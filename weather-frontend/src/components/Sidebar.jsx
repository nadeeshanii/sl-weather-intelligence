const Sidebar = ({ profiles, selectedId, onSelect }) => {
  return (
    <div className="w-64 bg-white shadow-lg overflow-y-auto h-full p-4 border-r border-gray-200">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Weather Stations</h2>
      <div className="space-y-2">
        {profiles.map((p) => {
          // Identify the sensor 
          const sensorId = p.metadata?.sensorId || `Station ${p._id.substring(0, 5)}`;
          const isActive = selectedId === sensorId;

          return (
            <button
              key={p._id}
              onClick={() => onSelect(sensorId, { lat: p.coordinates[1], lng: p.coordinates[0] })}
              className={`w-full text-left p-3 rounded-lg transition-all ${
                isActive 
                  ? 'bg-blue-600 text-white shadow-md scale-105' 
                  : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-100'
              }`}
            >
              <div className="font-semibold">{sensorId}</div>
              <div className="text-xs opacity-80">
                {p.temperature}°C | {p.humidity}% Hum
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;