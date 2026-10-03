import { describe, expect, test } from "vitest";
import { db, get, shorten } from "./url";

describe("shorten", () => {
  test("getting a shortened url should give back the original", async () => {
    const resp = await shorten({ url: "https://example.com" });
    const url = await get({ id: resp.id });
    expect(url.url).toBe("https://example.com");
    expect(url.expiresAt).toBe(resp.expiresAt);
  });

  test("shortened urls expire 500 seconds after creation", async () => {
    const before = Date.now();
    const resp = await shorten({ url: "https://example.com" });
    const ttlMs = new Date(resp.expiresAt).getTime() - before;
    expect(ttlMs).toBeGreaterThan(495_000);
    expect(ttlMs).toBeLessThanOrEqual(505_000);
  });

  test("expired urls return 'url has expired'", async () => {
    const { id } = await shorten({ url: "https://example.com" });
    await db.exec`UPDATE url SET expires_at = NOW() - INTERVAL '1 second' WHERE id = ${id}`;
    await expect(get({ id })).rejects.toThrow("url has expired");
  });

  test("unknown ids return 'url not found'", async () => {
    await expect(get({ id: "does-not-exist" })).rejects.toThrow("url not found");
  });
});
