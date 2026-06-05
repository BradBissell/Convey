import type { NextApiRequest, NextApiResponse } from 'next';
import { loadByKeyword } from '../../../lib/loadIllustrations';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const result = await loadByKeyword(
      req.query.lastItem,
      req.query.keyword,
      req.query.pageSize
    );
    if (result && 'Items' in result) {
      return res
        .status(200)
        .json({ items: result.Items, lastItem: result.LastEvaluatedKey });
    }
    // loadByKeyword returns an Error instance on failure rather than throwing.
    throw result instanceof Error ? result : new Error('Query failed');
  } catch (error) {
    // Log the detail server-side, but never leak internals to the client.
    console.error('GET /api/keywords/[keyword] failed:', error);
    return res.status(500).json({ error: 'Failed to load illustrations' });
  }
}
