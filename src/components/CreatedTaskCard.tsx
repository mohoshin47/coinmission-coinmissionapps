import { Trash2, Pause, Play, PlayCircle, CheckCircle2, Globe, Bot, Link2 } from 'lucide-react';

export interface CreatedTask {
  _id: string;
  title: string;
  description: string;
  type: string;
  url: string;
  reward: number;
  maxComplete: number;
  totalCompleted: number;
  active: boolean;
  status: 'active' | 'paused' | 'pending' | 'rejected' | 'completed' | 'limit_reached' | 'approved' | 'deleted';
}

interface Props {
  task: CreatedTask;
  onPause?: (id: string) => void;
  onResume?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export default function CreatedTaskCard({ task, onPause, onResume, onDelete }: Props) {
  const totalCost = task.reward * task.maxComplete;

  const badgeClass = {
    active: 'bg-green-700 text-white',
    paused: 'bg-yellow-600 text-white',
    pending: 'bg-orange-600 text-white',
    rejected: 'bg-red-700 text-white',
    completed: 'bg-slate-600 text-white',
    approved: 'bg-green-700 text-white',
    limit_reached: 'bg-violet-700 text-white',
    deleted: 'bg-red-800 text-white',
  };

  const badgeText = {
    active: 'Active',
    paused: 'Paused',
    pending: 'Pending',
    rejected: 'Rejected',
    completed: 'Completed',
    approved: 'Approved',
    limit_reached: 'Limit Reached',
    deleted: 'Deleted',
  };

  const displayStatus = task.status === 'deleted' ? 'deleted' : task.active ? task.status : 'paused';

  const icon = () => {
    switch (task.type) {
      case 'telegram_channel':
        return (
          <div className="h-11 w-11 rounded-full bg-cyan-600 flex items-center justify-center">
            <CheckCircle2 size={22} className="text-white" />
          </div>
        );

      case 'telegram_bot':
        return (
          <div className="h-11 w-11 rounded-full bg-violet-600 flex items-center justify-center">
            <Bot size={22} className="text-white" />
          </div>
        );

      case 'youtube_video':
        return (
          <div className="h-11 w-11 rounded-full bg-red-600 flex items-center justify-center">
            <PlayCircle size={22} className="text-white" />
          </div>
        );

      case 'facebook_video':
        return (
          <div className="h-11 w-11 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white">
            f
          </div>
        );

      case 'website_visitor':
        return (
          <div className="h-11 w-11 rounded-full bg-green-600 flex items-center justify-center">
            <Globe size={22} className="text-white" />
          </div>
        );

      default:
        return (
          <div className="h-11 w-11 rounded-full bg-orange-500 flex items-center justify-center">
            <Link2 size={22} className="text-white" />
          </div>
        );
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-[#2A3146] bg-[#111827]">
      {/* Header */}
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex gap-3">
            {icon()}

            <div>
              <h2 className="text-white text-xl font-bold">{task.title}</h2>

              <p className="text-slate-400 text-sm mt-1 break-all">{task.url}</p>
            </div>
          </div>

          <span className={`rounded-full px-4 py-1 text-sm font-semibold ${badgeClass[displayStatus]}`}>
            {badgeText[displayStatus]}
          </span>
        </div>
      </div>

      <div className="border-t border-[#2A3146]" />

      {/* Stats */}

      <div className="grid grid-cols-3">
        <div className="border-r border-[#2A3146] p-4">
          <p className="text-slate-400 text-sm">Reward/User</p>

          <h3 className="mt-1 text-2xl font-bold text-white">${task.reward.toFixed(3)}</h3>
        </div>

        <div className="border-r border-[#2A3146] p-4">
          <p className="text-slate-400 text-sm">Used / Max</p>

          <h3 className="mt-1 text-2xl font-bold text-white">
            {task.totalCompleted}/{task.maxComplete}
          </h3>
        </div>

        <div className="p-4">
          <p className="text-slate-400 text-sm">Total Cost</p>

          <h3 className="mt-1 text-2xl font-bold text-white">
            {totalCost.toFixed(3)}
            <span className="ml-1 text-base font-normal">USD</span>
          </h3>
        </div>
      </div>

      <div className="border-t border-[#2A3146]" />

      {/* Buttons */}

      <div className="grid grid-cols-2">
        <div className="flex justify-center border-r border-[#2A3146] p-4">
          {task.status === 'deleted' ? (
            <div className="flex h-11 w-44 items-center justify-center rounded-xl bg-slate-700 font-semibold text-slate-300">
              Deleted
            </div>
          ) : !task.active ? (
            <button
              onClick={() => onResume?.(task._id)}
              className="flex h-11 w-44 items-center justify-center gap-2 rounded-xl bg-green-700 font-semibold text-white"
            >
              <Play size={18} />
              Resume
            </button>
          ) : (
            <button
              onClick={() => onPause?.(task._id)}
              className="flex h-11 w-44 items-center justify-center gap-2 rounded-xl bg-yellow-500 font-semibold text-black"
            >
              <Pause size={18} />
              Pause
            </button>
          )}
        </div>

        <div className="flex justify-center p-4">
          <button
            onClick={() => onDelete?.(task._id)}
            className="flex h-11 w-44 items-center justify-center gap-2 rounded-xl bg-red-700 font-semibold text-white"
          >
            <Trash2 size={18} />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
