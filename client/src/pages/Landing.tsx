import { Link } from "react-router";
import { useAuthStore } from "../store/authStore";

export default function Landing() {
  const token = useAuthStore((state) => state.token);

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-white/20">
      {/* Navbar */}
      <nav className="fixed top-0 w-full px-6 lg:px-16 py-5 flex justify-between items-center bg-[#050505]/90 backdrop-blur-md border-b border-white/[0.08] z-50">
        <div className="flex items-center gap-4">
          <div className="w-6 h-6 rounded-md border border-white/[0.16] flex items-center justify-center text-[0.7rem] font-bold">
            J
          </div>
          <div className="text-lg font-semibold tracking-tight">
            JobAssistAI
          </div>
        </div>
        <div className="hidden sm:flex gap-8 text-sm text-[#8c8c8c]">
          <a href="#product" className="hover:text-white transition-colors">
            Product
          </a>
          <a href="#billing" className="hover:text-white transition-colors">
            Billing
          </a>
          <a href="#docs" className="hover:text-white transition-colors">
            Docs
          </a>
        </div>
        <div className="flex gap-4 items-center text-sm">
          {token ? (
            <Link
              to="/dashboard"
              className="px-5 py-2 rounded-full bg-white text-[#050505] font-medium hover:scale-105 transition-transform"
            >
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="px-4 py-2 rounded-full border border-white/[0.08] text-[#8c8c8c] hover:text-white hover:border-white/[0.16] transition-all"
              >
                Sign in
              </Link>
              <Link
                to="/dashboard"
                className="px-5 py-2 rounded-full bg-white text-[#050505] font-medium hover:scale-105 transition-transform"
              >
                Get started
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero */}
      <section className="min-h-screen flex flex-col items-center justify-center px-6 pt-28 pb-16 border-b border-white/[0.08] text-center">
        <div className="text-[0.7rem] tracking-[0.18em] uppercase text-[#8c8c8c] mb-7">
          AI Job Application Assistant
        </div>
        <h1 className="font-serif text-5xl md:text-7xl lg:text-[5.2rem] font-bold leading-tight tracking-tight mb-7">
          Effortless <span className="opacity-70">job hunting</span>, AI-powered
          matching.
        </h1>
        <p className="text-base md:text-lg max-w-[520px] text-[#8c8c8c] mx-auto mb-10">
          A smart job application workspace to track roles, optimize resumes to
          fit job descriptions perfectly, and conquer interviews confidently.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8 w-full sm:w-auto">
          {token ? (
            <Link
              to="/dashboard"
              className="px-8 py-3.5 rounded-full bg-white text-[#050505] font-medium text-[0.95rem] hover:scale-105 transition-transform"
            >
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link
                to="/dashboard"
                className="px-8 py-3.5 rounded-full bg-white text-[#050505] font-medium text-[0.95rem] hover:scale-105 transition-transform"
              >
                Get started
              </Link>
              <Link
                to="/register"
                className="px-8 py-3.5 rounded-full border border-white/[0.08] text-white text-[0.95rem] hover:bg-white/[0.08] hover:border-white/[0.16] transition-all"
              >
                Create an account
              </Link>
            </>
          )}
        </div>
        <div className="text-xs text-[#8c8c8c]">
          No credit card required · Free to use
        </div>

        <div className="w-full max-w-[1100px] mt-16 text-left">
          <div className="bg-[#0b0b0b] rounded-xl border border-white/[0.08] p-6">
            <div className="h-auto lg:h-[420px] rounded-lg border border-white/[0.08] flex flex-col lg:grid lg:grid-cols-[280px_1fr] overflow-hidden">
              <div className="border-b lg:border-b-0 lg:border-r border-white/[0.08] p-5 flex flex-col gap-5">
                <div className="text-[0.7rem] px-3 py-1 rounded-full border border-white/[0.08] inline-flex items-center gap-2 text-[#8c8c8c] w-fit">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                  <span>Workspace: General</span>
                </div>
                <div>
                  <div className="text-[0.95rem] font-medium mb-3 text-white">
                    Members &amp; roles
                  </div>
                  <div className="flex flex-col gap-1.5 text-sm text-[#8c8c8c]">
                    <span>• You — Applicant</span>
                    <span>• Gemini — AI Recruiter</span>
                    <span>• Auto — Tracking</span>
                  </div>
                </div>
                <div>
                  <div className="text-[0.95rem] font-medium mb-3 text-white">
                    Active Application
                  </div>
                  <div className="flex flex-col gap-1.5 text-sm text-[#8c8c8c]">
                    <span>Role: Frontend Developer</span>
                    <span>Company: ACME Corp</span>
                    <span>Match Score: 87%</span>
                  </div>
                </div>
              </div>
              <div className="p-6 lg:p-8 flex flex-col justify-between">
                <div>
                  <h2 className="text-[1.05rem] font-semibold mb-1.5 text-white">
                    Deploy your resume
                  </h2>
                  <p className="text-sm text-[#8c8c8c] max-w-[320px]">
                    Give us a job description, and JobAssistAI handles ATS
                    optimization, missing skills gap analysis, and cover letter
                    generation behind the scenes.
                  </p>
                  <div className="mt-5">
                    <div className="text-sm text-[#8c8c8c] mb-1.5">
                      Target Role
                    </div>
                    <div className="rounded-md border border-white/[0.08] px-3.5 py-2.5 text-sm w-full font-medium text-white">
                      Senior React Engineer
                    </div>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-xs text-[#8c8c8c] mt-6 gap-4">
                  <div className="flex flex-wrap gap-1.5">
                    <div className="rounded-full border border-white/[0.08] px-2.5 py-1 text-white">
                      ATS-Friendly
                    </div>
                    <div className="rounded-full border border-white/[0.08] px-2.5 py-1 text-white">
                      Gemini-Powered
                    </div>
                    <div className="rounded-full border border-white/[0.08] px-2.5 py-1 text-white">
                      Cover letters
                    </div>
                  </div>
                  <div>Generates optimizations in under 2 seconds.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Highlights */}
      <section className="px-6 py-24 border-b border-white/[0.08]" id="product">
        <div className="max-w-[1100px] mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6 md:gap-0">
            <div>
              <div className="text-xl font-medium tracking-[0.05em] uppercase text-white mb-2">
                Product
              </div>
              <p className="text-sm text-[#8c8c8c] max-w-[380px]">
                Kanban boards, AI resume tuning, and auto-generated cover
                letters — everything you need for the modern job hunt.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="rounded-xl border border-white/[0.08] p-6 lg:p-7">
              <h3 className="text-[0.95rem] font-medium mb-1.5 text-white">
                Application Dashboard
              </h3>
              <p className="text-sm text-[#8c8c8c]">
                Easily track every job you've applied to. Move applications
                across Saved, Applied, Interview, and Rejected stages.
              </p>
              <div className="text-xs text-[#8c8c8c] mt-4">
                Drag &amp; Drop · Kanban UI
              </div>
            </div>
            <div className="rounded-xl border border-white/[0.08] p-6 lg:p-7">
              <h3 className="text-[0.95rem] font-medium mb-1.5 text-white">
                AI Resume Check
              </h3>
              <p className="text-sm text-[#8c8c8c]">
                Upload your PDF resume and paste a job description. Let our AI
                pull key skills and rewrite bullet points to get past ATS bots.
              </p>
              <div className="text-xs text-[#8c8c8c] mt-4">
                Gemini API · Match Scoring
              </div>
            </div>
            <div className="rounded-xl border border-white/[0.08] p-6 lg:p-7">
              <h3 className="text-[0.95rem] font-medium mb-1.5 text-white">
                Tailored Cover Letters
              </h3>
              <p className="text-sm text-[#8c8c8c]">
                Select your tone (professional or enthusiastic) and generate
                customized cover letters that highlight your strengths
                perfectly.
              </p>
              <div className="text-xs text-[#8c8c8c] mt-4">
                1-Click Generation · Context Aware
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Billing / Subscription */}
      <section className="px-6 py-24 border-b border-white/[0.08]" id="billing">
        <div className="max-w-[1100px] mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6 md:gap-0">
            <div>
              <div className="text-xl font-medium tracking-[0.05em] uppercase text-white mb-2">
                Subscription &amp; billing
              </div>
              <p className="text-sm text-[#8c8c8c] max-w-[380px]">
                Simple pricing designed for job seekers. Start organizing your
                hunt for free, upgrade when you need advanced AI tokens.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
            <div className="rounded-xl border border-white/[0.08] p-7 flex flex-col gap-3 text-left">
              <div className="text-xs tracking-[0.18em] uppercase text-[#8c8c8c]">
                Free
              </div>
              <div className="text-2xl font-medium text-white">$0 / month</div>
              <div className="text-sm text-[#8c8c8c] mb-1.5">
                For anyone starting their job hunt.
              </div>
              <div className="text-sm text-[#8c8c8c]">
                • 1 base resume
                <br />
                • Kanban tracking
                <br />• 5 AI optimizations / mo
              </div>
              <Link
                to={token ? "/dashboard" : "/register"}
                className="mt-5 inline-flex justify-center flex-1 px-4 py-2 rounded-full border border-white/[0.08] text-sm text-white hover:bg-white/[0.08] hover:border-white/[0.16] transition-all"
              >
                Start free
              </Link>
            </div>

            <div className="rounded-xl border border-white/[0.16] bg-[#0f0f0f] p-7 flex flex-col gap-3 text-left">
              <div className="text-xs tracking-[0.18em] uppercase text-[#8c8c8c]">
                Pro
              </div>
              <div className="text-2xl font-medium text-white">$12 / month</div>
              <div className="text-sm text-[#8c8c8c] mb-1.5">
                For aggressive job seekers.
              </div>
              <div className="text-sm text-[#8c8c8c]">
                • unlimited job tracking
                <br />
                • priority AI processing
                <br />• unlimited optimizations
              </div>
              <Link
                to={token ? "/dashboard" : "/register"}
                className="mt-5 inline-flex justify-center flex-1 px-4 py-2 rounded-full bg-white text-[#050505] text-sm hover:bg-[#eaeaea] hover:scale-105 transition-transform border border-transparent font-medium"
              >
                Start 7‑day trial
              </Link>
            </div>

            <div className="rounded-xl border border-white/[0.08] p-7 flex flex-col gap-3 text-left">
              <div className="text-xs tracking-[0.18em] uppercase text-[#8c8c8c]">
                Lifetime
              </div>
              <div className="text-2xl font-medium text-white">$49 once</div>
              <div className="text-sm text-[#8c8c8c] mb-1.5">
                Never pay a subscription again.
              </div>
              <div className="text-sm text-[#8c8c8c]">
                • one-time payment
                <br />
                • early access to features
                <br />• direct support
              </div>
              <Link
                to={token ? "/dashboard" : "/register"}
                className="mt-5 inline-flex justify-center flex-1 px-4 py-2 rounded-full border border-white/[0.08] text-sm text-white hover:bg-white/[0.08] hover:border-white/[0.16] transition-all"
              >
                Get lifetime
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 pt-16 pb-10">
        <div className="max-w-[1100px] mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-[#8c8c8c]">
          <div>&copy; 2026 JobAssistAI</div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">
              Status
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Terms
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
