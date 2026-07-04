import { useEffect, useMemo, useState, useRef } from 'react';
import Header from '../components/Header';
import TaskTabs from '../components/TaskTabs';
import { getuserTasks } from '../services/userService';
import type { Task } from '../types/usertask';
import { useUser } from '../contexts/UserContext';
import TaskCard from '../components/TaskCard';
import ProfileCardProps from '../components/ProfileCardProps';
import DailyRewardCard from '../components/DailyRewardCard';
import TelegramJoinVerify from '../components/TelegramJoinVerify';
import { useGlobalConfig } from '../contexts/GlobalConfigContext';
import toast from 'react-hot-toast';
import { claimDailyReward } from '../services/userService';

export default function Earn() {
  const { user, loading, loadUser } = useUser();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [active, setActive] = useState<'all' | 'social' | 'website' | 'ads'>('all');
  const { config } = useGlobalConfig();
  const [claimLoading, setClaimLoading] = useState(false);
  const [refreshLoading, setRefreshLoading] = useState(false);
  const [verificationTask, setVerificationTask] = useState<Task | null>(null);
  const firstLoad = useRef(false);

  useEffect(() => {
    if (!user?.telegramId) return;
    if (firstLoad.current) return;
    firstLoad.current = true;
    loadTasks();
  }, [user?.telegramId]);


  async function loadTasks() {
    try {
      const res = await getuserTasks(user!.telegramId);
      setTasks(res.tasks);
    } catch (err) {
      console.log(err);
    }
  }

  const filteredTasks = useMemo(() => {
    if (active === 'all') return tasks;

    if (active === 'social') {
      return tasks.filter(
        (task) => task.type === 'telegram_channel' || task.type === 'telegram_group' || task.type === 'telegram_bot',
      );
    }

    if (active === 'ads') {
      return tasks.filter((task) => task.type === 'rewarded_popup');
    }

    return tasks;
  }, [tasks, active]);

  // console.log("test: ",filteredTasks)

  if (loading) {
    return <div className="p-4 text-white">Loading...</div>;
  }

  // const [tasksCompleted, setTasksCompleted] = useState(1);

  const handleClaim = async () => {
    if (claimLoading) return;
    setClaimLoading(true);
    const url = config?.daily?.daily_link || 'https://google.com';
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.openLink(url);
    } else {
      window.open(url, '_blank');
    }
    setTimeout(async () => {
      try {
        const res = await claimDailyReward(user.telegramId);
        if (res.success) {
          toast.success('Reward Claimed!');
          await loadUser();
        }
      } catch (err: any) {
        toast.error(err.response?.data?.message || 'Claim failed');
      } finally {
        setClaimLoading(false);
      }
    }, 60000); // 1 minute
  };

  const handleRefresh = async () => {
    setRefreshLoading(true);
    try {
      await loadUser();
      await loadTasks();
    } finally {
      setRefreshLoading(false);
    }
  };

  return (
    <div>
      <Header title="Mini" subtitle="Task" onRefresh={handleRefresh} showRefresh loading={refreshLoading} />

      <div className="pt-20 pb-24 overflow-y-auto h-screen px-3  no-scrollbar ">
        {/* <User_Profile_Card user={user} /> */}
        <ProfileCardProps user={user} />

        <div className="mt-4">
          {/* <RewardCard /> */}

          <DailyRewardCard
            tasksCompleted={user?.totaltaskscompleted ?? 0}
            totalTasks={config?.daily?.daily_task_target ?? 0}
            rewardAmount={config?.daily?.daily_checkin ?? 0}
            loading={claimLoading}
            onClaim={handleClaim}
          />
        </div>

        <TaskTabs active={active} setActive={setActive} />

        {config?.adSettings?.enabled ? (
          <div className="mt-4 space-y-3">
            {filteredTasks.length === 0 ? (
              <div className="text-center py-10 text-slate-400">No Tasks Available</div>
            ) : (
              filteredTasks.map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onReload={loadTasks}
                  onOpenVerification={(selectedTask) => setVerificationTask(selectedTask)}
                />
              ))
            )}
          </div>
        ) : (
          <div className="mt-6 rounded-xl border border-[#2A3146] bg-[#111827] p-5 text-center">
            <h3 className="text-white text-h3">Tasks are temporarily disabled</h3>
            <p className="mt-2 text-sm text-slate-400">Please check back later.</p>
          </div>
        )}
      </div>

      {verificationTask && (
        <div className="fixed inset-0 z-50 bg-[#050B17]/90 backdrop-blur-sm">
          <TelegramJoinVerify
            taskId={verificationTask._id}
            taskUrl={verificationTask.url}
            reward={verificationTask.reward}
            onClose={() => setVerificationTask(null)}
          />
        </div>
      )}
    </div>
  );
}
