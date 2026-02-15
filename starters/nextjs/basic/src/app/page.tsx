'use client'

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { Github, KeyRound, Mail, Shield } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { AppLogo } from "@/components/layout/AppLogo"
import type { UserRole } from "@/lib/types"
import { useAuth, useUser } from "@/firebase"
import { initiateEmailSignIn } from "@/firebase/non-blocking-login"
import { useToast } from "@/hooks/use-toast"

export default function LoginPage() {
  const router = useRouter();
  const auth = useAuth();
  const { toast } = useToast();
  const { user, isUserLoading } = useUser();
  const [role, setRole] = useState<UserRole>('applicant');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (!isUserLoading && user) {
      if (role === 'applicant') {
        router.push('/dashboard');
      } else {
        router.push('/officer/dashboard');
      }
    }
  }, [user, isUserLoading, role, router]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
        toast({
            title: "Login Failed",
            description: "Please enter your email and password.",
            variant: "destructive"
        })
        return;
    }
    initiateEmailSignIn(auth, email, password);
  }

  useEffect(() => {
    if (role === 'applicant') {
        setEmail('user@example.com');
        setPassword('password123');
    } else {
        setEmail('officer@gov.my');
        setPassword('password123');
    }
  }, [role]);

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md border-primary/20 shadow-lg shadow-primary/5">
        <CardHeader className="text-center space-y-2">
            <div className="flex justify-center">
                <AppLogo />
            </div>
          <CardTitle className="font-headline text-2xl">Welcome Back</CardTitle>
          <CardDescription>Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="email" type="email" placeholder="user@example.com" required className="pl-10" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
            </div>
            <div className="space-y-2">
                <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <Link href="#" className="ml-auto inline-block text-xs text-accent hover:underline">
                    Forgot your password?
                </Link>
                </div>
                <div className="relative">
                    <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="password" type="password" required className="pl-10" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <div className="relative">
                <Shield className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Select value={role} onValueChange={(value) => setRole(value as UserRole)}>
                    <SelectTrigger className="pl-10">
                        <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="applicant">Applicant / Driver</SelectItem>
                        <SelectItem value="officer">Officer / Admin</SelectItem>
                    </SelectContent>
                </Select>
              </div>
            </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold">Sign In</Button>
            <Button variant="outline" className="w-full">
                <svg role="img" viewBox="0 0 24 24" className="mr-2 h-4 w-4"><path fill="currentColor" d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.02 1.08-2.58 2.15-4.8 2.15-3.6 0-6.52-3-6.52-6.6 0-3.6 2.92-6.6 6.52-6.6 1.98 0 3.22.77 4.05 1.56l2.6-2.58C18.07 3.32 15.75 2 12.48 2c-5.6 0-10.2 4.4-10.2 10.2s4.6 10.2 10.2 10.2c5.9 0 9.82-3.92 9.82-9.92 0-.7-.07-1.32-.18-1.92h-9.64z"></path></svg>
                Sign in with Google
            </Button>
            </CardFooter>
        </form>
        <div className="mt-4 text-center text-sm pb-6">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="underline text-accent">
            Sign up
          </Link>
        </div>
      </Card>
    </div>
  )
}
