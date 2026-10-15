import { studioUnlocked } from "@/lib/studio-gate";
import { realtimeUsers } from "@/lib/studio-live";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await studioUnlocked())) return Response.json({ active: 0 }, { status: 401 });
  try {
    return Response.json({ active: await realtimeUsers() });
  } catch {
    return Response.json({ active: 0 });
  }
}
