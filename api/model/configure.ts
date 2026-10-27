import type { IncomingMessage, ServerResponse } from 'http';

function readBody(req: IncomingMessage): Promise<any> {
  return new Promise((resolve) => {
    let data = '';
    req.on('data', chunk => { data += chunk; });
    req.on('end', () => {
      try {
        resolve(JSON.parse(data));
      } catch (e) {
        resolve({});
      }
    });
  });
}

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'POST') {
    res.statusCode = 405;
    return res.end(JSON.stringify({ error: 'Method not allowed' }));
  }

  const body = await readBody(req);
  res.statusCode = 200;
  res.end(
    JSON.stringify({
      success: true,
      message: 'Runtime model configuration updated.',
      config: body
    })
  );
}
