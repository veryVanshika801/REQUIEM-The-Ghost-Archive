import type { IncomingMessage, ServerResponse } from 'http';
import { GoogleGenAI } from '@google/genai';

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  res.setHeader('Content-Type', 'application/json');

  const startTime = Date.now();
  const apiKey = process.env.GEMINI_API_KEY;
  const customEndpoint = process.env.GEMMA_API_ENDPOINT;

  if (customEndpoint) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 6000);

      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (process.env.GEMMA_API_KEY) {
        headers['Authorization'] = `Bearer ${process.env.GEMMA_API_KEY}`;
      }

      const pingResponse = await fetch(customEndpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          model: process.env.GEMMA_MODEL_ID || 'google/gemma-2-9b-it',
          prompt: 'Ping test',
          max_tokens: 5
        }),
        signal: controller.signal
      });

      clearTimeout(timeout);
      const latencyMs = Date.now() - startTime;

      if (!pingResponse.ok) {
        throw new Error(`Endpoint returned HTTP ${pingResponse.status}`);
      }

      res.statusCode = 200;
      return res.end(
        JSON.stringify({
          success: true,
          isConnected: true,
          latencyMs,
          model: process.env.GEMMA_MODEL_ID || 'google/gemma-2-9b-it',
          message: 'Custom Gemma endpoint verified responsive.'
        })
      );
    } catch (err: any) {
      res.statusCode = 502;
      return res.end(
        JSON.stringify({
          success: false,
          isConnected: false,
          latencyMs: Date.now() - startTime,
          error: err?.message || 'Custom endpoint connection failed.'
        })
      );
    }
  }

  if (!apiKey) {
    res.statusCode = 400;
    return res.end(
      JSON.stringify({
        success: false,
        isConnected: false,
        error: 'GEMINI_API_KEY environment variable is not configured in Vercel settings.'
      })
    );
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: 'Ping test for REQUIEM digital archaeology engine.'
    });

    const latencyMs = Date.now() - startTime;
    res.statusCode = 200;
    return res.end(
      JSON.stringify({
        success: true,
        isConnected: true,
        latencyMs,
        model: 'Gemma 2 / Gemini Flash Adapter',
        message: 'Inference endpoint verified responsive.'
      })
    );
  } catch (err: any) {
    res.statusCode = 502;
    return res.end(
      JSON.stringify({
        success: false,
        isConnected: false,
        latencyMs: Date.now() - startTime,
        error: err?.message || 'Connection test failed.'
      })
    );
  }
}
