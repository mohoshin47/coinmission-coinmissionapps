import { useEffect, useState } from "react";
import { ExternalLink, CheckCircle2, AlertCircle, X } from "lucide-react";
import { useUser } from "../contexts/UserContext";
import { useGlobalConfig } from "../contexts/GlobalConfigContext";
import { completeTask } from "../services/userService";
import type { Task } from "../types/usertask";

interface WebsiteVisitVerifyProps {
  task?: Task | null;
  onClose?: () => void;
}

export default function WebsiteVisitVerify({ task, onClose }: WebsiteVisitVerifyProps) {
  const { user } = useUser();
  const { config } = useGlobalConfig();
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const visitDuration = Number(config?.adSettings?.visittimes ?? 60);
  const [timeLeft, setTimeLeft] = useState(visitDuration);
  const [timerStarted, setTimerStarted] = useState(false);
  const [endTime, setEndTime] = useState<number | null>(null);

  const taskTitle = task?.title || "Task";
  const taskDescription = task?.description || "Complete this task to earn rewards.";
  const taskUrl = task?.url;
  const taskId = task?._id || "-";
  const taskTypeLabel = (task?.type || "task").replace(/_/g, " ");

  useEffect(() => {
    if (!timerStarted || endTime === null) return;

    const timer = window.setInterval(() => {
      const remaining = Math.max(0, Math.ceil((endTime - Date.now()) / 1000));
      setTimeLeft(remaining);

      if (remaining <= 0) {
        window.clearInterval(timer);
      }
    }, 250);

    return () => window.clearInterval(timer);
  }, [timerStarted, endTime]);

  const handleVisit = () => {
    if (!taskUrl) return;

    setTimerStarted(true);
    setTimeLeft(visitDuration);
    setEndTime(Date.now() + visitDuration * 1000);

    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.openLink(taskUrl);
    } else {
      window.open(taskUrl, "_blank", "noopener,noreferrer");
    }
  };

  const handleVerify = async () => {
    if (!task?._id || !user?.telegramId) {
      setError("Task or user information is missing.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await completeTask(task._id, Number(user.telegramId));

      if (res?.success) {
        setVerified(true);
      } else {
        setError(res?.message || "Verification failed.");
      }
    } catch (err: any) {
      console.error("Verification failed:", err);
      setError(err?.response?.data?.message || "Verification failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1320] flex flex-col items-center justify-center px-3">
      <div className="w-full max-w-lg rounded-2xl border border-slate-700 bg-[#131D2D] shadow-lg p-4 sm:p-6 space-y-4 relative">
        {onClose && (
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full bg-slate-800 p-2 text-slate-300 hover:bg-slate-700"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        )}

        <div className="flex flex-col items-center gap-2 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-cyan-500/15">
            <ExternalLink className="text-cyan-400" size={28} />
          </div>
          <h2 className="text-2xl font-bold text-white">Complete Task</h2>
          <p className="text-slate-400 text-sm">Open the task link and verify once you finish.</p>
        </div>

        <div className="rounded-xl border border-slate-700 bg-[#111827] p-4 space-y-2 text-left">
          <div>
            <p className="text-slate-400 text-sm">Task:</p>
            <h3 className="text-white text-h3">{taskTitle}</h3>
          </div>
          <p className="text-slate-400 text-sm">{taskDescription}</p>
          <p className="text-cyan-400 text-sm break-all">Task ID: {taskId}</p>
          <div className="flex flex-wrap justify-between gap-2 pt-2 text-sm text-slate-300">
            <span>Reward: <span className="text-white font-semibold">{task?.reward?.toFixed(3) ?? "0.000"} USD</span></span>
            <span>Type: <span className="text-white font-semibold">{taskTypeLabel}</span></span>
          </div>
        </div>

        <div className="rounded-xl border border-slate-700 bg-[#111827] p-3 text-center text-sm text-slate-300">
          {timerStarted ? (
            <span>
              Time remaining: <span className="font-semibold text-white">{timeLeft}s</span>
            </span>
          ) : (
            <span>Open the task link to start the {visitDuration}-second timer.</span>
          )}
        </div>

        <button
          onClick={handleVisit}
          className="w-full h-12 rounded-xl bg-gradient-to-r from-purple-600 to-violet-500 text-white font-semibold flex items-center justify-center gap-2 active:scale-95"
        >
          <ExternalLink size={20} /> Open Task Link
        </button>

        <div className="flex flex-col items-center gap-3">
          {!verified ? (
            <>
              <button
                onClick={handleVerify}
                disabled={loading || timeLeft > 0}
                className={`w-full h-12 rounded-xl ${
                  loading || timeLeft > 0
                    ? "bg-gray-600 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700"
                } text-white font-semibold flex items-center justify-center gap-2 active:scale-95 transition`}
              >
                {loading ? "Verifying..." : timeLeft > 0 ? `Wait ${timeLeft}s` : "Verify Task"}
              </button>
              <p className="text-slate-400 text-sm flex items-center gap-1 text-center">
                <AlertCircle size={16} className="text-yellow-400" />
                {timeLeft > 0 ? `Please wait until the timer finishes before verifying.` : "You can verify now."}
              </p>
              {error && <p className="text-sm text-red-400 text-center">{error}</p>}
            </>
          ) : (
            <div className="flex items-center gap-2 text-green-400 font-semibold">
              <CheckCircle2 size={20} />
              Verified! Your task has been completed.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
