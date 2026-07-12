import Header from "../components/Header";
import ReferralCard from "../components/ReferralCard";

// Referral.tsx
export default function Referral() {
  return (
    <div>
      <Header title="Referral" subtitle="Users" />
      
      <div className="h-dvh overflow-y-auto px-2.5 pb-20 pt-[72px] no-scrollbar sm:px-3">
        <ReferralCard />
      </div>
    </div>
  );
}
