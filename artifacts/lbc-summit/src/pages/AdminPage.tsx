import { useState, useEffect, useCallback } from "react";
import { Search, LogOut, Download, CheckCircle2, Circle, Loader2, Shield } from "lucide-react";
import summitLogo from "@assets/LBC_Summit_pic_1781402272251.png";

interface Attendee {
  registration_id: string;
  ticket_number: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  company: string | null;
  job_title: string | null;
  ticket_type: string;
  amount_paid: number;
  payment_status: string;
  registration_date: string;
  checked_in: boolean;
  checked_in_at: string | null;
}

interface AdminState {
  token: string | null;
  registrations: Attendee[];
  total: number;
  loading: boolean;
  error: string | null;
  search: string;
  page: number;
}

const TICKET_LABELS: Record<string, string> = {
  general: "General $25",
  general_plus_one: "Gen+1 $35",
  vip: "VIP $97",
  vip_plus_one: "VIP+1 $145",
  executive: "Executive $250",
  young_adult: "Young Adult $15",
};

const STATUS_COLORS: Record<string, string> = {
  paid: "bg-green-900/40 text-green-400 border-green-700/40",
  pending: "bg-yellow-900/40 text-yellow-400 border-yellow-700/40",
  refunded: "bg-blue-900/40 text-blue-400 border-blue-700/40",
  cancelled: "bg-red-900/40 text-red-400 border-red-700/40",
};

export default function AdminPage() {
  const [state, setState] = useState<AdminState>({
    token: null,
    registrations: [],
    total: 0,
    loading: false,
    error: null,
    search: "",
    page: 1,
  });
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loggingIn, setLoggingIn] = useState(false);

  const fetchRegistrations = useCallback(async (token: string, search: string, page: number) => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const params = new URLSearchParams({ page: String(page), limit: "50" });
      if (search) params.set("search", search);
      const res = await fetch(`/api/admin/registrations?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) {
        setState((s) => ({ ...s, token: null, loading: false }));
        return;
      }
      const data = await res.json() as { registrations: Attendee[]; total: number };
      setState((s) => ({ ...s, registrations: data.registrations, total: data.total, loading: false }));
    } catch {
      setState((s) => ({ ...s, error: "Failed to load registrations.", loading: false }));
    }
  }, []);

  useEffect(() => {
    if (state.token) fetchRegistrations(state.token, state.search, state.page);
  }, [state.token, state.search, state.page, fetchRegistrations]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoggingIn(true);
    setLoginError(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json() as { token?: string; error?: string };
      if (!res.ok) throw new Error(data.error ?? "Login failed");
      setState((s) => ({ ...s, token: data.token ?? null }));
    } catch (err) {
      setLoginError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoggingIn(false);
    }
  };

  const [checkInError, setCheckInError] = useState<string | null>(null);

  const toggleCheckIn = async (registrationId: string) => {
    if (!state.token) return;
    setCheckInError(null);
    try {
      const res = await fetch(`/api/admin/attendees/${encodeURIComponent(registrationId)}/checkin`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${state.token}` },
      });
      if (!res.ok) throw new Error("Check-in update failed");
      const data = await res.json() as { checkedIn: boolean };
      setState((s) => ({
        ...s,
        registrations: s.registrations.map((r) =>
          r.registration_id === registrationId
            ? { ...r, checked_in: data.checkedIn, checked_in_at: data.checkedIn ? new Date().toISOString() : null }
            : r
        ),
      }));
    } catch (err) {
      setCheckInError(err instanceof Error ? err.message : "Check-in update failed");
    }
  };

  const [exportError, setExportError] = useState<string | null>(null);

  const handleExport = async () => {
    if (!state.token) return;
    setExportError(null);
    try {
      const res = await fetch("/api/admin/export", {
        headers: { Authorization: `Bearer ${state.token}` },
      });
      if (!res.ok) throw new Error("Export failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `lbc-summit-registrations-${Date.now()}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      setExportError("Export failed. Please try again.");
    }
  };

  // Login screen
  if (!state.token) {
    return (
      <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <img src={summitLogo} alt="LBC Summit" className="h-16 w-16 object-contain mx-auto mb-4" />
            <div className="w-12 h-12 rounded-full bg-[#1a56db]/20 flex items-center justify-center mx-auto mb-4">
              <Shield size={24} className="text-[#1a56db]" />
            </div>
            <h1 className="text-2xl font-extrabold text-white mb-1" style={{ fontFamily: "var(--app-font-heading)" }}>
              Admin Dashboard
            </h1>
            <p className="text-gray-400 text-sm">LBC Wealth & Development Summit 2026</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-1">Admin Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#1a56db]"
                autoComplete="current-password"
              />
            </div>
            {loginError && (
              <p className="text-red-400 text-sm text-center">{loginError}</p>
            )}
            <button
              type="submit"
              disabled={loggingIn || !password}
              className="w-full bg-[#1a56db] hover:bg-[#1e3a8a] disabled:opacity-60 text-white font-bold py-3 rounded-xl transition-colors"
              style={{ fontFamily: "var(--app-font-heading)" }}
            >
              {loggingIn ? <Loader2 size={18} className="animate-spin mx-auto" /> : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  const paidCount = state.registrations.filter((r) => r.payment_status === "paid").length;
  const checkedInCount = state.registrations.filter((r) => r.checked_in).length;
  const totalRevenue = state.registrations.reduce((sum, r) => sum + (r.payment_status === "paid" ? r.amount_paid : 0), 0);

  return (
    <div className="min-h-screen bg-[#0a0f1e]">
      {/* Header */}
      <header className="bg-[#0f1729]/95 border-b border-white/10 py-4 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={summitLogo} alt="LBC Summit" className="h-8 w-8 object-contain" />
            <div>
              <p className="text-white font-bold text-sm" style={{ fontFamily: "var(--app-font-heading)" }}>Admin Dashboard</p>
              <p className="text-gray-400 text-xs">LBC Wealth & Development Summit 2026</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleExport}
              className="flex items-center gap-1.5 bg-[#1a56db]/20 hover:bg-[#1a56db] border border-[#1a56db]/40 text-[#1a56db] hover:text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors"
            >
              <Download size={14} /> Export CSV
            </button>
            <button
              onClick={() => setState((s) => ({ ...s, token: null }))}
              className="flex items-center gap-1.5 text-gray-400 hover:text-white text-xs transition-colors"
            >
              <LogOut size={14} /> Sign Out
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total Registrations" value={String(state.total)} />
          <StatCard label="Confirmed Paid" value={String(paidCount)} color="text-green-400" />
          <StatCard label="Checked In" value={String(checkedInCount)} color="text-[#c79d35]" />
          <StatCard label="Total Revenue" value={`$${(totalRevenue / 100).toFixed(2)}`} color="text-[#1a56db]" />
        </div>

        {/* Search */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              value={state.search}
              onChange={(e) => setState((s) => ({ ...s, search: e.target.value, page: 1 }))}
              placeholder="Search by name, email, registration ID, or ticket type..."
              className="w-full bg-white/5 border border-white/15 rounded-xl pl-9 pr-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#1a56db]"
            />
          </div>
        </div>

        {/* Errors */}
        {(state.error || exportError || checkInError) && (
          <div className="bg-red-900/20 border border-red-500/40 rounded-xl p-4 mb-4 text-red-300 text-sm">
            {state.error ?? exportError ?? checkInError}
          </div>
        )}

        {/* Table */}
        {state.loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={32} className="text-[#1a56db] animate-spin" />
          </div>
        ) : (
          <div className="bg-[#0f1729] border border-white/10 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    {["Reg ID", "Name", "Email", "Phone", "Ticket", "Paid", "Status", "Date", "Check-In"].map((h) => (
                      <th key={h} className="text-left py-3 px-4 text-gray-400 text-xs font-semibold uppercase tracking-wider whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {state.registrations.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="text-center py-12 text-gray-500">
                        {state.search ? "No results found." : "No registrations yet."}
                      </td>
                    </tr>
                  ) : (
                    state.registrations.map((r) => (
                      <tr key={r.registration_id} className="hover:bg-white/3 transition-colors">
                        <td className="py-3 px-4">
                          <span className="text-[#c79d35] font-mono text-xs">{r.registration_id}</span>
                        </td>
                        <td className="py-3 px-4 text-white whitespace-nowrap">
                          {r.first_name} {r.last_name}
                        </td>
                        <td className="py-3 px-4 text-gray-300">{r.email}</td>
                        <td className="py-3 px-4 text-gray-300 whitespace-nowrap">{r.phone}</td>
                        <td className="py-3 px-4 text-gray-300 whitespace-nowrap text-xs">
                          {TICKET_LABELS[r.ticket_type] ?? r.ticket_type}
                        </td>
                        <td className="py-3 px-4 text-white whitespace-nowrap">
                          ${(r.amount_paid / 100).toFixed(2)}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded-full text-xs border ${STATUS_COLORS[r.payment_status] ?? ""}`}>
                            {r.payment_status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-400 whitespace-nowrap text-xs">
                          {new Date(r.registration_date).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => toggleCheckIn(r.registration_id)}
                            title={r.checked_in ? "Mark as not checked in" : "Mark as checked in"}
                            className="flex items-center gap-1.5 text-xs transition-colors"
                          >
                            {r.checked_in ? (
                              <CheckCircle2 size={18} className="text-green-400" />
                            ) : (
                              <Circle size={18} className="text-gray-500 hover:text-white" />
                            )}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {state.total > 50 && (
              <div className="border-t border-white/10 px-4 py-3 flex items-center justify-between text-sm text-gray-400">
                <span>Showing {state.registrations.length} of {state.total}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setState((s) => ({ ...s, page: s.page - 1 }))}
                    disabled={state.page === 1}
                    className="px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setState((s) => ({ ...s, page: s.page + 1 }))}
                    disabled={state.page * 50 >= state.total}
                    className="px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, color = "text-white" }: { label: string; value: string; color?: string }) {
  return (
    <div className="bg-[#0f1729] border border-white/10 rounded-xl p-4">
      <p className="text-gray-400 text-xs mb-1">{label}</p>
      <p className={`text-2xl font-extrabold ${color}`} style={{ fontFamily: "var(--app-font-heading)" }}>{value}</p>
    </div>
  );
}
