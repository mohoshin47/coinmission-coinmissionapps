import Header from '../components/Header';
import { Clock3, Wallet, Coins, Clipboard, ArrowUpRight, Loader2, AlertCircle, AlertTriangle, CheckCircle } from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import { useGlobalConfig } from '../contexts/GlobalConfigContext';
import { toast } from 'react-hot-toast';
import { requestWithdraw } from '../services/userService';
import { useEffect, useState } from 'react';
import { getWithdrawHistory } from '../services/userService';
import { showRewardedPopup2 } from '../utils/monetagAds';

// Withdraw.tsx
export default function Withdraw() {
  const { user, setUser } = useUser();
  const { config } = useGlobalConfig();
  const [amount, setAmount] = useState('');
  const balance = user?.balance?.toFixed(3) || 0;

  const [walletAddress, setWalletAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const defaultWarning = 'Withdrawals to external wallets are irreversible. Make sure the wallet address is correct.';
  const [messageBox, setMessageBox] = useState<{ type: 'default' | 'error' | 'success'; text: string }>({
    type: 'default',
    text: defaultWarning,
  });

  useEffect(() => {
        // Show ad when app opens
        if (config?.adSettings?.enabled) {
          setTimeout(async () => {
            try {
              await showRewardedPopup2(config?.adSettings?.MonetagZoneId);
            } catch (err) {
              console.log(err);
            }
          }, 1000);
        }

    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const data = await getWithdrawHistory(user?.telegramId || 0);

      setHistory(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleWithdraw = async () => {
    try {
      if (!walletAddress.trim()) {
        toast.error('Enter wallet address');
        return;
      }

      if (!amount) {
        toast.error('Enter amount');
        return;
      }
      setLoading(true);
      const result = await requestWithdraw(user?.telegramId || 0, Number(amount), walletAddress);

      // on success, clear backend message and show toast success as before
      setMessageBox({ type: 'default', text: defaultWarning });
      toast.success(result.message);
      await loadHistory();
      setAmount('');
      setWalletAddress('');
      setUser({
        ...user!,
        balance: result.balance,
      });
    } catch (error: any) {
      const backendMessage = error?.response?.data?.message;
      if (backendMessage) {
        // show backend validation/error inside the message box (do not use toast)
        setMessageBox({ type: 'error', text: backendMessage });
      } else {
        // fallback to toast for unexpected errors without backend message
        toast.error(backendMessage || 'Withdraw failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const shortAddress = (address: string) => {
    if (!address) return '';
    return `${address.slice(0, 4)}....${address.slice(-4)}`;
  };

  return (
    <div>
      <Header title="Withdraw" subtitle="Funds" />
      <div className="h-dvh overflow-y-auto px-2.5 pb-20 pt-[72px] no-scrollbar sm:px-3">
        <div className="rounded-2xl border border-slate-800 bg-[#07111F] p-3 shadow-xl sm:p-4">
          {/* Compact Balance Card (exchange-style) */}
          <div className="rounded-xl bg-[#111827] border" style={{ borderColor: '#27344A' }}>
            <div className="p-3 sm:p-4 flex items-center justify-between gap-3">
              <div className="min-w-0 text-left">
                <p className="text-xs text-slate-400">Available Balance</p>

                <div className="flex items-baseline gap-3">
                  <h1 className="mt-0.5 text-[28px] sm:text-3xl md:text-4xl font-bold leading-8 text-white">
                    ${user?.balance?.toFixed(3) || 0}
                  </h1>
                  <span className="text-sm text-slate-400">≈ {user?.balance?.toFixed(3) || 0} USDT</span>
                </div>

                <p className="mt-1 text-xs text-slate-400">Minimum Withdraw • {config?.min_withdraw ?? 0.05} USDT</p>
              </div>

              <div className="flex items-center gap-3">
                <div className="inline-flex items-center gap-2 rounded-lg bg-[#0B1728] px-3 py-1 border" style={{ borderColor: '#27344A' }}>
                  <Coins size={16} className="text-yellow-300" />
                  <div className="text-sm font-semibold text-white">USDT (TON)</div>
                </div>
              </div>
            </div>
          </div>

          {/* Method selector (compact) */}
          <div className="mt-3">
            <h3 className="mb-1 text-left text-sm text-slate-300">Withdrawal Method</h3>

            <div className="mt-2">
              <button
                type="button"
                className="w-full flex items-center justify-between rounded-xl bg-[#0B1728] border px-3 py-3 text-left transition-all hover:border-cyan-500/40"
                style={{ borderColor: '#27344A' }}
              >
                <div className="flex items-center gap-3">
                  <Coins size={18} className="text-yellow-300" />
                  <div className="flex flex-col text-sm">
                    <span className="font-semibold text-white">USDT (TON)</span>
                    <span className="text-xs text-slate-400">Selected</span>
                  </div>
                </div>

                <div className="text-slate-400">▼</div>
              </button>
            </div>
          </div>

          {/* Wallet */}
          <div className="mt-3">

            <h3 className="mb-1 text-left text-sm text-slate-300">Wallet Address</h3>

            <div className="flex items-center gap-2">
              <div className="flex items-center rounded-xl bg-[#0B1728] border px-3 py-2 w-full" style={{ borderColor: '#27344A' }}>
                <Wallet size={18} className="text-purple-300 mr-2" />
                <input
                  placeholder="Enter TON wallet address"
                  type="text"
                  value={walletAddress}
                  onChange={(e) => {
                    setWalletAddress(e.target.value);
                    // reset message box to default when user edits input
                    setMessageBox({ type: 'default', text: defaultWarning });
                  }}
                  className="min-w-0 w-full bg-transparent text-sm text-white placeholder:text-slate-500 outline-none"
                />
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      const text = await navigator.clipboard.readText();
                      setWalletAddress(text || '');
                      setMessageBox({ type: 'default', text: defaultWarning });
                    } catch (err) {
                      console.log(err);
                    }
                  }}
                  className="ml-2 inline-flex items-center rounded px-2 py-1 bg-purple-500/10 text-sm text-purple-200"
                >
                  <Clipboard size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Amount */}
          <div className="mt-3">
            <h3 className="mb-1 text-left text-sm text-slate-300">Amount (USDT)</h3>

            <div className="flex items-center gap-2">
              <div className="w-full rounded-xl bg-[#0B1728] border px-3 py-2" style={{ borderColor: '#27344A' }}>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => {
                      setAmount(e.target.value);
                      // reset message box to default when user edits input
                      setMessageBox({ type: 'default', text: defaultWarning });
                    }}
                    placeholder="0.00"
                    className="min-w-0 w-full bg-transparent text-sm text-white placeholder:text-slate-500 outline-none"
                  />

                  <button
                    type="button"
                    onClick={() => {
                      setAmount(balance.toString());
                      setMessageBox({ type: 'default', text: defaultWarning });
                    }}
                    className="ml-2 inline-flex items-center rounded px-3 py-1 bg-purple-500/10 text-sm text-purple-200"
                  >
                    Max
                  </button>
                </div>
              </div>
            </div>

            {/* Computed row */}
            <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
              <div>Available: ${user?.balance?.toFixed(3) || 0}</div>
              <div className="flex items-center gap-3">
                <div>Network Fee: $0.00</div>
                <div className="font-semibold text-white">You Receive: ${amount ? Number(amount).toFixed(3) : '0.000'}</div>
              </div>
            </div>
          </div>

          {/* Warning + Submit */}
          <div className="mt-3 flex flex-col gap-3">
            <div
              className={
                "rounded-xl border p-3 text-sm " +
                (messageBox.type === 'error'
                  ? 'bg-red-700/10 text-white'
                  : messageBox.type === 'success'
                  ? 'bg-emerald-700/10 text-white'
                  : 'bg-[#0B1728] text-amber-200')
              }
              style={{ borderColor: messageBox.type === 'error' ? '#7f1d1d' : messageBox.type === 'success' ? '#065f46' : '#553c0b' }}
            >
              <div className="flex items-start gap-2">
                <div className="mt-0.5">
                  {messageBox.type === 'error' ? (
                    <AlertCircle size={16} className="text-red-400" />
                  ) : messageBox.type === 'success' ? (
                    <CheckCircle size={16} className="text-emerald-300" />
                  ) : (
                    <AlertTriangle size={16} className="text-amber-300" />
                  )}
                </div>
                <div className={messageBox.type === 'error' ? 'text-white' : messageBox.type === 'success' ? 'text-white' : 'text-amber-200'}>
                  {messageBox.text}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleWithdraw}
              disabled={loading}
              className="relative flex h-13 items-center justify-center gap-2 w-full rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-sm font-semibold text-white shadow-lg transition-transform duration-150 active:scale-95 disabled:opacity-50"
              style={{ height: 52 }}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="animate-spin" size={18} /> Processing...
                </div>
              ) : (
                <>
                  <ArrowUpRight size={18} /> Withdraw
                </>
              )}
            </button>
          </div>
        </div>

        {/* withdrowal histroy start */}
        <div className="mt-3 rounded-2xl border border-slate-800 bg-[#07111F] p-3 sm:p-4">
          <div className="mb-2.5 flex items-center gap-2">
            <Clock3 size={18} className="text-purple-300" />
            <h3 className="text-h3 !text-white">Withdrawal History</h3>
          </div>

          <div className="space-y-2.5">
            {history.length === 0 ? (
              <div className="rounded-xl border border-slate-800 bg-[#0B1728] p-3 text-center text-sm text-slate-400">
                No withdrawals found
              </div>
            ) : (
              <div className="overflow-hidden rounded-xl border border-slate-800 bg-[#0B1728]">
                {/* Header - visible on md+ */}
                <div className="hidden md:grid grid-cols-6 gap-4 px-4 py-3 text-xs text-slate-400 uppercase tracking-wide bg-slate-950/0">
                  <div>Date</div>
                  <div>Amount</div>
                  <div>Wallet</div>
                  <div>Network</div>
                  <div className="text-right">Fee</div>
                  <div className="text-right">Status</div>
                </div>

                <div className="divide-y divide-slate-800">
                  {history.map((item) => (
                    <div
                      key={item._id}
                      className="flex flex-col gap-2 px-3 py-3 hover:bg-slate-900/60 transition sm:px-4 md:flex-row md:items-center md:justify-between md:gap-3"
                    >
                      <div className="flex items-start justify-between gap-3 md:w-[22%] md:flex-col md:items-start">
                        <div className="text-[11px] uppercase tracking-wide text-slate-400 md:text-xs">
                          Date
                        </div>
                        <div className="text-sm text-slate-300">
                          {new Date(item.createdAt).toLocaleString()}
                        </div>
                      </div>

                      <div className="flex items-start justify-between gap-3 md:w-[12%] md:flex-col md:items-start">
                        <div className="text-[11px] uppercase tracking-wide text-slate-400 md:text-xs">
                          Amount
                        </div>
                        <div className="font-mono text-base font-semibold text-white">
                          ${Number(item.amount).toFixed(3)}
                        </div>
                      </div>

                      <div className="flex items-start justify-between gap-3 md:w-[24%] md:flex-col md:items-start">
                        <div className="text-[11px] uppercase tracking-wide text-slate-400 md:text-xs">
                          Wallet
                        </div>
                        <div className="truncate text-sm text-slate-300">
                          {shortAddress(item.walletAddress)}
                        </div>
                      </div>

                      <div className="flex items-start justify-between gap-3 md:w-[10%] md:flex-col md:items-start">
                        <div className="text-[11px] uppercase tracking-wide text-slate-400 md:text-xs">
                          Network
                        </div>
                        <div className="text-sm text-slate-300">{item.network}</div>
                      </div>

                      <div className="flex items-start justify-between gap-3 md:w-[10%] md:flex-col md:items-start md:text-right">
                        <div className="text-[11px] uppercase tracking-wide text-slate-400 md:text-xs">
                          Fee
                        </div>
                        <div className="text-sm text-slate-300">${Number(item.fee).toFixed(3)}</div>
                      </div>

                      <div className="flex items-center justify-between gap-3 md:w-[10%] md:justify-end">
                        <div className="text-[11px] uppercase tracking-wide text-slate-400 md:hidden">
                          Status
                        </div>
                        <span
                          className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-semibold capitalize ${
                            item.status === 'pending'
                              ? 'border-yellow-400/30 bg-yellow-400/10 text-yellow-300'
                              : item.status === 'paid'
                                ? 'border-green-400/30 bg-green-400/10 text-green-300'
                                : 'border-red-400/30 bg-red-400/10 text-red-300'
                          }`}
                        >
                          {item.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
