import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Copy,
  CheckCircle2,
  Calendar,
  Building,
  Briefcase,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

interface ApplicationDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  application: any; // Using any for now, but should ideally use IApplication interface
}

export default function ApplicationDetailsModal({
  isOpen,
  onClose,
  application,
}: ApplicationDetailsModalProps) {
  if (!isOpen || !application) return null;

  const copyToClipboard = () => {
    if (application.optimizedResume) {
      navigator.clipboard.writeText(application.optimizedResume);
      toast.success("Optimized text copied to clipboard!");
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-3xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-2xl rounded-2xl overflow-hidden max-h-[90vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-start bg-zinc-50/50 dark:bg-zinc-900/50">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-white">
                  {application.jobTitle}
                </h2>
                <Badge
                  variant="outline"
                  className="uppercase text-[10px] tracking-widest"
                >
                  {application.status}
                </Badge>
              </div>
              <div className="flex items-center gap-4 text-sm text-zinc-500">
                <span className="flex items-center gap-1.5">
                  <Building className="w-4 h-4" />
                  {application.company}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  {new Date(application.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-zinc-400" />
            </button>
          </div>

          <div className="p-8 overflow-y-auto custom-scrollbar">
            <div className="space-y-8">
              {/* Stats & Analysis */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-5 bg-zinc-50 dark:bg-zinc-900 rounded-xl border border-zinc-100 dark:border-zinc-800">
                  <div>
                    <p className="text-[10px] uppercase font-bold tracking-widest text-zinc-400 mb-1">
                      Match Score
                    </p>
                    <h3 className="text-4xl font-bold tracking-tighter text-zinc-900 dark:text-white">
                      {application.matchScore || 0}%
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
                    {application.matchAnalysis ||
                      "No detailed analysis available for this application."}
                  </p>
                </div>
              </div>

              {/* Skills Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Required/Matched Skills */}
                <div className="space-y-3">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-zinc-400 flex items-center gap-2">
                    <CheckCircle2 className="w-3 h-3 text-green-500" /> Matched
                    Skills
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {application.requiredSkills &&
                    application.requiredSkills.length > 0 ? (
                      application.requiredSkills.map(
                        (skill: string, idx: number) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-green-50 dark:bg-green-900/10 text-green-600 dark:text-green-400 text-xs font-semibold rounded-full border border-green-100 dark:border-green-900/20"
                          >
                            {skill}
                          </span>
                        ),
                      )
                    ) : (
                      <span className="text-xs text-zinc-400 italic">
                        No specific skills listed
                      </span>
                    )}
                  </div>
                </div>

                {/* Missing Skills */}
                <div className="space-y-3">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-red-400 flex items-center gap-2">
                    <X className="w-3 h-3 text-red-500" /> Missing / To Learn
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {application.missingSkills &&
                    application.missingSkills.length > 0 ? (
                      application.missingSkills.map(
                        (skill: string, idx: number) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 text-xs font-semibold rounded-full border border-red-100 dark:border-red-900/20"
                          >
                            {skill}
                          </span>
                        ),
                      )
                    ) : (
                      <span className="text-xs text-zinc-400 italic">
                        No missing skills identified
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Job Description Info */}
              <div className="space-y-3">
                <label className="text-[10px] uppercase font-bold tracking-widest text-zinc-400 flex items-center gap-2">
                  <Briefcase className="w-3 h-3" /> Job Description
                </label>
                <div className="p-4 bg-zinc-50 dark:bg-zinc-900/50 rounded-lg border border-zinc-100 dark:border-zinc-800 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed max-h-64 overflow-y-auto whitespace-pre-wrap">
                  {application.jobDescription || "No job description provided."}
                </div>
              </div>

              {/* Optimized Resume Section */}
              <div className="space-y-3">
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
                <div className="p-5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-xl h-64 overflow-y-auto text-xs font-mono whitespace-pre-wrap text-zinc-600 dark:text-zinc-300 shadow-inner">
                  {application.optimizedResume ||
                    application.resumeText ||
                    "No resume content available."}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
