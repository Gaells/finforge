import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "./types";

export async function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Sem env vars (ex: build sem .env) → retorna proxy que retorna erro
  // de forma controlada em vez de crashar o módulo inteiro.
  if (!url || !anonKey) {
    return {
      auth: {
        async getUser() {
          return { data: { user: null }, error: { message: "Supabase env vars ausentes" } };
        },
        async signInWithPassword() {
          return { data: { user: null, session: null }, error: { message: "Supabase env vars ausentes" } };
        },
        async signUp() {
          return { data: { user: null, session: null }, error: { message: "Supabase env vars ausentes" } };
        },
        async signOut() {
          return { error: null };
        },
      },
      from() {
        const makeThenable = () => {
          const t: Record<string | symbol, unknown> = {};
          t.then = (resolve: (v: unknown) => void) =>
            resolve({ data: null, error: { message: "Supabase env vars ausentes" } });
          return new Proxy(t, {
            get(target, prop) {
              if (prop === "then") return target.then;
              return () => makeThenable();
            },
          });
        };
        return makeThenable();
      },
    } as unknown as Awaited<ReturnType<typeof createServerClient<Database>>>;
  }

  const cookieStore = await cookies();

  return createServerClient<Database>(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // Server Component não pode setar cookies — tratado pelo middleware.
        }
      },
    },
  });
}