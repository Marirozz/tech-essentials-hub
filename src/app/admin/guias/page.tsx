import Link from "next/link";
import { requireAdmin } from "@/lib/admin-auth";
import { getAdminGuides } from "@/lib/guides";
import { deleteGuideAction, logoutAction } from "../actions";

export const dynamic = "force-dynamic";

export default async function AdminGuides() {
  await requireAdmin();
  const guides = await getAdminGuides();
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
            <h1>Guías</h1>
            <p className="muted">Crea una guía y selecciona los productos que debe mostrar.</p>
          </div>
          <Link className="btn btn-primary" href="/admin/guias/nueva">Nueva guía</Link>
        </div>
        {guides.length > 0 ? (
          <div className="admin-table-wrap">
            <table className="table">
              <thead><tr><th>Guía</th><th>Categoría</th><th>Productos</th><th>Estado</th><th>Acciones</th></tr></thead>
              <tbody>
                {guides.map((guide) => (
                  <tr key={guide.id ?? guide.slug}>
                    <td><strong>{guide.title}</strong><small className="muted" style={{ display: "block" }}>{guide.minutes} min</small></td>
                    <td>{guide.category}</td>
                    <td>{guide.products.length}</td>
                    <td>{guide.status}</td>
                    <td>
                      <div className="admin-actions">
                        {guide.id && <Link href={`/admin/guias/${guide.id}`}>Editar</Link>}
                        {guide.id && <form action={deleteGuideAction.bind(null, guide.id)}><button type="submit" className="admin-link-danger">Eliminar</button></form>}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state"><h2>Aún no hay guías</h2><p className="muted">Crea la primera y selecciona productos existentes.</p></div>
        )}
      </section>
    </main>
  );
}
