import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CaseStudyPage } from "@/components/CaseStudyPage";
import { CASE_SLUGS, getCase } from "@/lib/cases";

export function generateStaticParams() {
  return CASE_SLUGS.map((slug) => ({ slug }));
}

export function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  return params.then(({ slug }) => {
    const study = getCase(slug);
    if (!study) return { title: "Not Found" };
    return {
      title: `${study.homeTitle} | DEV / AI STUDIO`,
      description: study.en.deck,
    };
  });
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!getCase(slug)) notFound();
  return <CaseStudyPage slug={slug} />;
}
