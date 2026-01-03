import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { toast } from "react-toastify";
import api from "../lib/api";
import { useAuthStore } from "../store/authStore";
import { MinimalInput } from "../components/ui/input";

const registerSchema = z.object({
  name: z.string().min(2, "Name required"),
  email: z.string().email("Valid email required"),
  password: z.string().min(6, "6+ characters required"),
});

type RegisterInputs = z.infer<typeof registerSchema>;

export default function Register() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInputs>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterInputs) => {
    setIsLoading(true);
    try {
      const res = await api.post("/auth/register", data);
      const { user, token } = res.data.data;
      setAuth(user, token);
      toast.success("Welcome to the studio");
      navigate("/dashboard");
    } catch (err: any) {
      toast.error("Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black text-zinc-900 dark:text-zinc-100 flex flex-col justify-center items-center px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.99 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[400px] space-y-12"
      >
        <header className="space-y-4">
          <div className="flex justify-between items-end">
            <div className="space-y-1">
              <h1 className="text-4xl font-medium tracking-tighter">
                Register
              </h1>
              <p className="text-zinc-500 dark:text-zinc-500 text-sm font-medium uppercase tracking-widest">
                New Membership
              </p>
            </div>
            <Sparkles className="w-6 h-6 text-zinc-300 dark:text-zinc-700" />
          </div>
        </header>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="space-y-6">
            <MinimalInput placeholder="Your Name" {...register("name")} />
            {errors.name && (
              <p className="text-[10px] uppercase font-bold text-red-500 mt-2 tracking-wider">
                {errors.name.message}
              </p>
            )}

            <MinimalInput
              placeholder="Email"
              type="email"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-[10px] uppercase font-bold text-red-500 mt-2 tracking-wider">
                {errors.email.message}
              </p>
            )}

            <MinimalInput
              placeholder="Set Password"
              type="password"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-[10px] uppercase font-bold text-red-500 mt-2 tracking-wider">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-14 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-black font-medium text-sm flex items-center justify-center gap-3 transition-all disabled:opacity-30"
            >
              {isLoading ? (
                "INITIALIZING..."
              ) : (
                <>
                  CREATE ACCOUNT
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>

        <footer className="text-[11px] font-medium uppercase tracking-widest text-zinc-400 dark:text-zinc-600 border-t border-zinc-100 dark:border-zinc-900 pt-8 flex justify-between">
          <Link
            to="/login"
            className="hover:text-zinc-900 dark:hover:text-white transition-colors"
          >
            Already registered?
          </Link>
          <span className="opacity-30">JobAI Platform</span>
        </footer>
      </motion.div>
    </div>
  );
}
