export const prerender = false;
import type { APIRoute } from "astro";
import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";

const genAI = new GoogleGenerativeAI(import.meta.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const {
      prompt = "Analyze the provided image of the medicine packaging. Pay close attention to logos, symbols, and distinct visual elements to identify the brand name. Prioritize these visual cues over any text, as the text may be unclear or stylized. If possible, describe the logo or any unique visual markers associated with the brand. Respond with only the brand name and nothing else.",
      imageData,
      mimeType,
    } = body;

    const image = {
      inlineData: {
        data: imageData,
        mimeType: mimeType || "image/png",
      },
    };

    const result = await model.generateContent([prompt, image]);
    const response = await result.response;
    const brand_name = response.text().trim();

    return new Response(JSON.stringify({ brand_name }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Failed to process request" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
};
