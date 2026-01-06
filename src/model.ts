export type ShortenedUrl = {
  id: string;
  longUrl: string;
  createdOn: string;
};

export function getShortUrl(baseUrl: URL, shortUrl: ShortenedUrl): string {
  return `${baseUrl.protocol}//${baseUrl.host}/${shortUrl.id}`;
}
