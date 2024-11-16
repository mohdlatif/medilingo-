export const prerender = false;
import { ImageAnnotatorClient } from "@google-cloud/vision";
import type { APIRoute } from "astro";

const credentials = JSON.parse(import.meta.env.GOOGLE_CLOUD_STORAGE_KEY_FILE);

export const POST: APIRoute = async ({ request }) => {
  try {
    const { imageUrl } = await request.json();
    if (!imageUrl) {
      return new Response("Image URL is required", { status: 400 });
    }

    const visionClient = new ImageAnnotatorClient({
      credentials: credentials,
    });

    // Request both text detection and object detection
    const [result] = await visionClient.annotateImage({
      image: { content: imageUrl.split(",")[1] }, // Remove data:image/jpeg;base64, prefix
      features: [
        { type: "TEXT_DETECTION" },
        { type: "OBJECT_LOCALIZATION" },
        { type: "LOGO_DETECTION" },
        { type: "LABEL_DETECTION", maxResults: 5 },
      ],
    });

    // Extract text and identify potential medicine names
    const fullText = result.fullTextAnnotation?.text || "";
    const textBlocks = result.textAnnotations?.slice(1) || [];

    // Look for common medicine packaging terms
    const medicineIndicators = [
      "mg",
      "tablet",
      "capsule",
      "tablets",
      "capsules",
      "prescription",
      "drug",
      "medicine",
      "pharmaceutical",
      "dose",
      "dosage",
      "active ingredient",
    ];

    // Find potential medicine names from text blocks
    const potentialMedicineNames = textBlocks
      .filter((block) => {
        const text = block.description?.toLowerCase() || "";
        // Filter out common non-medicine text
        return (
          !medicineIndicators.includes(text) &&
          !/^\d+$/.test(text) && // Exclude pure numbers
          text.length > 2
        ); // Exclude very short text
      })
      .map((block) => block.description)
      .slice(0, 3); // Get top 3 potential names

    const response = {
      medicineName: potentialMedicineNames[0] || "", // Best guess for medicine name
      alternativeNames: potentialMedicineNames.slice(1), // Other potential names
      fullText: fullText,
      objects: result.localizedObjectAnnotations?.map((obj) => obj.name) || [],
      logos: result.logoAnnotations?.map((logo) => logo.description) || [],
      labels: result.labelAnnotations?.map((label) => label.description) || [],
    };

    console.log("Vision AI response:", response);

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Vision AI Error:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to analyze image",
        details: error instanceof Error ? error.message : "Unknown error",
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
