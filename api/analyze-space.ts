// api/analyze-space.ts
import { VercelRequest, VercelResponse } from '@vercel/node';

export const config = {
  runtime: 'nodejs18.x',
};

export default async (req: VercelRequest, res: VercelResponse) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: 'GEMINI_API_KEY not set' });
    return;
  }

  const { imageBase64 } = req.body;
  if (!imageBase64) {
    res.status(400).json({ error: 'Missing imageBase64 in request body' });
    return;
  }

  const prompt = `\
You are an AI assistant that extracts structured information from a photo of a vacant space. Return a JSON object with the following fields exactly:\n\n{\n  "ocrText": string,               // all visible text in the image, empty string if none\n  "phone": string | null,          // phone number found in the text, null if none\n  "spaceType": "VACANT_STORE" | "VACANT_HOUSE" | "WAREHOUSE_FACTORY" | "CLOSED_SCHOOL" | null,\n  "conditionGrade": "A" | "B" | "C" | "D" | null,\n  "conditionReasons": string[],    // reasons for the grade, empty array if none\n  "estimatedFloors": number | null,\n  "recommendedUses": string[],     // suggested uses, empty array if none\n  "confidence": number | null      // overall confidence between 0 and 1\n}\n\nIf a piece of information cannot be determined, set its value to null (or empty array / empty string as appropriate). Do not add any explanations outside the JSON.`;

  try {
    const resp = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-001:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [
                { inlineData: { mimeType: 'image/jpeg', data: imageBase64 } },
                { text: prompt },
              ],
            },
          ],
          generationConfig: { temperature: 0 },
        }),
      }
    );

    if (!resp.ok) {
      const errText = await resp.text();
      console.error('Gemini API error', resp.status, errText);
      res.status(502).json({ error: 'Gemini API error', details: errText });
      return;
    }

    const data = await resp.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    if (!text) {
      res.status(500).json({ error: 'Invalid response from Gemini' });
      return;
    }
    let json;
    try { json = JSON.parse(text); } catch (e) {
      const match = text.match(/\{[\s\S]*\}/);
      if (match) { json = JSON.parse(match[0]); } else { throw e; }
    }
    res.status(200).json(json);
  } catch (err) {
    console.error('Server error', err);
    res.status(500).json({ error: 'Server error', details: (err as any).message });
  }
};
