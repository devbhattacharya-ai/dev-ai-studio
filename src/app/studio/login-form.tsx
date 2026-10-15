"use client";

import { useActionState } from "react";
import { unlockStudio } from "./actions";

export function LoginForm() {
  const [state, action, pending] = useActionState(unlockStudio, null);

  return (
    <main className="bd">
      <form className="bd-gate" action={action}>
        <p className="bd-kicker">DevAI Studio</p>
        <h1>Private dashboard</h1>
        <p className="bd-muted">Only this password opens the studio numbers. They are not on the public site.</p>
        <label htmlFor="studio-password">Password</label>
        <input
          id="studio-password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          minLength={8}
        />
        {state?.error ? <p className="bd-error">{state.error}</p> : null}
        <button className="bd-primary" type="submit" disabled={pending}>
          {pending ? "Checking…" : "Unlock"}
        </button>
      </form>
    </main>
  );
}
