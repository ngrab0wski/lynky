import { zValidator } from "@hono/zod-validator";
import { env } from "cloudflare:workers";
import { Hono } from "hono";
import { bearerAuth } from "hono/bearer-auth";
import * as z from "zod/mini";
import { getShortUrl } from "./model";
import { getShortenedUrlById, storeShortenedUrl } from "./storage";

const app = new Hono<{ Bindings: CloudflareBindings }>();

// Enable bearer authentication using the configured AUTH_TOKEN.
// This prevents anyone without the secret from adding new link entries.
// For local development this can be disabled by not setting the AUTH_TOKEN variable in the .env file.
if (env.AUTH_TOKEN) {
  app.use("/shorten", bearerAuth({ token: env.AUTH_TOKEN }));
}

app.post(
  "/shorten",
  zValidator(
    "json",
    z.object({
      url: z.url({ protocol: /^https$/ }),
    }),
  ),
  async (c) => {
    const validated = c.req.valid("json");
    const requestUrl = new URL(c.req.url);

    const shortUrl = await storeShortenedUrl(validated.url);

    return c.text(getShortUrl(requestUrl, shortUrl));
  },
);

app.get("/:code", async (c) => {
  const code = c.req.param("code");

  const longUrl = await getShortenedUrlById(code);
  if (longUrl === null) {
    return c.notFound();
  }

  // @Todo: Add expiration headers that match the storage properties.
  return c.redirect(longUrl, 301);
});

export default app;
