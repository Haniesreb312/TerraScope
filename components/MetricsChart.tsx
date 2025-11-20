import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { EconomicMetric } from '../types';

interface MetricsChartProps {
  data: EconomicMetric[];
  isDark: boolean;
}

export const MetricsChart: React.FC<MetricsChartProps> = ({ data, isDark }) => {
  return (
    <div className="w-full h-[300px] mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <defs>
            <linearGradient id="colorGdp" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#38bdf8" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorInflation" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f87171" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#f87171" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke={isDark ? "#334155" : "#e2e8f0"} 
            vertical={false} 
          />
          <XAxis 
            dataKey="year" 
            stroke={isDark ? "#94a3b8" : "#64748b"}
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            stroke={isDark ? "#94a3b8" : "#64748b"} 
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value}%`}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: isDark ? '#1e293b' : '#ffffff', 
              borderColor: isDark ? '#334155' : '#cbd5e1',
              borderRadius: '12px',
              color: isDark ? '#f1f5f9' : '#1e293b',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
            }}
            itemStyle={{ color: isDark ? '#e2e8f0' : '#334155' }}
          />
          <Legend wrapperStyle={{ paddingTop: '20px' }} />
          <Area 
            type="monotone" 
            dataKey="gdp" 
            name="GDP Growth" 
            stroke="#38bdf8" 
            fillOpacity={1} 
            fill="url(#colorGdp)" 
            strokeWidth={2}
          />
          <Area 
            type="monotone" 
            dataKey="inflation" 
            name="Inflation" 
            stroke="#f87171" 
            fillOpacity={1} 
            fill="url(#colorInflation)" 
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
