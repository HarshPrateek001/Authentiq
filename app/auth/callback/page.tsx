"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleAuth = async () => {
      // Supabase URL me session pick karta hai
      const { data, error } = await supabase.auth.getSession();

      if (error || !data.session) {
        console.error(error);
        router.replace("/login?error=auth_failed");
        return;
      }

      // Access token automatically refresh hota rahega
      router.replace("/dashboard");
    };

    handleAuth();
  }, [router]);

  return <p className="p-6 text-center">Signing you in…</p>;
}