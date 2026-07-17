import Link from "next/link";
import { AdminProductForm } from "@/components/AdminProductForm";
import { requireAdmin } from "@/lib/admin-auth";
import { createProductAction } from "../../actions";
export default async function NewProduct(){await requireAdmin();return <main className="section"><div className="container"><p><Link href="/admin">← Volver al panel</Link></p><span className="eyebrow">Administración</span><h1>Nuevo producto</h1><AdminProductForm action={createProductAction} submitLabel="Guardar producto"/></div></main>}
