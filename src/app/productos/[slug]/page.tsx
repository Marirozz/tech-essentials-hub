import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/ProductCard";
import {
  getProductBySlug,
  getProducts,
} from "@/lib/products";

export const dynamic = "force-dynamic";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const [product, products] = await Promise.all([
    getProductBySlug(slug),
    getProducts(),
  ]);

  if (!product) {
    notFound();
  }

  const descriptionLines = product.description.split(/\r?\n/);

  return (
    <main>
      <section className="section">
        <div className="container">
          <p className="muted">
            <Link href="/productos">Productos</Link> /{" "}
            {product.name}
          </p>

          <div className="product-page">
            <Image
              className="product-main-image"
              src={product.image}
              alt={product.name}
              width={1000}
              height={800}
            />

            <div>
              <span className="badge">
                {product.category}
              </span>

              <h1>{product.name}</h1>

              <p className="muted">
                {product.brand}
              </p>

              <div className="score">
                {product.score}
              </div>

              <div className="product-description">
                {descriptionLines.map((line, index) =>
                  line.trim() ? (
                    <p key={index}>
                      {line}
                    </p>
                  ) : (
                    <div
                      key={index}
                      className="description-space"
                    />
                  ),
                )}
              </div>

              <h3>{product.price}</h3>

              <a
                className="btn btn-primary"
                href={product.affiliateUrl}
                target="_blank"
                rel="sponsored nofollow noopener"
              >
                Ver en Amazon
              </a>

              <p
                className="muted"
                style={{ fontSize: 13 }}
              >
                Podemos recibir una comisión sin costo
                adicional para ti.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container grid grid-3">
          <div className="procon">
            <h2>Ventajas</h2>

            <ul>
              {product.pros.map((item) => (
                <li key={item}>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="procon">
            <h2>Desventajas</h2>

            <ul>
              {product.cons.map((item) => (
                <li key={item}>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="procon">
            <h2>Ideal para</h2>

            <p>{product.bestFor}</p>
            <p>{product.verdict}</p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2>Especificaciones</h2>

          <table className="specs">
            <tbody>
              {Object.entries(product.specs).map(
                ([key, value]) => (
                  <tr key={key}>
                    <td className="muted">
                      {key}
                    </td>

                    <td>{value}</td>
                  </tr>
                ),
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2>Productos relacionados</h2>

          <div className="grid grid-3">
            {products
              .filter(
                (item) =>
                  item.slug !== product.slug,
              )
              .slice(0, 3)
              .map((item) => (
                <ProductCard
                  key={item.slug}
                  product={item}
                />
              ))}
          </div>
        </div>
      </section>
    </main>
  );
}