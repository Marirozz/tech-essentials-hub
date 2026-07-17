"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAdminSession, clearAdminSession, requireAdmin } from "@/lib/admin-auth";
import { adminClient } from "@/lib/products";

function slugify(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}
function lines(value: FormDataEntryValue | null) { return String(value ?? "").split("\n").map((v)=>v.trim()).filter(Boolean); }
function specs(value: FormDataEntryValue | null) {
  return Object.fromEntries(lines(value).map((line)=>{ const [label,...rest]=line.split(":"); return [label.trim(), rest.join(":").trim()]; }).filter(([,v])=>v));
}
function payload(formData: FormData) {
  const name=String(formData.get("name")??"").trim();
  return {
    name,
    slug: slugify(String(formData.get("slug")||name)),
    brand:String(formData.get("brand")??"").trim(),
    category:String(formData.get("category")??"").trim(),
    price:String(formData.get("price")??"").trim(),
    score:Number(formData.get("score")??0),
    best_for:String(formData.get("bestFor")??"").trim(),
    description:String(formData.get("description")??"").trim(),
    image:String(formData.get("image")??"").trim(),
    pros:lines(formData.get("pros")),
    cons:lines(formData.get("cons")),
    specs:specs(formData.get("specs")),
    affiliate_url:String(formData.get("affiliateUrl")??"").trim(),
    verdict:String(formData.get("verdict")??"").trim()||null,
    status:String(formData.get("status")??"draft"),
    featured:formData.get("featured")==="on",
    updated_at:new Date().toISOString(),
  };
}

export async function loginAction(formData: FormData) {
  const ok=await createAdminSession(String(formData.get("password")??""));
  if (!ok) redirect("/admin/login?error=1");
  redirect("/admin");
}
export async function logoutAction(){ await clearAdminSession(); redirect("/admin/login"); }
export async function createProductAction(formData: FormData){
  await requireAdmin(); const client=adminClient(); if(!client) throw new Error("Configura Supabase en .env.local");
  const {error}=await client.from("products").insert(payload(formData)); if(error) throw new Error(error.message);
  revalidatePath("/"); revalidatePath("/productos"); redirect("/admin");
}
export async function updateProductAction(id:string,formData:FormData){
  await requireAdmin(); const client=adminClient(); if(!client) throw new Error("Configura Supabase en .env.local");
  const {error}=await client.from("products").update(payload(formData)).eq("id",id); if(error) throw new Error(error.message);
  revalidatePath("/"); revalidatePath("/productos"); redirect("/admin");
}
export async function deleteProductAction(id:string){
  await requireAdmin(); const client=adminClient(); if(!client) throw new Error("Configura Supabase en .env.local");
  const {error}=await client.from("products").delete().eq("id",id); if(error) throw new Error(error.message);
  revalidatePath("/"); revalidatePath("/productos"); redirect("/admin");
}
