import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminProductForm } from "@/components/AdminProductForm";
import { requireAdmin } from "@/lib/admin-auth";
import { getAdminProduct } from "@/lib/products";
import { updateProductAction } from "../../actions";
export default async function EditProduct({params}:{params:Promise<{id:string}>}){await requireAdmin();const {id}=await params;const product=await getAdminProduct(id);if(!product)notFound();return <main className="section"><div className="container"><p><Link href="/admin">← Volver al panel</Link></p><span className="eyebrow">Administración</span><h1>Editar {product.name}</h1><AdminProductForm product={product} action={updateProductAction.bind(null,id)} submitLabel="Guardar cambios"/></div></main>}
