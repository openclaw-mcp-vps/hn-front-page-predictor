import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { sql } from "@vercel/postgres";

export type PurchaseProvider = "stripe" | "lemonsqueezy";

interface PurchaseRecord {
  email: string;
  provider: PurchaseProvider;
  eventId: string;
  checkoutId?: string;
  paidAt: string;
}

interface FileStore {
  purchases: PurchaseRecord[];
}

const STORE_PATH = path.join(process.cwd(), ".data", "purchases.json");

function shouldUsePostgres() {
  return Boolean(process.env.POSTGRES_URL || process.env.DATABASE_URL || process.env.POSTGRES_PRISMA_URL);
}

async function ensurePgSchema() {
  await sql`
    CREATE TABLE IF NOT EXISTS purchases (
      id BIGSERIAL PRIMARY KEY,
      email TEXT NOT NULL,
      provider TEXT NOT NULL,
      event_id TEXT NOT NULL,
      checkout_id TEXT,
      paid_at TIMESTAMPTZ NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      UNIQUE(provider, event_id)
    );
  `;
}

async function readStore(): Promise<FileStore> {
  await mkdir(path.dirname(STORE_PATH), { recursive: true });
  try {
    const raw = await readFile(STORE_PATH, "utf8");
    const parsed = JSON.parse(raw) as FileStore;
    return {
      purchases: Array.isArray(parsed.purchases) ? parsed.purchases : []
    };
  } catch {
    return { purchases: [] };
  }
}

async function writeStore(store: FileStore) {
  await mkdir(path.dirname(STORE_PATH), { recursive: true });
  await writeFile(STORE_PATH, JSON.stringify(store, null, 2), "utf8");
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export async function recordPurchase(record: PurchaseRecord) {
  const normalized: PurchaseRecord = {
    ...record,
    email: normalizeEmail(record.email)
  };

  if (shouldUsePostgres()) {
    try {
      await ensurePgSchema();
      await sql`
        INSERT INTO purchases (email, provider, event_id, checkout_id, paid_at)
        VALUES (
          ${normalized.email},
          ${normalized.provider},
          ${normalized.eventId},
          ${normalized.checkoutId ?? null},
          ${normalized.paidAt}
        )
        ON CONFLICT (provider, event_id)
        DO NOTHING;
      `;
      return;
    } catch {
      // Fall back to file persistence.
    }
  }

  const store = await readStore();
  const exists = store.purchases.some(
    (item) => item.provider === normalized.provider && item.eventId === normalized.eventId
  );

  if (!exists) {
    store.purchases.push(normalized);
    await writeStore(store);
  }
}

export async function hasPurchaseForEmail(email: string) {
  const normalizedEmail = normalizeEmail(email);

  if (shouldUsePostgres()) {
    try {
      await ensurePgSchema();
      const result = await sql`
        SELECT 1
        FROM purchases
        WHERE email = ${normalizedEmail}
        LIMIT 1;
      `;
      if ((result.rowCount ?? 0) > 0) return true;
    } catch {
      // Fall back to file persistence.
    }
  }

  const store = await readStore();
  return store.purchases.some((item) => item.email === normalizedEmail);
}
