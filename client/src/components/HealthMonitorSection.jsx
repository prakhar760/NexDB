import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { ThemeContext } from '../ThemeContext';

const HealthMonitorSection = () => {
  const [metrics, setMetrics] = useState(null);
  const { isDarkMode } = useContext(ThemeContext);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await axios.get('/api/db-health');
        setMetrics(response.data);
      } catch (error) {
        console.error('Error fetching health metrics:', error);
      }
    };
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 60000);
    return () => clearInterval(interval);
  }, []);

  if (!metrics) return <div className={isDarkMode ? 'text-text-primary' : 'text-gray-800'}>Loading health metrics...</div>;

  const cardClass = isDarkMode
    ? 'bg-surface text-text-primary'
    : 'bg-white text-gray-800 border border-gray-200';

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className={`p-4 rounded ${cardClass}`}>
        <h3 className="font-bold">Database Size</h3>
        <p>{metrics.size}</p>
      </div>
      <div className={`p-4 rounded ${cardClass}`}>
        <h3 className="font-bold">Number of Collections</h3>
        <p>{metrics.collections}</p>
      </div>
      <div className={`p-4 rounded ${cardClass}`}>
        <h3 className="font-bold">Average Query Time</h3>
        <p>{metrics.avgQueryTime}ms</p>
      </div>
      <div className={`p-4 rounded ${cardClass}`}>
        <h3 className="font-bold">Active Connections</h3>
        <p>{metrics.activeConnections}</p>
      </div>
    </div>
  );
};

export default HealthMonitorSection;