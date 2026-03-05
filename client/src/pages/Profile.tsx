import { useState, useEffect } from "react";
import { LogOut, Mail, Calendar, User, Shield, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "../store/authStore";
import api from "../lib/api";
import { toast } from "sonner";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export default function Profile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const logout = useAuthStore((s) => s.logout);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const res = await api.get("/auth/profile");
        setProfile(res.data.data.user);
      } catch (error) {
        console.error("Failed to fetch profile", error);
        toast.error("Failed to load profile data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-zinc-500 bg-zinc-50 dark:bg-[#0A0A0A]">
        <Loader2 className="w-8 h-8 animate-spin text-zinc-400 mb-4" />
        <p className="text-sm">Loading your digital identity...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex-1 flex items-center justify-center bg-zinc-50 dark:bg-[#0A0A0A]">
        <div className="text-zinc-500">Failed to load profile.</div>
      </div>
    );
  }

  const joinDate = new Date(profile.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="flex-1 overflow-y-auto bg-zinc-50 dark:bg-[#0A0A0A] p-6 sm:p-10">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header Section */}
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-white">
            Account Profile
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-2">
            Manage your personal information and preferences.
          </p>
        </div>

        {/* Profile Card */}
        <div className="bg-white dark:bg-[#0F0F0F] rounded-2xl border border-zinc-200 dark:border-white/10 overflow-hidden shadow-sm">
          {/* Cover Area */}
          <div className="h-32 bg-zinc-900 dark:bg-white/5 relative">
            <div className="absolute -bottom-12 left-8">
              <Avatar className="w-24 h-24 border-4 border-white dark:border-[#0F0F0F] bg-zinc-100 dark:bg-zinc-800 shadow-md">
                <AvatarFallback className="text-3xl font-medium text-zinc-900 dark:text-white bg-zinc-100 dark:bg-zinc-800">
                  {profile.name[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>

          {/* Main Info */}
          <div className="pt-16 pb-8 px-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold text-zinc-900 dark:text-white">
                  {profile.name}
                </h2>
                <div className="flex items-center gap-2 text-zinc-500 mt-1">
                  <Shield className="w-4 h-4 text-emerald-500" />
                  <span className="text-sm font-medium">Verified User</span>
                </div>
              </div>

              <Button
                variant="outline"
                onClick={handleLogout}
                className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 border-red-200 dark:border-red-500/20"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>

            <div className="my-8 h-px bg-zinc-200 dark:bg-white/5" />

            {/* Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400 text-sm font-medium mb-2">
                  <User className="w-4 h-4" />
                  Full Name
                </div>
                <div className="text-zinc-900 dark:text-white font-medium pl-6">
                  {profile.name}
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400 text-sm font-medium mb-2">
                  <Mail className="w-4 h-4" />
                  Email Address
                </div>
                <div className="text-zinc-900 dark:text-white font-medium pl-6">
                  {profile.email}
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400 text-sm font-medium mb-2">
                  <Calendar className="w-4 h-4" />
                  Member Since
                </div>
                <div className="text-zinc-900 dark:text-white font-medium pl-6">
                  {joinDate}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Subscription Info Card */}
        <div className="bg-white dark:bg-[#0F0F0F] rounded-2xl border border-zinc-200 dark:border-white/10 p-8 shadow-sm">
          <h3 className="text-lg font-medium text-zinc-900 dark:text-white mb-4">
            Subscription Plan
          </h3>
          <div className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-white/5 rounded-xl border border-zinc-200 dark:border-white/10">
            <div>
              <div className="font-semibold text-zinc-900 dark:text-white tracking-wide uppercase text-sm">
                Free Tier
              </div>
              <div className="text-sm text-zinc-500 mt-1">
                Get unlimited optimizations with Pro.
              </div>
            </div>
            <Button className="bg-zinc-900 dark:bg-white text-white dark:text-black">
              Upgrade
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
