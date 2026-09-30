import type { Metadata } from "next";
import { ProjectNotesPage } from "@/components/ProjectNotesPage";

export const metadata: Metadata = {
  title: "Privacy & project notes | DEV / AI STUDIO",
};

export default function Page() {
  return <ProjectNotesPage />;
}
