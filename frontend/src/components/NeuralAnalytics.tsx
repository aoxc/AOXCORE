import React, { useState } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  BarChart,
  Bar
} from 'recharts';
import { useAoxcStore } from '../store/useAoxcStore';
import { useTranslation } from 'react-i18next';
import { Activity, TrendingUp, Zap, Wallet, BarChart2, Clock } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

export const NeuralAnalytics = () => {
  const { analyticsData, gasEfficiency, networkLoad } = useAoxcStore();
  const { t } = useTranslation();
  const [timeRange, setTimeRange] = useState('1H');

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-black/90 border border-white/10 p-3 rounded-xl backdrop-blur-md shadow-2xl z-50">
          <p className="text-[10px] text-white/40 mb-2 font-mono">EPOCH: {label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: entry.color }} />
              <span className="text-[11px] font-bold text-white uppercase tracking-tight">
                {entry.name}: {entry.value.toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex-1 overflow-auto bg-[#0a0a0a] p-4 md:p-8 space-y-8 scrollbar-hide pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="flex flex-col">
          <h2 className="text-cyan-400 font-mono text-[10px] font-bold uppercase tracking-[0.3em] mb-1">
            {t('analytics.title', 'Neural Analytics Engine')}
          </h2>
          <span className="text-[8px] font-mono text-white/20 uppercase tracking-widest">Real-time XLayer-Reth Telemetry</span>
        </div>

        {/* Time Range Selector */}
        <div className="flex items-center bg-white/5 rounded-lg p-1 border border-white/10 self-start md:self-auto">
          {['1H', '24H', '7D', '30D'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={cn(
                "px-3 py-1 rounded-md text-[10px] font-bold transition-all",
                timeRange === range 
                  ? "bg-cyan-500 text-black shadow-lg shadow-cyan-500/20" 
                  : "text-white/40 hover:text-white hover:bg-white/5"
              )}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <StatCard 
          icon={Zap} 
          label="Gas Efficiency" 
          value={`${gasEfficiency}%`} 
          trend="+2.4%" 
          color="text-emerald-500" 
        />
        <StatCard 
          icon={Activity} 
          label="Network Latency" 
          value={networkLoad} 
          trend="-0.1ms" 
          color="text-cyan-500" 
        />
        <StatCard 
          icon={Wallet} 
          label="Treasury Balance" 
          value={`$${(analyticsData[analyticsData.length - 1]?.treasury / 1000000).toFixed(2)}M`} 
          trend="+12K" 
          color="text-purple-500" 
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        {/* Gas & Load Chart */}
        <div className="bg-white/[0.02] border border-white/5 rounded-[2rem] p-6 md:p-8 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <h3 className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-8 flex items-center gap-2">
            <TrendingUp size={12} className="text-cyan-500" />
            Network Performance
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analyticsData}>
                <defs>
                  <linearGradient id="colorGas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorLoad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis dataKey="timestamp" hide />
                <YAxis hide domain={['auto', 'auto']} />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#ffffff10', strokeWidth: 1 }} />
                <Area 
                  type="monotone" 
                  dataKey="gas" 
                  name="Gas"
                  stroke="#10b981" 
                  fillOpacity={1} 
                  fill="url(#colorGas)" 
                  strokeWidth={2}
                />
                <Area 
                  type="monotone" 
                  dataKey="load" 
                  name="Load"
                  stroke="#06b6d4" 
                  fillOpacity={1} 
                  fill="url(#colorLoad)" 
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Treasury Chart */}
        <div className="bg-white/[0.02] border border-white/5 rounded-[2rem] p-6 md:p-8 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <h3 className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-8 flex items-center gap-2">
            <Wallet size={12} className="text-purple-500" />
            Treasury Growth
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analyticsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis dataKey="timestamp" hide />
                <YAxis hide domain={['auto', 'auto']} />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#ffffff10', strokeWidth: 1 }} />
                <Line 
                  type="stepAfter" 
                  dataKey="treasury" 
                  name="Treasury"
                  stroke="#a855f7" 
                  strokeWidth={3} 
                  dot={false}
                  animationDuration={1000}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Transaction Volume Bar Chart (New) */}
        <div className="col-span-1 lg:col-span-2 bg-white/[0.02] border border-white/5 rounded-[2rem] p-6 md:p-8 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <h3 className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-8 flex items-center gap-2">
            <BarChart2 size={12} className="text-amber-500" />
            Transaction Volume (TPS)
          </h3>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analyticsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis dataKey="timestamp" hide />
                <YAxis hide />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#ffffff05' }} />
                <Bar 
                  dataKey="gas" 
                  name="TPS" 
                  fill="#f59e0b" 
                  radius={[4, 4, 0, 0]} 
                  barSize={20}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon: Icon, label, value, trend, color }: any) => (
  <motion.div 
    whileHover={{ y: -4 }}
    className="bg-white/[0.03] border border-white/10 p-6 rounded-3xl relative overflow-hidden group"
  >
    <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    <div className="flex items-start justify-between relative z-10">
      <div className="flex flex-col">
        <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest mb-2">{label}</span>
        <span className={cn("text-2xl font-bold tracking-tighter tabular-nums", color)}>{value}</span>
      </div>
      <div className={cn("p-3 rounded-2xl bg-white/5", color.replace('text-', 'text-opacity-20 bg-'))}>
        <Icon size={20} />
      </div>
    </div>
    <div className="mt-4 flex items-center gap-2 relative z-10">
      <span className="text-[10px] font-bold text-emerald-500">{trend}</span>
      <span className="text-[8px] text-white/20 uppercase tracking-widest">vs last epoch</span>
    </div>
  </motion.div>
);
