import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  try {
    // フロントエンドから送られてきたヘッダー情報を解析
    const originalHeaders = req.headers['x-original-headers']
      ? JSON.parse(req.headers['x-original-headers'] as string)
      : {};

    // ベースとなるヘッダー
    const headers = {
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Cache-Control': 'max-age=0',
      ...originalHeaders,
    };

    const response = await fetch(url, { headers });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const contentType = response.headers.get('content-type');
    const isHtml = contentType?.includes('text/html') || contentType?.includes('application/xhtml+xml');

    const text = await response.text();
    res.status(200).json({ content: text, isHtml });
  } catch (error) {
    console.error('Error fetching URL:', error);
    res.status(500).json({ error: 'Failed to fetch URL' });
  }
}
