'use client';
import { useEffect, useState, useRef } from 'react';
import Sidebar from '../../../src/components/sidebar/Sidebar';
import { api } from '../../../src/services/api';
import { useToast } from '../../../src/components/shared/Toast';
import { Play, Trash2, ChevronDown, ChevronUp, Loader, CheckCircle, XCircle, Clock } from 'lucide-react';

interface AgentRun {
  id: string;
  task: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  steps: any[];
  result: string | null;
  created_at: string;
  completed_at: string | null;
}

const EXAMPLE_TASKS = [
  'Research the latest trends in AI and write a summary report',
  'Find information about climate change and create a study guide',
  'Research top 5 programming languages in 2025 and compare them',
  'Analyze the pros and cons of remote work and write a business memo',
];

const statusIcon = (status: string) => {
  if (status === 'running' || status === 'pending') return <Loader size={14} style={{ animation: 'spin 1s linear infinite' }} color="var(--color-primary)" />;
  if (status === 'completed') return <CheckCircle size={14} color="var(--color-success)" />;
  if (status === 'failed') return <XCircle size={14} color="var(--color-error)" />;
  return <Clock size={14} color="var(--color-text-muted)" />;
};

export default function AgentsPage() {
  const { show } = useToast();
  const [task, setTask] = useState('');
  const [runs, setRuns] = useState<AgentRun[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const pollRef = useRef<NodeJS.Timeout | null>(null);

  const loadRuns = async () => {
    try {
      const data = await api.getAgentRuns();
      setRuns(data);
    } catch { } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRuns();
    // Poll every 3s for running agents
    pollRef.current = setInterval(() => {
      setRuns((prev) => {
        const hasActive = prev.some((r) => r.status === 'running' || r.status === 'pending');
        if (hasActive) loadRuns();
        return prev;
      });
    }, 3000);
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, []);

  const handleRun = async () => {
    if (!task.trim()) return;
    setSubmitting(true);
    try {
      await api.createAgentRun(task.trim());
      setTask('');
      show('Agent started! It will work in the background.', 'success');
      await loadRuns();
    } catch {
      show('Failed to start agent', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    await api.deleteAgentRun(id);
    setRuns((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <div style={{ display: 'flex', height: '100vh', background: 'var(--color-bg)' }}>
      <Sidebar />
      <main className="app-main" style={{ flex: 1, overflowY: 'auto', padding: '48px 40px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <div style={{ marginBottom: 40 }}>
            <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>🤖 AI Agents</h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: 15 }}>Give the AI a complex task. It will break it down, research, and complete it autonomously.</p>
          </div>

          {/* Task input */}
          <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: 24, marginBottom: 32 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Describe your task
            </label>
            <textarea
              value={task}
              onChange={(e) => setTask(e.target.value)}
              placeholder="e.g. Research the top 5 AI tools in 2025 and write a comparison report..."
              rows={3}
              style={{ width: '100%', background: 'var(--color-surface-2)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '12px 14px', color: 'var(--color-text)', fontSize: 14, resize: 'none', outline: 'none', lineHeight: 1.6, boxSizing: 'border-box', marginBottom: 16 }}
            />
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
              {EXAMPLE_TASKS.map((ex) => (
                <button key={ex} onClick={() => setTask(ex)}
                  style={{ padding: '5px 12px', background: 'var(--color-surface-2)', border: '1px solid var(--color-border)', borderRadius: 20, fontSize: 12, color: 'var(--color-text-muted)', cursor: 'pointer' }}>
                  {ex.slice(0, 40)}...
                </button>
              ))}
            </div>
            <button onClick={handleRun} disabled={!task.trim() || submitting}
              style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '11px 24px', background: 'var(--color-primary)', color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', fontSize: 14, fontWeight: 600, cursor: task.trim() && !submitting ? 'pointer' : 'not-allowed', opacity: !task.trim() || submitting ? 0.5 : 1 }}>
              <Play size={15} /> {submitting ? 'Starting...' : 'Run Agent'}
            </button>
          </div>

          {/* Runs list */}
          {!loading && runs.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🤖</div>
              <p style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>No agent runs yet</p>
              <p style={{ fontSize: 14, color: 'var(--color-text-muted)' }}>Give the agent a complex task above and it will work autonomously.</p>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {runs.map((run) => (
              <div key={run.id} style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
                {/* Run header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 20px' }}>
                  {statusIcon(run.status)}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--color-text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{run.task}</p>
                    <p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 2 }}>
                      {run.status} · {new Date(run.created_at).toLocaleString()}
                      {run.steps?.length > 0 && ` · ${run.steps.length} steps`}
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                    {(run.status === 'completed' || run.steps?.length > 0) && (
                      <button onClick={() => setExpanded(expanded === run.id ? null : run.id)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', display: 'flex', padding: 4 }}>
                        {expanded === run.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>
                    )}
                    <button onClick={() => handleDelete(run.id)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', display: 'flex', padding: 4 }}>
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>

                {/* Expanded steps + result */}
                {expanded === run.id && (
                  <div style={{ borderTop: '1px solid var(--color-border)', padding: '16px 20px' }}>
                    {run.steps?.length > 0 && (
                      <div style={{ marginBottom: 16 }}>
                        <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Steps</p>
                        {run.steps.map((step: any, i: number) => (
                          <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
                            <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'var(--color-primary)', color: '#fff', fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>{i + 1}</div>
                            <div>
                              <p style={{ fontSize: 13, color: 'var(--color-text)', marginBottom: 2 }}>{step.thought}</p>
                              {step.result && <p style={{ fontSize: 12, color: 'var(--color-text-muted)', background: 'var(--color-surface-2)', padding: '6px 10px', borderRadius: 6, marginTop: 4 }}>{step.result.slice(0, 200)}{step.result.length > 200 ? '...' : ''}</p>}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    {run.result && (
                      <div>
                        <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Result</p>
                        <div style={{ fontSize: 14, color: 'var(--color-text)', lineHeight: 1.7, whiteSpace: 'pre-wrap', background: 'var(--color-surface-2)', padding: '14px 16px', borderRadius: 'var(--radius-md)' }}>
                          {run.result}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
