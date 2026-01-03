import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { useAuthStore } from "../store/authStore";
import api from "../lib/api";
import { toast } from "react-toastify";
import { MinimalInput } from "../components/ui/input";

const loginSchema = z.object({
  email: z.string().email("Valid email required"),
  password: z.string().min(1, "Password required"),
});

type LoginInputs = z.infer<typeof loginSchema>;

export default function Login() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInputs>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInputs) => {
    setIsLoading(true);
    try {
      const res = await api.post("/auth/login", data);
      const { user, token } = res.data.data;
      setAuth(user, token);
      toast.success("Access granted");
      navigate("/dashboard");
    } catch (error: any) {
      toast.error("Invalid credentials");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black text-zinc-900 dark:text-zinc-100 flex flex-col justify-center items-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[400px] space-y-12"
      >
        {/* Brand Header */}
        <header className="space-y-4">
          <div className="flex justify-between items-end">
            <div className="space-y-1">
              <h1 className="text-4xl font-medium tracking-tighter">JobAI</h1>
              <p className="text-zinc-500 dark:text-zinc-500 text-sm font-medium uppercase tracking-widest">
                Studio Access
              </p>
            </div>
            <Sparkles className="w-6 h-6 text-zinc-300 dark:text-zinc-700" />
          </div>
        </header>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="space-y-6">
            <div className="group">
              <MinimalInput
                placeholder="Email address"
                type="email"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-[10px] uppercase font-bold text-red-500 mt-2 tracking-wider">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="group">
              <MinimalInput
                placeholder="Password"
                type="password"
                {...register("password")}
              />
              {errors.password && (
                <p className="text-[10px] uppercase font-bold text-red-500 mt-2 tracking-wider">
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-14 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-black font-medium text-sm flex items-center justify-center gap-3 hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-30"
            >
              {isLoading ? (
                "Authenticating..."
              ) : (
                <>
                  CONTINUE TO DASHBOARD
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Footer */}
        <footer className="flex flex-col gap-4 text-[11px] font-medium uppercase tracking-widest text-zinc-400 dark:text-zinc-600 border-t border-zinc-100 dark:border-zinc-900 pt-8">
          <div className="flex justify-between">
            <Link
              to="/register"
              className="hover:text-zinc-900 dark:hover:text-white transition-colors"
            >
              Create Account
            </Link>
            <a
              href="#"
              className="hover:text-zinc-900 dark:hover:text-white transition-colors"
            >
              Forgot Access?
            </a>
          </div>
          <p className="text-center opacity-50">
            © 2026 JobAI. Engineered for performance.
          </p>
        </footer>
      </motion.div>

      {/* Subtle Background Detail */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-zinc-200 dark:via-zinc-800 to-transparent" />
    </div>
  );
}
