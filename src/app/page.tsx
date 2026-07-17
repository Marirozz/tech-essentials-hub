import Link from "next/link";
import { FeaturedProductsCarousel } from "@/components/FeaturedProductsCarousel";
import { GuideCard } from "@/components/GuideCard";
import { SearchForm } from "@/components/SearchForm";
import { guides } from "@/data/content";
import { getProducts } from "@/lib/products";

const categories = ["Home Office", "Home Essentials", "Smart Home", "Audio", "Setups"];

export default async function Home() {
  const products = await getProducts();
  return (
    <main>
      <section className="hero"><div className="container"><span className="eyebrow">Tech Essentials Hub</span><h1 className="title">Tecnología que mejora<br />tu trabajo y tu hogar.</h1><p className="subtitle">Guías claras, análisis honestos y productos seleccionados para trabajar mejor y simplificar las tareas del día a día.</p><SearchForm className="hero-search" /><div className="chips">{categories.map((category)=><Link key={category} className="chip" href={`/categorias/${category.toLowerCase().replaceAll(" ", "-")}`}>{category}</Link>)}</div></div></section>
      <section className="section"><div className="container"><div className="section-head"><div><span className="eyebrow">Selección destacada</span><h2>Productos para empezar</h2></div><Link className="view-all-products" href="/productos">Ver todos los productos →</Link></div><FeaturedProductsCarousel products={products} /></div></section>
      <section className="section"><div className="container"><div className="section-head"><div><span className="eyebrow">Guías recientes</span><h2>Compra con más contexto</h2></div><Link href="/guias">Ver todas →</Link></div><div className="grid grid-3">{guides.map((guide)=><GuideCard key={guide.slug} guide={guide} />)}</div></div></section>
      <section className="section"><div className="container card newsletter-card"><h2>Recomendaciones útiles, sin ruido</h2><p className="muted">Recibe nuevas guías y comparativas cuando publiquemos contenido.</p><form className="newsletter-form" action="#" method="post"><input className="search" type="email" placeholder="Tu correo electrónico" aria-label="Correo electrónico"/><button className="btn btn-primary" type="submit">Suscribirme</button></form></div></section>
    </main>
  );
}
