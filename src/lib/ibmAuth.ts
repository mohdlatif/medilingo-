import { WatsonXAI } from "@ibm-cloud/watsonx-ai";

import { IamAuthenticator } from "ibm-cloud-sdk-core";

export const watsonxAIService = WatsonXAI.newInstance({
  version: "2024-05-31",
  serviceUrl: "https://us-south.ml.cloud.ibm.com",
  authenticator: new IamAuthenticator({
    apikey: import.meta.env.WATSON_API_KEY!,
  }),
});
const systemPrompt =
  "your job is to be medicine assistant and replay with the manufactor and side effects of a midicine and what used for.";
export const textGeneration = async (input: string) =>
  watsonxAIService.generateText({
    input: `${systemPrompt}\n\nInput: ${input}\nOutput:`,
    parameters: {
      decoding_method: "greedy",
      max_new_tokens: 1500,
      min_new_tokens: 0,
      stop_sequences: ["<|endoftext|>"],
      repetition_penalty: 1.03,
    },
    modelId: "meta-llama/llama-3-405b-instruct",
    projectId: import.meta.env.WATSON_PROJECT_ID,
  });
