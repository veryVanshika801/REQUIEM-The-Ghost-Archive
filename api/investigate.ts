import type { IncomingMessage, ServerResponse } from 'http';
import { GoogleGenAI } from '@google/genai';
import { ProjectAutopsyData } from '../src/types/archive.js';

function readBody(req: IncomingMessage): Promise<any> {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', chunk => {
      data += chunk;
      if (data.length > 5 * 1024 * 1024) {
        req.destroy();
        reject(new Error('Payload too large'));
      }
    });
    req.on('end', () => {
      try {
        resolve(JSON.parse(data));
      } catch (e) {
        resolve({});
      }
    });
    req.on('error', reject);
  });
}

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'POST') {
    res.statusCode = 405;
    return res.end(JSON.stringify({ error: 'Method not allowed' }));
  }

  const body = await readBody(req);
  const { projectName, projectDescription, files, scanDepth } = body;

  if (!projectName) {
    res.statusCode = 400;
    return res.end(JSON.stringify({ error: 'Project name is required.' }));
  }

  const uploadedFiles: Array<{ name: string; path?: string; content: string; size: number }> = files || [];
  if (uploadedFiles.length === 0) {
    res.statusCode = 400;
    return res.end(JSON.stringify({ error: 'No files provided for analysis.' }));
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    res.statusCode = 503;
    return res.end(
      JSON.stringify({
        error: 'Model endpoint is currently not connected in Vercel environment. Configure GEMINI_API_KEY or GEMMA_API_ENDPOINT in Vercel Project Settings.',
        code: 'MODEL_NOT_CONNECTED'
      })
    );
  }

  // Safe excerpt selection
  const safeFiles = uploadedFiles
    .filter(f => !f.name.endsWith('.lock') && !f.name.endsWith('.min.js') && !f.name.endsWith('.png') && !f.name.endsWith('.jpg'))
    .slice(0, 15);

  let totalLength = 0;
  const summarizedSources: Array<{ filename: string; snippet: string }> = [];

  for (const f of safeFiles) {
    if (totalLength > 40000) break;
    const truncated = f.content.slice(0, 4000);
    totalLength += truncated.length;
    summarizedSources.push({
      filename: f.path || f.name,
      snippet: truncated
    });
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

    const systemPrompt = `You are REQUIEM, an objective open-weight digital archaeology investigator for forgotten software repositories.
Analyse the supplied project files and produce an evidence-backed autopsy report.
CRITICAL RULES:
1. Distinguish strictly between:
   - "verified": directly confirmed by exact code or manifest lines.
   - "interpretation": reasoned deduction or hypothesis from context.
   - "unknown": information that cannot be reliably established.
2. Every finding MUST include the real filename, start and end lines, and exact code snippet. Do NOT fabricate filenames or line numbers!
3. Detect unfinished features, missing docs, dead code, and architecture pivots.
4. Output strict JSON matching this schema:
{
  "projectName": string,
  "tagline": string,
  "primaryLanguage": string,
  "detectedLicense": string,
  "licenseSourceFile": string,
  "purposeSummary": string,
  "intendedAudience": string,
  "techStack": string[],
  "architectureOverview": string,
  "whyAbandonedAnalysis": string,
  "findings": [
    {
      "id": string,
      "title": string,
      "category": "architecture" | "unfinished_feature" | "security_risk" | "missing_docs" | "dependency" | "dead_code",
      "evidenceType": "verified" | "interpretation" | "unknown",
      "explanation": string,
      "confidenceScore": number,
      "confidenceExplanation": string,
      "evidence": {
        "filename": string,
        "lineStart": number,
        "lineEnd": number,
        "codeSnippet": string,
        "contextDescription": string,
        "uncertaintyNotes": string
      }
    }
  ],
  "timeline": [
    {
      "id": string,
      "title": string,
      "description": string,
      "dateStr": string,
      "commitHash": string,
      "isAiInferred": boolean,
      "uncertaintyLabel": string,
      "category": "commit" | "release" | "abandonment" | "ghost_branch" | "inferred_pivot"
    }
  ],
  "graphNodes": [
    { "id": string, "label": string, "type": "module"|"feature"|"file"|"dependency"|"doc"|"proposal", "status": "verified"|"incomplete"|"uncertain"|"blocked", "description": string, "filename": string, "x": number, "y": number }
  ],
  "graphEdges": [
    { "id": string, "source": string, "target": string, "label": string, "relationType": "imports"|"intends"|"blocks"|"documents" }
  ],
  "revivalTasks": [
    {
      "id": string,
      "title": string,
      "category": "fix_first"|"restore_docs"|"add_tests"|"complete_feature"|"improve_architecture"|"good_first_issue",
      "priority": "P0"|"P1"|"P2",
      "reason": string,
      "supportingEvidence": string,
      "suggestedSteps": string[],
      "expectedOutcome": string,
      "acceptanceCriteria": string[],
      "estimatedDifficulty": "Easy"|"Moderate"|"Complex",
      "status": "pending"
    }
  ]
}`;

    const userPrompt = `Project Name: ${projectName}
Context: ${projectDescription || 'None'}
Scan Depth: ${scanDepth || 'Deep Investigation'}

Files:
${summarizedSources.map(s => `=== FILE: ${s.filename} ===\n${s.snippet}\n`).join('\n\n')}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `${systemPrompt}\n\n${userPrompt}`,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const parsed: ProjectAutopsyData = JSON.parse(response.text || '{}');
    parsed.analysisDate = new Date().toISOString();
    parsed.isPreloadedSample = false;
    parsed.modelIdentifierUsed = 'Gemma / Gemini 3.8 Flash Adapter';

    res.statusCode = 200;
    return res.end(JSON.stringify(parsed));
  } catch (err: any) {
    res.statusCode = 500;
    return res.end(
      JSON.stringify({
        error: 'Inference failed: ' + (err?.message || 'Internal analysis error'),
        code: 'INFERENCE_ERROR'
      })
    );
  }
}
