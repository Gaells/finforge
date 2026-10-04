"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { LogIn, Mail, Lock, User, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginAction, signupAction } from "@/app/(auth)/actions";

interface AuthFormProps {
  mode: "login" | "signup";
}

export function AuthForm({ mode }: AuthFormProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const isLogin = mode === "login";
  const action = isLogin ? loginAction : signupAction;

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await action(formData);
      if (result?.error) {
        setError(result.error);
      }
    });
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-md"
    >
      <div className="relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-emerald-500/20 to-accent/20 rounded-3xl blur-xl opacity-60" />
        <div className="relative rounded-2xl border-2 border-[hsl(var(--border)/0.6)] bg-card p-8 shadow-2xl">
          <div className="flex flex-col items-center mb-6">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-emerald-500 shadow-lg shadow-primary/30 mb-4"
            >
              <LogIn className="w-7 h-7 text-white" />
            </motion.div>
            <h1 className="text-2xl font-bold tracking-tight">
              {isLogin ? "Entrar" : "Criar conta"}
            </h1>
            <p className="text-sm text-muted-foreground mt-1 text-center">
              {isLogin
                ? "Acesse sua carteira FinForge"
                : "Comece a gerenciar sua carteira"}
            </p>
          </div>

          <form action={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="displayName">Nome</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="displayName"
                    name="displayName"
                    type="text"
                    placeholder="Como podemos te chamar?"
                    className="pl-9"
                    autoComplete="name"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="seu@email.com"
                  className="pl-9"
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  minLength={6}
                  placeholder="Mínimo 6 caracteres"
                  className="pl-9"
                  autoComplete={isLogin ? "current-password" : "new-password"}
                />
              </div>
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-destructive font-medium"
              >
                {error}
              </motion.p>
            )}

            <Button
              type="submit"
              disabled={isPending}
              className="w-full bg-gradient-to-r from-primary to-emerald-500 hover:from-primary/90 hover:to-emerald-500/90 text-white shadow-lg shadow-primary/30"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {isLogin ? "Entrando..." : "Criando conta..."}
                </>
              ) : isLogin ? (
                "Entrar"
              ) : (
                "Criar conta"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            {isLogin ? (
              <>
                Não tem conta?{" "}
                <Link
                  href="/signup"
                  className="font-medium text-primary hover:underline"
                >
                  Criar agora
                </Link>
              </>
            ) : (
              <>
                Já tem conta?{" "}
                <Link
                  href="/login"
                  className="font-medium text-primary hover:underline"
                >
                  Entrar
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}