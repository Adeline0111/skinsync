
import React, { useMemo } from 'react';
import { UserProfile } from '../types';
import { Card, Badge } from '../components/UI';
import { db } from '../services/storageService';

const DashboardView: React.FC<{ user: UserProfile }> = ({ user }) => {
  const products = db.getUserProducts(user.id);
  const logs = db.getRoutineLogs(user.id);

  const healthScore = useMemo(() => {
    // Basic logic: base 60 + consistency bonus + profile bonus
    let score = 65;
    const recentLogs = logs.slice(-7);
    if (recentLogs.length > 0) {
      const completedCount = recentLogs.reduce((acc, log) => 
        acc + (log.morningCompleted ? 1 : 0) + (log.nightCompleted ? 1 : 0), 0
      );
      score += (completedCount / (recentLogs.length * 2)) * 30;
    }
    if (products.length >= 3) score += 5;
    return Math.min(Math.round(score), 100);
  }, [logs, products]);

  const routineStatus = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const todayLog = logs.find(l => l.date === today);
    return {
      morning: todayLog?.morningCompleted || false,
      night: todayLog?.nightCompleted || false
    };
  }, [logs]);

  return (
    <div className="space-y-8 animate-fadeIn">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm uppercase tracking-widest font-semibold">Welcome back,</p>
          <h1 className="text-3xl font-serif text-white">{user.name.split(' ')[0]}</h1>
        </div>
        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#c5a059] p-0.5">
          <img src={`https://picsum.photos/seed/${user.id}/100/100`} alt="Profile" className="w-full h-full rounded-full object-cover" />
        </div>
      </header>

      {/* Health Score Wheel */}
      <section className="relative flex flex-col items-center justify-center py-10 bg-gradient-to-b from-[#1a1c23] to-transparent rounded-3xl border border-white/5">
        <div className="relative w-48 h-48 flex items-center justify-center">
          <svg className="absolute inset-0 w-full h-full -rotate-90">
            <circle cx="96" cy="96" r="80" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-white/5" />
            <circle 
              cx="96" cy="96" r="80" stroke="currentColor" strokeWidth="8" fill="transparent" 
              strokeDasharray={2 * Math.PI * 80}
              strokeDashoffset={2 * Math.PI * 80 * (1 - healthScore / 100)}
              className="text-[#c5a059] transition-all duration-1000"
              strokeLinecap="round"
            />
          </svg>
          <div className="text-center">
            <span className="text-5xl font-serif text-white">{healthScore}</span>
            <p className="text-xs text-[#c5a059] uppercase tracking-widest font-bold mt-1">Health Score</p>
          </div>
        </div>
        <p className="mt-8 text-gray-400 text-sm text-center px-8">
          Your skin is <span className="text-white font-semibold">improving</span>! Consistency this week is {healthScore > 80 ? 'excellent' : 'steady'}.
        </p>
      </section>

      {/* Today's Routine Shortcut */}
      <section className="space-y-4">
        <h3 className="text-xs font-semibold text-[#c5a059] uppercase tracking-widest">Today's Routine</h3>
        <div className="grid grid-cols-2 gap-4">
          <Card className={`flex flex-col items-center gap-3 transition-all ${routineStatus.morning ? 'border-[#c5a059]/30 bg-[#c5a059]/5' : ''}`}>
            <span className="text-3xl">☀️</span>
            <div className="text-center">
              <p className="text-sm font-bold">Morning</p>
              <p className="text-[10px] text-gray-500">{routineStatus.morning ? 'COMPLETED' : 'INCOMPLETE'}</p>
            </div>
          </Card>
          <Card className={`flex flex-col items-center gap-3 transition-all ${routineStatus.night ? 'border-[#c5a059]/30 bg-[#c5a059]/5' : ''}`}>
            <span className="text-3xl">🌙</span>
            <div className="text-center">
              <p className="text-sm font-bold">Night</p>
              <p className="text-[10px] text-gray-500">{routineStatus.night ? 'COMPLETED' : 'INCOMPLETE'}</p>
            </div>
          </Card>
        </div>
      </section>

      {/* AI Insights */}
      <section className="space-y-4">
        <h3 className="text-xs font-semibold text-[#c5a059] uppercase tracking-widest">Personalized Insights</h3>
        <Card className="bg-gradient-to-br from-[#1a1c23] to-[#0f1115] border-[#c5a059]/20">
          <div className="flex items-start gap-4">
            <div className="bg-[#c5a059]/20 p-2 rounded-lg text-[#c5a059]">✨</div>
            <div>
              <p className="text-sm text-gray-200 leading-relaxed">
                Since your concern is <span className="text-[#c5a059]">{user.concerns[0] || 'skin health'}</span>, 
                remember to reapply your sunscreen every 2-3 hours today for maximum protection.
              </p>
            </div>
          </div>
        </Card>
      </section>

      {/* Weekly Stats */}
      <section className="space-y-4">
        <h3 className="text-xs font-semibold text-[#c5a059] uppercase tracking-widest">Weekly Consistency</h3>
        <div className="flex justify-between items-end h-24 px-2">
          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
            <div key={day + i} className="flex flex-col items-center gap-2">
              <div 
                className={`w-6 rounded-full transition-all duration-700 ${i < 4 ? 'bg-[#c5a059]' : 'bg-white/5'}`} 
                style={{ height: `${[80, 100, 60, 90, 40, 20, 10][i]}%` }}
              ></div>
              <span className="text-[10px] text-gray-500 font-bold">{day}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default DashboardView;
