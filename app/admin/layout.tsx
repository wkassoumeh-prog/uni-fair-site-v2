"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const [allowed, setAllowed] = useState(false);
  const [loading, setLoading] = useState(true);

  const isLoginRoute = pathname === "/admin/login";

  useEffect(() => {
    let cancelled = false;

    async function check() {
      setLoading(true);

      const { data: userData } = await supabase.auth.getUser();
      const user = userData.user;

      // Not logged in -> go to admin login (but allow the login page itself)
      if (!user) {
        if (!isLoginRoute) router.replace("/admin/login");
        if (!cancelled) {
          setAllowed(false);
          setLoading(false);
        }
        return;
      }

      // Logged in: check role in profiles
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .maybeSingle();

      if (profile?.role !== "admin") {
        router.replace("/en");
        if (!cancelled) {
          setAllowed(false);
          setLoading(false);
        }
        return;
      }

      if (!cancelled) {
        setAllowed(true);
        setLoading(false);
      }
    }

    check();
    return () => {
      cancelled = true;
    };
  }, [router, isLoginRoute]);

  // Login page should render without admin nav
  if (isLoginRoute) return <>{children}</>;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-sm opacity-70">Loading admin…</p>
      </div>
    );
  }

  if (!allowed) return null;

  return (
    <div className="min-h-screen">
      <header className="border-b">
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link 
              href="/admin" 
              className={`font-semibold text-3xl text-black transition-colors ${
                pathname === "/admin" ? "opacity-100" : "opacity-80 hover:opacity-100"
              }`}
            >
              Admin
            </Link>
            <Link 
              href="/admin/registrations" 
              className={`text-lg transition-colors hover:opacity-100 ${
                pathname.startsWith("/admin/registrations") ? "opacity-100 font-medium text-black" : "opacity-80"
              }`}
            >
              Registrations
            </Link>
            <Link 
              href="/admin/messages" 
              className={`text-lg transition-colors hover:opacity-100 ${
                pathname.startsWith("/admin/messages") ? "opacity-100 font-medium text-black" : "opacity-80"
              }`}
            >
              Contact messages
            </Link>
            <Link 
              href="/admin/cms" 
              className={`text-lg transition-colors hover:opacity-100 ${
                pathname.startsWith("/admin/cms") ? "opacity-100 font-medium text-black" : "opacity-80"
              }`}
            >
              CMS
            </Link>
          </div>

          <button
            className="text-lg underline opacity-80 hover:opacity-100"
            onClick={async () => {
              await supabase.auth.signOut();
              router.replace("/admin/login");
            }}
          >
            Sign out
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-6">{children}</main>
    </div>
  );
}
