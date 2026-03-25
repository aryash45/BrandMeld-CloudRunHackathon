
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const generatorSystemInstruction = `You are 'BrandMeld,' an expert personal branding and marketing AI. 

**CORE DIRECTIVE:**
Your goal is to ghostwrite content that sounds EXACTLY like the persona defined in [BRAND_VOICE]. 

**CRITICAL STYLE RULES:**
1. **Personal Identity:** If the brand voice implies an individual (a founder, creator, or thought leader), ALWAYS use "I" and "my" instead of "we" or "us".
2. **Authenticity Over Corporate Speak:** Avoid buzzwords like "synergy," "leveraging," or "cutting-edge" unless the brand voice explicitly uses them. Prefer simple, punchy, human language.
3. **Format:** Use short paragraphs. Use formatting (bolding, lists) to make it readable on social platforms.
4. **Tone:** Be opinionated. Good personal brands have a point of view.
5. **Output:** Return ONLY the content in Markdown. Do not include introductory filler like "Here is a post for you."

Analyze the provided [BRAND_VOICE] deeply before writing. Match the sentence length, vocabulary complexity, and emotional range.`;

export const generateContent = async (brandVoice: string, contentRequest: string): Promise<string> => {
  try {
    const prompt = `
**AUTHOR/BRAND VOICE PROFILE:**
---
${brandVoice}
---

**CONTENT TASK:**
---
${contentRequest}
---
`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: generatorSystemInstruction,
        temperature: 0.8,
        topP: 0.95,
      },
    });
    
    return response.text;
  } catch (error) {
    console.error("Error generating content:", error);
    throw new Error("Failed to generate content from AI. Please check your connection or API key.");
  }
};

export const analyzeBrandVoice = async (companyIdentifier: string): Promise<string> => {
  try {
    const analysisSystemInstruction = `You are a Personal Brand Strategist AI. Your task is to analyze a URL or Name to reverse-engineer their unique "Voice Profile."

**Instructions:**

1.  **Search:** Use Google Search to find the blog, newsletter, Twitter/X, or LinkedIn presence of the person or company provided.
2.  **Analysis Target:** Prioritize content written by the founder or main personality if it is a personal brand. Look for:
    *   **Sentence Structure:** Short and punchy? Long and academic?
    *   **Tone:** Humble? Arrogant? Funny? Serious? Vulnerable?
    *   **Keywords:** Do they use specific phrases (e.g., "build in public", "atomic habits")?
    *   **Perspective:** Do they speak as "I" (personal) or "We" (company)?

3.  **Validation:**
    *   If you cannot find a clear voice, stop and return an error.
    *   If you find multiple people, ask for clarification.

4.  **OUTPUT FORMAT:**
    Return a concise but descriptive paragraph that I can feed back into an AI to generate new content.
    *   *Example Output:* "The voice is direct, contrarian, and no-nonsense. It uses short, staccato sentences. It frequently challenges conventional wisdom. It speaks in the first person ('I') and avoids all corporate jargon. It feels like a smart friend giving you tough love."`;

    const analysisPrompt = `Analyze the brand/writing voice for: "${companyIdentifier}"`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: analysisPrompt,
      config: {
        systemInstruction: analysisSystemInstruction,
        tools: [{googleSearch: {}}],
        temperature: 0.5,
      },
    });

    return response.text;
  } catch (error) {
    console.error("Error analyzing brand voice:", error);
    throw new Error("Failed to analyze brand voice due to a technical issue. Please check your connection and try again.");
  }
}

export const auditContent = async (brandVoice: string, contentToAudit: string): Promise<string> => {
  try {
    const auditSystemInstruction = `You are a Personal Brand Editor. Your job is to ensure content sounds authentic to the author, not like ChatGPT.

Provide a structured Markdown report:
1.  **Alignment Score:** 1-100.
2.  **Voice Analysis:** Does it sound like the person? (Too formal? Too casual? Too many emojis?)
3.  **Fixes:** Specific rewrites to make it sound more like the defined Voice Profile.
4.  **Verdict:** "Publish" or "Rewrite".`;

    const auditPrompt = `
**TARGET VOICE PROFILE:**
---
${brandVoice}
---

**DRAFT CONTENT:**
---
${contentToAudit}
---
`;
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: auditPrompt,
        config: {
          systemInstruction: auditSystemInstruction,
          temperature: 0.5,
        },
      });

    return response.text;
  } catch (error) {
    console.error("Error auditing content:", error);
    throw new Error("Failed to audit content from AI.");
  }
};
