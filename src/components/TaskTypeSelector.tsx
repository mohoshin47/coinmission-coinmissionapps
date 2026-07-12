import { Check } from 'lucide-react';

interface TaskTypeSelectorProps {
  active: string;
  setActive: (type: string) => void;
}

export default function TaskTypeSelector({ active, setActive }: TaskTypeSelectorProps) {
  const taskTypes = [
    { id: 'telegram_channel', label: 'Telegram Channel', text: 'User join your channel' },
    { id: 'telegram_bot', label: 'Telegram Bot', text: 'User join your Bot' },
    { id: 'youtube_video', label: 'Youtube Video', text: 'User view your video' },
    { id: 'facebook_video', label: 'Facebook Video', text: 'User view your video' },
    { id: 'website_visitor', label: 'Website Visitor', text: 'User visit your website' },
    { id: 'custom_url', label: 'Custom URL', text: 'User open your link' },
  ];

  const activeTask = taskTypes.find((task) => task.id === active);

  return (
    <div className="mx-auto mt-1 w-full rounded-xl border border-[#2A3146] bg-[#111827] p-2 sm:p-2.5">
      <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3 sm:gap-2">
        {taskTypes.map((task) => {
          const selected = active === task.id;
          return (
            <button
              key={task.id}
              onClick={() => setActive(task.id)}
              className={`flex h-8 min-w-0 items-center justify-center gap-1 rounded-lg border px-2 text-center text-[11px] font-medium leading-none transition sm:gap-1.5 sm:px-2.5 sm:text-xs
                  ${
                    selected
                      ? 'border-violet-500/70 bg-gradient-to-r from-violet-800 to-purple-700 text-white'
                      : 'border-[#1D2940] bg-[#091322] text-slate-300'
                  }`}
            >
              <span className="min-w-0 truncate">{task.label}</span>
              {selected && <Check size={12} className="shrink-0 text-white" />}
            </button>
          );
        })}
      </div>
      {activeTask && <p className="mt-1 text-xs leading-5 text-gray-400">{activeTask.text}</p>}
    </div>
  );
}
