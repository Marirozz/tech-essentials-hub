import { notFound } from "next/navigation";
import { ProductCard } from "@/components/ProductCard";
import { getProducts } from "@/lib/products";
import { getGuides } from "@/lib/guides";

export const dynamic = "force-dynamic";

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function categoryNameFromSlug(slug: string) {
  const categories: Record<string, string> = {
    "home-office": "Home Office",
    "home-essentials": "Home Essentials",
    "smart-home": "Smart Home",
    audio: "Audio",
    setups: "Setups",
  };

  return categories[slug];
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const categoryName = categoryNameFromSlug(slug);

  if (!categoryName) {
    notFound();
  }

  const [products, guides] = await Promise.all([
    getProducts(),
    getGuides(),
  ]);

  const categoryProducts = products.filter(
    (product) => slugify(product.category) === slug,
  );

  const categoryGuides = guides.filter(
    (guide) => slugify(guide.category) === slug,
  );

  return (
    <main>
      <section className="section">
        <div className="container">
          <span className="eyebrow">Categoría</span>

          <h1>{categoryName}</h1>

          <p className="subtitle">
            Productos y guías seleccionados para esta categoría.
          </p>

          {categoryProducts.length > 0 ? (
            <div className="grid grid-3">
              {categoryProducts.map((product) => (
                <ProductCard
                  key={product.slug}
                  product={product}
                />
              ))}
            </div>
          ) : (
            <p className="empty-state">
              Todavía no hay productos publicados en esta categoría.
            </p>
          )}

          {categoryGuides.length > 0 && (
            <section style={{ marginTop: 64 }}>
              <h2>Guías de {categoryName}</h2>

              <div className="grid grid-3">
                {categoryGuides.map((guide) => (
                  <article className="card" key={guide.slug}>
                    <div className="card-body">
                      <span className="badge">
                        {guide.category}
                      </span>

                      <h3>{guide.title}</h3>

                      <p className="muted">
                        {guide.excerpt}
                      </p>

                      <a
                        className="btn btn-secondary"
                        href={`/guias/${guide.slug}`}
                      >
                        Ver guía
                      </a>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}
        </div>
      </section>
    </main>
  );
}