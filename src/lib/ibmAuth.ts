import { WatsonXAI } from "@ibm-cloud/watsonx-ai";

import { IamAuthenticator } from "ibm-cloud-sdk-core";

export const watsonxAIService = WatsonXAI.newInstance({
  version: "2024-05-31",
  serviceUrl: "https://us-south.ml.cloud.ibm.com",
  authenticator: new IamAuthenticator({
    apikey: import.meta.env.WATSON_SERVICE_API_KEY!, // OR WATSON_IAM_API_KEY!
  }),
});
