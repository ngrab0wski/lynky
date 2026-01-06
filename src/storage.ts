import { env } from "cloudflare:workers";
import { generateId } from "./ids";
import { ShortenedUrl } from "./model";

const ID_GENERATION_RETRY_COUNT = 3;

export async function storeShortenedUrl(
  longUrl: string,
): Promise<ShortenedUrl> {
  const id = await generateUniqueId();
  const shortenedUrl: ShortenedUrl = {
    id,
    longUrl,
    createdOn: new Date().toISOString(),
  };

  await env.LYNKY_DATA.put(shortenedUrl.id, longUrl, {
    metadata: {
      createdOn: shortenedUrl.createdOn,
    },
  });

  return shortenedUrl;
}

export async function getShortenedUrlById(id: string): Promise<string | null> {
  const longUrl = await env.LYNKY_DATA.get(id);
  return longUrl;
}

async function generateUniqueId() {
  for (let index = 0; index <= ID_GENERATION_RETRY_COUNT; index++) {
    const id = generateId();
    const result = await env.LYNKY_DATA.get(id);
    if (!result) {
      return id;
    }
  }

  throw new Error(
    `Failed to generate ID after ${ID_GENERATION_RETRY_COUNT} tries`,
  );
}
