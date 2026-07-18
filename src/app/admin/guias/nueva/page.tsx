import Link from "next/link";
import { AdminGuideForm } from "@/components/AdminGuideForm";
import { requireAdmin } from "@/lib/admin-auth";
import { getAdminProducts } from "@/lib/products";
import { createGuideAction } from "../../actions";

export default async function NewGuide() {
  await requireAdmin();
  const products = await getAdminProducts();
  return (
    <main className="section">
      <div className="container">
        <p><Link href="/admin/guias">← Volver a guías</Link></p>
        <span className="eyebrow">Administración</span>
        <h1>Nueva guía</h1>
        <p className="muted">Escribe el contenido y selecciona los productos que aparecerán en ella.</p>
        <AdminGuideForm products={products} action={createGuideAction} submitLabel="Guardar guía" />
      </div>
    </main>
  );
}
