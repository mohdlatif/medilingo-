import type { APIRoute } from "astro";
export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();

    if (!body.brand_name) {
      return new Response(
        JSON.stringify({
          message: "Error: Medicine name is required in request body",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Construct FDA API URL with the medicine name
    const FDA_API_URL = `https://api.fda.gov/drug/label.json?search=brand_name=${encodeURIComponent(
      body.brand_name
    )}&limit=1`;

    // Fetch data from FDA API
    const response = await fetch(FDA_API_URL);
    const data = await response.json();

    // Return the FDA API response
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
