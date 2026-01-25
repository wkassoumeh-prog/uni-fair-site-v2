"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    setLoading(false);

    if (error) {
      setErrorMsg("Invalid email or password.");
      return;
    }

    router.replace("/admin");
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-semibold">Admin login</h1>

        {errorMsg ? <p className="text-sm text-red-600">{errorMsg}</p> : null}

        <form onSubmit={onSubmit} className="space-y-3">
          <input
            className="w-full rounded-md border px-3 py-2"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className="w-full rounded-md border px-3 py-2"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            className="w-full rounded-md bg-black text-white py-2 disabled:opacity-60"
            disabled={loading}
            type="submit"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
