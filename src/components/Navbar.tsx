import {
  Zap,
  Plus,
  Users,
  Wallet,
  User,
} from "lucide-react";

interface Props {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Navbar({
  activeTab,
  setActiveTab,
}: Props) {
  const navItems = [
    {
      id: "earn",
      icon: <Zap size={20} />,
      label: "Earn",
    },
    {
      id: "create",
      icon: <Plus size={20} />,
      label: "Create",
    },
    {
      id: "referral",
      icon: <Users size={20} />,
      label: "Referral",
    },
    {
      id: "withdraw",
      icon: <Wallet size={20} />,
      label: "Withdraw",
    },
    {
      id: "profile",
      icon: <User size={20} />,
      label: "Profile",
    },
  ];

  return (
    <div className="fixed bottom-0 left-1/2 w-full max-w-[720px] -translate-x-1/2 border-t border-gray-700 bg-[#081425]">
      
      <div className="grid grid-cols-5 px-1 py-2.5">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() =>
              setActiveTab(item.id)
            }
            className={`flex min-w-0 flex-col items-center gap-1 rounded-lg px-1 py-1 transition ${
              activeTab === item.id
                ? "text-purple-500"
                : "text-gray-400"
            }`}
          >
            {item.icon}
            <span className="max-w-full truncate text-[11px] leading-4">
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
