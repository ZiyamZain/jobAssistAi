import { useState, useEffect } from "react";

import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from "@hello-pangea/dnd";
import {
  Plus,
  Search,
  Check,
  X,
  Target,
  Sun,
  Moon,
  Trash2,
} from "lucide-react";
import { useAuthStore } from "../store/authStore";
import { useTheme } from "../contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import api from "../lib/api";
import { toast } from "react-toastify";

import NewAppModal from "../components/NewAppModal";

// Mapping backend status to frontend stages
const STAGES = [
  { id: "saved", label: "Saved", color: "zinc", icon: Target },
  { id: "applied", label: "Applied", color: "blue", icon: Check },
  { id: "interview", label: "Interview", color: "purple", icon: Target }, // Using Target as generic icon
  { id: "rejected", label: "Rejected", color: "red", icon: X },
];

export default function Dashboard() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const { toggleTheme } = useTheme();
  const [view, setView] = useState<"board" | "list">("board");
  const [searchQuery, setSearchQuery] = useState("");
  const [apps, setApps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch real data
  const fetchApplications = async () => {
    try {
      setLoading(true);
      const res = await api.get("/applications");
      setApps(res.data.data);
    } catch (error) {
      console.error("Failed to fetch apps", error);
      toast.error("Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleAppSuccess = () => {
    fetchApplications();
    setIsModalOpen(false);
  };

  const handleDelete = async (e: React.MouseEvent, appId: string) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this application?")) {
      return;
    }

    try {
      await api.delete(`/applications/${appId}`);
      setApps(apps.filter((app) => app._id !== appId));
      toast.success("Application deleted");
    } catch (error) {
      console.error("Failed to delete app", error);
      toast.error("Failed to delete application");
    }
  };

  const getStageApps = (stageId: string) =>
    apps.filter((app) => app.status === stageId);

  const filteredApps = apps.filter(
    (app) =>
      app.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.jobTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const onDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // Optimistic Update
    const newStatus = destination.droppableId;

    // Find the moved app
    const movedApp = apps.find((app) => app._id === draggableId);
    if (!movedApp) return;

    // Create a new apps array with the updated status
    const updatedApps = apps.map((app) =>
      app._id === draggableId ? { ...app, status: newStatus } : app
    );

    setApps(updatedApps); // Update UI immediately

    try {
      await api.put(`/applications/${draggableId}`, { status: newStatus });
      toast.success(
        `Moved to ${STAGES.find((s) => s.id === newStatus)?.label}`
      );
    } catch (error) {
      console.error("Failed to update status", error);
      toast.error("Failed to update status");
      // Revert on error
      fetchApplications();
    }
  };

  return (
    <div className="h-screen flex bg-white dark:bg-[#0A0A0A] text-zinc-900 dark:text-white antialiased overflow-hidden transition-colors duration-300">
      {/* Sidebar */}
      <aside className="w-16 bg-white dark:bg-[#0A0A0A] border-r border-zinc-200 dark:border-white/5 flex flex-col items-center py-6 gap-8">
        <div className="w-10 h-10 rounded-xl bg-black dark:bg-white flex items-center justify-center shadow-lg">
          <Target className="w-5 h-5 text-white dark:text-black" />
        </div>

        <nav className="flex-1 flex flex-col items-center gap-4">
          {/* Simple Nav - Active Dashboard */}
          <div className="w-10 h-10 rounded-lg bg-zinc-100 dark:bg-white/10 flex items-center justify-center text-zinc-900 dark:text-white">
            <Target className="w-5 h-5" />
          </div>
        </nav>

        <button
          onClick={toggleTheme}
          className="w-10 h-10 rounded-lg flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/5 transition-all group relative"
        >
          <Sun className="w-5 h-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute w-5 h-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </button>

        <Avatar className="w-10 h-10 border-2 border-zinc-200 dark:border-white/10 cursor-pointer hover:border-zinc-300 dark:hover:border-white/30 transition-all">
          <AvatarFallback className="bg-zinc-200 dark:bg-zinc-800 text-xs font-bold">
            {user?.name?.[0] || "U"}
          </AvatarFallback>
        </Avatar>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b border-zinc-200 dark:border-white/5 backdrop-blur-xl bg-white/80 dark:bg-[#0A0A0A]/80 px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 dark:text-zinc-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search your applications..."
                className="w-full h-9 pl-10 pr-4 bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-lg text-sm placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-300 dark:focus:ring-white/20 focus:bg-zinc-50 dark:focus:bg-white/10 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className="text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
            >
              Sign Out
            </Button>
            <Button
              size="sm"
              onClick={() => setIsModalOpen(true)}
              className="bg-zinc-900 dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-white/90 font-medium shadow-lg h-9 px-4"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Application
            </Button>
          </div>
        </header>

        {/* Workspace */}
        <div className="flex-1 overflow-y-auto px-6 py-8 bg-zinc-50 dark:bg-[#0A0A0A]">
          {/* View Toggle */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl font-semibold tracking-tight">
              Your Applications ({apps.length})
            </h1>
            <div className="bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 p-1 rounded-lg flex">
              <button
                onClick={() => setView("board")}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                  view === "board"
                    ? "bg-zinc-100 dark:bg-white/10 text-zinc-900 dark:text-white"
                    : "text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
                }`}
              >
                Board
              </button>
              <button
                onClick={() => setView("list")}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                  view === "list"
                    ? "bg-zinc-100 dark:bg-white/10 text-zinc-900 dark:text-white"
                    : "text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
                }`}
              >
                List
              </button>
            </div>
          </div>

          {loading ? (
            <div className="h-64 flex items-center justify-center text-zinc-500 text-sm">
              Loading your applications...
            </div>
          ) : apps.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-zinc-500 text-sm opacity-60">
              <Target className="w-12 h-12 mb-4 opacity-20" />
              <p>No applications yet.</p>
              <p>Click "New Application" to get started.</p>
            </div>
          ) : (
            <>
              {view === "board" && (
                <DragDropContext onDragEnd={onDragEnd}>
                  <div className="grid grid-cols-4 gap-4 h-full overflow-x-auto min-w-[1000px]">
                    {STAGES.map((stage) => (
                      <KanbanColumn
                        key={stage.id}
                        stage={stage}
                        apps={getStageApps(stage.id)}
                        onDelete={handleDelete}
                      />
                    ))}
                  </div>
                </DragDropContext>
              )}

              {view === "list" && (
                <div className="bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-xl overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-zinc-50 dark:bg-white/5">
                      <tr className="border-b border-zinc-200 dark:border-white/10 text-left text-xs text-zinc-500 uppercase tracking-widest">
                        <th className="px-6 py-4 font-bold">Company</th>
                        <th className="px-6 py-4 font-bold">Role</th>
                        <th className="px-6 py-4 font-bold">Match Score</th>
                        <th className="px-6 py-4 font-bold">Status</th>
                        <th className="px-6 py-4 font-bold">Date</th>
                        <th className="px-6 py-4 font-bold text-right">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100 dark:divide-white/5">
                      {filteredApps.map((app) => (
                        <tr
                          key={app._id}
                          className="hover:bg-zinc-50 dark:hover:bg-white/5 transition-colors"
                        >
                          <td className="px-6 py-4 font-medium">
                            {app.company}
                          </td>
                          <td className="px-6 py-4 text-zinc-600 dark:text-zinc-400">
                            {app.jobTitle}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <Progress
                                value={app.matchScore}
                                className="w-16 h-1.5"
                              />
                              <span className="text-xs font-mono">
                                {app.matchScore}%
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <Badge
                              variant="outline"
                              className="text-xs uppercase tracking-wider bg-transparent"
                            >
                              {app.status}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 text-xs text-zinc-400">
                            {new Date(app.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => handleDelete(e, app._id)}
                              className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/10"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <NewAppModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleAppSuccess}
      />
    </div>
  );
}

function KanbanColumn({
  stage,
  apps,
  onDelete,
}: {
  stage: any;
  apps: any[];
  onDelete: (e: React.MouseEvent, id: string) => void;
}) {
  const StageIcon = stage.icon;
  return (
    <div className="flex flex-col h-full bg-zinc-100/50 dark:bg-zinc-900/30 rounded-xl p-3 border border-zinc-200/50 dark:border-white/5">
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-2">
          <StageIcon className="w-4 h-4 text-zinc-500" />
          <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500">
            {stage.label}
          </h3>
          <span className="bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-[10px] font-bold px-2 py-0.5 rounded-full">
            {apps.length}
          </span>
        </div>
      </div>

      <Droppable droppableId={stage.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 overflow-y-auto space-y-3 transition-colors rounded-lg ${
              snapshot.isDraggingOver
                ? "bg-zinc-200/50 dark:bg-zinc-800/30 ring-2 ring-inset ring-zinc-300 dark:ring-zinc-700"
                : ""
            }`}
            style={{ minHeight: "100px" }}
          >
            {apps.map((app, i) => (
              <Draggable key={app._id} draggableId={app._id} index={i}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={`p-4 bg-white dark:bg-[#0F0F0F] border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-sm cursor-grab active:cursor-grabbing group transition-all relative
                        ${
                          snapshot.isDragging
                            ? "shadow-xl ring-2 ring-zinc-900 dark:ring-white rotate-2 scale-105 z-50"
                            : "hover:ring-1 hover:ring-zinc-900/10 dark:hover:ring-white/20"
                        }
                    `}
                    style={{ ...provided.draggableProps.style }}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-zinc-900 dark:text-white truncate">
                        {app.company}
                      </h4>
                      <span className="text-[10px] text-zinc-400">
                        {new Date(app.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4 line-clamp-1">
                      {app.jobTitle}
                    </p>

                    <div className="flex items-center justify-between">
                      <Badge
                        variant="secondary"
                        className="text-[10px] h-5 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border-0"
                      >
                        {app.matchScore}% Match
                      </Badge>
                    </div>

                    <button
                      onClick={(e) => onDelete(e, app._id)}
                      className="absolute bottom-3 right-3 p-1.5 rounded-md text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}
