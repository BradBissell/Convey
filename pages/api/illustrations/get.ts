import { GetCommand } from '@aws-sdk/lib-dynamodb';
import type { NextApiRequest, NextApiResponse } from 'next';
import { ddbDocClient } from '../../../lib/ddbDocClient';

export interface IllustrationGetResponse {
  PK: string;
  SK: string;
  date: string;
  image: string;
  keywords: Set<string>;
  text: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { snippet, source } = req.query;
  if (typeof snippet !== 'string' || typeof source !== 'string') {
    return res
      .status(400)
      .json({ error: 'snippet and source query params are required' });
  }

  try {
    const decodedSnippet = decodeURIComponent(snippet);

    const { Item } = await ddbDocClient.send(
      new GetCommand({
        TableName: process.env.TABLE_NAME,
        Key: {
          PK: `Illustration#${decodedSnippet}`,
          SK: `Meta#${source}`,
        },
      })
    );

    if (!Item) {
      return res.status(404).json({ error: 'Illustration not found' });
    }
    return res.status(200).json(Item);
  } catch (error) {
    // Log the detail server-side, but never leak internals to the client.
    console.error('GET /api/illustrations/get failed:', error);
    return res.status(500).json({ error: 'Failed to load illustration' });
  }
}
