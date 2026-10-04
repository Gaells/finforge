import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "./types";

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Sem env vars (ex: build/prerrocess) → passa reto sem auth.
  // Páginas públicas continuam funcionando; protegidas vão redirecionar via layouts.
  if (!url || !anonKey) {
    return response;
  }

  const supabase = createServerClient<Database>(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        );
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });

  // CRÍTICO: refresh da sessão do usuário — não remover.
  // Envelopado em try para não quebrar build se houver erro de rede.
  try {
    await supabase.auth.getUser();
  } catch {
    // ignora — sem sessão válida é OK
  }

  return response;
}