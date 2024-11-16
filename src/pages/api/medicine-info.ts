import type { APIRoute } from "astro";
export const prerender = false;

import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: import.meta.env.ARIA_API_KEY,
  baseURL: "https://api.rhymes.ai/v1",
});
export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();

    return new Response(
      JSON.stringify({
        message: "Success",
        data: data,
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
        error: (error as Error).message,
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
