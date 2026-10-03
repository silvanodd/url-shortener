import { api, APIError } from "encore.dev/api";
import { SQLDatabase } from "encore.dev/storage/sqldb";
import { randomBytes } from "node:crypto";

// 'url' database is used to store the URLs that are being shortened.
export const db = new SQLDatabase("url", { migrations: "./migrations" });

// URLs expire this many seconds after being shortened.
const URL_TTL_SECONDS = 500;

interface URL {
    id: string; // short-form URL id
    url: string; // complete URL, in long form
    expiresAt: string; // ISO-8601 timestamp after which the URL is expired
}

interface ShortenParams {
    url: string; // the URL to shorten
}

// Shortens a URL.
export const shorten = api(
    { method: "POST", path: "/url", expose: true },
    async ({ url }: ShortenParams): Promise<URL> => {
      const id = randomBytes(6).toString("base64url");
      const row = await db.queryRow<{ expires_at: Date }>`
        INSERT INTO url (id, original_url, expires_at)
        VALUES (${id}, ${url}, NOW() + ${URL_TTL_SECONDS} * INTERVAL '1 second')
        RETURNING expires_at
      `;
      if (!row) throw APIError.internal("failed to store url");
      return { id, url, expiresAt: row.expires_at.toISOString() };
    },
  );

  // Get retrieves the original URL for the id.
export const get = api(
    { expose: true, method: "GET", path: "/url/:id" },
    async ({ id }: { id: string }): Promise<URL> => {
      const row = await db.queryRow<{ original_url: string; expires_at: Date; expired: boolean }>`
          SELECT original_url, expires_at, expires_at <= NOW() AS expired
          FROM url WHERE id = ${id}
      `;
      if (!row) throw APIError.notFound("url not found");
      if (row.expired) throw APIError.notFound("url has expired");
      return { id, url: row.original_url, expiresAt: row.expires_at.toISOString() };
    }
  );
