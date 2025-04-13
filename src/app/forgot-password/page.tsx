"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/lib/firebase";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("");
    setError("");

    try {
      await sendPasswordResetEmail(auth, email);
      setStatus("✅ Password reset link sent! Check your inbox.");
    } catch (error) {
      console.error(error);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="flex items-center justify-center flex-col gap-2">
          <Image src="/logo.png" alt="Applyify logo" width={160} height={160} />
          <CardTitle className="text-xl">Reset Your Password</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleReset} className="space-y-6">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <p className="text-muted-foreground text-xs">
                Enter your email to receive a password reset link.
              </p>
            </div>

            {status && (
              <p className="text-green-600 text-sm bg-green-50 p-2 rounded">
                {status}
              </p>
            )}
            {error && (
              <p className="text-red-600 text-sm bg-red-50 p-2 rounded">
                {error}
              </p>
            )}

            <Button type="submit" className="w-full">
              Send Reset Link
            </Button>

            <div className="text-center mt-6">
              <Link
                href="/login"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                ← Back to login
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
