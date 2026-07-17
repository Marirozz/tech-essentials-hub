import type { Metadata } from "next";
import { Suspense } from "react";
import { ProductsExplorer } from "@/components/ProductsExplorer";
import { getProducts } from "@/lib/products";

export const metadata: Metadata = { title: "Productos", description: "Productos tecnológicos recomendados para trabajo remoto y hogar." };

export default async function Products() {
  const products = await getProducts();
  return <main className="section"><div className="container"><span className="eyebrow">Catálogo</span><h1>Productos recomendados</h1><p className="subtitle">Filtra por categoría y encuentra el producto adecuado para tu necesidad.</p><Suspense fallback={<p className="muted">Cargando productos…</p>}><ProductsExplorer products={products} /></Suspense></div></main>;
}
