"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ProductCard } from "@/components/ProductCard";
import type { Product } from "@/data/content";

export function ProductsExplorer({ products }: { products: Product[] }) {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("buscar") ?? "";
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState("Todas");
  const [sort, setSort] = useState("score");

  const categories = useMemo(
    () => ["Todas", ...Array.from(new Set(products.map((product) => product.category)))],
    [],
  );

  const visibleProducts = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("es");
    const filtered = products.filter((product) => {
      const matchesQuery =
        !normalized ||
        [product.name, product.brand, product.category, product.description, product.bestFor]
          .join(" ")
          .toLocaleLowerCase("es")
          .includes(normalized);
      const matchesCategory = category === "Todas" || product.category === category;
      return matchesQuery && matchesCategory;
    });

    return [...filtered].sort((a, b) => {
      if (sort === "name") return a.name.localeCompare(b.name, "es");
      if (sort === "price") {
        const priceA = Number(a.price.replace(/[^0-9.]/g, "")) || 0;
        const priceB = Number(b.price.replace(/[^0-9.]/g, "")) || 0;
        return priceA - priceB;
      }
      return b.score - a.score;
    });
  }, [category, query, sort]);

  return (
    <>
      <div className="filters">
        <input
          className="search"
          style={{ maxWidth: 420 }}
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Buscar producto..."
          aria-label="Buscar producto"
        />
        <select className="select" value={category} onChange={(event) => setCategory(event.target.value)}>
          {categories.map((item) => (
            <option key={item} value={item}>{item === "Todas" ? "Todas las categorías" : item}</option>
          ))}
        </select>
        <select className="select" value={sort} onChange={(event) => setSort(event.target.value)}>
          <option value="score">Mejor puntuación</option>
          <option value="price">Precio menor</option>
          <option value="name">Nombre A–Z</option>
        </select>
      </div>

      {visibleProducts.length > 0 ? (
        <div className="grid grid-3">
          {visibleProducts.map((product) => <ProductCard key={product.slug} product={product} />)}
        </div>
      ) : (
        <div className="empty-state">
          <h2>No encontramos resultados</h2>
          <p className="muted">Prueba con otra palabra o selecciona una categoría diferente.</p>
        </div>
      )}
    </>
  );
}
