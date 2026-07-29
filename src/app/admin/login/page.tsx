"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ShieldAlert, Check } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError("Invalid email or password");
      } else {
        router.push("/admin");
        router.refresh();
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getInputStyle = (field: string) => {
    const isFocused = focused === field;
    return `w-full px-4 py-3.5 rounded-xl font-sans text-sm outline-none transition-all duration-200 border box-border ${
      isFocused
        ? "bg-white/5 border-[#aaff00]/50 shadow-[0_0_0_3px_rgba(170,255,0,0.1)]"
        : "bg-white/[0.03] border-white/10"
    } text-white`;
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#111] px-6">
      <div className="w-full max-w-[420px] bg-[#161616] border border-white/5 rounded-3xl p-10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-[#aaff00] flex items-center justify-center mx-auto mb-4">
            <span className="font-mono text-[16px] font-bold text-[#111]">C</span>
          </div>
          <h1 className="font-sans text-xl font-extrabold text-white tracking-tight">Studio Admin Panel</h1>
          <p className="font-sans text-[12.5px] text-[#555] mt-1">Sign in to manage website content</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3">
            <ShieldAlert className="text-red-400 shrink-0" size={18} />
            <p className="font-sans text-[12.5px] text-red-300 m-0">{error}</p>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block font-mono text-[10px] text-[#555] tracking-[0.12em] uppercase mb-2">Email Address</label>
            <input
              type="email"
              required
              placeholder="admin@charudesign.studio"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setFocused("email")}
              onBlur={() => setFocused(null)}
              className={getInputStyle("email")}
            />
          </div>

          <div>
            <label className="block font-mono text-[10px] text-[#555] tracking-[0.12em] uppercase mb-2">Password</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setFocused("password")}
              onBlur={() => setFocused(null)}
              className={getInputStyle("password")}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full p-3.5 rounded-xl bg-[#aaff00] text-[#111] text-[14px] font-bold font-sans border-none cursor-pointer transition-all duration-200 shadow-[0_8px_30px_rgba(170,255,0,0.25)] hover:bg-[#88cc00] hover:shadow-[0_12px_40px_rgba(170,255,0,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
