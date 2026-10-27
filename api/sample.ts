import type { IncomingMessage, ServerResponse } from 'http';
import { SAMPLE_CASE_STUDY } from '../src/data/sampleArchive.js';

export default function handler(_req: IncomingMessage, res: ServerResponse) {
  res.setHeader('Content-Type', 'application/json');
  res.statusCode = 200;
  res.end(JSON.stringify(SAMPLE_CASE_STUDY));
}
