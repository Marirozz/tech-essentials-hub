import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";

export function Header() {
  return (
    <header className="header">
      <div className="container nav">
        <Link className="brand" href="/">
          TECH ESSENTIALS HUB
          <span>SMART TECH. BETTER LIVING.</span>
        </Link>
        <nav className="navlinks" aria-label="Navegación principal">
          <Link href="/productos">Productos</Link>
          <Link href="/guias">Guías</Link>
          <Link href="/categorias/home-office">Categorías</Link>
          <Link href="/sobre-nosotros">Nosotros</Link>
          <Link href="/contacto">Contacto</Link>
        </nav>
        <div className="nav-actions">
          <ThemeToggle />
          <Link className="btn btn-primary nav-explore" href="/productos">Explorar</Link>
        </div>
      </div>
    </header>
  );
}
