import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const SensorChart = ({ data, profileId, onClose }) => {
  if (!profileId) return null;

  return (
   
    <div className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm border border-gray-200 shadow-xl transition-all duration-300 z-10 h-56 p-3 mx-4 mb-4 rounded-xl">
      
      {/* Header  */}
      <div className="flex justify-between items-center mb-1 px-2">
        <h2 className="text-sm font-bold text-slate-800">
          📊 <span className="text-blue-600">{profileId}</span> History
        </h2>
        <button 
          onClick={onClose}
          className="text-gray-400 hover:text-red-500 text-xs font-bold transition-colors"
        >
          ✕ Close
        </button>
      </div>

      {/* Chart  */}
      <div className="w-full h-40">
        <ResponsiveContainer>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
            <XAxis 
                dataKey="time" 
                tick={{fontSize: 10, fill: '#9ca3af'}} 
                interval="preserveStartEnd" 
            />
            <YAxis tick={{fontSize: 10, fill: '#9ca3af'}} />
            <Tooltip 
              contentStyle={{ fontSize: '12px', borderRadius: '8px', border: 'none', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}
            />
            <Line type="monotone" dataKey="temperature" stroke="#3b82f6" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
            <Line type="monotone" dataKey="humidity" stroke="#10b981" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SensorChart;