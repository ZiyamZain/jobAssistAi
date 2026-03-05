import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Sparkles,
  ArrowRight,
  Loader2,
  CheckCircle2,
  Copy,
  Upload,
} from "lucide-react";
import api from "../lib/api";
import { MinimalInput } from "./ui/input";
import { toast } from "sonner";

interface FormData {
  jobTitle: string;
  company: string;
  jobDescription: string;
  resumeText: string;
}

interface AIResult {
  optimizedResume: string;
  matchScore: number;
  matchAnalysis: string;
  requiredSkills: string[];
  missingSkills: string[];
}

export default function NewAppModal({
  isOpen,
  onClose,
  onSuccess,
  onRefresh,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onRefresh?: () => void;
}) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isPdfUpload, setIsPdfUpload] = useState(false);
  const [fileName, setFileName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<FormData>({
    jobTitle: "",
    company: "",
    jobDescription: "",
    resumeText: "",
  });
  const [result, setResult] = useState<AIResult | null>(null);

  const handleCloseAndReset = () => {
    setStep(1);
    setLoading(false);
    setResult(null);
    setIsPdfUpload(false);
    setFileName("");
    setFormData({
      jobTitle: "",
      company: "",
      jobDescription: "",
      resumeText: "",
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onClose();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
    }
  };

  const handleOptimize = async () => {
    if (!formData.jobTitle || !formData.jobDescription) {
      toast.error("Please fill in all required fields.");
      return;
    }

    // Check if either resume text or file is provided
    if (!formData.resumeText && !fileName) {
      toast.error("Please provide either resume text or upload a PDF file.");
      return;
    }

    setLoading(true);
    setStep(3); // Show the AI Loading screen

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("jobTitle", formData.jobTitle);
      formDataToSend.append("company", formData.company || "");
      formDataToSend.append("jobDescription", formData.jobDescription);

      if (isPdfUpload && fileInputRef.current?.files?.[0]) {
        formDataToSend.append("resumeFile", fileInputRef.current.files[0]);
      } else {
        formDataToSend.append("resumeText", formData.resumeText);
      }

      // 1. Call your AI Route
      const aiRes = await api.post("/ai/optimize", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const aiData = aiRes.data.data;
      setResult(aiData);

      // 2. Save the application
      await api.post("/applications", {
        jobTitle: formData.jobTitle,
        company: formData.company,
        jobDescription: formData.jobDescription,
        optimizedResume: aiData.optimizedResume,
        matchScore: aiData.matchScore,
        matchAnalysis: aiData.matchAnalysis,
        requiredSkills: aiData.requiredSkills,
        missingSkills: aiData.missingSkills,
        originalResume: isPdfUpload ? "PDF Upload" : formData.resumeText,
      });

      setStep(4); // Success view
      if (onRefresh) onRefresh(); // Refresh dashboard list
    } catch (err: any) {
      console.error("AI/Save Error:", err.response?.data || err.message);

      // Detailed error message extraction
      const errorMessage =
        err.response?.data?.errors?.[0]?.message ||
        err.response?.data?.message ||
        "Processing failed.";

      toast.error(errorMessage);
      setStep(2); // Send back to step 2 to allow editing
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (result?.optimizedResume) {
      navigator.clipboard.writeText(result.optimizedResume);
      toast.success("Optimized text copied to clipboard!");
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
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
          onClick={(e) => e.stopPropagation()}
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
                disabled={loading}
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
                        Job Role *
                      </label>
                      <MinimalInput
                        placeholder="e.g. React Developer"
                        value={formData.jobTitle}
                        onChange={(e) =>
                          setFormData({ ...formData, jobTitle: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-zinc-400">
                      Job Description *
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
                      required
                    />
                  </div>
                  <button
                    onClick={() => setStep(2)}
                    disabled={!formData.jobTitle || !formData.jobDescription}
                    className="w-full h-12 bg-black dark:bg-white text-white dark:text-black font-bold text-xs tracking-widest uppercase hover:opacity-90 flex items-center justify-center gap-2 disabled:opacity-50"
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
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] uppercase font-bold tracking-widest text-zinc-400">
                        Resume *
                      </label>
                      <div className="flex space-x-2">
                        <button
                          type="button"
                          onClick={() => {
                            setIsPdfUpload(false);
                            setFileName("");
                            if (fileInputRef.current) {
                              fileInputRef.current.value = "";
                            }
                          }}
                          className={`text-xs px-2 py-1 rounded ${
                            !isPdfUpload
                              ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                              : "bg-gray-100 dark:bg-zinc-800"
                          }`}
                        >
                          Paste Text
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setIsPdfUpload(true);
                            fileInputRef.current?.click();
                          }}
                          className={`text-xs px-2 py-1 rounded ${
                            isPdfUpload
                              ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                              : "bg-gray-100 dark:bg-zinc-800"
                          }`}
                        >
                          Upload PDF
                        </button>
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleFileChange}
                          accept=".pdf"
                          className="hidden"
                        />
                      </div>
                    </div>

                    {isPdfUpload ? (
                      <div
                        className="border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-lg p-6 text-center cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        {fileName ? (
                          <div className="flex items-center justify-between p-2 bg-zinc-50 dark:bg-zinc-900/50 rounded">
                            <span className="truncate max-w-xs text-sm">
                              {fileName}
                            </span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setFileName("");
                                if (fileInputRef.current) {
                                  fileInputRef.current.value = "";
                                }
                              }}
                              className="text-red-500 hover:text-red-700 ml-2"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <div className="mx-auto w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                              <Upload
                                size={20}
                                className="text-blue-500 dark:text-blue-400"
                              />
                            </div>
                            <p className="text-sm font-medium mt-2">
                              Click to upload PDF resume
                            </p>
                            <p className="text-xs text-zinc-500">
                              or drag and drop (max 5MB)
                            </p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <textarea
                        placeholder="Paste your resume content here..."
                        className="w-full h-64 bg-transparent border border-zinc-200 dark:border-zinc-800 focus:border-zinc-900 dark:focus:border-white outline-none resize-none p-3 text-sm rounded-lg transition-all"
                        value={formData.resumeText}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            resumeText: e.target.value,
                          })
                        }
                        required={!isPdfUpload}
                      />
                    )}
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={() => setStep(1)}
                      className="flex-1 h-12 border border-zinc-200 dark:border-zinc-800 font-bold text-xs tracking-widest uppercase hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all"
                      disabled={loading}
                    >
                      BACK
                    </button>
                    <button
                      onClick={handleOptimize}
                      disabled={
                        loading ||
                        (!formData.resumeText && !fileName) ||
                        !formData.jobTitle ||
                        !formData.jobDescription
                      }
                      className="flex-[2] h-12 bg-black dark:bg-white text-white dark:text-black font-bold text-xs tracking-widest uppercase flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {loading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Sparkles className="w-4 h-4" />
                      )}{" "}
                      OPTIMIZE WITH AI
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
                          ),
                        )}
                      </div>
                    </div>
                  )}

                  {/* Required Skills Section */}
                  {result.requiredSkills &&
                    result.requiredSkills.length > 0 && (
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase font-bold tracking-widest text-zinc-400">
                          Key Skills Matched
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {result.requiredSkills.map(
                            (skill: string, idx: number) => (
                              <span
                                key={idx}
                                className={`px-3 py-1 text-xs font-semibold rounded-full ${
                                  result.missingSkills?.includes(skill)
                                    ? "bg-yellow-50 dark:bg-yellow-900/10 text-yellow-600 dark:text-yellow-400 border border-yellow-100 dark:border-yellow-900/20"
                                    : "bg-green-50 dark:bg-green-900/10 text-green-600 dark:text-green-400 border border-green-100 dark:border-green-900/20"
                                }`}
                              >
                                {skill}
                                {result.missingSkills?.includes(skill) &&
                                  " (Partial)"}
                              </span>
                            ),
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
                    onClick={onSuccess} // Close modal
                    className="w-full h-12 bg-black dark:bg-white text-white dark:text-black font-bold text-xs tracking-widest uppercase hover:opacity-90 rounded-lg transition-opacity"
                  >
                    Done
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
