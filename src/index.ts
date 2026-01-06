import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import * as z from "zod/mini";
import { getShortUrl } from "./model";
import { getShortenedUrlById, storeShortenedUrl } from "./storage";

const app = new Hono<{ Bindings: CloudflareBindings }>();

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
