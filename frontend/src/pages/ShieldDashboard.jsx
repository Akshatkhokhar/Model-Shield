import React from 'react';

// Mock data to show the dashboard layout before connecting to Supabase
const MOCK_THREAT_LOGS = [
  { id: 1, timestamp: '2025-11-27 14:30:00', threat_type: 'Prompt_Injection', input_prompt: 'Ignore all previous...', blocked_content: 'ignore all previous', user_id: 'user-001' },
  { id: 2, timestamp: '2025-11-27 14:35:15', threat_type: 'Unsafe_Content', input_prompt: 'I hate those people...', blocked_content: 'hate', user_id: 'user-002' },
  { id: 3, timestamp: '2025-11-27 14:40:40', threat_type: 'Hallucination', input_prompt: 'Tell me a fact...', blocked_content: 'fact check failed: 99.9%', user_id: 'user-003' },
  { id: 4, timestamp: '2025-11-27 14:45:05', threat_type: 'Prompt_Injection', input_prompt: 'Disregard the rules', blocked_content: 'Disregard', user_id: 'user-001' },
];

function ShieldDashboard() {
  
  // Calculate some quick stats for the overview panel
  const totalLogs = MOCK_THREAT_LOGS.length;
  const injectionCount = MOCK_THREAT_LOGS.filter(log => log.threat_type === 'Prompt_Injection').length;
  const hallucinationCount = MOCK_THREAT_LOGS.filter(log => log.threat_type === 'Hallucination').length;

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
        <h3 className="text-xl font-semibold mb-4 text-white">Recent Threat Activity</h3>
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
              {MOCK_THREAT_LOGS.map((log) => (
                <tr key={log.id} className="hover:bg-gray-600 transition duration-150">
                  <TableData>{log.timestamp.split(' ')[1]}</TableData>
                  <TableData>
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${log.threat_type === 'Prompt_Injection' ? 'bg-yellow-100 text-yellow-800' : 
                        log.threat_type === 'Hallucination' ? 'bg-blue-100 text-blue-800' : 
                        'bg-red-100 text-red-800'}`}>
                      {log.threat_type.replace('_', ' ')}
                    </span>
                  </TableData>
                  <TableData className="truncate max-w-xs">{log.input_prompt}</TableData>
                  <TableData className="font-mono text-xs text-red-300">{log.blocked_content}</TableData>
                  <TableData>{log.user_id}</TableData>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-sm italic text-gray-400">
          *Data shown is mock data. Connect Supabase to fetch live logs.
        </p>
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