import Header from '../components/Header';
import TaskTypeSelector from '../components/TaskTypeSelector';
import { Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { useMemo, useState, useEffect } from 'react';
import { createTask, deleteTask, getCreatedHistory, pauseTask } from '../services/userService';
import { useUser } from '../contexts/UserContext';
import CreatedTaskCard from '../components/CreatedTaskCard';
import type { CreatedTask } from '../components/CreatedTaskCard';
import { useGlobalConfig } from '../contexts/GlobalConfigContext';

export default function Create() {
  const [active, setActive] = useState('telegram_channel');
  const [url, setUrl] = useState('');
  const [reward, setReward] = useState('');
  const [limit, setLimit] = useState('');
  const { user } = useUser();
  const [tasks, setTasks] = useState<CreatedTask[]>([]);
  const { config } = useGlobalConfig();

  useEffect(() => {
    if (user?.telegramId) {
      loadTasks();
    }
  }, [user?.telegramId]);

  async function loadTasks() {
    try {
      const res = await getCreatedHistory(user.telegramId);

      setTasks(res.tasks);
    } catch (err) {
      console.log(err);
    }
  }

  const totalBudget = useMemo(() => {
    if (!reward || !limit) return 0;

    return Number(reward) * Number(limit);
  }, [reward, limit]);

  // Task type mapping
  const taskConfig: Record<string, { label: string; placeholder: string }> = {
    telegram_channel: {
      label: 'Channel Link',
      placeholder: 'https://t.me/yourchannel',
    },
    telegram_bot: {
      label: 'Bot Link',
      placeholder: 'https://t.me/yourbot',
    },
    youtube_video: {
      label: 'Video Link',
      placeholder: 'https://youtube.com/watch?v=xxxx',
    },
    facebook_video: {
      label: 'Video Link',
      placeholder: 'https://facebook.com/video/xxxx',
    },
    website_visitor: {
      label: 'Website URL',
      placeholder: 'https://example.com',
    },
    custom_url: {
      label: 'Custom URL',
      placeholder: 'https://yourlink.com',
    },
  };

  const currentConfig = taskConfig[active];

  const handleCopyBotName = async () => {
    const botName = config?.bot_link;

    if (!botName) return;

    const valueToCopy = botName.startsWith('@') ? botName : `@${botName}`;

    try {
      await navigator.clipboard.writeText(valueToCopy);
      toast.success('Copied');
    } catch {
      toast.error('Failed to copy');
    }
  };

  const validate = () => {
    // Task Type
    if (!active) {
      toast.error('Please select a task type.');
      return false;
    }

    // URL
    if (!url.trim()) {
      toast.error('Please enter the task URL.');
      return false;
    }

    try {
      new URL(url);
    } catch {
      toast.error('Please enter a valid URL.');
      return false;
    }

    // Telegram Task
    if (active === 'telegram_channel' || active === 'telegram_bot') {
      if (!url.startsWith('https://t.me/')) {
        toast.error('Please enter a valid Telegram link.');
        return false;
      }
    }

    // Youtube
    if (active === 'youtube_video') {
      if (!url.includes('youtube.com') && !url.includes('youtu.be')) {
        toast.error('Please enter a valid YouTube link.');
        return false;
      }
    }

    // Facebook
    if (active === 'facebook_video') {
      if (!url.includes('facebook.com')) {
        toast.error('Please enter a valid Facebook link.');
        return false;
      }
    }

    // Reward
    const rewardValue = Number(reward);

    if (isNaN(rewardValue) || rewardValue < config?.creator.minimumreward) {
      toast.error(`Minimum reward is ${config?.creator.minimumreward} USD.`);
      return false;
    }

    // Task Limit
    const limitValue = Number(limit);

    if (isNaN(limitValue) || limitValue < config?.creator.minimumtask) {
      toast.error(`Minimum task limit is ${config?.creator.minimumtask} users.`);
      return false;
    }

    const availableBudget = Number(user?.balance ?? 0) + Number(user?.adcredit ?? 0);
    const requiredBudget = rewardValue * limitValue;

    if (requiredBudget > availableBudget) {
      toast.error(
        `Insufficient budget. Required ${requiredBudget.toFixed(3)} USD, available ${availableBudget.toFixed(3)} USD.`,
      );
      return false;
    }

    return true;
  };

  const handleCreateTask = async () => {
    if (!validate()) return;

    try {
      const res = await createTask({
        type: active,
        url,
        reward: Number(reward),
        createdBy: user?.telegramId,
        maxComplete: Number(limit),
      });

      toast.success(res.message || 'Task created successfully');
      setUrl('');
      setReward('');
      setLimit('');
      await loadTasks();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create task');
    }
  };

  const handlePauseResume = async (taskId: string, shouldPause: boolean) => {
    if (!user?.telegramId) {
      toast.error('User not found.');
      return;
    }

    try {
      const res = await pauseTask(taskId, user.telegramId, !shouldPause);
      toast.success(res.message || 'Task updated successfully');
      setTasks((prev) =>
        prev.map((task) =>
          task._id === taskId ? { ...task, active: !shouldPause, status: shouldPause ? 'approved' : 'paused' } : task,
        ),
      );
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update task');
    }
  };

  const handleDelete = async (taskId: string) => {
    if (!user?.telegramId) {
      toast.error('User not found.');
      return;
    }

    try {
      const res = await deleteTask(taskId, user.telegramId);
      toast.success(res.message || 'Task deleted successfully');
      setTasks((prev) => prev.filter((task) => task._id !== taskId));
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to delete task');
    }
  };

  return (
    <div className="h-dvh overflow-y-auto bg-[#050B17] px-2.5 pb-24 pt-[72px] no-scrollbar sm:px-3">
      {/* Task Type */}
      <Header title="Create" subtitle="Task" />
      <section>
        <div className="flex items-start">
          <h2 className="text-[18px] font-semibold leading-6 !text-white sm:text-h2">1. Select Task Type</h2>
        </div>

        <TaskTypeSelector active={active} setActive={setActive} />

        {/* Task Details */}
        <div>
          <h2 className="!mb-1 !mt-4 text-[18px] font-semibold leading-6 !text-white sm:text-h2">2. Task Details</h2>

          <div className="space-y-2.5 rounded-xl border border-slate-800 bg-[#0B1320] p-3 sm:space-y-3">
            {/* Dynamic Input */}
            <div className="flex flex-col items-start">
              <label className="mb-1 block text-sm text-gray-300">{currentConfig.label}</label>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder={currentConfig.placeholder}
                className="h-10 w-full rounded-lg border border-slate-700 bg-[#111827] px-3 text-sm text-white placeholder:text-slate-500 sm:px-3.5"
              />
              {active === 'telegram_channel' && (
                <button
                  type="button"
                  onClick={handleCopyBotName}
                  className="mt-2 w-full rounded-lg border border-amber-500/20 bg-amber-500/10 px-3 py-1.5 text-left !text-xs leading-5 text-amber-200/80"
                >
                  Tap to copy{' '}
                  {config?.bot_link ? (config.bot_link.startsWith('@') ? config.bot_link : `@${config.bot_link}`) : ''}{' '}
                  and make sure it is added as an administrator to this channel before creating the task.
                </button>
              )}
            </div>

            {/* Reward + Max Users */}
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              <div>
                <label className="mb-1 block text-xs leading-5 text-gray-300 sm:text-sm">Reward/User (USD)</label>
                <input
                  type="number"
                  value={reward}
                  onChange={(e) => setReward(e.target.value)}
                  placeholder="0.01 USD"
                  className="h-10 w-full rounded-lg border border-slate-700 bg-[#111827] px-3 text-sm text-white placeholder:text-slate-500 sm:px-3.5"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs leading-5 text-gray-300 sm:text-sm">Task Limit</label>
                <input
                  type="number"
                  value={limit}
                  onChange={(e) => setLimit(e.target.value)}
                  placeholder="200"
                  className="h-10 w-full rounded-lg border border-slate-700 bg-[#111827] px-3 text-sm text-white placeholder:text-slate-500 sm:px-3.5"
                />
              </div>
            </div>

            {/* Total Cost */}
            <div className="flex items-center justify-between gap-3 rounded-lg border border-slate-700 bg-[#111827] px-3 py-2.5">
              <span className="shrink-0 text-sm text-gray-400">Total Budget</span>
              <span className="min-w-0 break-words text-right text-[18px] font-bold leading-6 text-purple-500 sm:text-[20px]">
                {totalBudget.toFixed(3)} USD
              </span>
            </div>

            {/* Create Button */}
            <button
              onClick={handleCreateTask}
              className="flex h-11 w-full items-center justify-center gap-1.5 rounded-lg bg-gradient-to-r from-purple-800 to-violet-700 text-xs font-medium text-white transition-transform duration-150 active:scale-95"
            >
              <Plus size={16} />
              Create Task
            </button>
          </div>
        </div>
      </section>

      <section className="mt-4">
        <div className="mb-1 flex items-start">
          <h2 className="text-[18px] font-semibold leading-6 !text-white sm:text-h2">3. Last Created Tasks</h2>
        </div>

        {tasks.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-700 bg-[#0B1320] p-5 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-purple-600/20 text-purple-400">
              <Plus size={24} />
            </div>
            <h3 className="text-h3 text-white">No task history yet</h3>
            <p className="mt-2 text-sm text-slate-400">
              Create your first task and it will appear here instantly.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {tasks.map((task) => (
              <CreatedTaskCard
                key={task._id}
                task={task}
                onPause={(id) => handlePauseResume(id, true)}
                onResume={(id) => handlePauseResume(id, false)}
                onDelete={(id) => handleDelete(id)}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
