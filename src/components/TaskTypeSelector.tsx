import { Check } from "lucide-react";

interface TaskTypeSelectorProps {
  active: string;
  setActive: (type: string) => void;
}

export default function TaskTypeSelector({ active, setActive }: TaskTypeSelectorProps) {
  const taskTypes = [
    { id: "telegram_channel", label: "Telegram Channel", text: "User join your channel" },
    { id: "telegram_bot", label: "Telegram Bot", text: "User join your Bot" },
    { id: "youtube_video", label: "Youtube Video", text: "User view your video" },
    { id: "facebook_video", label: "Facebook Video", text: "User view your video" },
    { id: "website_visitor", label: "Website Visitor", text: "User visit your website" },
    { id: "custom_url", label: "Custom URL", text: "User open your link" },
  ];

  return (
    <div className="w-full  mx-auto bg-[#111827] border border-[#2A3146] rounded-xl p-3 mt-1">
     
      <div className="flex flex-wrap gap-3">
        {taskTypes.map((task) => {
          const selected = active === task.id;
          return (
            <div key={task.id} className="flex flex-col items-start">
              <button
                onClick={() => setActive(task.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition
                  ${
                    selected
                      ? "bg-gradient-to-r from-violet-600 to-purple-500 text-white border border-purple-500"
                      : "bg-[#091322] text-slate-300 border border-[#1D2940]"
                  }`}
              >
                {task.label}
                {selected && <Check size={16} className="text-white" />}
              </button>

              {/* Show text when selected */}
              {selected && (
                <span className="text-gray-400 text-xs mt-1">{task.text}</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
