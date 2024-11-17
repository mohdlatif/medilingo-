import type { APIRoute } from "astro";
import Together from "together-ai";
export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const {
      medicineName,
      purposeText,
      indicationsText,
      warningsText,
      patientInfoText,
      storageText,
      inactiveIngredients,
      activeIngredients,
      structuredProductLabeling,
      userSettings,
    } = body;

    // Initialize Together AI client
    const together = new Together({
      apiKey: import.meta.env.TOGETHER_API_KEY,
    });

    // Create a comprehensive prompt
    const systemPrompt = `You are a knowledgeable medical assistant. Analyze the provided medication information for side effects and herbal alternatives. 

IMPORTANT: Respond ONLY with a JSON object. Do not include any additional text, markdown formatting, or code blocks.
Here are the user settings: ${userSettings} you have to follow these settings to answer the question.
The JSON response must follow this exact structure:
{
  "side_effects": {
    "common": ["effect1", "effect2"],
    "serious": ["effect1", "effect2"],
    "rare": ["effect1", "effect2"]
  },
  "herbal_alternatives": {
    "options": [
      {
        "name": "string",
        "benefits": "string",
        "warnings": "string"
      }
    ],
    "disclaimer": "string"
  }
}`;

    // Create chat completion with Together AI
    const response = await together.chat.completions.create({
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: `Analyze this medication:
            Medicine Name: ${medicineName}
            Purpose: ${purposeText}
            Indications: ${indicationsText}
            Warnings: ${warningsText}
            Patient Info: ${patientInfoText}
            Storage Information: ${storageText}
            Active Ingredients: ${JSON.stringify(activeIngredients)}
            Inactive Ingredients: ${JSON.stringify(inactiveIngredients)}
            Structured Product Labeling: ${JSON.stringify(
              structuredProductLabeling
            )}`,
        },
      ],
      model: "meta-llama/Llama-3.2-11B-Vision-Instruct-Turbo",
      max_tokens: 1500,
      temperature: 0.7,
    });

    const aiResponse = response.choices?.[0]?.message?.content;

    // Parse the AI response into a clean JSON object
    let analysisData = null;
    try {
      analysisData = aiResponse ? JSON.parse(aiResponse) : null;
    } catch (error) {
      console.error("Error parsing AI response:", error);
      return new Response(
        JSON.stringify({
          message: "Error parsing AI response",
          error: "Invalid JSON response from AI",
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    return new Response(
      JSON.stringify({
        message: "Success",
        data: {
          sideEffects: analysisData.side_effects,
          herbalAlternatives: analysisData.herbal_alternatives,
        },
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        message: "Error processing request",
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
};
