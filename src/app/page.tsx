"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader className="flex items-center justify-center flex-col gap-2">
          <Image src="/logo.png" alt="Applyify Logo" width={250} height={250} />
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Your AI-powered resume matcher. Upload your resume and compare it to
            job descriptions in seconds.
          </p>

          <div className="flex justify-center gap-4">
            <Link href="/login">
              <Button>Login</Button>
            </Link>
            <Link href="/register">
              <Button variant="outline">Register</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
