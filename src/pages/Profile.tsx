import Header from "../components/Header";
import {
  BadgeCheck,
  Copy,
  Gift,
  IdCard,
  Medal,
  ShieldCheck,
  TicketPercent,
  Users,
  Wallet,
} from "lucide-react";
import { useState } from "react";
import { useUser } from "../contexts/UserContext";
import { applyPromo } from "../services/userService";
import toast from "react-hot-toast";

const DEFAULT_PROFILE_PHOTO = `${import.meta.env.BASE_URL}astronaut.png`;

function getErrorMessage(error: unknown) {
  const apiError = error as {
    response?: { data?: { message?: string } };
    message?: string;
  };

  return apiError.response?.data?.message || apiError.message || "Something went wrong";
}

export default function Profile() {
  const { user, setUser } = useUser();
  const [loading, setLoading] = useState(false);
  const [promoCode, setPromoCode] = useState("");

  const balance = Number(user?.balance || 0);
  const adCredit = Number(user?.adcredit || 0);
  const referralIncome = Number(user?.totalreferralsincome || 0);
  const status = user?.accountStatus || "inactive";
  const statusClass =
    status === "active"
      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
      : status === "banned"
        ? "border-red-500/30 bg-red-500/10 text-red-300"
        : "border-amber-500/30 bg-amber-500/10 text-amber-300";

  const copyUserId = () => {
    navigator.clipboard.writeText(String(user?.telegramId || "123456789"));
    toast.success("User ID Copied!", {
      duration: 2000,
      position: "top-center",
    });
  };

  const applyPromo2 = async () => {
    if (!promoCode.trim()) {
      toast.error("Please enter a promo code", {
        duration: 2000,
        position: "top-center",
      });
      return;
    }

    try {
      setLoading(true);
      const result = await applyPromo(user?.telegramId || 0, promoCode.trim());

      toast.success(result.message, {
        duration: 2000,
        position: "top-center",
      });
      setUser({
        ...user,
        balance: result.balance,
      });
      setPromoCode("");
    } catch (error) {
      toast.error(getErrorMessage(error), {
        duration: 2000,
        position: "top-center",
      });
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    {
      label: "Tasks Completed",
      value: user?.totaltaskscompleted || 0,
      icon: Medal,
      accent: "text-cyan-300",
    },
    {
      label: "Referrals",
      value: user?.referrals || 0,
      icon: Users,
      accent: "text-violet-300",
    },
    {
      label: "Referral Income",
      value: `$${referralIncome.toFixed(3)}`,
      icon: Gift,
      accent: "text-emerald-300",
    },
    {
      label: "Ad Credit",
      value: `$${adCredit.toFixed(3)}`,
      icon: Wallet,
      accent: "text-amber-300",
    },
  ];

  return (
    <div>
      <Header title="Profile" subtitle="User" />
      <div className="h-dvh overflow-y-auto px-2.5 pb-20 pt-[72px] no-scrollbar sm:px-3">
        <section className="overflow-hidden rounded-2xl border border-slate-800 bg-[#07111F] shadow-xl">
          <div className="bg-gradient-to-br from-[#18223A] via-[#0B1728] to-[#07111F] p-3 sm:p-4">
            <div className="flex items-start justify-between gap-2">
              <div className="flex min-w-0 items-center gap-2.5">
                <div className="relative h-14 w-14 shrink-0 rounded-2xl border border-white/10 bg-slate-900 p-1 shadow-lg sm:h-16 sm:w-16">
                  <img
                    src={user?.photoUrl || DEFAULT_PROFILE_PHOTO}
                    alt="Profile"
                    className="h-full w-full rounded-xl object-cover"
                    onError={(event) => {
                      if (event.currentTarget.src !== DEFAULT_PROFILE_PHOTO) {
                        event.currentTarget.src = DEFAULT_PROFILE_PHOTO;
                      }
                    }}
                  />
                  <div className="absolute -bottom-1 -right-1 rounded-full border border-[#07111F] bg-emerald-500 p-1">
                    <BadgeCheck size={14} className="text-white" />
                  </div>
                </div>

                <div className="min-w-0 text-left">
                  <h2 className="truncate text-[20px] font-semibold leading-7 text-white sm:text-h2">
                    {user?.Name || "Mini Task User"}
                  </h2>
                  <p className="truncate text-[13px] text-slate-400">
                    @{user?.username || "unknown"}
                  </p>
                  <span
                    className={`mt-1.5 inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold capitalize ${statusClass}`}
                  >
                    <ShieldCheck size={13} /> {status}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-3 rounded-2xl border border-cyan-400/10 bg-cyan-400/10 p-3 sm:p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="text-left">
                  <p className="text-[13px] text-cyan-100/70">Available Balance</p>
                  <h1 className="mt-0.5 text-[28px] font-bold leading-9 text-white">
                    ${balance.toFixed(3)}
                  </h1>
                </div>
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-cyan-400/15">
                  <Wallet size={24} className="text-cyan-300" />
                </div>
              </div>
            </div>
          </div>

          <div className="p-3 sm:p-4">
            <div className="rounded-xl border border-slate-800 bg-[#0B1728] p-3">
              <div className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-2 text-left">
                  <IdCard size={18} className="shrink-0 text-slate-400" />
                  <div className="min-w-0">
                    <p className="text-xs text-slate-500">Telegram ID</p>
                    <p className="truncate text-sm font-semibold text-slate-200">
                      {user?.telegramId || "123456789"}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={copyUserId}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-700 bg-slate-900 text-slate-300 active:scale-95"
                  aria-label="Copy user ID"
                >
                  <Copy size={17} />
                </button>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2.5">
              {stats.map((item) => (
                <div
                  key={item.label}
                  className="flex min-w-0 rounded-xl border border-slate-800 bg-[#0B1728] p-2.5 text-left"
                >
                  <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-xl bg-white/5">
                    <item.icon size={18} className={item.accent} />
                  </div>
                 <div className="ms-3">
                   <p className="truncate text-[11px] leading-4 text-slate-400">
                    {item.label}
                  </p>
                  <h2 className="mt-0.5 truncate text-[18px] font-semibold leading-6 text-white">
                    {item.value}
                  </h2>
                   </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-3 rounded-2xl border border-slate-800 bg-[#07111F] p-3 sm:p-4">
          <div className="mb-2.5 flex items-center gap-2">
            <TicketPercent size={19} className="text-violet-300" />
            <h3 className="text-h3 !text-white">Promo Code</h3>
          </div>

          <div className="flex w-full items-center gap-2">
            <input
              type="text"
              placeholder="Enter promo code"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
              className="h-10 min-w-0 flex-1 rounded-xl border border-slate-800 bg-[#0B1728] px-3 text-sm font-semibold uppercase tracking-wide text-white placeholder:font-normal placeholder:normal-case placeholder:tracking-normal placeholder:text-slate-500 outline-none focus:border-violet-500"
            />

            <button
              type="button"
              onClick={applyPromo2}
              disabled={loading}
              className="h-10 w-20 shrink-0 rounded-xl bg-gradient-to-r from-violet-600 to-purple-500 text-sm font-semibold text-white shadow-lg shadow-purple-950/30 active:scale-95 disabled:opacity-50 sm:w-24"
            >
              {loading ? "..." : "Apply"}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
