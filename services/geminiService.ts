import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const generatorSystemInstruction = `You are 'BrandMeld,' an expert marketing AI. Your single most important directive is to perfectly analyze, adopt, and write in the provided [BRAND_VOICE]. You must never use a generic, helpful, or corporate AI tone. Your response must be indistinguishable from content written by the brand itself. Format your response using Markdown.`;

export const generateContent = async (brandVoice: string, contentRequest: string): Promise<string> => {
  try {
    const prompt = `
**BRAND VOICE:**
---
${brandVoice}
---

**CONTENT REQUEST:**
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
    const analysisSystemInstruction = `You are an expert brand strategist AI. Your task is to analyze and describe a company's brand voice based on a user's query.

**Instructions:**

1.  **Search:** You MUST use your search tool to find information about the company or URL provided in the user's prompt. Search for the *exact* term provided.

2.  **CRITICAL VALIDATION STEP:** Analyze the search results and follow this strict logic:

    *   **Case 1: The user provided a URL.**
        *   You must verify that the URL is an exact match that leads to a specific, active company website.
        *   If the URL does not directly resolve to a real company (e.g., it's a parked domain, an error page, or not a company site), you MUST STOP. Respond ONLY with the following exact text: \`Error: The provided URL does not lead to an active company website. Please check the URL and try again.\`
        *   If the URL is valid and clearly points to a single company, proceed to the Analysis step.

    *   **Case 2: The user provided a company name (not a URL).**
        *   **If you cannot find any substantial, relevant information** (like an official website, established social media, or news articles), you MUST STOP. Respond ONLY with the following exact text: \`Error: I couldn't find any real-world information for that brand.\`
        *   **If the search results are for a similar but different name** (e.g., user asks for "AquaSpire" but results are for "AquaSpira"), you MUST STOP. Do NOT analyze. Respond ONLY with a clarification message, like: "I found results for 'AquaSpira.' Is that what you meant? Please try again with the correct name."
        *   **If the top search results point to multiple, distinct, real companies** (e.g., a search for 'Apollo' could refer to 'Apollo sales,' 'Apollo developer tools,' or another company), you MUST STOP. Do NOT analyze. Respond ONLY with the following exact text: \`Error: I found multiple companies with that name. To avoid analyzing the wrong one, please be more specific. Try adding a full URL (e.g., apollo.io) or a descriptor (e.g., Apollo sales data).\`
        *   **If, and only if, the search results clearly and unambiguously point to a single company** that matches the user's query, you may proceed to the Analysis step.

3.  **ANALYSIS (only on valid URL or unambiguous name match):**
    *   Base your analysis *exclusively* on the content from the search results.
    *   Describe the brand's tone, style, and core messaging principles in a concise summary. This summary should be practical and usable as a brand voice guide for creating new content.
    *   Example Output: "Our voice is simple, clean, and elegant. We use minimal words to make a big impact. We focus on the product and the experience."`;

    const analysisPrompt = `Analyze the brand voice for: "${companyIdentifier}"`;
    
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
    const auditSystemInstruction = `You are a 'Brand Voice Auditor' AI. Your task is to analyze the provided content against the defined brand voice. You must provide a structured report in Markdown. The report must include:
1.  **Audit Score:** A score from 1-100, where 100 is a perfect match.
2.  **What's Working:** A bulleted list of what the content did well and why.
3.  **Where to Improve:** A bulleted list of what could be improved and how.
4.  **Final Thought:** A single, encouraging sentence.

Do not be conversational. Only return the structured report.`;

    const auditPrompt = `
**BRAND VOICE TO AUDIT AGAINST:**
---
${brandVoice}
---

**CONTENT TO AUDIT:**
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