import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "./types";

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    // Stub para evitar crash em build/prerrocess sem env vars.
    // Métodos retornam respostas vazias; auth sempre "sem usuário".
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
        onAuthStateChange() {
          return { data: { subscription: { unsubscribe() {} } } };
        },
      },
      from() {
        // Cada chamada encadeada retorna um objeto thenable.
        // Final do chain (await) resolve com { data: null, error }.
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
    } as unknown as ReturnType<typeof createBrowserClient<Database>>;
  }

  return createBrowserClient<Database>(url, anonKey);
}