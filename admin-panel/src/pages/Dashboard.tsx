import { useEffect, useState } from 'react';
import { Users, Activity, Heart, ShieldAlert } from 'lucide-react';
import api from '../services/api';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    reports: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/admin/users');
        const users = response.data;
        setStats({
          totalUsers: users.length,
          activeUsers: users.filter((u: any) => u.isVerified).length, // simple proxy for now
          reports: 0,
        });
      } catch (error) {
        console.error('Failed to fetch stats', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const cards = [
    { title: 'Total Users', value: stats.totalUsers, icon: Users, color: 'from-blue-500 to-cyan-400' },
    { title: 'Active (Verified)', value: stats.activeUsers, icon: Activity, color: 'from-green-500 to-emerald-400' },
    { title: 'New Matches', value: '124', icon: Heart, color: 'from-pink-500 to-rose-400' },
    { title: 'Pending Reports', value: stats.reports, icon: ShieldAlert, color: 'from-orange-500 to-red-400' },
  ];

  if (loading) {
    return <div className="animate-pulse flex space-x-4">Loading stats...</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-slate-400">Welcome back to the admin portal.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div key={idx} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden group hover:border-slate-700 transition-colors">
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${card.color} opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity`} />
              
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-300`}>
                  <Icon size={24} />
                </div>
              </div>
              
              <div>
                <h3 className="text-slate-400 font-medium mb-1">{card.title}</h3>
                <p className="text-3xl font-bold text-white">{card.value}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
