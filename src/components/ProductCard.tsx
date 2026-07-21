import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/data/content";

export function ProductCard({
  product,
}: {
  product: Product;
}) {
  return (
    <article className="card product-card">
      <div className="product-card-image-wrap">
        <Image
          className="product-card-image"
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>

      <div className="card-body">
        <span className="badge">{product.category}</span>

        <h3>{product.name}</h3>

        <p className="muted">{product.bestFor}</p>

        <div className="product-meta">
          <div>
            <small className="muted">Desde</small>
            <strong style={{ display: "block" }}>
              {product.price}
            </strong>
          </div>

          <div className="score">{product.score}</div>
        </div>

        <p>
          <Link
            className="btn btn-secondary"
            href={`/productos/${product.slug}`}
          >
            Ver análisis
          </Link>
        </p>
      </div>
    </article>
  );
}