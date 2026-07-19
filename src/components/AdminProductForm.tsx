"use client";

import { useState } from "react";
import type { AdminProduct } from "@/lib/products";
import { ImageUploader } from "@/components/admin/ImageUploader";

type AdminProductFormProps = {
  product?: AdminProduct | null;
  action: (formData: FormData) => void | Promise<void>;
  submitLabel: string;
};

export function AdminProductForm({
  product,
  action,
  submitLabel,
}: AdminProductFormProps) {
  const [imageUrl, setImageUrl] = useState(product?.image ?? "");

  const specs = product
    ? Object.entries(product.specs)
        .map(([key, value]) => `${key}: ${value}`)
        .join("\n")
    : "";

  return (
    <form action={action} className="admin-form">
      <div className="admin-form-grid">
        <label>
          Nombre
          <input
            name="name"
            required
            defaultValue={product?.name}
          />
        </label>

        <label>
          Slug
          <input
            name="slug"
            defaultValue={product?.slug}
            placeholder="Se genera automáticamente"
          />
        </label>

        <label>
          Marca
          <input
            name="brand"
            required
            defaultValue={product?.brand}
          />
        </label>

        <label>
          Categoría
          <input
            name="category"
            required
            defaultValue={product?.category}
          />
        </label>

        <label>
          Precio
          <input
            name="price"
            required
            defaultValue={product?.price}
            placeholder="US$99"
          />
        </label>

        <label>
          Puntuación
          <input
            name="score"
            required
            type="number"
            min="0"
            max="10"
            step="0.1"
            defaultValue={product?.score ?? 8}
          />
        </label>

        <label className="admin-full">
          Ideal para
          <input
            name="bestFor"
            required
            defaultValue={product?.bestFor}
          />
        </label>

        <div className="admin-full">
          <ImageUploader
            value={imageUrl}
            onChange={setImageUrl}
            folder="products"
            label="Imagen principal del producto"
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
              Debes subir una imagen antes de guardar el producto.
            </p>
          )}
        </div>

        <label className="admin-full">
          Enlace de afiliado
          <input
            name="affiliateUrl"
            type="url"
            required
            defaultValue={product?.affiliateUrl}
            placeholder="https://www.amazon.com/..."
          />
        </label>

        <label className="admin-full">
          Descripción
          <textarea
            name="description"
            required
            rows={5}
            defaultValue={product?.description}
          />
        </label>

        <label>
          Ventajas
          <span className="muted">
            Una ventaja por línea
          </span>

          <textarea
            name="pros"
            rows={6}
            defaultValue={product?.pros.join("\n")}
          />
        </label>

        <label>
          Desventajas
          <span className="muted">
            Una desventaja por línea
          </span>

          <textarea
            name="cons"
            rows={6}
            defaultValue={product?.cons.join("\n")}
          />
        </label>

        <label className="admin-full">
          Especificaciones
          <span className="muted">
            Usa el formato Nombre: valor
          </span>

          <textarea
            name="specs"
            rows={7}
            defaultValue={specs}
            placeholder={
              "Batería: 70 días\nConectividad: Bluetooth"
            }
          />
        </label>

        <label className="admin-full">
          Veredicto
          <textarea
            name="verdict"
            rows={3}
            defaultValue={product?.verdict}
          />
        </label>

        <label>
          Estado
          <select
            name="status"
            defaultValue={product?.status ?? "draft"}
          >
            <option value="draft">
              Borrador
            </option>

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
            defaultChecked={product?.featured}
          />

          Producto destacado
        </label>
      </div>

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