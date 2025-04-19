"use client";

import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import ProtectedLayout from "@/components/layout/ProtectedLayout";
import Spinner from "@/components/ui/spinner";

export default function AccountPage() {
  const [user, setUser] = useState<{
    name: string;
    email: string;
    photoURL?: string;
  } | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) {
        setUser({
          name: firebaseUser.displayName || "Unnamed",
          email: firebaseUser.email || "",
          photoURL: firebaseUser.photoURL || undefined,
        });
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <ProtectedLayout>
      {!user ? (
        <div className="flex flex-1 items-center justify-center">
          <Spinner />
        </div>
      ) : (
        <div className="p-6 max-w-2xl mx-auto space-y-6">
          <Card>
            <CardHeader className="flex flex-col items-center justify-center text-center space-y-2">
              <Avatar className="w-24 h-24">
                {user.photoURL ? (
                  <AvatarImage src={user.photoURL} alt={user.name} />
                ) : (
                  <AvatarFallback>
                    {user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </AvatarFallback>
                )}
              </Avatar>
              <div>
                <CardTitle>{user.name}</CardTitle>
                <p className="text-muted-foreground text-sm">{user.email}</p>
              </div>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>My Stats (coming soon)</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 text-muted-foreground">
              <p>
                Uploaded CVs: <span className="text-muted">0</span>
              </p>
              <p>
                Jobs added: <span className="text-muted">0</span>
              </p>
              <p>
                Plan: <span className="text-muted">Free</span>
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Uploaded CVs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-muted-foreground text-sm">
                <p className="mb-2">
                  Coming soon: View, download, and delete your uploaded resumes.
                </p>
                <div className="border rounded p-4 bg-muted italic">
                  No CVs uploaded yet.
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Jobs You Added</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-muted-foreground text-sm">
                <p className="mb-2">
                  This section will show your saved or compared job
                  descriptions.
                </p>
                <div className="border rounded p-4 bg-muted italic">
                  No jobs added yet.
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </ProtectedLayout>
  );
}
