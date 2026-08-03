import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY") ?? "";

const ENHANCEMENT_SYSTEM_PROMPT = `You are an expert architectural visualization prompt engineer. Your job is to take a simple architectural idea and transform it into a detailed, professional prompt for an AI image generator.

The enhanced prompt must include:
- Architectural style (specific, named style)
- Building materials (concrete, glass, wood, stone, steel, etc.)
- Lighting (cinematic, golden hour, HDR, volumetric, etc.)
- Composition (wide-angle, aerial, eye-level, etc.)
- Realism level (photorealistic, 8K, ultra-detailed)
- Landscaping and surrounding environment
- Camera angle and lens
- Rendering quality (V-Ray, Unreal Engine, PBR materials)
- Atmosphere and mood
- Environmental details (sky, weather, vegetation, water features)

Write the enhanced prompt as a single flowing paragraph, 200-400 words. Be specific and vivid. Do not include any preamble or explanation — output ONLY the enhanced prompt.`;

interface GenerateRequest {
  prompt: string;
  project_type?: string;
}

async function enhancePrompt(userPrompt: string): Promise<string> {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o",
      messages: [
        { role: "system", content: ENHANCEMENT_SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 500,
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`OpenAI enhancement failed: ${response.status} ${errText}`);
  }

  const data = await response.json();
  const enhanced = data?.choices?.[0]?.message?.content?.trim();

  if (!enhanced) {
    throw new Error("No enhanced prompt returned from OpenAI");
  }

  return enhanced;
}

async function generateImage(enhancedPrompt: string): Promise<string> {
  const response = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "dall-e-3",
      prompt: enhancedPrompt,
      n: 1,
      size: "1792x1024",
      quality: "hd",
      response_format: "url",
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`OpenAI image generation failed: ${response.status} ${errText}`);
  }

  const data = await response.json();
  const imageUrl = data?.data?.[0]?.url;

  if (!imageUrl) {
    throw new Error("No image URL returned from OpenAI");
  }

  return imageUrl;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    if (!OPENAI_API_KEY) {
      return new Response(
        JSON.stringify({ error: "OpenAI API key not configured. Please set the OPENAI_API_KEY secret." }),
        { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const { prompt, project_type } = (await req.json()) as GenerateRequest;

    if (!prompt || typeof prompt !== "string" || prompt.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: "A prompt is required." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    if (prompt.length > 2000) {
      return new Response(
        JSON.stringify({ error: "Prompt is too long. Please keep it under 2000 characters." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Step 1: Enhance the prompt
    const enhancedPrompt = await enhancePrompt(prompt.trim());

    // Step 2: Generate the image (automatic, no extra button click)
    const imageUrl = await generateImage(enhancedPrompt);

    return new Response(
      JSON.stringify({
        enhanced_prompt: enhancedPrompt,
        image_url: imageUrl,
        project_type: project_type ?? "villa",
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "An unexpected error occurred.";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
