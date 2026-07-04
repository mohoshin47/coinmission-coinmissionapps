import Header from '../components/Header';
import { Wallet, Send } from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import { useGlobalConfig } from '../contexts/GlobalConfigContext';
import { toast } from 'react-hot-toast';
import { requestWithdraw } from '../services/userService';
import { useEffect, useState } from 'react';
import { getWithdrawHistory } from '../services/userService';

// Withdraw.tsx
export default function Withdraw() {
  const { user, setUser } = useUser();
  const [method, setMethod] = useState('trc20');
  const { config } = useGlobalConfig();
  const [amount, setAmount] = useState('');
  const balance = user?.balance?.toFixed(3) || 0;

  const [walletAddress, setWalletAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
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

      toast.success(result.message);
      await loadHistory();
      setAmount('');
      setWalletAddress('');
      setUser({
        ...user!,
        balance: result.balance,
      });
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Withdraw failed');
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
      <div className="pt-20 pb-24 overflow-y-auto h-screen px-3  no-scrollbar ">
        <div className="rounded-xl border border-slate-800 bg-[#07111F] p-3">
          {/* Balance Card */}
          <div className=" rounded-xl border border-slate-800 bg-[#0B1728] p-3">
            <div className=" flex items-center justify-between">
              <div className="flex flex-col items-start justify-start">
                <p className="text-gray-400 text-sm">Available Balance</p>

                <h1 className="mt-2 text-lg  !text-purple-500">
                  ${user?.balance?.toFixed(3) || 0}
                  <span className="text-lg ml-2 text-white">USD</span>
                </h1>

                <p className="text-gray-500 text-sm mt-2">Minimum Withdraw: {config?.min_withdraw || 1} USD</p>
              </div>

              <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center">
                <Wallet size={28} className="text-white" />
              </div>
            </div>
          </div>

          {/* Method */}
          <div className="mt-4">
            <h3 className="flex items-start justify-start text-white !text-h3 mb-1">Withdrawal Method</h3>
            <div className="space-y-3">
              {/* TON */}
              <label className="flex items-center justify-between rounded-xl border border-slate-800 bg-[#0B1728] p-3 cursor-pointer">
                <div className="flex items-center gap-3">
                  <input type="radio" checked={method === 'ton'} onChange={() => setMethod('ton')} />

                  <span className="text-white">TON USDT</span>
                </div>

                <img src="https://cryptologos.cc/logos/toncoin-ton-logo.png" className="w-8 h-8" />
              </label>
            </div>
          </div>

          {/* Wallet */}
          <div className="mt-4">
    
            <h3 className="flex items-start justify-start text-white !text-h3 mb-0">Wallet Address</h3>

            <input
              placeholder="Enter wallet address"
              type="text"
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              className="w-full h-12 mt-1 rounded-xl border border-slate-800 bg-[#0B1728] px-4 text-gray-500 outline-none"
            />
          </div>

          {/* Amount */}
          <div className="mt-4">
            
            <h3 className="flex items-start justify-start text-white !text-h3 mb-0">Amount (USD)</h3>

            <div className="flex items-center gap-2 mt-1">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                className="min-w-0 flex-1 h-12 rounded-xl border border-slate-800 bg-[#0B1728] px-3 text-sm text-gray-500 outline-none"
              />

              <button
                onClick={() => setAmount(balance.toString())}
                className="shrink-0 h-12 px-3 rounded-xl bg-purple-900 border border-purple-600 text-purple-300 text-sm font-medium"
              >
                Max
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            onClick={handleWithdraw}
            disabled={loading}
            className="w-full h-12 mt-4 rounded-xl bg-gradient-to-r from-purple-600 to-violet-500 text-white font-semibold flex items-center justify-center gap-2"
          >
            <Send size={18} />
            {loading ? 'Processing...' : 'Request Withdraw'}
          </button>
        </div>

        {/* withdrowal histroy start */}
        <div className="rounded-xl border border-slate-800 bg-[#07111F] p-3 mt-4">
          <h3 className="flex items-start justify-start text-white text-h3 !mb-1">Withdrawal History</h3>

          <div className="space-y-3">
            {history.length === 0 && (
              <div className="rounded-xl border border-slate-800 bg-[#07111F] p-3 text-center text-gray-400">
                No withdrawals found
              </div>
            )}

            {history.map((item) => (
              <div key={item._id} className="rounded-xl border border-slate-800 bg-[#07111F] p-3">
                <div className="flex items-start justify-between">
                  <div className="flex flex-col items-start justify-start">
                    <p className="!text-white font-medium">Amount: ${item.amount}</p>

                    <p className="text-gray-400 text-sm">Wallet Address: {shortAddress(item.walletAddress)}</p>

                    <p className="text-gray-500 text-xs mt-1">Date : {new Date(item.createdAt).toLocaleString()}</p>
                  </div>

                  <div className="text-right">
                    <span
                      className={`text-sm font-medium ${
                        item.status === 'pending'
                          ? 'text-yellow-400'
                          : item.status === 'paid'
                            ? 'text-green-400'
                            : 'text-red-400'
                      }`}
                    >
                      {item.status}
                    </span>

                    <p className="text-gray-400 text-xs mt-1">Fee: ${item.fee}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
