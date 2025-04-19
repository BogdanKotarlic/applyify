"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, User, Bot } from "lucide-react";
import { auth } from "@/lib/firebase";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import { ModeToggle } from "../ui/mode-toggle";
import { useTheme } from "next-themes";

const links = [
  { href: "/matcher", label: "Matcher", icon: Bot },
  { href: "/account", label: "Account", icon: User },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<{
    name: string;
    email: string;
    photoURL?: string;
  } | null>(null);

  const { resolvedTheme } = useTheme();
  const logoSrc = resolvedTheme === "dark" ? "/logo-white.png" : "/logo.png";

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) {
        setUser({
          name: firebaseUser.displayName || "",
          email: firebaseUser.email || "",
          photoURL: firebaseUser.photoURL || undefined,
        });
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await auth.signOut();
    router.push("/login");
  };

  return (
    <aside className="h-full px-4 py-6 flex flex-col justify-between">
      <div className="space-y-6">
        <div className="px-3 flex items-center justify-between w-full">
          <div
            className={cn(
              "w-max-content h-[2.2rem] flex items-center justify-center rounded-md text-xl font-bold px-3",
              resolvedTheme === "dark"
                ? "bg-white text-black"
                : "bg-black text-white"
            )}
          >
            APPLYIFY
          </div>
          <div className="ml-auto">
            <ModeToggle />
          </div>
        </div>

        <div className="flex items-center gap-3 px-3">
          {user ? (
            <>
              <Avatar>
                {user.photoURL ? (
                  <AvatarImage src={user.photoURL} alt={user.name} />
                ) : (
                  <AvatarFallback>
                    {user.name
                      ? user.name
                          .split(" ")
                          .map((part) => part[0])
                          .join("")
                          .toUpperCase()
                      : "U"}
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="text-sm">
                <p className="font-medium leading-tight">
                  {user.name || "Unnamed User"}
                </p>
                <p className="text-muted-foreground text-xs truncate">
                  {user.email}
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="h-10 w-10 rounded-full bg-muted animate-pulse" />
              <div className="flex flex-col gap-1">
                <div className="h-4 w-24 bg-muted rounded animate-pulse" />
                <div className="h-3 w-16 bg-muted rounded animate-pulse" />
              </div>
            </>
          )}
        </div>

        <nav className="space-y-2">
          {links.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                pathname === href
                  ? "bg-muted text-primary"
                  : "text-muted-foreground hover:bg-muted"
              )}
            >
              <Icon size={18} />
              {label}
            </Link>
          ))}
        </nav>
      </div>

      <Button
        onClick={handleLogout}
        variant="ghost"
        className="w-full mt-6 flex items-center justify-start gap-2 text-sm text-muted-foreground hover:text-destructive cursor-pointer"
      >
        <LogOut size={18} />
        Logout
      </Button>
    </aside>
  );
}
