export const prerender = false;
import type { APIRoute } from "astro";
import { Readable } from "stream";

export const POST: APIRoute = async ({ request, locals }) => {
  return new Response(
    JSON.stringify({
      hi: "hiii",
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};
