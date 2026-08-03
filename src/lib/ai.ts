import { getFunctionUrl, getFunctionHeaders } from './supabase';

export interface GenerateRequest {
  prompt: string;
  project_type?: string;
}

export interface GenerateResponse {
  enhanced_prompt: string;
  image_url: string;
}

export async function generateImage(req: GenerateRequest): Promise<GenerateResponse> {
  const url = getFunctionUrl('generate-image');
  const headers = getFunctionHeaders();

  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(req),
  });

  if (!response.ok) {
    let message = `Generation failed (${response.status})`;
    try {
      const body = await response.json();
      if (body?.error) message = body.error;
    } catch {}
    throw new Error(message);
  }

  const data = await response.json();

  if (!data?.image_url || !data?.enhanced_prompt) {
    throw new Error('Invalid response from generation service');
  }

  return {
    enhanced_prompt: data.enhanced_prompt,
    image_url: data.image_url,
  };
}
