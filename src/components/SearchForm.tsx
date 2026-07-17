"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type SearchFormProps = {
  className?: string;
  placeholder?: string;
  initialValue?: string;
};

export function SearchForm({
  className = "",
  placeholder = "Buscar productos, guías o categorías...",
  initialValue = "",
}: SearchFormProps) {
  const router = useRouter();
  const [query, setQuery] = useState(initialValue);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = query.trim();
    router.push(value ? `/productos?buscar=${encodeURIComponent(value)}` : "/productos");
  }

  return (
    <form className={`search-form ${className}`.trim()} onSubmit={handleSubmit} role="search">
      <input
        className="search"
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder={placeholder}
        aria-label="Buscar en Tech Essentials Hub"
      />
      <button className="search-button" type="submit" aria-label="Buscar">
        Buscar
      </button>
    </form>
  );
}
