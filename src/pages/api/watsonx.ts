import type { APIRoute } from "astro";
import { watsonxAIService } from "@/lib/ibmAuth";

export const prerender = false;

interface MedicineData {
  fdaData: {
    data: {
      results: Array<{
        purpose?: string[];
        indications_and_usage?: string[];
        warnings?: string[];
        patient_information?: string[];
        storage_and_handling?: string[];
        active_ingredient?: string[];
        inactive_ingredient?: string[];
        spl_product_data_elements?: any[];
      }>;
    };
  };
  sideEffectData: {
    data: {
      sideEffects: Record<string, string[]>;
      herbalAlternatives: {
        options: Array<{
          name: string;
          benefits: string;
          warnings: string;
        }>;
        disclaimer: string;
      };
    };
  };
  userSettings: string;
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { fdaData, sideEffectData, userSettings } = body as MedicineData;

    const formattedPrompt = `
Medicine Analysis Results:

Basic Information:
Purpose: ${fdaData.data.results?.[0]?.purpose?.[0] || "Not specified"}
Indications: ${
      fdaData.data.results?.[0]?.indications_and_usage?.[0] || "Not specified"
    }
Warnings: ${fdaData.data.results?.[0]?.warnings?.[0] || "Not specified"}
Patient Information: ${
      fdaData.data.results?.[0]?.patient_information?.[0] || "Not specified"
    }
Storage: ${
      fdaData.data.results?.[0]?.storage_and_handling?.[0] || "Not specified"
    }

Active Ingredients: ${
      (fdaData.data.results?.[0]?.active_ingredient || []).join(", ") ||
      "None listed"
    }
Inactive Ingredients: ${
      (fdaData.data.results?.[0]?.inactive_ingredient || []).join(", ") ||
      "None listed"
    }

Side Effects:
${Object.entries(sideEffectData.data.sideEffects)
  .map(
    ([category, effects]) =>
      `${category.replace(/_/g, " ").toUpperCase()}:\n${effects.join("\n- ")}`
  )
  .join("\n\n")}

Herbal Alternatives:
${sideEffectData.data.herbalAlternatives.options
  .map((alt) => `- ${alt.name}: ${alt.benefits}\n  Warning: ${alt.warnings}`)
  .join("\n")}

Disclaimer: ${sideEffectData.data.herbalAlternatives.disclaimer}`;

    const systemPrompt = `You are an experienced medical professional providing information about medications. When a user asks about a medicine, provide a comprehensive response in the following structured format:

OVERVIEW
- Primary use:
- Drug class:
- Manufacturer:
- Available forms:

ACTIVE INGREDIENTS
- Main ingredients:
- Strength/dosage options:

COMMON SIDE EFFECTS
- Frequent (>10%):
- Less common (1-10%):
- Rare but serious:

NATURAL/HERBAL ALTERNATIVES
- Evidence-based alternatives:
- Important notes:
- Consult healthcare provider before trying alternatives

IMPORTANT: This information is for educational purposes only. Always consult your healthcare provider before making any changes to your medication.

Please analyze the following medicine:`;

    const textGeneration = async (input: string) =>
      watsonxAIService.generateText({
        input: `${systemPrompt}\n\nInput: ${input}\n${userSettings}\nOutput:`,
        parameters: {
          decoding_method: "greedy",
          max_new_tokens: 3000,
          min_new_tokens: 100,
          stop_sequences: ["<|endoftext|>"],
          repetition_penalty: 2,
          temperature: 0.8,
        },
        modelId: "meta-llama/llama-3-405b-instruct",
        projectId: import.meta.env.WATSON_PROJECT_ID,
      });

    const response = await textGeneration(formattedPrompt);
    const generatedText = response.result.results[0].generated_text;

    return new Response(JSON.stringify({ generatedText }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        message: "Error processing request",
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
