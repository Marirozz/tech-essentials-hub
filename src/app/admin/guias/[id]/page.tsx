import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminGuideForm } from "@/components/AdminGuideForm";
import { requireAdmin } from "@/lib/admin-auth";
import { getAdminGuide } from "@/lib/guides";
import { getAdminProducts } from "@/lib/products";
import { updateGuideAction } from "../../actions";

export default async function EditGuide({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const [guide, products] = await Promise.all([getAdminGuide(id), getAdminProducts()]);
  if (!guide) notFound();
  return (
    <main className="section">
      <div className="container">
        <p><Link href="/admin/guias">← Volver a guías</Link></p>
        <span className="eyebrow">Administración</span>
        <h1>Editar {guide.title}</h1>
        <AdminGuideForm guide={guide} products={products} action={updateGuideAction.bind(null, id)} submitLabel="Guardar cambios" />
      </div>
    </main>
  );
}
