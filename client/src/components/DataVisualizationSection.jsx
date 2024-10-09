import React, { useState, useEffect, useContext } from 'react';
import { PowerBIEmbed } from 'powerbi-client-react';
import { models } from 'powerbi-client';
import { ThemeContext } from '../ThemeContext';

const DataVisualizationSection = () => {
  const [reportConfig, setReportConfig] = useState(null);
  const { isDarkMode } = useContext(ThemeContext);

  useEffect(() => {
    const fetchReportConfig = async () => {
      const response = await fetch('/api/powerbi-config');
      const config = await response.json();
      setReportConfig(config);
    };
    fetchReportConfig();
  }, []);

  if (!reportConfig) return <div className={`text-${isDarkMode ? 'text-primary' : 'gray-800'}`}>Loading...</div>;

  return (
    <div className={`h-[600px] w-full ${isDarkMode ? 'bg-surface' : 'bg-white'} rounded-lg overflow-hidden shadow-lg`}>
      <PowerBIEmbed
        embedConfig={{
          type: 'report',
          id: reportConfig.reportId,
          embedUrl: reportConfig.embedUrl,
          accessToken: reportConfig.accessToken,
          settings: {
            panes: {
              filters: {
                expanded: false,
                visible: false
              }
            },
            background: isDarkMode ? models.BackgroundType.Transparent : models.BackgroundType.Default,
          }
        }}
      />
    </div>
  );
};

export default DataVisualizationSection;