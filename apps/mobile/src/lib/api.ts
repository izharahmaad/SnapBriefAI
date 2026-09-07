import { Brief } from '@/types/brief';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://127.0.0.1:8000';

type GenerateResponse = Omit<Brief, 'id' | 'created_at'>;

export async function generateBrief(content: string): Promise<GenerateResponse> {
  const response = await fetch(`${API_URL}/v1/briefs/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content, tone: 'professional' }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || 'Unable to generate your brief.');
  }

  return response.json();
}
