import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { products as fallbackProducts, type Product } from "@/data/content";

type ProductRow = {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: string;
  price: string;
  score: number;
  best_for: string;
  description: string;
  image: string;
  pros: string[] | null;
  cons: string[] | null;
  specs: Record<string, string> | null;
  affiliate_url: string;
  verdict: string | null;
  status: "draft" | "published" | "archived";
  featured: boolean;
  created_at?: string;
  updated_at?: string;
};

export type AdminProduct = Product & {
  id?: string;
  status: "draft" | "published" | "archived";
  featured: boolean;
};

function publicClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createSupabaseClient(url, key, { auth: { persistSession: false } });
}

export function adminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createSupabaseClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

function rowToProduct(row: ProductRow): AdminProduct {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    brand: row.brand,
    category: row.category,
    price: row.price,
    score: Number(row.score),
    bestFor: row.best_for,
    description: row.description,
    image: row.image,
    pros: row.pros ?? [],
    cons: row.cons ?? [],
    specs: row.specs ?? {},
    affiliateUrl: row.affiliate_url,
    verdict: row.verdict ?? undefined,
    status: row.status,
    featured: row.featured,
  };
}

export async function getProducts(): Promise<Product[]> {
  const client = publicClient();
  if (!client) return fallbackProducts;

  const { data, error } = await client
    .from("products")
    .select("*")
    .eq("status", "published")
    .order("featured", { ascending: false })
    .order("created_at", { ascending: false });

  if (error || !data || data.length === 0) return fallbackProducts;
  return (data as ProductRow[]).map(rowToProduct);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const client = publicClient();
  if (client) {
    const { data } = await client
      .from("products")
      .select("*")
      .eq("slug", slug)
      .eq("status", "published")
      .maybeSingle();
    if (data) return rowToProduct(data as ProductRow);
  }
  return fallbackProducts.find((product) => product.slug === slug) ?? null;
}

export async function getAdminProducts(): Promise<AdminProduct[]> {
  const client = adminClient();
  if (!client) {
    return fallbackProducts.map((product) => ({ ...product, status: "published", featured: true }));
  }
  const { data, error } = await client.from("products").select("*").order("updated_at", { ascending: false });
  if (error) throw new Error(error.message);
  return ((data ?? []) as ProductRow[]).map(rowToProduct);
}

export async function getAdminProduct(id: string): Promise<AdminProduct | null> {
  const client = adminClient();
  if (!client) return null;
  const { data, error } = await client.from("products").select("*").eq("id", id).maybeSingle();
  if (error) throw new Error(error.message);
  return data ? rowToProduct(data as ProductRow) : null;
}
