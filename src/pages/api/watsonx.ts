import type { APIRoute } from "astro";
import { textGeneration } from "@/lib/ibmAuth";

export const prerender = false;
export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();

    if (!body.prompt) {
      return new Response(
        JSON.stringify({
          message: "Error: Prompt is required in request body",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const response = await textGeneration(body.prompt);
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
