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
    active: 'border border-emerald-500/20 bg-emerald-500/10 text-emerald-300',
    paused: 'border border-amber-500/20 bg-amber-500/10 text-amber-300',
    pending: 'border border-orange-500/20 bg-orange-500/10 text-orange-300',
    rejected: 'border border-red-500/20 bg-red-500/10 text-red-300',
    completed: 'border border-slate-600 bg-slate-700/40 text-slate-300',
    approved: 'border border-emerald-500/20 bg-emerald-500/10 text-emerald-300',
    limit_reached: 'border border-violet-500/20 bg-violet-500/10 text-violet-300',
    deleted: 'border border-red-500/20 bg-red-500/10 text-red-300',
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
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-cyan-500/20 bg-cyan-500/10">
            <CheckCircle2 size={20} className="text-cyan-300" />
          </div>
        );

      case 'telegram_bot':
        return (
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-violet-500/20 bg-violet-500/10">
            <Bot size={20} className="text-violet-300" />
          </div>
        );

      case 'youtube_video':
        return (
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-red-500/20 bg-red-500/10">
            <PlayCircle size={20} className="text-red-300" />
          </div>
        );

      case 'facebook_video':
        return (
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-blue-500/20 bg-blue-500/10 font-bold text-blue-300">
            f
          </div>
        );

      case 'website_visitor':
        return (
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-emerald-500/20 bg-emerald-500/10">
            <Globe size={20} className="text-emerald-300" />
          </div>
        );

      default:
        return (
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-orange-500/20 bg-orange-500/10">
            <Link2 size={20} className="text-orange-300" />
          </div>
        );
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border border-[#2A3146] bg-[#111827]">
      {/* Header */}
      <div className="p-2.5 sm:p-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex min-w-0 gap-2.5">
            {icon()}

            <div className="min-w-0">
              <h2 className="truncate text-h3 text-white">{task.title}</h2>

              <p className="mt-1 break-all text-xs leading-5 text-slate-400 sm:text-sm">{task.url}</p>
            </div>
          </div>

          <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${badgeClass[displayStatus]}`}>
            {badgeText[displayStatus]}
          </span>
        </div>
      </div>

      <div className="border-t border-[#2A3146]" />

      {/* Stats */}

      <div className="grid grid-cols-3">
        <div className="min-w-0 border-r border-[#2A3146] p-2.5 sm:p-4">
          <p className="text-xs leading-4 text-slate-400 sm:text-sm">Reward/User</p>

          <h3 className="mt-1 break-words text-base font-semibold leading-6 text-white sm:text-[17px]">${task.reward.toFixed(3)}</h3>
        </div>

        <div className="min-w-0 border-r border-[#2A3146] p-2.5 sm:p-4">
          <p className="text-xs leading-4 text-slate-400 sm:text-sm">Used / Max</p>

          <h3 className="mt-1 break-words text-base font-semibold leading-6 text-white sm:text-[17px]">
            <span className="text-sm">{task.totalCompleted}</span>/{task.maxComplete}
          </h3>
        </div>

        <div className="min-w-0 p-2.5 sm:p-4">
          <p className="text-xs leading-4 text-slate-400 sm:text-sm">Total Cost</p>

          <h3 className="mt-1 break-words text-base font-semibold leading-6 text-white sm:text-[17px]">
            <span className="text-sm">{(task.totalCompleted * task.reward).toFixed(3)}</span>/
            {totalCost.toFixed(2)}
          </h3>
        </div>
      </div>

      <div className="border-t border-[#2A3146]" />

      {/* Buttons */}

      <div className="grid grid-cols-2">
        <div className="flex justify-center border-r border-[#2A3146] p-2.5 sm:p-3">
          {task.status === 'deleted' ? (
            <div className="flex h-8 w-full items-center justify-center rounded-lg border border-slate-700 bg-[#0B1728] text-xs font-medium text-slate-400">
              Deleted
            </div>
          ) : !task.active ? (
            <button
              onClick={() => onResume?.(task._id)}
              className="flex h-8 w-full items-center justify-center gap-1.5 rounded-lg border border-emerald-500/20 bg-emerald-500/10 text-xs font-medium text-emerald-300 sm:gap-2"
            >
              <Play size={14} />
              Resume
            </button>
          ) : (
            <button
              onClick={() => onPause?.(task._id)}
              className="flex h-8 w-full items-center justify-center gap-1.5 rounded-lg border border-amber-500/20 bg-amber-500/10 text-xs font-medium text-amber-300 sm:gap-2"
            >
              <Pause size={14} />
              Pause
            </button>
          )}
        </div>

        <div className="flex justify-center p-2.5 sm:p-3">
          <button
            onClick={() => onDelete?.(task._id)}
            disabled={task.status === 'deleted'}
            className={`flex h-8 w-full items-center justify-center gap-1.5 rounded-lg text-xs font-medium sm:gap-2 ${
              task.status === 'deleted'
                ? 'cursor-not-allowed border border-slate-700 bg-[#0B1728] text-slate-400'
                : 'border border-red-500/20 bg-red-500/10 text-red-300'
            }`}
          >
            <Trash2 size={14} />
            {task.status === 'deleted' ? 'Deleted' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}
