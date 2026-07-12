import { Globe, ListFilter, Megaphone, Send } from 'lucide-react';

interface Props {
  active: 'all' | 'social' | 'website' | 'ads';
  setActive: (tab: 'all' | 'social' | 'website' | 'ads') => void;
}

export default function TaskTabs({ active, setActive }: Props) {
  const tabs = [
    { id: 'all', label: 'All', icon: ListFilter },
    { id: 'social', label: 'Social', icon: Send },
    { id: 'website', label: 'Website', icon: Globe },
    { id: 'ads', label: 'Ads', icon: Megaphone },
  ];

  return (
    <div className="mt-3 w-full max-w-full overflow-x-auto pb-1 no-scrollbar scroll-smooth touch-pan-x">
      <div className="flex w-max min-w-full flex-nowrap gap-1.5">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const selected = active === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => setActive(tab.id as any)}
            className={`flex h-7 shrink-0 snap-start items-center justify-center gap-1.5 whitespace-nowrap rounded-lg border px-2 text-xs font-medium transition-all
              ${
                selected
                  ? 'border-purple-500 bg-gradient-to-r from-violet-600 to-purple-500 text-white'
                  : 'border-[#1D2940] bg-[#091322] text-slate-300'
              }`}
          >
            {Icon && <Icon size={14} className="shrink-0" />}
            <span>{tab.label}</span>
          </button>
        );
      })}
      </div>
    </div>
  );
}
