import type { IncomingMessage, ServerResponse } from 'http';

export default function handler(_req: IncomingMessage, res: ServerResponse) {
  res.setHeader('Content-Type', 'application/json');

  const provider = process.env.GEMMA_API_ENDPOINT
    ? 'custom_endpoint'
    : (process.env.GEMINI_API_KEY ? 'google_ai_studio' : 'google_ai_studio');

  const modelId = process.env.GEMMA_MODEL_ID || 'google/gemma-2-9b-it';
  const endpointUrl = process.env.GEMMA_API_ENDPOINT || 'https://api-inference.huggingface.co/models/google/gemma-2-9b-it';
  const isKeyConfigured = Boolean(process.env.GEMMA_API_KEY || process.env.GEMINI_API_KEY);

  res.statusCode = 200;
  res.end(
    JSON.stringify({
      provider,
      modelId,
      endpointUrl,
      isKeyConfigured,
      isConnected: false,
      capabilities: [
        'Source-evidence extraction',
        'Verified vs Hypothesis classification',
        'Ghost Timeline reconstruction',
        'Unfinished feature detection',
        'Revival roadmap sequencing'
      ]
    })
  );
}
