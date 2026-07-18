import Link from "next/link";
import { requireAdmin } from "@/lib/admin-auth";
import { getAdminProducts } from "@/lib/products";
import { logoutAction, deleteProductAction } from "./actions";

export const dynamic = "force-dynamic";

export default async function Admin() {
  await requireAdmin();
  const products = await getAdminProducts();
  return (
    <main className="admin-shell">
      <aside className="admin-nav">
        <h2>Admin</h2>
        <Link href="/admin">Productos</Link>
        <Link href="/admin/guias">Guías</Link>
        <Link href="/">Ver sitio</Link>
        <form action={logoutAction}><button className="btn btn-secondary" type="submit">Cerrar sesión</button></form>
      </aside>
      <section className="admin-content">
        <div className="section-head">
          <div>
            <span className="eyebrow">Panel administrativo</span>
            <h1>Productos</h1>
            <p className="muted">Los productos forman la biblioteca central que luego reutilizan las guías.</p>
          </div>
          <Link className="btn btn-primary" href="/admin/productos/nuevo">Nuevo producto</Link>
        </div>
        <div className="admin-table-wrap">
          <table className="table">
            <thead><tr><th>Producto</th><th>Categoría</th><th>Estado</th><th>Acciones</th></tr></thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id ?? product.slug}>
                  <td><strong>{product.name}</strong><small className="muted" style={{ display: "block" }}>{product.brand}</small></td>
                  <td>{product.category}</td>
                  <td>{product.status}</td>
                  <td>
                    <div className="admin-actions">
                      {product.id && <Link href={`/admin/productos/${product.id}`}>Editar</Link>}
                      {product.id && <form action={deleteProductAction.bind(null, product.id)}><button type="submit" className="admin-link-danger">Eliminar</button></form>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
