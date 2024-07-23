import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).end(); // Method Not Allowed
    }

    const { b_no } = req.body;

    if (!b_no || !Array.isArray(b_no)) {
        return res.status(400).json({ error: 'Invalid request' });
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const apiKey = process.env.NEXT_PUBLIC_API_KEY;

    try {
        console.log('Sending request to external API');
        console.log(`API URL: ${apiUrl}`);
        console.log(`API Key: ${apiKey}`);
        console.log(`Request body: ${JSON.stringify({ b_no })}`);

        const response = await axios.post(
            `${apiUrl}?serviceKey=${apiKey}`,
            { b_no },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
            }
        );

        console.log('Response received from external API:', response.data);
        return res.status(200).json(response.data);
    } catch (error: any) {
        console.error('API request error:', error.response?.data || error.message);
        return res.status(500).json({ error: 'Failed to check business number', details: error.message });
    }
}
