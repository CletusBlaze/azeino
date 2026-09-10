'use client';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Sidebar from '../../../src/components/sidebar/Sidebar';
import { api } from '../../../src/services/api';
import { useToast } from '../../../src/components/shared/Toast';
import { Check } from 'lucide-react';

const PLANS = [
  { id: 'free',     label: 'Free',     priceNGN: 0,     messages: 20,    features: ['20 messages/month', 'All AI capabilities', 'Memory system', 'File uploads'] },
  { id: 'plus',     label: 'Plus',     priceNGN: 4000,  messages: 500,   popular: true, features: ['500 messages/month', 'All AI capabilities', 'Memory system', 'File uploads', 'Priority responses'] },
  { id: 'pro',      label: 'Pro',      priceNGN: 8000,  messages: 2000,  features: ['2,000 messages/month', 'All AI capabilities', 'Memory system', 'File uploads', 'Priority responses', 'API access (soon)'] },
  { id: 'business', label: 'Business', priceNGN: 20000, messages: 10000, features: ['10,000 messages/month', 'All AI capabilities', 'Memory system', 'File uploads', 'Priority responses', 'API access (soon)', 'Team seats (soon)'] },
];

function formatNGN(amount: number) {
  return `₦${amount.toLocaleString('en-NG')}`;
}

function BillingContent() {
  const searchParams = useSearchParams();
  const { show } = useToast();
  const [planData, setPlanData] = useState<{ plan: string; used: number; limit: number; remaining: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkingOut, setCheckingOut] = useState<string | null>(null);

  useEffect(() => {
    if (searchParams.get('success')) show('Subscription activated! 🎉', 'success');
    api.getBillingPlan().then(setPlanData).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleUpgrade = async (planId: string) => {
    if (planId === 'free') return;
    setCheckingOut(planId);
    try {
      const { url } = await api.createCheckout(planId);
      window.location.href = url;
    } catch {
      show('Failed to start checkout', 'error');
      setCheckingOut(null);
    }
  };

  const usedPct = planData ? Math.min(100, (planData.used / planData.limit) * 100) : 0;
  const barColor = usedPct > 90 ? 'var(--color-error)' : usedPct > 70 ? 'var(--color-warning)' : 'var(--color-primary)';

  return (
    <main className="app-main" style={{ flex: 1, overflowY: 'auto', padding: '48px 40px' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <div style={{ marginBottom: 40 }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>⚡ Billing</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 15 }}>Manage your plan and usage.</p>
        </div>

        {!loading && planData && (
          <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: 24, marginBottom: 40 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div>
                <p style={{ fontSize: 14, fontWeight: 600 }}>This month&apos;s usage</p>
                <p style={{ fontSize: 13, color: 'var(--color-text-muted)', marginTop: 2 }}>
                  {planData.used} / {planData.limit} messages · {planData.remaining} remaining
                </p>
              </div>
              <span style={{ padding: '4px 12px', background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 20, fontSize: 12, color: 'var(--color-primary)', fontWeight: 600, textTransform: 'capitalize' }}>
                {planData.plan} plan
              </span>
            </div>
            <div style={{ height: 8, background: 'var(--color-surface-2)', borderRadius: 4, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${usedPct}%`, background: barColor, borderRadius: 4, transition: 'width 0.4s ease' }} />
            </div>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
          {PLANS.map((plan) => {
            const isCurrent = planData?.plan === plan.id;
            return (
              <div key={plan.id} className="card-hover" style={{ position: 'relative', padding: 24, background: 'var(--color-surface)', border: `1px solid ${'popular' in plan && plan.popular ? 'var(--color-primary)' : 'var(--color-border)'}`, borderRadius: 'var(--radius-lg)' }}>
                {'popular' in plan && plan.popular && (
                  <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: 'var(--color-primary)', color: '#fff', fontSize: 11, fontWeight: 700, padding: '3px 12px', borderRadius: 20, whiteSpace: 'nowrap' }}>
                    MOST POPULAR
                  </div>
                )}
                <p style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>{plan.label}</p>
                <p style={{ fontSize: 28, fontWeight: 800, color: 'var(--color-primary)', marginBottom: 4 }}>
                  {plan.priceNGN === 0 ? 'Free' : formatNGN(plan.priceNGN)}
                  {plan.priceNGN > 0 && <span style={{ fontSize: 13, fontWeight: 400, color: 'var(--color-text-muted)' }}>/mo</span>}
                </p>
                <p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 20 }}>{plan.messages.toLocaleString()} messages/month</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
                  {plan.features.map((f) => (
                    <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--color-text-muted)' }}>
                      <Check size={13} color="var(--color-success)" style={{ flexShrink: 0 }} /> {f}
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => handleUpgrade(plan.id)}
                  disabled={isCurrent || plan.id === 'free' || !!checkingOut}
                  style={{ width: '100%', padding: '10px', background: isCurrent ? 'var(--color-surface-2)' : 'var(--color-primary)', color: isCurrent ? 'var(--color-text-muted)' : '#fff', border: 'none', borderRadius: 'var(--radius-md)', fontSize: 13, fontWeight: 600, cursor: isCurrent || plan.id === 'free' ? 'default' : 'pointer', opacity: checkingOut && checkingOut !== plan.id ? 0.5 : 1 }}>
                  {isCurrent ? 'Current Plan' : checkingOut === plan.id ? 'Loading...' : plan.id === 'free' ? 'Free Forever' : `Upgrade to ${plan.label}`}
                </button>
              </div>
            );
          })}
        </div>

        <p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 24, textAlign: 'center' }}>
          Payments powered by Paystack · Supports cards, bank transfer & USSD · Cancel anytime
        </p>
      </div>
    </main>
  );
}

export default function BillingPage() {
  return (
    <div style={{ display: 'flex', height: '100vh', background: 'var(--color-bg)' }}>
      <Sidebar />
      <Suspense fallback={<main style={{ flex: 1 }} />}>
        <BillingContent />
      </Suspense>
    </div>
  );
}
