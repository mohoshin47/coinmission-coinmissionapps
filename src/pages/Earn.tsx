import { useEffect, useMemo, useState, useRef } from 'react';
import Header from '../components/Header';
import TaskTabs from '../components/TaskTabs';
import type { Task } from '../types/usertask';
import { useUser } from '../contexts/UserContext';
import TaskCard from '../components/TaskCard';
import ProfileCardProps from '../components/ProfileCardProps';
import DailyRewardCard from '../components/DailyRewardCard';
import TelegramJoinVerify from '../components/TelegramJoinVerify';
import WebsiteVisitVerify from '../components/WebsiteVisitVerify';
import { useGlobalConfig } from '../contexts/GlobalConfigContext';
import { checkCountry, getuserTasks } from '../services/userService';


export default function Earn() {
  const { user, loading, loadUser } = useUser();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [active, setActive] = useState<'all' | 'social' | 'website' | 'ads'>('all');
  const { config } = useGlobalConfig();
  const [claimLoading] = useState(false);
  const [refreshLoading, setRefreshLoading] = useState(false);
  const [verificationTask, setVerificationTask] = useState<Task | null>(null);
  const [countryBlocked, setCountryBlocked] = useState(false);
  const [countryMessage, setCountryMessage] = useState('');
  const firstLoad = useRef(false);

  const isVipEligible =
    user?.vipuser === true ||
    (user?.totalAdsClicked ?? 0) >= 5 ||
    (user?.totalAdsShow ?? 0) >= 10;

  useEffect(() => {
  if (!user?.telegramId || !config) return;
  if (firstLoad.current) return;

  firstLoad.current = true;

  initializeEarn();
}, [user?.telegramId, config]);

  async function initializeEarn() {
    try {
      // VPN/Country check only when enabled
      if (config?.vpnalllowed) {
        const result = await checkCountry();

        if (!result.allow) {
          setCountryBlocked(true);
          setCountryMessage(result.message);
          return;
        }
      }

      setCountryBlocked(false);
      await loadTasks();

    

    } catch (err) {
      console.log(err);
    }
  }

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
      return tasks.filter((task) => task.type === 'rewarded_popup' || task.type === 'watch_ads');
    }

    return tasks.filter(
      (task) =>
        task.type === 'website_visitor' ||
        task.type === 'custom_url' ||
        task.type === 'youtube_video' ||
        task.type === 'facebook_video',
    );
  }, [tasks, active]);

  // console.log("test: ",filteredTasks)

  if (loading) {
    return <div className="p-4 text-white">Loading...</div>;
  }

  // const [tasksCompleted, setTasksCompleted] = useState(1);


  const handleRefresh = async () => {
  setRefreshLoading(true);

  try {
    await loadUser();
    await initializeEarn();
  } finally {
    setRefreshLoading(false);
  }
};

  return (
    <div className="min-h-[100svh] bg-[#050B17]">
      <Header title="Mini" subtitle="Task" onRefresh={handleRefresh} showRefresh loading={refreshLoading} />

      <div className="h-[100svh] overflow-y-auto overflow-x-auto no-scrollbar px-3 pb-24 pt-[76px]">
        {/* <User_Profile_Card user={user} /> */}
        <ProfileCardProps user={user} />

        {isVipEligible ? (
          <div className="mt-3">
            {/* <RewardCard /> */}

            <DailyRewardCard
              user={user}
              rewardAmount={config?.daily?.daily_checkin ?? 0}
              totalTasks={config?.daily?.daily_task_target ?? 0}
              loading={claimLoading}
              countryBlocked={countryBlocked}
            />
          </div>
        ) : null}

        <TaskTabs active={active} setActive={setActive} />

        {countryBlocked ? (
          <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-5 text-center">
            <div className="text-lg font-bold text-red-400">Task Access Restricted</div>

            <p className="mt-2 text-sm text-slate-300">{countryMessage}</p>

            <p className="mt-3 text-xs text-slate-500">
              Please connect to a VPN and choose a supported country, then reopen the Mini App.
            </p>
          </div>
        ) : config?.adSettings?.enabled? (
          <div className="mt-3 space-y-2.5">
            {filteredTasks.length === 0 ? (
              <div className="rounded-lg border border-[#1D2940] bg-[#091322] px-4 py-8 text-center text-sm text-slate-400">
                No Tasks Available
              </div>
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
          <div className="mt-4 rounded-lg border border-[#2A3146] bg-[#111827] p-4 text-center">
            <h3 className="text-white text-h3">Tasks are temporarily disabled</h3>
            <p className="mt-2 text-sm text-slate-400">Please check back later.</p>
          </div>
        )}
      </div>

      {verificationTask && (
        <div className="fixed inset-0 z-50 bg-[#050B17]/90 backdrop-blur-sm">
          {verificationTask.type === 'telegram_channel' ? (
            <TelegramJoinVerify
              taskId={verificationTask._id}
              taskUrl={verificationTask.url}
              reward={verificationTask.reward}
              onClose={() => setVerificationTask(null)}
            />
          ) : (
            <WebsiteVisitVerify task={verificationTask} onClose={() => setVerificationTask(null)} />
          )}
        </div>
      )}
    </div>
  );
}
