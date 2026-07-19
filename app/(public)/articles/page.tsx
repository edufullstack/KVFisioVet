import Link from "next/link";
import { articles } from "@/lib/articles";

export const metadata = { title: "Educación | KV FisioVet", description: "Información sobre movilidad, dolor y rehabilitación veterinaria." };

export default function ArticlesPage() {
  return <main className="public-page"><p className="eyebrow">Educación</p><h1>Recursos para cuidar su movilidad</h1><p className="page-intro">Información breve para reconocer cambios y llegar mejor preparado a una valoración.</p><div className="article-grid">{articles.map((article) => <article className="public-card" key={article.slug}><span>Lectura breve</span><h2>{article.title}</h2><p>{article.summary}</p><Link href={`/articles/${article.slug}`}>Leer artículo →</Link></article>)}</div></main>;
}
