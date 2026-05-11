import "./lib/error-capture";

import { createStartHandler, defaultStreamHandler } from "@tanstack/react-start/server";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";

const startHandler = createStartHandler(defaultStreamHandler);

async function normalizeServerError(response: Response): Promise<Response> {
  if (response.status < 500) return response;

  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  const isHiddenServerError =
    body.includes('"unhandled":true') && body.includes('"message":"HTTPError"');

  if (!isHiddenServerError) return response;

  console.error(consumeLastCapturedError() ?? new Error(`Hidden SSR error: ${body}`));

  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

export default {
  async fetch(request: Request, opts?: Parameters<typeof startHandler>[1]) {
    try {
      const response = await startHandler(request, opts);
      return await normalizeServerError(response);
    } catch (error) {
      console.error(error);

      return new Response(renderErrorPage(), {
        status: 500,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }
  },
};