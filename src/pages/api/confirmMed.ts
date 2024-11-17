import type { APIRoute } from "astro";
import Together from "together-ai";
export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();

    // Initialize Together AI client
    const together = new Together({
      apiKey: import.meta.env.TOGETHER_API_KEY,
    });

    // Create chat completion with Together AI
    const response = await together.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that provides information about medications. Here is the information about the medicine, please return ONLY the medicine brand_name that matches these descriptions so then we can verify it from the FDA database. Return only the brand_name, nothing else. Do not add any explanations or additional text. It does not necessarily be mentioned but based on the descriptions, please return the most likely brand_name.\n\nExample:\nTylenol",
        },
        {
          role: "user",
          content: JSON.stringify(body),
        },
      ],
      model: "meta-llama/Llama-3.2-11B-Vision-Instruct-Turbo",
      max_tokens: 1500,
      temperature: 0.7,
      stop: ["\n"],
    });

    console.log(response);
    // Return only the content from choices
    return new Response(
      JSON.stringify({
        message: "Success",
        brand_name:
          response.choices?.[0]?.message?.content || "No response generated",
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
