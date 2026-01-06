const ID_LENGTH = 7;
const ALPHABET =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

/**
 * Generate a new random ID.
 */
export function generateId(): string {
  return Array.from({ length: ID_LENGTH }, () => {
    const randomIndex = Math.floor(Math.random() * ALPHABET.length);
    return ALPHABET[randomIndex];
  }).join("");
}
