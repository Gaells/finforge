"use client";

import Link from "next/link";
import { useTransition } from "react";
import { LogOut, User as UserIcon, Wallet, LayoutDashboard, Settings } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { logoutAction } from "@/app/(auth)/actions";

export function UserMenu() {
  const { user, loading } = useAuth();
  const [isPending, startTransition] = useTransition();

  function handleLogout() {
    startTransition(async () => {
      await logoutAction();
    });
  }

  if (loading) {
    return <div className="w-9 h-9 rounded-full bg-muted animate-pulse" />;
  }

  if (!user) {
    return (
      <Button
        asChild
        size="sm"
        className="bg-gradient-to-r from-primary to-emerald-500 text-white shadow-md shadow-primary/30"
      >
        <Link href="/login">Entrar</Link>
      </Button>
    );
  }

  const initials = (user.user_metadata.display_name as string | undefined)
    ?.split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase() ?? user.email?.[0]?.toUpperCase() ?? "?";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-br from-primary to-emerald-500 text-white font-semibold text-sm shadow-md shadow-primary/30 hover:scale-105 active:scale-95 transition-transform"
        >
          {initials}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {(user.user_metadata.display_name as string | undefined) ??
                "Usuário"}
            </p>
            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/portfolio" className="cursor-pointer">
            <Wallet className="mr-2 h-4 w-4" />
            Carteira
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/" className="cursor-pointer">
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Dashboard
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/profile" className="cursor-pointer">
            <UserIcon className="mr-2 h-4 w-4" />
            Perfil
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/portfolio/settings" className="cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            Backup
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleLogout}
          disabled={isPending}
          className="text-destructive focus:text-destructive cursor-pointer"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sair
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}