import { useMemo, useState } from "react";
import { Send, CheckCircle2, AlertCircle, X } from "lucide-react";
import { useUser } from "../contexts/UserContext";
import { completeTask } from "../services/userService";

interface TelegramJoinVerifyProps {
  taskId?: string;
  taskUrl?: string;
  reward?: number;
  onClose?: () => void;
}

export default function TelegramJoinVerify({ taskId, taskUrl, reward, onClose }: TelegramJoinVerifyProps) {
  const { user } = useUser();
  const [verified, setVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const channelName = useMemo(() => {
    if (!taskUrl) return "Telegram Channel";

    try {
      const url = new URL(taskUrl);
      return url.pathname.replace(/^\/+|\/+$/g, "") || "Telegram Channel";
    } catch {
      return taskUrl;
    }
  }, [taskUrl]);

  const handleVerify = async () => {
    if (!taskId || !user?.telegramId) {
      setError("Task or user information is missing.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await completeTask(taskId, Number(user.telegramId));

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
      <div className="w-full  rounded-2xl border border-slate-700 bg-[#131D2D] shadow-lg p-3 space-y-3 relative">
        {onClose && (
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full bg-slate-800 p-2 text-slate-300 hover:bg-slate-700"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        )}
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-cyan-500/15">
            <Send className="text-cyan-400" size={28} />
          </div>
          <h2 className="text-h2 text-white">Join Telegram Channel</h2>
        </div>

        {/* Description */}
        <p className="text-slate-400 text-sm">
          Join the channel below and get verified to receive your reward.
        </p>

        {/* Channel Info */}
        <div className="rounded-lg border border-slate-700 bg-[#111827] p-4 space-y-2">
          <p className="text-slate-400 text-sm">Channel:</p>
          <h3 className="text-white  text-h3">{channelName}</h3>
          <p className="text-cyan-400">Task ID: {taskId || "-"}</p>

          <div className="flex justify-between text-slate-300 text-sm mt-3">
            <span>Reward: <span className="text-white font-semibold">{reward?.toFixed(3) ?? "0.000"} USD</span></span>
            <span>Task: <span className="text-white font-semibold">Telegram Channel</span></span>
          </div>
        </div>

        {/* Join Button */}
        <a
          href={taskUrl || "https://t.me"}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full h-12 rounded-xl bg-gradient-to-r from-purple-600 to-violet-500 text-white font-semibold flex items-center justify-center gap-2 active:scale-95"
        >
          <Send size={20} /> Join Channel
        </a>

        {/* Verify Section */}
        <div className="flex flex-col items-center gap-3">
          {!verified ? (
            <>
              <button
                onClick={handleVerify}
                disabled={loading}
                className={`w-full h-12 rounded-xl ${
                  loading
                    ? "bg-gray-600 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700"
                } text-white font-semibold flex items-center justify-center gap-2 active:scale-95 transition`}
              >
                {loading ? "Verifying..." : "Verify Join"}
              </button>
              <p className="text-slate-400 text-sm flex items-center gap-1">
                <AlertCircle size={16} className="text-yellow-400" />
                Click verify after joining the channel
              </p>
              {error && (
                <p className="text-sm text-red-400 text-center">{error}</p>
              )}
            </>
          ) : (
            <div className="flex items-center gap-2 text-green-400 font-semibold">
              <CheckCircle2 size={20} />
              Verified! You have joined the channel.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
