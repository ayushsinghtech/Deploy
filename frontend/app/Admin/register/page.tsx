"use client"

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function AdminRegisterPage() {
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", password: "", phone: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/admin/register`, form);
      setSuccess("Registration successful! Redirecting to login...");
              setTimeout(() => router.push("/Admin/login"), 1500);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="flex flex-col items-center">
          <div className="mb-2">
            <Logo size="md" />
          </div>
          <CardTitle className="text-2xl font-bold text-center">Admin Registration</CardTitle>
          <Badge className="mt-2 bg-purple-100 text-purple-700">Admin Portal</Badge>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input name="firstName" placeholder="First Name" value={form.firstName} onChange={handleChange} required />
            <Input name="lastName" placeholder="Last Name" value={form.lastName} onChange={handleChange} required />
            <Input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
            <Input name="phone" placeholder="Phone (optional)" value={form.phone} onChange={handleChange} />
            <Input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required />
            {error && <div className="text-red-500 text-sm">{error}</div>}
            {success && <div className="text-green-600 text-sm">{success}</div>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Registering..." : "Register"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
