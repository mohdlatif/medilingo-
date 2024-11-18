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

// Validation helper
const validateMedicineData = (data: any): data is MedicineData => {
  try {
    return (
      data &&
      data.fdaData?.data?.results?.length > 0 &&
      data.sideEffectData?.data?.sideEffects &&
      data.sideEffectData?.data?.herbalAlternatives?.options
    );
  } catch (e) {
    return false;
  }
};
const MEDICAL_SYSTEM_PROMPT = `
return the following information in the following format:
1. OVERVIEW
   - Primary Use
   - Drug Class
   - Key Benefits

2. SAFETY
   - Common Side Effects
   - Important Warnings
   - Drug Interactions

3. USAGE
   - Typical Dosing
   - Storage
   - Key Precautions

4. ALTERNATIVES
   - Natural Options
   - Important Notes
  constraints: Guidelines:
- Use clear language
- Prioritize safety
- Be concise
- Cite key warnings`;

interface WatsonResponse {
  result: {
    results: Array<{
      generated_text: string;
    }>;
  };
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    if (!validateMedicineData(body)) {
      throw new Error("Invalid request data structure");
    }

    const { fdaData, sideEffectData, userSettings = "" } = body;

    // console.log(fdaData.data.results?.[0]?.purpose?.[0]);

    const buildMedicineInfo = (fdaData: any = {}) => {
      const medicineDetails = fdaData?.data?.results?.[0] || {};
      const medicineName =
        medicineDetails?.spl_product_data_elements?.[0]?.name_of_product ||
        medicineDetails?.openfda?.brand_name?.[0] ||
        medicineDetails?.openfda?.generic_name?.[0] ||
        "Unknown Medicine";

      return {
        name: medicineName,
        purpose: medicineDetails?.purpose?.[0] || null,
        indications: medicineDetails?.indications_and_usage?.[0] || null,
        warnings: medicineDetails?.warnings?.[0] || null,
        patientInfo: medicineDetails?.patient_information?.[0] || null,
      };
    };

    const formatSideEffects = (sideEffectData: any = {}) => {
      if (!sideEffectData?.data?.sideEffects) return "";

      return Object.entries(sideEffectData.data.sideEffects)
        .map(([category, effects]) => {
          const categoryTitle = category.replace(/_/g, " ").toUpperCase();
          const effectsList = Array.isArray(effects)
            ? effects.join("\n- ")
            : "";
          return effectsList ? `${categoryTitle}:\n${effectsList}` : "";
        })
        .filter(Boolean)
        .join("\n\n");
    };

    const buildPrompt = (
      medicineInfo: any,
      sideEffects: string,
      userSettings: string = ""
    ) => {
      const sections = [];

      sections.push(`Medicine Analysis Results for ${medicineInfo.name}:`);

      // Only add sections with data
      const basicInfo = [
        ["Purpose", medicineInfo.purpose],
        ["Indications", medicineInfo.indications],
        ["Warnings", medicineInfo.warnings],
        ["Patient Information", medicineInfo.patientInfo],
      ].filter(([_, value]) => value !== null);

      if (basicInfo.length > 0) {
        sections.push("\nBasic Information:");
        sections.push(
          basicInfo.map(([key, value]) => `- ${key}: ${value}`).join("\n")
        );
      }

      if (sideEffects) {
        sections.push("\nSide Effects:");
        sections.push(sideEffects);
      }

      return sections.join("\n");
    };

    const textGeneration = async (input: string) => {
      const prompt = `System Instructions:
${MEDICAL_SYSTEM_PROMPT}

Medicine Data:
${input}

User Settings:
${userSettings}

Output:`;

      console.log("Prompt sent to Watson:", prompt);

      const response = (await Promise.race([
        watsonxAIService.generateText({
          input: prompt,
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
        }),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Watson API timeout")), 30000)
        ),
      ])) as WatsonResponse;
      return response;
    };

    // Main execution
    const medicineInfo = buildMedicineInfo(fdaData);
    const sideEffects = formatSideEffects(sideEffectData);
    const formattedPrompt = buildPrompt(
      medicineInfo,
      sideEffects,
      userSettings
    );

    // Only proceed if we have at least some meaningful data
    if (formattedPrompt.trim() === "") {
      throw new Error("No valid data provided");
    }

    const response = await textGeneration(formattedPrompt);
    if (!response?.result?.results?.[0]?.generated_text) {
      throw new Error("Invalid response from Watson");
    }

    return new Response(
      JSON.stringify({
        generatedText: response.result.results[0].generated_text,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        message: "Error processing request",
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status:
          error instanceof Error && error.message.includes("Invalid request")
            ? 400
            : 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};
