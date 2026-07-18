import type { Metadata } from "next";
import { GuideCard } from "@/components/GuideCard";
import { getGuides } from "@/lib/guides";

export const metadata: Metadata = { title: "Guías" };
export const dynamic = "force-dynamic";

export default async function Guides() {
  const guides = await getGuides();
  return (
    <main className="section">
      <div className="container">
        <span className="eyebrow">Contenido</span>
        <h1>Guías y comparativas</h1>
        <p className="subtitle">Información práctica para elegir tecnología con confianza.</p>
        {guides.length > 0 ? (
          <div className="grid grid-3" style={{ marginTop: 36 }}>
            {guides.map((guide) => <GuideCard key={guide.slug} guide={guide} />)}
          </div>
        ) : (
          <div className="empty-state"><h2>Aún no hay guías publicadas</h2></div>
        )}
      </div>
    </main>
  );
}
