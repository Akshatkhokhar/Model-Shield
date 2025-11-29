import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ShieldDashboard() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [rules, setRules] = useState([]);
  const [newRule, setNewRule] = useState({ rule_name: '', type: 'KEYWORD_BLOCK', value: '' });

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      const [logsRes, rulesRes] = await Promise.all([
        axios.get('/api/logs?limit=50'),
        axios.get('/api/rules'),
      ]);
      setLogs(Array.isArray(logsRes.data?.data) ? logsRes.data.data : []);
      setRules(Array.isArray(rulesRes.data?.data) ? rulesRes.data.data : []);
    } catch (err) {
      setError(err?.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const addRule = async (e) => {
    e.preventDefault();
    if (!newRule.rule_name || !newRule.value) return;
    try {
      await axios.post('/api/rules', newRule);
      setNewRule({ rule_name: '', type: 'KEYWORD_BLOCK', value: '' });
      fetchData();
    } catch (err) {
      setError(err?.message || 'Failed to add rule');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  
  // Calculate some quick stats for the overview panel
  const totalLogs = logs.length;
  const injectionCount = logs.filter(log => log.threat_type === 'Prompt_Injection').length;
  const hallucinationCount = logs.filter(log => log.threat_type === 'Hallucination').length;

  return (
    <div className="p-4">
      <h2 className="text-3xl font-bold mb-6 text-teal-400">Admin Dashboard: Model Shield Logs</h2>

      {/* --- STATS VIEW --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard title="Total Blocked Prompts" value={totalLogs} color="bg-red-600" />
        <StatCard title="Prompt Injection Attempts" value={injectionCount} color="bg-yellow-600" />
        <StatCard title="Hallucination Flags" value={hallucinationCount} color="bg-blue-600" />
      </div>

      {/* --- THREAT LOG VIEW --- */}
      <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold mb-4 text-white">Recent Threat Activity</h3>
          <button onClick={fetchData} className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-3 rounded-lg">Refresh</button>
        </div>
        {loading && <p className="text-gray-400">Loading…</p>}
        {error && <p className="text-red-400">{error}</p>}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-700">
              <tr>
                <TableHeader>Timestamp</TableHeader>
                <TableHeader>Threat Type</TableHeader>
                <TableHeader>Input Prompt</TableHeader>
                <TableHeader>Blocked Content</TableHeader>
                <TableHeader>User ID</TableHeader>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {logs.map((log, idx) => (
                <tr key={log.id || idx} className="hover:bg-gray-600 transition duration-150">
                  <TableData>{(log.timestamp || '').toString().split('T')[1] || ''}</TableData>
                  <TableData>
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${log.threat_type === 'Prompt_Injection' ? 'bg-yellow-100 text-yellow-800' : 
                        log.threat_type === 'Hallucination' ? 'bg-blue-100 text-blue-800' : 
                        'bg-red-100 text-red-800'}`}>
                      {log.threat_type.replace('_', ' ')}
                    </span>
                  </TableData>
                  <TableData className="truncate max-w-xs">{log.input_prompt}</TableData>
                  <TableData className="font-mono text-xs text-red-300">{String(log.blocked_content).slice(0, 120)}</TableData>
                  <TableData>{log.user_id || '—'}</TableData>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-sm italic text-gray-400">*Mock mode using in-memory logs.</p>
      </div>

      {/* --- RULESET EDITOR --- */}
      <div className="bg-gray-800 p-6 rounded-xl shadow-lg mt-8">
        <h3 className="text-xl font-semibold mb-4 text-white">Ruleset Editor (Mock)</h3>
        <form onSubmit={addRule} className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <input className="bg-gray-700 text-white p-2 rounded" placeholder="Rule Name" value={newRule.rule_name} onChange={(e) => setNewRule({ ...newRule, rule_name: e.target.value })} />
          <select className="bg-gray-700 text-white p-2 rounded" value={newRule.type} onChange={(e) => setNewRule({ ...newRule, type: e.target.value })}>
            <option value="KEYWORD_BLOCK">KEYWORD_BLOCK</option>
          </select>
          <input className="bg-gray-700 text-white p-2 rounded" placeholder="Value" value={newRule.value} onChange={(e) => setNewRule({ ...newRule, value: e.target.value })} />
          <button type="submit" className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-3 rounded">Add Rule</button>
        </form>
        <div className="mt-4">
          <h4 className="text-white font-semibold mb-2">Current Rules</h4>
          <ul className="space-y-1">
            {rules.map((r, idx) => (
              <li key={r.id || idx} className="text-gray-300 text-sm">• [{r.type}] {r.rule_name}: <span className="font-mono">{r.value}</span></li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

// --- Helper Components for Cleanliness ---

const StatCard = ({ title, value, color }) => (
  <div className={`${color} p-5 rounded-xl shadow-2xl transition duration-300 hover:scale-[1.02]`}>
    <p className="text-sm font-medium text-white opacity-80">{title}</p>
    <p className="text-4xl font-extrabold mt-1 text-white">{value}</p>
  </div>
);

const TableHeader = ({ children }) => (
  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
    {children}
  </th>
);

const TableData = ({ children, className = '' }) => (
  <td className={`px-6 py-4 whitespace-nowrap text-sm text-gray-200 ${className}`}>
    {children}
  </td>
);

export default ShieldDashboard;
