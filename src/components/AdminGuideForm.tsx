"use client";

import { useState } from "react";
import type { Guide } from "@/lib/guides";
import type { AdminProduct } from "@/lib/products";
import { ImageUploader } from "@/components/admin/ImageUploader";

function faqToText(guide?: Guide | null) {
  return (
    guide?.faq
      .map((item) => `${item.question} | ${item.answer}`)
      .join("\n") ?? ""
  );
}

export function AdminGuideForm({
  guide,
  products,
  action,
  submitLabel,
}: {
  guide?: Guide | null;
  products: AdminProduct[];
  action: (formData: FormData) => void | Promise<void>;
  submitLabel: string;
}) {
  const [imageUrl, setImageUrl] = useState(guide?.image ?? "");

  const selected = new Map(
    guide?.products.map((item) => [
      item.product.id,
      item,
    ]) ?? [],
  );

  return (
    <form action={action} className="admin-form">
      <div className="admin-form-grid">
        <label>
          Título
          <input
            name="title"
            required
            defaultValue={guide?.title}
          />
        </label>

        <label>
          Slug
          <input
            name="slug"
            defaultValue={guide?.slug}
            placeholder="Se genera automáticamente"
          />
        </label>

        <label>
          Categoría
          <input
            name="category"
            required
            defaultValue={guide?.category}
          />
        </label>

        <label>
          Tiempo de lectura
          <input
            name="minutes"
            type="number"
            min="1"
            required
            defaultValue={guide?.minutes ?? 8}
          />
        </label>

        <div className="admin-full">
          <ImageUploader
            value={imageUrl}
            onChange={setImageUrl}
            folder="guides"
            label="Imagen principal de la guía"
          />

          <input
            type="hidden"
            name="image"
            value={imageUrl}
          />

          {!imageUrl && (
            <p
              className="muted"
              style={{ marginTop: 8 }}
            >
              Debes subir una imagen antes de guardar la
              guía.
            </p>
          )}
        </div>

        <label className="admin-full">
          Resumen
          <textarea
            name="excerpt"
            rows={3}
            required
            defaultValue={guide?.excerpt}
          />
        </label>

        <label className="admin-full">
          Introducción
          <textarea
            name="introduction"
            rows={6}
            required
            defaultValue={guide?.introduction}
          />
        </label>

        <label className="admin-full">
          Criterios de selección
          <textarea
            name="selectionCriteria"
            rows={6}
            required
            defaultValue={guide?.selectionCriteria}
          />
        </label>

        <label className="admin-full">
          Cómo elegir
          <textarea
            name="howToChoose"
            rows={7}
            required
            defaultValue={guide?.howToChoose}
          />
        </label>

        <label className="admin-full">
          Preguntas frecuentes
          <span className="muted">
            Pregunta | Respuesta, una por línea
          </span>

          <textarea
            name="faq"
            rows={8}
            defaultValue={faqToText(guide)}
            placeholder="¿Qué tamaño necesito? | Depende del espacio y del uso..."
          />
        </label>

        <label className="admin-full">
          Conclusión
          <textarea
            name="conclusion"
            rows={5}
            required
            defaultValue={guide?.conclusion}
          />
        </label>

        <label className="admin-full">
          Aviso de afiliados
          <textarea
            name="affiliateNotice"
            rows={3}
            defaultValue={guide?.affiliateNotice}
          />
        </label>

        <label>
          Título SEO
          <input
            name="metaTitle"
            defaultValue={guide?.metaTitle}
          />
        </label>

        <label>
          Meta descripción
          <input
            name="metaDescription"
            defaultValue={guide?.metaDescription}
          />
        </label>

        <label>
          Estado
          <select
            name="status"
            defaultValue={guide?.status ?? "draft"}
          >
            <option value="draft">Borrador</option>
            <option value="published">
              Publicado
            </option>
            <option value="archived">
              Archivado
            </option>
          </select>
        </label>

        <label className="admin-checkbox">
          <input
            name="featured"
            type="checkbox"
            defaultChecked={guide?.featured}
          />
          Guía destacada
        </label>
      </div>

      <section className="admin-product-picker">
        <div>
          <h2>Productos de la guía</h2>

          <p className="muted">
            Selecciona productos existentes. La guía
            reutilizará su imagen, precio, puntuación,
            ventajas, desventajas y enlace.
          </p>
        </div>

        {products.length === 0 ? (
          <p className="empty-state">
            Primero agrega al menos un producto.
          </p>
        ) : (
          <div className="admin-product-options">
            {products.map((product, index) => {
              const relation = product.id
                ? selected.get(product.id)
                : undefined;

              return (
                <div
                  className="admin-product-option"
                  key={product.id ?? product.slug}
                >
                  <label className="admin-product-check">
                    <input
                      name="productIds"
                      type="checkbox"
                      value={product.id}
                      defaultChecked={Boolean(relation)}
                      disabled={!product.id}
                    />

                    <span>
                      <strong>{product.name}</strong>

                      <small>
                        {product.brand} ·{" "}
                        {product.category}
                      </small>
                    </span>
                  </label>

                  {product.id && (
                    <div className="admin-product-relation-fields">
                      <label>
                        Orden
                        <input
                          name={`position_${product.id}`}
                          type="number"
                          min="1"
                          defaultValue={
                            relation?.position ?? index + 1
                          }
                        />
                      </label>

                      <label>
                        Distinción
                        <input
                          name={`badge_${product.id}`}
                          defaultValue={
                            relation?.badge ?? ""
                          }
                          placeholder="Mejor calidad-precio"
                        />
                      </label>

                      <label className="admin-full">
                        Nota para esta guía
                        <textarea
                          name={`note_${product.id}`}
                          rows={2}
                          defaultValue={
                            relation?.note ?? ""
                          }
                          placeholder="Explica por qué lo recomendamos en esta guía."
                        />
                      </label>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      <button
        className="btn btn-primary"
        type="submit"
        disabled={!imageUrl}
      >
        {submitLabel}
      </button>
    </form>
  );
}