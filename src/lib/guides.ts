import { guides as fallbackGuides, products as fallbackProducts, type Product } from "@/data/content";
import { adminClient } from "@/lib/products";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

export type GuideProductRelation = {
  product: Product & { id?: string };
  position: number;
  badge?: string;
  note?: string;
};

export type Guide = {
  id?: string;
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  image: string;
  minutes: number;
  introduction: string;
  selectionCriteria: string;
  howToChoose: string;
  faq: Array<{ question: string; answer: string }>;
  conclusion: string;
  affiliateNotice: string;
  metaTitle?: string;
  metaDescription?: string;
  status: "draft" | "published" | "archived";
  featured: boolean;
  products: GuideProductRelation[];
};

type GuideRow = {
  id: string;
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  image: string;
  minutes: number;
  introduction: string;
  selection_criteria: string;
  how_to_choose: string;
  faq: Array<{ question: string; answer: string }> | null;
  conclusion: string;
  affiliate_notice: string;
  meta_title: string | null;
  meta_description: string | null;
  status: "draft" | "published" | "archived";
  featured: boolean;
};

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
};

type RelationRow = {
  position: number;
  badge: string | null;
  note: string | null;
  products: ProductRow | ProductRow[] | null;
};

function publicClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createSupabaseClient(url, key, { auth: { persistSession: false } });
}

function productRowToProduct(row: ProductRow): Product & { id: string } {
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
  };
}

function relationProduct(value: RelationRow["products"]): ProductRow | null {
  if (Array.isArray(value)) return value[0] ?? null;
  return value;
}

function rowToGuide(row: GuideRow, relations: RelationRow[] = []): Guide {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    category: row.category,
    excerpt: row.excerpt,
    image: row.image,
    minutes: Number(row.minutes),
    introduction: row.introduction,
    selectionCriteria: row.selection_criteria,
    howToChoose: row.how_to_choose,
    faq: row.faq ?? [],
    conclusion: row.conclusion,
    affiliateNotice: row.affiliate_notice,
    metaTitle: row.meta_title ?? undefined,
    metaDescription: row.meta_description ?? undefined,
    status: row.status,
    featured: row.featured,
    products: relations
      .reduce<GuideProductRelation[]>((items, relation) => {
        const product = relationProduct(relation.products);
        if (!product) return items;
        items.push({
          product: productRowToProduct(product),
          position: relation.position,
          badge: relation.badge ?? undefined,
          note: relation.note ?? undefined,
        });
        return items;
      }, [])
      .sort((a, b) => a.position - b.position),
  };
}

function fallback(): Guide[] {
  return fallbackGuides.map((guide, index) => ({
    ...guide,
    introduction: guide.excerpt,
    selectionCriteria: "Comparamos utilidad, facilidad de uso, funciones relevantes y relación calidad-precio.",
    howToChoose: "Define primero tu necesidad, presupuesto y espacio disponible. No siempre el producto con más funciones es el más conveniente.",
    faq: [],
    conclusion: "Elige la opción que mejor se adapte a tu uso diario y revisa la ficha individual antes de comprar.",
    affiliateNotice: "Este artículo puede contener enlaces de afiliado. Tech Essentials Hub podría recibir una comisión si realizas una compra mediante alguno de ellos, sin costo adicional para ti.",
    status: "published" as const,
    featured: index < 3,
    products: fallbackProducts.slice(index, index + 3).map((product, position) => ({ product, position })),
  }));
}

export async function getGuides(): Promise<Guide[]> {
  const client = publicClient();
  if (!client) return fallback();
  const { data, error } = await client.from("guides").select("*").eq("status", "published").order("featured", { ascending: false }).order("created_at", { ascending: false });
  if (error || !data || data.length === 0) return fallback();
  return (data as GuideRow[]).map((row) => rowToGuide(row));
}

export async function getGuideBySlug(slug: string): Promise<Guide | null> {
  const client = publicClient();
  if (client) {
    const { data } = await client.from("guides").select("*").eq("slug", slug).eq("status", "published").maybeSingle();
    if (data) {
      const { data: relations } = await client
        .from("guide_products")
        .select("position,badge,note,products(*)")
        .eq("guide_id", (data as GuideRow).id)
        .order("position", { ascending: true });
      return rowToGuide(data as GuideRow, (relations ?? []) as RelationRow[]);
    }
  }
  return fallback().find((guide) => guide.slug === slug) ?? null;
}

export async function getAdminGuides(): Promise<Guide[]> {
  const client = adminClient();
  if (!client) return fallback();
  const { data, error } = await client.from("guides").select("*").order("updated_at", { ascending: false });
  if (error) throw new Error(error.message);
  return ((data ?? []) as GuideRow[]).map((row) => rowToGuide(row));
}

export async function getAdminGuide(id: string): Promise<Guide | null> {
  const client = adminClient();
  if (!client) return null;
  const { data, error } = await client.from("guides").select("*").eq("id", id).maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) return null;
  const { data: relations, error: relationError } = await client
    .from("guide_products")
    .select("position,badge,note,products(*)")
    .eq("guide_id", id)
    .order("position", { ascending: true });
  if (relationError) throw new Error(relationError.message);
  return rowToGuide(data as GuideRow, (relations ?? []) as RelationRow[]);
}
