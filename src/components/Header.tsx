import { MessageCircle, RefreshCw } from 'lucide-react';
import { useGlobalConfig } from '../contexts/GlobalConfigContext';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  onRefresh?: () => void;
  showRefresh?: boolean;
  loading?: boolean;
}
export default function Header({ title, subtitle, onRefresh, showRefresh = false }: HeaderProps) {
  const { config } = useGlobalConfig();

  const handleContactClick = () => {
    const url = config?.contractus;
    if (url) {
      window.open(url, '_blank');
    }
  };

  return (
    <div className="fixed top-0 left-1/2 z-50 h-16 w-full max-w-[720px] -translate-x-1/2 border-b border-gray-700 bg-[#081425]">
      
      <div className="flex h-16 items-center justify-between gap-3 bg-[#081425]/90 px-3">
        <h1 className="min-w-0 truncate text-[26px] font-bold leading-8 text-white">
          {title} <span className="text-purple-500">{subtitle}</span>
        </h1>

        <div className="flex shrink-0 items-center gap-2">
          {showRefresh && (
            <button
              onClick={onRefresh}
              className="group flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-all duration-200 hover:bg-white/20 active:scale-95"
            >
              <RefreshCw className="w-5 h-5 text-white transition-transform duration-500 group-active:rotate-180 group-hover:rotate-45" />
            </button>
          )}

          {/* Telegram Chat */}
          <button
            onClick={handleContactClick}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/20 active:scale-95"
            aria-label="Telegram chat"
          >
            <MessageCircle className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
