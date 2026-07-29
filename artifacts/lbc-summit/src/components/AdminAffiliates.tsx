import { useState, useEffect, useCallback } from "react";
import { Loader2, Check, Ban, RotateCcw } from "lucide-react";

interface Affiliate {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  affiliate_code: string;
  commission_rate: string;
  status: string;
  total_clicks: number;
  total_sales: number;
  total_commissions_cents: number;
  total_paid_cents: number;
  created_at: string;
}

interface Commission {
  id: string;
  sale_amount_cents: number;
  commission_amount_cents: number;
  status: string;
  created_at: string;
  affiliate_code: string;
  first_name: string;
  last_name: string;
  payout_email: string | null;
}

function money(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

const STATUS_PILL: Record<string, string> = {
  active: "bg-green-900/40 text-green-400",
  pending: "bg-yellow-900/40 text-yellow-300",
  suspended: "bg-red-900/40 text-red-400",
  approved: "bg-blue-900/40 text-blue-300",
  paid: "bg-green-900/40 text-green-400",
  rejected: "bg-red-900/40 text-red-400",
};

export default function AdminAffiliates({ token }: { token: string }) {
  const [view, setView] = useState<"affiliates" | "commissions">("affiliates");
  const [affiliates, setAffiliates] = useState<Affiliate[]>([]);
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [aRes, cRes] = await Promise.all([
        fetch("/api/admin/affiliates", { headers: { Authorization: `Bearer ${token}` } }),
        fetch("/api/admin/commissions", { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      if (aRes.ok) setAffiliates(((await aRes.json()).affiliates ?? []) as Affiliate[]);
      if (cRes.ok) setCommissions(((await cRes.json()).commissions ?? []) as Commission[]);
    } catch {
      setError("Failed to load affiliate data.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { load(); }, [load]);

  async function setAffiliateStatus(id: string, status: string) {
    setError(null);
    try {
      const res = await fetch(`/api/admin/affiliates/${id}/status`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error();
      setAffiliates((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
    } catch {
      setError("Failed to update affiliate status.");
    }
  }

  async function setCommissionStatus(id: string, status: string) {
    setError(null);
    try {
      const res = await fetch(`/api/admin/commissions/${id}/status`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error();
      setCommissions((prev) => prev.map((c) => (c.id === id ? { ...c, status } : c)));
    } catch {
      setError("Failed to update commission status.");
    }
  }

  const pendingAffiliates = affiliates.filter((a) => a.status === "pending").length;
  const pendingCommissionsCents = commissions
    .filter((c) => c.status === "pending")
    .reduce((s, c) => s + c.commission_amount_cents, 0);

  return (
    <div>
      {/* Sub-stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <SubStat label="Total Affiliates" value={String(affiliates.length)} />
        <SubStat label="Pending Approval" value={String(pendingAffiliates)} color="text-[#c79d35]" />
        <SubStat label="Active" value={String(affiliates.filter((a) => a.status === "active").length)} color="text-green-400" />
        <SubStat label="Pending Commissions" value={money(pendingCommissionsCents)} color="text-[#1a56db]" />
      </div>

      {/* View toggle */}
      <div className="inline-flex bg-[#0f1729] border border-white/10 rounded-xl p-1 mb-5">
        {(["affiliates", "commissions"] as const).map((v) => (
          <button
            key={v}
            onClick={() => setView(v)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold capitalize transition-colors ${
              view === v ? "bg-[#1a56db] text-white" : "text-gray-400 hover:text-white"
            }`}
          >
            {v}
          </button>
        ))}
      </div>

      {error && <div className="bg-red-900/20 border border-red-500/40 rounded-xl p-4 mb-4 text-red-300 text-sm">{error}</div>}

      {loading ? (
        <div className="flex items-center justify-center py-20"><Loader2 size={32} className="text-[#1a56db] animate-spin" /></div>
      ) : view === "affiliates" ? (
        <div className="bg-[#0f1729] border border-white/10 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  {["Code", "Name", "Email", "Clicks", "Sales", "Earned", "Paid", "Status", "Actions"].map((h) => (
                    <th key={h} className="text-left py-3 px-4 text-gray-400 text-xs font-semibold uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {affiliates.length === 0 ? (
                  <tr><td colSpan={9} className="text-center py-12 text-gray-500">No affiliates yet.</td></tr>
                ) : affiliates.map((a) => (
                  <tr key={a.id} className="hover:bg-white/3 transition-colors">
                    <td className="py-3 px-4"><span className="text-[#c79d35] font-mono text-xs">{a.affiliate_code}</span></td>
                    <td className="py-3 px-4 text-white whitespace-nowrap">{a.first_name} {a.last_name}</td>
                    <td className="py-3 px-4 text-gray-300">{a.email}</td>
                    <td className="py-3 px-4 text-gray-300">{a.total_clicks}</td>
                    <td className="py-3 px-4 text-gray-300">{a.total_sales}</td>
                    <td className="py-3 px-4 text-white">{money(a.total_commissions_cents)}</td>
                    <td className="py-3 px-4 text-gray-300">{money(a.total_paid_cents)}</td>
                    <td className="py-3 px-4"><span className={`px-2 py-0.5 rounded-full text-xs ${STATUS_PILL[a.status] ?? ""}`}>{a.status}</span></td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      {a.status !== "active" && (
                        <button onClick={() => setAffiliateStatus(a.id, "active")} title="Approve / activate"
                          className="inline-flex items-center gap-1 text-xs bg-green-900/30 hover:bg-green-900/60 text-green-400 px-2 py-1 rounded-lg mr-1 transition-colors">
                          <Check size={12} /> Activate
                        </button>
                      )}
                      {a.status === "active" && (
                        <button onClick={() => setAffiliateStatus(a.id, "suspended")} title="Suspend"
                          className="inline-flex items-center gap-1 text-xs bg-red-900/30 hover:bg-red-900/60 text-red-400 px-2 py-1 rounded-lg transition-colors">
                          <Ban size={12} /> Suspend
                        </button>
                      )}
                      {a.status === "suspended" && (
                        <button onClick={() => setAffiliateStatus(a.id, "active")} title="Reinstate"
                          className="inline-flex items-center gap-1 text-xs bg-blue-900/30 hover:bg-blue-900/60 text-blue-300 px-2 py-1 rounded-lg transition-colors">
                          <RotateCcw size={12} /> Reinstate
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-[#0f1729] border border-white/10 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  {["Date", "Affiliate", "Payout Email", "Sale", "Commission", "Status", "Actions"].map((h) => (
                    <th key={h} className="text-left py-3 px-4 text-gray-400 text-xs font-semibold uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {commissions.length === 0 ? (
                  <tr><td colSpan={7} className="text-center py-12 text-gray-500">No commissions yet.</td></tr>
                ) : commissions.map((c) => (
                  <tr key={c.id} className="hover:bg-white/3 transition-colors">
                    <td className="py-3 px-4 text-gray-400 text-xs whitespace-nowrap">{new Date(c.created_at).toLocaleDateString()}</td>
                    <td className="py-3 px-4 text-white whitespace-nowrap">
                      {c.first_name} {c.last_name} <span className="text-[#c79d35] font-mono text-xs">({c.affiliate_code})</span>
                    </td>
                    <td className="py-3 px-4 text-gray-300 text-xs">{c.payout_email ?? "—"}</td>
                    <td className="py-3 px-4 text-gray-300">{money(c.sale_amount_cents)}</td>
                    <td className="py-3 px-4 text-white font-semibold">{money(c.commission_amount_cents)}</td>
                    <td className="py-3 px-4"><span className={`px-2 py-0.5 rounded-full text-xs ${STATUS_PILL[c.status] ?? ""}`}>{c.status}</span></td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      {c.status === "pending" && (
                        <>
                          <button onClick={() => setCommissionStatus(c.id, "approved")}
                            className="inline-flex items-center gap-1 text-xs bg-blue-900/30 hover:bg-blue-900/60 text-blue-300 px-2 py-1 rounded-lg mr-1 transition-colors">
                            <Check size={12} /> Approve
                          </button>
                          <button onClick={() => setCommissionStatus(c.id, "rejected")}
                            className="inline-flex items-center gap-1 text-xs bg-red-900/30 hover:bg-red-900/60 text-red-400 px-2 py-1 rounded-lg transition-colors">
                            <Ban size={12} /> Reject
                          </button>
                        </>
                      )}
                      {c.status === "approved" && (
                        <button onClick={() => setCommissionStatus(c.id, "paid")}
                          className="inline-flex items-center gap-1 text-xs bg-green-900/30 hover:bg-green-900/60 text-green-400 px-2 py-1 rounded-lg transition-colors">
                          <Check size={12} /> Mark Paid
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function SubStat({ label, value, color = "text-white" }: { label: string; value: string; color?: string }) {
  return (
    <div className="bg-[#0f1729] border border-white/10 rounded-xl p-4">
      <p className="text-gray-400 text-xs mb-1">{label}</p>
      <p className={`text-2xl font-extrabold ${color}`} style={{ fontFamily: "var(--app-font-heading)" }}>{value}</p>
    </div>
  );
}
