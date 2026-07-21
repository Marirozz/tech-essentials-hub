"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  createAdminSession,
  clearAdminSession,
  requireAdmin,
} from "@/lib/admin-auth";
import { adminClient } from "@/lib/products";

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function lines(value: FormDataEntryValue | null) {
  return String(value ?? "")
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function specs(value: FormDataEntryValue | null) {
  return Object.fromEntries(
    lines(value)
      .map((line) => {
        const [label, ...rest] = line.split(":");
        return [label.trim(), rest.join(":").trim()];
      })
      .filter(([, value]) => value),
  );
}

function productPayload(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  return {
    name,
    slug: slugify(String(formData.get("slug") || name)),
    brand: String(formData.get("brand") ?? "").trim(),
    category: String(formData.get("category") ?? "").trim(),
    price: String(formData.get("price") ?? "").trim(),
    score: Number(formData.get("score") ?? 0),
    best_for: String(formData.get("bestFor") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    image: String(formData.get("image") ?? "").trim(),
    pros: lines(formData.get("pros")),
    cons: lines(formData.get("cons")),
    specs: specs(formData.get("specs")),
    affiliate_url: String(formData.get("affiliateUrl") ?? "").trim(),
    verdict: String(formData.get("verdict") ?? "").trim() || null,
    status: String(formData.get("status") ?? "draft"),
    featured: formData.get("featured") === "on",
    updated_at: new Date().toISOString(),
  };
}

function faq(value: FormDataEntryValue | null) {
  const text = String(value ?? "")
    .replace(/\r\n/g, "\n")
    .trim();

  if (!text) {
    return [];
  }

  // Formato recomendado:
  // Pregunta | Respuesta
  if (text.includes("|")) {
    return text
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const separatorIndex = line.indexOf("|");

        if (separatorIndex === -1) {
          return null;
        }

        const question = line
          .slice(0, separatorIndex)
          .trim();

        const answer = line
          .slice(separatorIndex + 1)
          .trim();

        if (!question || !answer) {
          return null;
        }

        return {
          question,
          answer,
        };
      })
      .filter(
        (
          item,
        ): item is {
          question: string;
          answer: string;
        } => item !== null,
      );
  }

  // Formato alternativo:
  // Pregunta
  // Respuesta
  //
  // Pregunta
  // Respuesta
  return text
    .split(/\n\s*\n/)
    .map((block) =>
      block
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean),
    )
    .map((block) => {
      if (block.length < 2) {
        return null;
      }

      const question = block[0];
      const answer = block.slice(1).join(" ");

      return {
        question,
        answer,
      };
    })
    .filter(
      (
        item,
      ): item is {
        question: string;
        answer: string;
      } => item !== null,
    );
}
function guidePayload(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  return {
    title,
    slug: slugify(String(formData.get("slug") || title)),
    category: String(formData.get("category") ?? "").trim(),
    excerpt: String(formData.get("excerpt") ?? "").trim(),
    image: String(formData.get("image") ?? "").trim(),
    minutes: Number(formData.get("minutes") ?? 8),
    introduction: String(formData.get("introduction") ?? "").trim(),
    selection_criteria: String(formData.get("selectionCriteria") ?? "").trim(),
    how_to_choose: String(formData.get("howToChoose") ?? "").trim(),
    faq: faq(formData.get("faq")),
    conclusion: String(formData.get("conclusion") ?? "").trim(),
    affiliate_notice:
      String(formData.get("affiliateNotice") ?? "").trim() ||
      "Este artículo puede contener enlaces de afiliado. Tech Essentials Hub podría recibir una comisión si realizas una compra mediante alguno de ellos, sin costo adicional para ti.",
    meta_title: String(formData.get("metaTitle") ?? "").trim() || null,
    meta_description:
      String(formData.get("metaDescription") ?? "").trim() || null,
    status: String(formData.get("status") ?? "draft"),
    featured: formData.get("featured") === "on",
    updated_at: new Date().toISOString(),
  };
}

function guideRelations(guideId: string, formData: FormData) {
  return formData.getAll("productIds").map((value, index) => {
    const productId = String(value);
    return {
      guide_id: guideId,
      product_id: productId,
      position: Number(formData.get(`position_${productId}`) ?? index + 1),
      badge: String(formData.get(`badge_${productId}`) ?? "").trim() || null,
      note: String(formData.get(`note_${productId}`) ?? "").trim() || null,
    };
  });
}

async function replaceGuideRelations(guideId: string, formData: FormData) {
  const client = adminClient();
  if (!client)
    throw new Error("Configura Supabase en las variables de entorno");
  const { error: deleteError } = await client
    .from("guide_products")
    .delete()
    .eq("guide_id", guideId);
  if (deleteError) throw new Error(deleteError.message);
  const relations = guideRelations(guideId, formData);
  if (relations.length > 0) {
    const { error: insertError } = await client
      .from("guide_products")
      .insert(relations);
    if (insertError) throw new Error(insertError.message);
  }
}

function revalidatePublicContent() {
  revalidatePath("/");
  revalidatePath("/productos");
  revalidatePath("/guias");
  revalidatePath("/categorias/[slug]", "page");
}

export async function loginAction(formData: FormData) {
  const ok = await createAdminSession(String(formData.get("password") ?? ""));
  if (!ok) redirect("/admin/login?error=1");
  redirect("/admin");
}

export async function logoutAction() {
  await clearAdminSession();
  redirect("/admin/login");
}

export async function createProductAction(formData: FormData) {
  await requireAdmin();
  const client = adminClient();
  if (!client)
    throw new Error("Configura Supabase en las variables de entorno");
  const { error } = await client
    .from("products")
    .insert(productPayload(formData));
  if (error) throw new Error(error.message);
  revalidatePublicContent();
  redirect("/admin");
}

export async function updateProductAction(id: string, formData: FormData) {
  await requireAdmin();
  const client = adminClient();
  if (!client)
    throw new Error("Configura Supabase en las variables de entorno");
  const { error } = await client
    .from("products")
    .update(productPayload(formData))
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePublicContent();
  revalidatePath(`/productos/${String(formData.get("slug") ?? "")}`);
  redirect("/admin");
}

export async function deleteProductAction(id: string) {
  await requireAdmin();
  const client = adminClient();
  if (!client)
    throw new Error("Configura Supabase en las variables de entorno");
  const { error } = await client.from("products").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePublicContent();
  redirect("/admin");
}

export async function createGuideAction(formData: FormData) {
  await requireAdmin();
  const client = adminClient();
  if (!client)
    throw new Error("Configura Supabase en las variables de entorno");
  const { data, error } = await client
    .from("guides")
    .insert(guidePayload(formData))
    .select("id")
    .single();
  if (error) throw new Error(error.message);
  await replaceGuideRelations(data.id as string, formData);
  revalidatePublicContent();
  redirect("/admin/guias");
}

export async function updateGuideAction(id: string, formData: FormData) {
  await requireAdmin();
  const client = adminClient();
  if (!client)
    throw new Error("Configura Supabase en las variables de entorno");
  const { error } = await client
    .from("guides")
    .update(guidePayload(formData))
    .eq("id", id);
  if (error) throw new Error(error.message);
  await replaceGuideRelations(id, formData);
  revalidatePublicContent();
  revalidatePath(`/guias/${String(formData.get("slug") ?? "")}`);
  redirect("/admin/guias");
}

export async function deleteGuideAction(id: string) {
  await requireAdmin();
  const client = adminClient();
  if (!client)
    throw new Error("Configura Supabase en las variables de entorno");
  const { error } = await client.from("guides").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePublicContent();
  redirect("/admin/guias");
}
