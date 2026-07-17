"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import type { Product } from "@/data/content";

const PRODUCTS_PER_PAGE = 6;

export function FeaturedProductsCarousel({ products }: { products: Product[] }) {
  const [page, setPage] = useState(0);
  const pages = useMemo(() => {
    const result: Product[][] = [];
    for (let index = 0; index < products.length; index += PRODUCTS_PER_PAGE) {
      result.push(products.slice(index, index + PRODUCTS_PER_PAGE));
    }
    return result;
  }, [products]);

  const totalPages = Math.max(pages.length, 1);
  const visibleProducts = pages[page] ?? [];

  function previousPage() {
    setPage((current) => (current === 0 ? totalPages - 1 : current - 1));
  }

  function nextPage() {
    setPage((current) => (current === totalPages - 1 ? 0 : current + 1));
  }

  return (
    <div className="featured-products-carousel">
      {totalPages > 1 && (
        <button
          className="carousel-button carousel-button-left"
          type="button"
          onClick={previousPage}
          aria-label="Ver productos anteriores"
        >
          <ChevronLeft aria-hidden="true" size={22} />
        </button>
      )}

      <div className="featured-products-grid" aria-live="polite">
        {visibleProducts.map((product) => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </div>

      {totalPages > 1 && (
        <button
          className="carousel-button carousel-button-right"
          type="button"
          onClick={nextPage}
          aria-label="Ver más productos"
        >
          <ChevronRight aria-hidden="true" size={22} />
        </button>
      )}

      {totalPages > 1 && (
        <div className="carousel-pagination" aria-label="Páginas de productos">
          {pages.map((_, index) => (
            <button
              key={index}
              className={index === page ? "carousel-dot carousel-dot-active" : "carousel-dot"}
              type="button"
              onClick={() => setPage(index)}
              aria-label={`Ir al grupo ${index + 1} de productos`}
              aria-current={index === page ? "true" : undefined}
            />
          ))}
        </div>
      )}
    </div>
  );
}
