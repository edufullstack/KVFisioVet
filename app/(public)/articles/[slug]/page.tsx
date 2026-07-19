import Link from "next/link";
import { notFound } from "next/navigation";
import { articleBySlug, articles } from "@/lib/articles";

export function generateStaticParams() {
  return articles.map(({ slug }) => ({ slug }));
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const article = articleBySlug((await params).slug);
  if (!article) notFound();
  return <main className="public-page article-page"><Link className="back-link" href="/articles">← Todos los artículos</Link><p className="eyebrow">Educación</p><h1>{article.title}</h1><p className="page-intro">{article.summary}</p>{article.sections.map((section) => <section key={section.title}><h2>{section.title}</h2>{section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</section>)}<aside className="source-note"><strong>Fuente consultada</strong><a href={article.sourceUrl} target="_blank" rel="noreferrer">{article.source} ↗</a><small>Contenido educativo; consulta a tu médico veterinario para diagnóstico y tratamiento.</small></aside></main>;
}
