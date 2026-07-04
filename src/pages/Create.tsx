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
    <div>
      {/* Task Type */}
      <Header title="Create" subtitle="Task" />
      <div className="pt-20 pb-4 px-3 overflow-y-auto  no-scrollbar">
         <div className="flex items-start">
    <h2 className="text-h2 !text-white">
      1. Select Task Type
    </h2>
  </div>

        <TaskTypeSelector active={active} setActive={setActive} />

        {/* Task Details */}
        <div>
          <h2 className="!text-white text-h2 !mb-1 !mt-4">2. Task Details</h2>

          <div className="rounded-xl border border-slate-800 bg-[#0B1320] p-3 space-y-4">
            {/* Dynamic Input */}
            <div className="flex flex-col items-start">
              <label className="text-gray-300 text-sm block mb-1">{currentConfig.label}</label>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder={currentConfig.placeholder}
                className="w-full h-12 rounded-xl border border-slate-700 bg-[#111827] px-4 text-white"
              />
              {active === 'telegram_channel' && (
                <button
                  type="button"
                  onClick={handleCopyBotName}
                  className="mt-2 rounded-lg border border-amber-500/20 bg-amber-500/10 px-3 py-2 text-left text-sm text-amber-200/80"
                >
                  Tap to copy bot name {config?.bot_link ? (config.bot_link.startsWith('@') ? config.bot_link : `@${config.bot_link}`) : ''} and make sure it is added as an administrator to this channel before creating the task.
                </button>
              )}
            </div>

            {/* Reward + Max Users */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-gray-300 text-sm block mb-1">Reward per User (USD)</label>
                <input
                  type="number"
                  value={reward}
                  onChange={(e) => setReward(e.target.value)}
                  placeholder="0.01 USD"
                  className="w-full h-12 rounded-xl border border-slate-700 bg-[#111827] px-4 text-white"
                />
              </div>

              <div>
                <label className="text-gray-300 text-sm block mb-1">Task Limit</label>
                <input
                  type="number"
                  value={limit}
                  onChange={(e) => setLimit(e.target.value)}
                  placeholder="200"
                  className="w-full h-12 rounded-xl border border-slate-700 bg-[#111827] px-4 text-white"
                />
              </div>
            </div>

            {/* Total Cost */}
            <div className="rounded-xl bg-[#111827] border border-slate-700 p-3 flex justify-between items-center">
              <span className="text-gray-400">Total Budget</span>
              <span className="text-h1 text-purple-500">{totalBudget.toFixed(3)} USD</span>
            </div>

            {/* Create Button */}
            <button
              onClick={handleCreateTask}
              className="w-full h-12 rounded-xl bg-gradient-to-r from-purple-600 to-violet-500 text-white font-semibold flex items-center justify-center gap-2"
            >
              <Plus size={20} />
              Create Task
            </button>
          </div>
        </div>
      </div>

       <div className="mb-1 flex items-start ms-4">
    <h2 className="text-h2 !text-white">
      3. Last Created Tasks
    </h2>
  </div>

      <div className="mb-24">
        {tasks.length === 0 ? (
          <div className="mb-24 mx-4 rounded-2xl border border-dashed border-slate-700 bg-[#0B1320] p-6 text-center">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-purple-600/20 text-purple-400">
              <Plus size={24} />
            </div>
            <h3 className="text-lg font-semibold text-white">No task history yet</h3>
            <p className="mt-2 text-sm text-slate-400">
              Create your first task and it will appear here instantly.
            </p>
          </div>
        ) : (
          <div className="space-y-4 mx-4">
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
      </div>
    </div>
  );
}
