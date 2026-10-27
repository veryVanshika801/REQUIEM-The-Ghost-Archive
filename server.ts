import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { SAMPLE_CASE_STUDY } from './src/data/sampleArchive';
import { ProjectAutopsyData } from './src/types/archive';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// In-memory runtime configuration for model adapter
interface ModelRuntimeConfig {
  provider: 'google_ai_studio' | 'ollama_local' | 'huggingface' | 'custom_endpoint';
  endpointUrl: string;
  modelId: string;
  hasCustomKey: boolean;
  lastTestedAt?: string;
  lastTestSuccess?: boolean;
  lastLatencyMs?: number;
  lastError?: string;
}

const runtimeConfig: ModelRuntimeConfig = {
  provider: (process.env.GEMMA_API_ENDPOINT ? 'custom_endpoint' : (process.env.GEMINI_API_KEY ? 'google_ai_studio' : 'google_ai_studio')),
  endpointUrl: process.env.GEMMA_API_ENDPOINT || 'https://api-inference.huggingface.co/models/google/gemma-2-9b-it',
  modelId: process.env.GEMMA_MODEL_ID || 'google/gemma-2-9b-it',
  hasCustomKey: Boolean(process.env.GEMMA_API_KEY || process.env.GEMINI_API_KEY)
};

// 1. Get Model Configuration & Status
app.get('/api/model/status', (_req: Request, res: Response) => {
  res.json({
    provider: runtimeConfig.provider,
    modelId: runtimeConfig.modelId,
    endpointUrl: runtimeConfig.endpointUrl,
    isKeyConfigured: runtimeConfig.hasCustomKey,
    lastTestedAt: runtimeConfig.lastTestedAt,
    isConnected: runtimeConfig.lastTestSuccess ?? false,
    latencyMs: runtimeConfig.lastLatencyMs,
    error: runtimeConfig.lastError,
    capabilities: [
      'Source-evidence extraction',
      'Verified vs Hypothesis classification',
      'Ghost Timeline reconstruction',
      'Unfinished feature detection',
      'Revival roadmap sequencing'
    ]
  });
});

// 2. Real Model Connection Test
app.post('/api/model/test', async (_req: Request, res: Response) => {
  const startTime = Date.now();

  try {
    if (runtimeConfig.provider === 'google_ai_studio') {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        runtimeConfig.lastTestSuccess = false;
        runtimeConfig.lastError = 'No GEMINI_API_KEY configured in server environment.';
        runtimeConfig.lastTestedAt = new Date().toISOString();
        return res.status(400).json({
          success: false,
          error: 'GEMINI_API_KEY environment variable is not set. Preloaded archaeological samples remain fully explorable.',
          isConnected: false
        });
      }

      const ai = new GoogleGenAI({ apiKey });
      // Quick test ping with flash model
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: 'Ping test for REQUIEM digital archaeology engine. Return only {"status":"online"}.'
      });

      const latencyMs = Date.now() - startTime;
      runtimeConfig.lastTestSuccess = true;
      runtimeConfig.lastLatencyMs = latencyMs;
      runtimeConfig.lastTestedAt = new Date().toISOString();
      runtimeConfig.lastError = undefined;

      return res.json({
        success: true,
        isConnected: true,
        latencyMs,
        model: 'gemini-3.8-flash / Gemma Adapter',
        message: 'Inference endpoint verified responsive.'
      });
    } else {
      // Custom endpoint or Ollama / HuggingFace test
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 6000);

      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };
      if (process.env.GEMMA_API_KEY) {
        headers['Authorization'] = `Bearer ${process.env.GEMMA_API_KEY}`;
      }

      const pingPayload = {
        model: runtimeConfig.modelId,
        prompt: 'Ping test',
        max_tokens: 5
      };

      const response = await fetch(runtimeConfig.endpointUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify(pingPayload),
        signal: controller.signal
      });

      clearTimeout(timeout);
      const latencyMs = Date.now() - startTime;

      if (!response.ok) {
        throw new Error(`Endpoint returned HTTP ${response.status}: ${response.statusText}`);
      }

      runtimeConfig.lastTestSuccess = true;
      runtimeConfig.lastLatencyMs = latencyMs;
      runtimeConfig.lastTestedAt = new Date().toISOString();
      runtimeConfig.lastError = undefined;

      return res.json({
        success: true,
        isConnected: true,
        latencyMs,
        model: runtimeConfig.modelId,
        message: 'Custom Gemma endpoint verified responsive.'
      });
    }
  } catch (err: any) {
    const latencyMs = Date.now() - startTime;
    runtimeConfig.lastTestSuccess = false;
    runtimeConfig.lastLatencyMs = latencyMs;
    runtimeConfig.lastTestedAt = new Date().toISOString();
    runtimeConfig.lastError = err?.message || 'Connection test failed';

    return res.status(502).json({
      success: false,
      isConnected: false,
      latencyMs,
      error: runtimeConfig.lastError
    });
  }
});

// 3. Configure Runtime Model Settings
app.post('/api/model/configure', (req: Request, res: Response) => {
  const { provider, endpointUrl, modelId } = req.body;
  if (provider) runtimeConfig.provider = provider;
  if (endpointUrl) runtimeConfig.endpointUrl = endpointUrl;
  if (modelId) runtimeConfig.modelId = modelId;
  runtimeConfig.lastTestSuccess = undefined;
  runtimeConfig.lastError = undefined;

  res.json({
    success: true,
    message: 'Configuration updated. Run connection test to verify.',
    runtimeConfig
  });
});

// 4. Sample Case Study Endpoint
app.get('/api/sample', (_req: Request, res: Response) => {
  res.json(SAMPLE_CASE_STUDY);
});

// 5. Safe Investigation Analysis Endpoint
interface UploadedFile {
  name: string;
  path: string;
  content: string;
  size: number;
}

app.post('/api/investigate', async (req: Request, res: Response) => {
  const { projectName, projectDescription, files, scanDepth } = req.body;

  if (!projectName) {
    return res.status(400).json({ error: 'Project name is required.' });
  }

  const uploadedFiles: UploadedFile[] = files || [];
  if (uploadedFiles.length === 0) {
    return res.status(400).json({ error: 'No files provided for analysis.' });
  }

  // Safety sanitization: filter out binaries, lockfiles, minified files, or oversized contents
  const safeFiles = uploadedFiles
    .filter(f => !f.name.endsWith('.lock') && !f.name.endsWith('.min.js') && !f.name.endsWith('.png') && !f.name.endsWith('.jpg'))
    .slice(0, 15); // limit to 15 relevant files

  // Aggregate excerpts within safe token bounds (< 60k characters)
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

  // Check if live model connection is configured
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey && !runtimeConfig.lastTestSuccess) {
    // Transparently disclose that model is not configured, and offer demonstration analysis
    return res.status(503).json({
      error: 'Model endpoint is currently not connected. Please configure a valid API key in Model Settings, or explore the preloaded HyperFlow archeological case study.',
      code: 'MODEL_NOT_CONNECTED'
    });
  }

  try {
    const ai = new GoogleGenAI({ apiKey: apiKey! });

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
      "confidenceScore": number (0 to 1),
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
Project Description: ${projectDescription || 'No description provided'}
Scan Depth: ${scanDepth || 'Deep Investigation'}

Files Extracted for Archaeology:
${summarizedSources.map(s => `=== FILE: ${s.filename} ===\n${s.snippet}\n`).join('\n\n')}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `${systemPrompt}\n\n${userPrompt}`,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const text = response.text || '{}';
    const parsed: ProjectAutopsyData = JSON.parse(text);

    parsed.analysisDate = new Date().toISOString();
    parsed.isPreloadedSample = false;
    parsed.modelIdentifierUsed = 'Gemma / Gemini 3.8 Flash Adapter';

    return res.json(parsed);
  } catch (err: any) {
    console.error('Investigation error:', err);
    return res.status(500).json({
      error: 'Inference failed: ' + (err?.message || 'Internal analysis error'),
      code: 'INFERENCE_ERROR'
    });
  }
});

// Vite middleware for dev or static serving in production
async function startServer() {
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`[REQUIEM] The Ghost Archive server listening on port ${PORT} (${isProduction ? 'Production' : 'Dev'})`);
  });
}

startServer();
