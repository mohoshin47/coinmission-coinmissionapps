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
    <div className="fixed top-0 left-1/2 -translate-x-1/2 z-50 w-full max-w-[720px] h-16 bg-[#081425] border-b border-gray-700">
      
      <div className="h-16 px-4 flex items-center justify-between bg-[#081425]/90">
        <h1 className="text-h1 text-white">
          {title} <span className="text-purple-500">{subtitle}</span>
        </h1>

        <div className="flex items-center gap-2">
          {showRefresh && (
            <button onClick={onRefresh} className="p-2 rounded-full bg-white/10 hover:bg-white/20">
              <RefreshCw className="w-5 h-5 text-white" />
            </button>
          )}

          {/* Telegram Chat */}
          <button
            onClick={handleContactClick}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 transition"
            aria-label="Telegram chat"
          >
            <MessageCircle className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
