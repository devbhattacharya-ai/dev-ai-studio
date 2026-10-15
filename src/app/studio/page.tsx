import type { Metadata } from "next";
import { studioConfigured, studioUnlocked } from "@/lib/studio-gate";
import { buildStudioBoard } from "@/lib/studio-data";
import { LoginForm } from "./login-form";
import { StudioDashboard } from "./dashboard";
import "./board.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Studio",
  robots: { index: false, follow: false },
};

export default async function StudioPage() {
  if (!studioConfigured()) {
    return (
      <main className="bd">
        <section className="bd-gate">
          <p className="bd-kicker">DevAI Studio</p>
          <h1>Studio is locked</h1>
          <p className="bd-muted">Access is not configured on the server yet.</p>
        </section>
      </main>
    );
  }

  if (!(await studioUnlocked())) return <LoginForm />;

  return <StudioDashboard board={buildStudioBoard()} />;
}
