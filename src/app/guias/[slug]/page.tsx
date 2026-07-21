import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getGuideBySlug } from "@/lib/guides";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const guide = await getGuideBySlug(slug);

  if (!guide) {
    return {};
  }

  return {
    title: guide.metaTitle ?? guide.title,
    description: guide.metaDescription ?? guide.excerpt,
    openGraph: {
      title: guide.metaTitle ?? guide.title,
      description: guide.metaDescription ?? guide.excerpt,
      images: [guide.image],
    },
  };
}

function Paragraphs({ value }: { value?: string | null }) {
  if (!value?.trim()) {
    return null;
  }

  const paragraphs = value
    .trim()
    .split(/\r?\n\s*\r?\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return (
    <div className="guide-paragraphs">
      {paragraphs.map((paragraph, index) => {
        const lines = paragraph.split(/\r?\n/);

        return (
          <p key={index}>
            {lines.map((line, lineIndex) => (
              <span key={lineIndex}>
                {line}
                {lineIndex < lines.length - 1 && <br />}
              </span>
            ))}
          </p>
        );
      })}
    </div>
  );
}

export default async function GuidePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = await getGuideBySlug(slug);

  if (!guide) {
    notFound();
  }

  return (
    <main>
      <section className="section">
        <div className="container article">
          <span className="badge">{guide.category}</span>

          <h1>{guide.title}</h1>

          <p className="muted">
            Tiempo de lectura: {guide.minutes} minutos
          </p>

          <Image
            src={guide.image}
            alt={guide.title}
            width={1200}
            height={720}
            style={{
              borderRadius: 24,
              margin: "28px 0",
            }}
          />

          <Paragraphs
            value={guide.introduction || guide.excerpt}
          />

          <h2>Criterios de selección</h2>

          <Paragraphs value={guide.selectionCriteria} />
        </div>
      </section>

      {guide.products.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="section-head">
              <div>
                <span className="eyebrow">
                  Nuestra selección
                </span>

                <h2>Productos recomendados</h2>
              </div>
            </div>

            <div className="guide-product-list">
              {guide.products.map(
                ({ product, badge, note }, index) => (
                  <article
                    className="guide-product-detail card"
                    key={product.slug}
                  >
                    <Image
                      src={product.image}
                      alt={product.name}
                      width={700}
                      height={500}
                      className="guide-product-image"
                    />

                    <div className="guide-product-copy">
                      <div className="guide-product-heading">
                        <div>
                          <span className="badge">
                            {badge ||
                              `Recomendación ${index + 1}`}
                          </span>

                          <h2>{product.name}</h2>

                          <p className="muted">
                            {product.brand} ·{" "}
                            {product.bestFor}
                          </p>
                        </div>

                        <span className="score">
                          {product.score.toFixed(1)}
                        </span>
                      </div>

                      {note && (
                        <p className="guide-note">
                          {note}
                        </p>
                      )}

                      <Paragraphs
                        value={product.description}
                      />

                      <div className="grid guide-pros-cons">
                        <div className="procon">
                          <h3>Ventajas</h3>

                          <ul>
                            {product.pros.map((item) => (
                              <li key={item}>
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="procon">
                          <h3>Desventajas</h3>

                          <ul>
                            {product.cons.map((item) => (
                              <li key={item}>
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="guide-product-actions">
                        <Link
                          className="btn btn-secondary"
                          href={`/productos/${product.slug}`}
                        >
                          Ver análisis completo
                        </Link>

                        {product.affiliateUrl &&
                          product.affiliateUrl !== "#" && (
                            <a
                              className="btn btn-primary"
                              href={product.affiliateUrl}
                              target="_blank"
                              rel="nofollow sponsored noopener"
                            >
                              Consultar disponibilidad
                            </a>
                          )}
                      </div>
                    </div>
                  </article>
                ),
              )}
            </div>
          </div>
        </section>
      )}

      <section className="section">
        <div className="container article">
          <h2>Cómo elegir</h2>

          <Paragraphs value={guide.howToChoose} />

          {guide.faq.length > 0 && (
            <>
              <h2>Preguntas frecuentes</h2>

              <div className="faq-list">
                {guide.faq.map((item) => (
                  <details key={item.question}>
                    <summary>
                      {item.question}
                    </summary>

                    <p>{item.answer}</p>
                  </details>
                ))}
              </div>
            </>
          )}

          <h2>Conclusión</h2>

          <Paragraphs value={guide.conclusion} />

          <div className="affiliate-notice">
            <strong>Aviso de afiliados:</strong>{" "}
            {guide.affiliateNotice}
          </div>
        </div>
      </section>
    </main>
  );
}