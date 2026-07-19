"use client";

import { ChangeEvent, useState } from "react";

type ImageUploaderProps = {
  value: string;
  onChange: (url: string) => void;
  folder: "products" | "guides";
  label?: string;
};

export function ImageUploader({
  value,
  onChange,
  folder,
  label = "Imagen",
}: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFileChange(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setError("");
    setIsUploading(true);

    try {
      const formData = new FormData();

      formData.append("file", file);
      formData.append("folder", folder);

      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const result = (await response.json()) as {
        url?: string;
        error?: string;
      };

      if (!response.ok || !result.url) {
        throw new Error(
          result.error ?? "No se pudo subir la imagen.",
        );
      }

      onChange(result.url);
    } catch (uploadError) {
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : "No se pudo subir la imagen.",
      );
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  }

  return (
    <div className="form-field">
      <label>{label}</label>

      <input
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileChange}
        disabled={isUploading}
      />

      {isUploading && (
        <p className="muted">Subiendo imagen...</p>
      )}

      {error && (
        <p style={{ color: "#dc2626" }}>{error}</p>
      )}

      {value && (
        <div style={{ marginTop: 16 }}>
          <img
            src={value}
            alt="Vista previa"
            style={{
              display: "block",
              width: "100%",
              maxWidth: 420,
              aspectRatio: "4 / 3",
              objectFit: "cover",
              borderRadius: 16,
            }}
          />

          <button
            type="button"
            className="button button-secondary"
            style={{ marginTop: 12 }}
            onClick={() => onChange("")}
          >
            Quitar imagen
          </button>
        </div>
      )}
    </div>
  );
}