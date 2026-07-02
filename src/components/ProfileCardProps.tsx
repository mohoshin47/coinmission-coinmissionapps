import type { User } from '../types/user';

interface UserProfileCardProps {
  user: User | null;
}

export default function ProfileCardProps({ user }: UserProfileCardProps) {
  if (!user) {
    return <div className="p-4">No user data available.</div>;
  }
  const profileImage = 'astronaut.png'; // Replace with actual image path or URL

  return (
    <div className="flex items-center justify-between bg-gray-900 border border-slate-700/40 text-white rounded-lg p-3 shadow-lg w-full  mx-auto">
      {/* Left side: Avatar + Info */}
      <div className="flex items-center gap-3">
        {/* Avatar placeholder */}
        <div className="w-12 h-12 rounded-full overflow-hidden">
          <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
        </div>

        <div className="flex flex-col items-start">
          <span className="text-h3">{user.Name}</span>
          <span className="text-gray-400 text-sm">@{user.username}</span>
        </div>
      </div>

      {/* Right side: Balance */}
      <div className="flex flex-col items-end">
        <span className="text-gray-400 text-sm">Balance</span>
        <div className="flex items-center gap-2">
          <span className="font-bold text-purple-400">${user.balance.toFixed(4)}</span>
          <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center overflow-hidden">
            <img
              src="https://cryptologos.cc/logos/tether-usdt-logo.png"
              alt="USDT"
              className="w-5 h-5"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
