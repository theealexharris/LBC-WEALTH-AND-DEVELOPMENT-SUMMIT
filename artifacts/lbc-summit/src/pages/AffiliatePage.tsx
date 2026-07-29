import { useState, useEffect, useCallback } from "react";
import { ArrowLeft, Loader2, Copy, Check, DollarSign, MousePointerClick, ShoppingCart, LogOut } from "lucide-react";
import summitLogo from "@assets/LBC_Summit_pic_1781402272251.png";

const TOKEN_KEY = "lbc_affiliate_token";
const SITE_ORIGIN = typeof window !== "undefined" ? window.location.origin : "";

function money(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

interface Dashboard {
  firstName: string;
  lastName: string;
  email: string;
  affiliateCode: string;
  commissionRate: number;
  status: string;
  totalClicks: number;
  totalSales: number;
  totalCommissionsCents: number;
  totalPaidCents: number;
  pendingCents: number;
  approvedCents: number;
}

interface Referral {
  sale_amount_cents: number;
  commission_amount_cents: number;
  status: string;
  created_at: string;
}

const inputCls =
  "w-full bg-white/5 border border-white/15 rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#1a56db] focus:border-transparent";

export default function AffiliatePage() {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [mode, setMode] = useState<"login" | "register">("login");
  const [dashboard, setDashboard] = useState<Dashboard | null>(null);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Auth form state
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", phone: "", password: "", payoutEmail: "",
  });
  const setField = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((p) => ({ ...p, [k]: e.target.value }));

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setDashboard(null);
    setReferrals([]);
  }, []);

  const loadDashboard = useCallback(async (t: string) => {
    setLoading(true);
    setError(null);
    try {
      const [dRes, rRes] = await Promise.all([
        fetch("/api/affiliate/dashboard", { headers: { Authorization: `Bearer ${t}` } }),
        fetch("/api/affiliate/referrals", { headers: { Authorization: `Bearer ${t}` } }),
      ]);
      if (dRes.status === 401) { logout(); return; }
      const d = await dRes.json();
      if (!dRes.ok) throw new Error(d.error ?? "Failed to load dashboard");
      setDashboard(d as Dashboard);
      if (rRes.ok) {
        const r = await rRes.json();
        setReferrals((r.referrals ?? []) as Referral[]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }, [logout]);

  useEffect(() => {
    if (token) loadDashboard(token);
  }, [token, loadDashboard]);

  async function handleAuth(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setNotice(null);
    try {
      if (mode === "register") {
        const res = await fetch("/api/affiliate/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Registration failed");
        setNotice(data.message ?? "Application received — pending approval.");
        setMode("login");
      } else {
        const res = await fetch("/api/affiliate/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: form.email, password: form.password }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Login failed");
        localStorage.setItem(TOKEN_KEY, data.token);
        setToken(data.token);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  const referralLink = dashboard ? `${SITE_ORIGIN}/register?ref=${dashboard.affiliateCode}` : "";

  function copyLink() {
    navigator.clipboard.writeText(referralLink).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="min-h-screen bg-[#0a0f1e]">
      <header className="bg-[#0f1729]/95 backdrop-blur-md border-b border-white/10 py-4 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <a href="/" className="flex items-center gap-3">
            <img src={summitLogo} alt="LBC Summit" className="h-10 w-10 object-contain" />
            <div className="hidden sm:block">
              <p className="text-white font-bold text-sm leading-tight" style={{ fontFamily: "var(--app-font-heading)" }}>
                LBC Wealth & Development Summit
              </p>
              <p className="text-[#c79d35] text-xs">Affiliate Program</p>
            </div>
          </a>
          {token ? (
            <button onClick={logout} className="flex items-center gap-1.5 text-gray-400 hover:text-white text-sm transition-colors">
              <LogOut size={14} /> Sign Out
            </button>
          ) : (
            <a href="/" className="flex items-center gap-1.5 text-gray-400 hover:text-white text-sm transition-colors">
              <ArrowLeft size={14} /> Back to Site
            </a>
          )}
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        {!token ? (
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <p className="text-[#c79d35] text-xs font-bold uppercase tracking-widest mb-2">Earn 20% Commission</p>
              <h1 className="text-3xl font-extrabold text-white mb-3" style={{ fontFamily: "var(--app-font-heading)" }}>
                {mode === "register" ? "Become an Affiliate" : "Affiliate Sign In"}
              </h1>
              <p className="text-gray-400 text-sm">
                Share your unique link and earn 20% on every ticket you refer.
              </p>
            </div>

            {notice && <div className="bg-green-900/30 border border-green-500/40 rounded-xl p-4 text-green-300 text-sm mb-5">{notice}</div>}
            {error && <div className="bg-red-900/30 border border-red-500/40 rounded-xl p-4 text-red-300 text-sm mb-5">{error}</div>}

            <form onSubmit={handleAuth} className="space-y-4">
              {mode === "register" && (
                <div className="grid grid-cols-2 gap-3">
                  <input type="text" required placeholder="First name" value={form.firstName} onChange={setField("firstName")} className={inputCls} />
                  <input type="text" required placeholder="Last name" value={form.lastName} onChange={setField("lastName")} className={inputCls} />
                </div>
              )}
              <input type="email" required placeholder="Email address" value={form.email} onChange={setField("email")} className={inputCls} />
              {mode === "register" && (
                <input type="tel" placeholder="Phone (optional)" value={form.phone} onChange={setField("phone")} className={inputCls} />
              )}
              <input type="password" required placeholder={mode === "register" ? "Create a password (8+ chars)" : "Password"} value={form.password} onChange={setField("password")} className={inputCls} />
              {mode === "register" && (
                <input type="email" placeholder="PayPal / payout email (optional)" value={form.payoutEmail} onChange={setField("payoutEmail")} className={inputCls} />
              )}

              <button type="submit" disabled={loading}
                className="w-full bg-[#1a56db] hover:bg-[#1e3a8a] disabled:opacity-60 text-white font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2"
                style={{ fontFamily: "var(--app-font-heading)" }}>
                {loading && <Loader2 size={16} className="animate-spin" />}
                {mode === "register" ? "Apply to Join" : "Sign In"}
              </button>
            </form>

            <p className="text-center text-gray-400 text-sm mt-6">
              {mode === "register" ? "Already an affiliate?" : "New here?"}{" "}
              <button
                onClick={() => { setMode(mode === "register" ? "login" : "register"); setError(null); setNotice(null); }}
                className="text-[#c79d35] font-semibold hover:underline"
              >
                {mode === "register" ? "Sign in" : "Become an affiliate"}
              </button>
            </p>
          </div>
        ) : loading && !dashboard ? (
          <div className="flex items-center justify-center py-24 text-gray-400">
            <Loader2 size={22} className="animate-spin mr-2" /> Loading your dashboard…
          </div>
        ) : dashboard ? (
          <>
            <div className="mb-8">
              <h1 className="text-3xl font-extrabold text-white mb-1" style={{ fontFamily: "var(--app-font-heading)" }}>
                Welcome back, {dashboard.firstName}
              </h1>
              <p className="text-gray-400 text-sm">
                Status:{" "}
                <span className={dashboard.status === "active" ? "text-green-400" : "text-[#c79d35]"}>
                  {dashboard.status === "active" ? "Active" : dashboard.status === "pending" ? "Pending Approval" : "Suspended"}
                </span>
                {" · "}Commission rate: {Math.round(dashboard.commissionRate * 100)}%
              </p>
            </div>

            {error && <div className="bg-red-900/30 border border-red-500/40 rounded-xl p-4 text-red-300 text-sm mb-5">{error}</div>}

            {/* Referral link */}
            <div className="bg-[#0f1729] border border-[#c79d35]/30 rounded-2xl p-6 mb-6">
              <p className="text-[#c79d35] text-xs font-bold uppercase tracking-widest mb-2">Your Referral Link</p>
              {dashboard.status === "active" ? (
                <div className="flex flex-col sm:flex-row items-stretch gap-2">
                  <code className="flex-1 bg-black/30 rounded-lg px-4 py-3 text-white text-sm break-all">{referralLink}</code>
                  <button onClick={copyLink}
                    className="flex items-center justify-center gap-1.5 bg-[#1a56db] hover:bg-[#1e3a8a] text-white text-sm font-bold px-5 py-3 rounded-lg transition-colors">
                    {copied ? <><Check size={15} /> Copied!</> : <><Copy size={15} /> Copy Link</>}
                  </button>
                </div>
              ) : (
                <p className="text-gray-400 text-sm">
                  Your link activates once an admin approves your account. Your code will be{" "}
                  <span className="text-white font-mono">{dashboard.affiliateCode}</span>.
                </p>
              )}
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <StatCard icon={MousePointerClick} label="Total Clicks" value={String(dashboard.totalClicks)} />
              <StatCard icon={ShoppingCart} label="Total Sales" value={String(dashboard.totalSales)} />
              <StatCard icon={DollarSign} label="Pending" value={money(dashboard.pendingCents)} />
              <StatCard icon={DollarSign} label="Approved" value={money(dashboard.approvedCents)} accent />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <StatCard icon={DollarSign} label="Lifetime Commissions" value={money(dashboard.totalCommissionsCents)} />
              <StatCard icon={DollarSign} label="Total Paid Out" value={money(dashboard.totalPaidCents)} />
            </div>

            {/* Referral history */}
            <div className="bg-[#0f1729] border border-white/10 rounded-2xl overflow-hidden">
              <p className="text-white font-bold px-6 py-4 border-b border-white/10" style={{ fontFamily: "var(--app-font-heading)" }}>
                Commission History
              </p>
              {referrals.length === 0 ? (
                <p className="text-gray-400 text-sm px-6 py-8 text-center">No referred sales yet. Share your link to start earning.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-gray-400 text-xs uppercase tracking-wider border-b border-white/10">
                        <th className="text-left px-6 py-3 font-semibold">Date</th>
                        <th className="text-left px-6 py-3 font-semibold">Sale</th>
                        <th className="text-left px-6 py-3 font-semibold">Commission</th>
                        <th className="text-left px-6 py-3 font-semibold">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {referrals.map((r, i) => (
                        <tr key={i} className="border-b border-white/5 last:border-0">
                          <td className="px-6 py-3 text-gray-300">{new Date(r.created_at).toLocaleDateString()}</td>
                          <td className="px-6 py-3 text-gray-300">{money(r.sale_amount_cents)}</td>
                          <td className="px-6 py-3 text-white font-semibold">{money(r.commission_amount_cents)}</td>
                          <td className="px-6 py-3">
                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                              r.status === "paid" ? "bg-green-900/40 text-green-400"
                              : r.status === "approved" ? "bg-blue-900/40 text-blue-300"
                              : r.status === "rejected" ? "bg-red-900/40 text-red-400"
                              : "bg-yellow-900/40 text-yellow-300"}`}>
                              {r.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, accent }: { icon: typeof DollarSign; label: string; value: string; accent?: boolean }) {
  return (
    <div className={`rounded-2xl p-5 border ${accent ? "bg-[#c79d35]/10 border-[#c79d35]/30" : "bg-white/5 border-white/10"}`}>
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-3 ${accent ? "bg-[#c79d35]/20" : "bg-[#1a56db]/20"}`}>
        <Icon size={16} className={accent ? "text-[#c79d35]" : "text-[#1a56db]"} />
      </div>
      <p className="text-gray-400 text-xs mb-1">{label}</p>
      <p className="text-white text-xl font-extrabold" style={{ fontFamily: "var(--app-font-heading)" }}>{value}</p>
    </div>
  );
}
