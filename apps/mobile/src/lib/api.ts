import { BriefPriority } from '@/types/brief';

const API_URL =
  process.env.EXPO_PUBLIC_API_URL || 'http://192.168.0.199:8000';

export type GenerateResponse = {
  title: string;
  summary: string;
  key_points: string[];
  actions: string[];
  tags: string[];
  priority: BriefPriority;
  due_date?: string | null;
};

export async function generateBrief(
  content: string,
): Promise<GenerateResponse> {
  const trimmedContent = content.trim();

  if (!trimmedContent) {
    throw new Error('Please enter some notes first.');
  }

  try {
    const response = await fetch(
      `${API_URL}/v1/briefs/generate`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          text: trimmedContent,
        }),
      },
    );

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      let message = 'Unable to generate your brief.';

      if (typeof data?.detail === 'string') {
        message = data.detail;
      } else if (data?.detail) {
        message = JSON.stringify(data.detail);
      }

      throw new Error(message);
    }

    if (!data || typeof data !== 'object') {
      throw new Error(
        'SnapBrief returned an invalid response.',
      );
    }

    return data as GenerateResponse;
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error(
        `Could not connect to SnapBrief API at ${API_URL}. Make sure FastAPI is running and your phone is on the same Wi-Fi network.`,
      );
    }

    throw error;
  }
}