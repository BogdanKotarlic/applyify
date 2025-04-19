"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { auth } from "@/lib/firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

export default function RegisterPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [error, setError] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirm) return setError("Passwords do not match.");
    if (password.length < 6)
      return setError("Password must be at least 6 characters.");
    if (!firstName || !lastName)
      return setError("First and last name are required.");

    try {
      const userCred = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const fullName = `${firstName} ${lastName}`;

      let photoURL;
      if (profileImage) {
        console.log(
          "🖼️ Upload image to Firebase Storage later:",
          profileImage.name
        );
        // TODO: Upload to Firebase Storage and get the URL
      }

      await updateProfile(userCred.user, {
        displayName: fullName,
        photoURL: photoURL || undefined,
      });

      router.push("/matcher");
    } catch (error: any) {
      setError(error.message || "Something went wrong.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="flex items-center justify-center flex-col gap-2">
          <Image src="/logo.png" alt="Applyify logo" width={160} height={160} />
          <CardTitle className="text-xl">Create your account</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="confirm">Confirm Password</Label>
              <Input
                id="confirm"
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="profileImage">Profile Picture (optional)</Label>
              <Input
                id="profileImage"
                type="file"
                accept="image/*"
                onChange={(e) => setProfileImage(e.target.files?.[0] || null)}
              />
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2">
                {error}
              </p>
            )}

            <Button type="submit" className="w-full">
              Sign Up
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
