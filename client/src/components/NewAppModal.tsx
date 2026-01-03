import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Sparkles,
  ArrowRight,
  Loader2,
  CheckCircle2,
  Copy,
} from "lucide-react";
import api from "../lib/api";
import { MinimalInput } from "./ui/input";
import { toast } from "react-toastify";

export default function NewAppModal({
  isOpen,
  onClose,
  onSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    jobTitle: "",
    company: "",
    jobDescription: "",
    resumeText: "",
  });
  const [result, setResult] = useState<any>(null);

  // --- NEW: Reset function to ensure the modal starts fresh next time ---
  const handleCloseAndReset = () => {
    setStep(1);
    setLoading(false);
    setResult(null);
    setFormData({
      jobTitle: "",
      company: "",
      jobDescription: "",
      resumeText: "",
    });
    onClose();
  };

  const handleOptimize = async () => {
    if (
      !formData.jobTitle ||
      !formData.jobDescription ||
      !formData.resumeText
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    setStep(3); // Show the AI Loading screen
    try {
      // 1. Call your AI Route (Mounted at /api/ai/optimize)
      const aiRes = await api.post("/ai/optimize", {
        resumeText: formData.resumeText,
        jobDescription: formData.jobDescription,
      });

      const aiData = aiRes.data.data;
      setResult(aiData);

      // 2. Call your Applications Route (Mounted at /api/applications)
      await api.post("/applications", {
        jobTitle: formData.jobTitle,
        company: formData.company,
        jobDescription: formData.jobDescription,
        optimizedResume: aiData.optimizedResume,
        matchScore: aiData.matchScore,
        originalResume: formData.resumeText, // Keep the original for your reference
      });

      setStep(4); // Success view
      onSuccess(); // Refresh dashboard list
    } catch (err: any) {
      console.error("AI/Save Error:", err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Processing failed.");
      setStep(2); // Send back to step 2 to allow editing
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (result?.optimizedResume) {
      navigator.clipboard.writeText(result.optimizedResume);
      toast.success("Optimized text copied!");
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop - now resets on click */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleCloseAndReset}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-2xl rounded-2xl overflow-hidden"
        >
          <div className="p-8">
            <header className="flex justify-between items-start mb-8">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight">
                  {step === 4 ? "Analysis Complete" : "New Application"}
                </h2>
                <p className="text-zinc-500 text-xs uppercase tracking-widest mt-1">
                  Step {step === 4 ? 3 : step} of 3 • AI Optimization
                </p>
              </div>
              <button
                onClick={handleCloseAndReset}
                className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-zinc-400" />
              </button>
            </header>

            <div className="min-h-[350px]">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase font-bold tracking-widest text-zinc-400">
                        Company
                      </label>
                      <MinimalInput
                        placeholder="e.g. Google"
                        value={formData.company}
                        onChange={(e) =>
                          setFormData({ ...formData, company: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase font-bold tracking-widest text-zinc-400">
                        Job Role
                      </label>
                      <MinimalInput
                        placeholder="e.g. React Dev"
                        value={formData.jobTitle}
                        onChange={(e) =>
                          setFormData({ ...formData, jobTitle: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-zinc-400">
                      Job Description
                    </label>
                    <textarea
                      placeholder="Paste the full job description here..."
                      className="w-full h-40 bg-transparent border-b border-zinc-200 dark:border-zinc-800 focus:border-zinc-900 dark:focus:border-white outline-none resize-none py-2 text-sm transition-all"
                      value={formData.jobDescription}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          jobDescription: e.target.value,
                        })
                      }
                    />
                  </div>
                  <button
                    onClick={() => setStep(2)}
                    className="w-full h-12 bg-black dark:bg-white text-white dark:text-black font-bold text-xs tracking-widest uppercase hover:opacity-90 flex items-center justify-center gap-2"
                  >
                    NEXT STEP <ArrowRight className="w-4 h-4" />
                  </button>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-zinc-400">
                      Current Resume
                    </label>
                    <textarea
                      placeholder="Paste your resume content..."
                      className="w-full h-64 bg-transparent border-b border-zinc-200 dark:border-zinc-800 focus:border-zinc-900 dark:focus:border-white outline-none resize-none py-2 text-sm transition-all"
                      value={formData.resumeText}
                      onChange={(e) =>
                        setFormData({ ...formData, resumeText: e.target.value })
                      }
                    />
                  </div>
                  <div className="flex gap-4">
                    <button
                      onClick={() => setStep(1)}
                      className="flex-1 h-12 border border-zinc-200 dark:border-zinc-800 font-bold text-xs tracking-widest uppercase hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all"
                    >
                      BACK
                    </button>
                    <button
                      onClick={handleOptimize}
                      disabled={loading}
                      className="flex-[2] h-12 bg-black dark:bg-white text-white dark:text-black font-bold text-xs tracking-widest uppercase flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <Sparkles className="w-4 h-4" /> OPTIMIZE WITH AI
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="h-full flex flex-col items-center justify-center text-center space-y-4 pt-12"
                >
                  <div className="relative">
                    <div className="absolute inset-0 bg-black dark:bg-white blur-xl opacity-20 animate-pulse"></div>
                    <Loader2 className="w-12 h-12 animate-spin relative z-10" />
                  </div>
                  <p className="text-sm font-medium tracking-tight">
                    AI is tailoring your resume...
                  </p>
                  <p className="text-xs text-zinc-500 max-w-[200px]">
                    Matching your skills with the job requirements.
                  </p>
                </motion.div>
              )}

              {step === 4 && result && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-6"
                >
                  {/* Top Stats Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center justify-between p-5 bg-zinc-50 dark:bg-zinc-900 rounded-xl border border-zinc-100 dark:border-zinc-800">
                      <div>
                        <p className="text-[10px] uppercase font-bold tracking-widest text-zinc-400 mb-1">
                          Match Score
                        </p>
                        <h3 className="text-4xl font-bold tracking-tighter text-zinc-900 dark:text-white">
                          {result.matchScore}%
                        </h3>
                      </div>
                      <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-500/10 flex items-center justify-center">
                        <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-500" />
                      </div>
                    </div>

                    <div className="p-5 bg-zinc-50 dark:bg-zinc-900 rounded-xl border border-zinc-100 dark:border-zinc-800">
                      <p className="text-[10px] uppercase font-bold tracking-widest text-zinc-400 mb-2">
                        AI Analysis
                      </p>
                      <p className="text-sm font-medium text-zinc-600 dark:text-zinc-300 leading-relaxed">
                        {result.matchAnalysis ||
                          "Great match! Your profile aligns well with the requirements."}
                      </p>
                    </div>
                  </div>

                  {/* Missing Skills Section */}
                  {result.missingSkills && result.missingSkills.length > 0 && (
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase font-bold tracking-widest text-red-500/80">
                        Missing Skills / Gaps
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {result.missingSkills.map(
                          (skill: string, idx: number) => (
                            <span
                              key={idx}
                              className="px-3 py-1 bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 text-xs font-semibold rounded-full border border-red-100 dark:border-red-900/20"
                            >
                              {skill}
                            </span>
                          )
                        )}
                      </div>
                    </div>
                  )}

                  {/* Optimized Resume Section */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] uppercase font-bold tracking-widest text-zinc-400">
                        Optimized Resume Content
                      </label>
                      <button
                        onClick={copyToClipboard}
                        className="text-[10px] font-bold text-zinc-500 hover:text-black dark:hover:text-white flex items-center gap-1 uppercase transition-colors"
                      >
                        <Copy className="w-3 h-3" /> Copy
                      </button>
                    </div>
                    <div className="p-4 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-xl h-40 overflow-y-auto text-xs font-mono whitespace-pre-wrap text-zinc-600 dark:text-zinc-300">
                      {result.optimizedResume}
                    </div>
                  </div>

                  <button
                    onClick={handleCloseAndReset}
                    className="w-full h-12 bg-black dark:bg-white text-white dark:text-black font-bold text-xs tracking-widest uppercase hover:opacity-90 rounded-lg transition-opacity"
                  >
                    Save Application
                  </button>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
