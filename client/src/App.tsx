import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router";
import { Toaster } from "sonner";
import Login from "./pages/Login";
// import Register from './pages/Register';
import Dashboard from "./pages/Dashboard";
import DashboardLayout from "./components/DashboardLayout";
import Landing from "./pages/Landing";
import Profile from "./pages/Profile";

import { useAuthStore } from "./store/authStore";
import Register from "./pages/Register";

//Protected Route wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = useAuthStore((state) => state.token);
  if (!token) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Landing />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route
            path="resume"
            element={
              <div className="flex flex-col flex-1 items-center justify-center p-8 text-zinc-500">
                <h2 className="text-xl font-medium mb-2 text-zinc-900 dark:text-white">
                  Resume Optimizer
                </h2>
                <p>Coming Soon...</p>
              </div>
            }
          />
          <Route path="profile" element={<Profile />} />
          <Route
            path="interviews"
            element={
              <div className="flex flex-col flex-1 items-center justify-center p-8 text-zinc-500">
                <h2 className="text-xl font-medium mb-2 text-zinc-900 dark:text-white">
                  Mock Interviews
                </h2>
                <p>Coming Soon...</p>
              </div>
            }
          />
          <Route
            path="skills"
            element={
              <div className="flex flex-col flex-1 items-center justify-center p-8 text-zinc-500">
                <h2 className="text-xl font-medium mb-2 text-zinc-900 dark:text-white">
                  Skill Analysis
                </h2>
                <p>Coming Soon...</p>
              </div>
            }
          />
          <Route
            path="letters"
            element={
              <div className="flex flex-col flex-1 items-center justify-center p-8 text-zinc-500">
                <h2 className="text-xl font-medium mb-2 text-zinc-900 dark:text-white">
                  Cover Letters
                </h2>
                <p>Coming Soon...</p>
              </div>
            }
          />
          <Route
            path="settings"
            element={
              <div className="flex flex-col flex-1 items-center justify-center p-8 text-zinc-500">
                <h2 className="text-xl font-medium mb-2 text-zinc-900 dark:text-white">
                  Global Settings
                </h2>
                <p>
                  Wait until you implement dark mode and account config here
                </p>
              </div>
            }
          />
        </Route>
      </Routes>
      <Toaster
        richColors
        position="top-right"
        theme="system"
        className="font-sans"
      />
    </Router>
  );
};

export default App;
