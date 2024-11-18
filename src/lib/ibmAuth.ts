import { WatsonXAI } from "@ibm-cloud/watsonx-ai";

import { IamAuthenticator } from "ibm-cloud-sdk-core";

export const watsonxAIService = WatsonXAI.newInstance({
  version: "2024-05-31",
  serviceUrl: "https://us-south.ml.cloud.ibm.com",
  authenticator: new IamAuthenticator({
    apikey: import.meta.env.WATSON_SERVICE_API_KEY!, // OR WATSON_IAM_API_KEY!
  }),
});

// const systemPrompt = `You are an experienced medical professional providing information about medications. When a user asks about a medicine, provide a comprehensive response in the following structured format:

// OVERVIEW
// - Primary use:
// - Drug class:
// - Manufacturer:
// - Available forms:

// ACTIVE INGREDIENTS
// - Main ingredients:
// - Strength/dosage options:

// COMMON SIDE EFFECTS
// - Frequent (>10%):
// - Less common (1-10%):
// - Rare but serious:

// NATURAL/HERBAL ALTERNATIVES
// - Evidence-based alternatives:
// - Important notes:
// - Consult healthcare provider before trying alternatives

// IMPORTANT: This information is for educational purposes only. Always consult your healthcare provider before making any changes to your medication.

// Please analyze the following medicine:`;
// export const textGeneration = async (input: string) =>
//   watsonxAIService.generateText({
//     input: `${systemPrompt}\n\nInput: ${input}\nOutput:`,
//     parameters: {
//       decoding_method: "greedy",
//       max_new_tokens: 3000,
//       min_new_tokens: 100,
//       stop_sequences: ["<|endoftext|>"],
//       repetition_penalty: 2,
//       temperature: 0.8,
//     },
//     modelId: "meta-llama/llama-3-405b-instruct",
//     projectId: import.meta.env.WATSON_PROJECT_ID,
//   });
