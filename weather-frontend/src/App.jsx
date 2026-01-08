import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from './components/Sidebar';
import MapView from './components/MapView';
import SensorChart from './components/SensorChart';

// UPDATED: Now points to your live Koyeb backend
const API_BASE_URL = "https://deliberate-ginny-nadeeshani-71eaf45d.koyeb.app/api";

function App() {
  const [profiles, setProfiles] = useState([]);
  const [historyData, setHistoryData] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/profiles/latest`)
      .then(res => {
        if (Array.isArray(res.data)) {
          const sortedData = res.data.sort((a, b) => 
            (a.metadata?.sensorId || "").localeCompare(b.metadata?.sensorId || "")
          );
          setProfiles(sortedData);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Fetch Error:", err);
        setLoading(false);
      });
  }, []);

  const handleSelect = async (sensorId) => {
    if (!sensorId) return;
    setSelectedId(sensorId);
    try {
      const res = await axios.get(`${API_BASE_URL}/history/${sensorId}`);
      if (res.data && Array.isArray(res.data)) {
        const formatted = res.data.map(item => ({
          ...item,
          time: item.timestamp?.$date 
            ? new Date(item.timestamp.$date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
            : new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }));
        setHistoryData(formatted);
      }
    } catch (err) { console.error(err); }
  };

  if (loading) return (
    <div className="h-screen w-screen flex items-center justify-center bg-slate-900 text-white font-mono tracking-tighter">
      LOADING_DATABASE_SYSTEM...
    </div>
  );

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-gray-50 font-sans">
      
      {/* --- DASHBOARD HEADER --- */}
      <header className="h-16 bg-slate-900 border-b border-slate-700 flex items-center justify-between px-6 shadow-xl z-20">
        <div className="flex items-center gap-4">
          <div className="bg-blue-600 p-2 rounded-lg">
            <span className="text-white font-black text-xl">SL</span>
          </div>
          <div>
            <h1 className="text-white font-bold text-lg leading-tight">Weather Intelligence</h1>
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="text-slate-400 text-[10px] uppercase tracking-widest font-semibold">Live System Active</span>
            </div>
          </div>
        </div>

        <div className="hidden md:flex flex-col items-end">
          <span className="text-white font-mono text-lg">
            {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </span>
          <span className="text-slate-400 text-[10px] uppercase">
            {currentTime.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </span>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar 
          profiles={profiles} 
          selectedId={selectedId} 
          onSelect={handleSelect} 
        />

        <div className="flex-1 relative flex flex-col">
          <div className="flex-1 relative z-0">
            <MapView 
              profiles={profiles} 
              selectedId={selectedId} 
              onSelect={handleSelect} 
            />
          </div>
          
          <SensorChart 
            data={historyData} 
            profileId={selectedId} 
            onClose={() => setSelectedId(null)} 
          />
        </div>
      </div>
    </div>
  );
}

export default App;