
import React, { useState } from 'react';
import GlassHeader from '@/components/GlassHeader';
import Footer from '@/components/Footer';
import LogsFilter from '@/components/logs/LogsFilter';
import LogsTable from '@/components/logs/LogsTable';
import LogsTabs from '@/components/logs/LogsTabs';
import { LogLevel, LogSource, LogModule, Log } from '@/types/logs';

const LogsPage: React.FC = () => {
  const [filters, setFilters] = useState({
    level: null as LogLevel | null,
    source: null as LogSource | null,
    search: '',
    startDate: null as Date | null,
    endDate: null as Date | null,
  });

  // Sample logs data for the viewer
  const viewerLogs: Log[] = [
    {
      id: '1',
      timestamp: new Date().toISOString(),
      level: LogLevel.INFO,
      source: LogSource.SYSTEM,
      type: LogModule.SYSTEM,
      message: 'User session started',
      userId: 'user123',
      metadata: { browser: 'Chrome', os: 'Windows' }
    },
    {
      id: '2',
      timestamp: new Date(Date.now() - 1800000).toISOString(),
      level: LogLevel.DEBUG,
      source: LogSource.CLIENT,
      type: LogModule.USER,
      message: 'Component mounted',
      userId: 'user123',
      metadata: { component: 'Dashboard' }
    },
  ];

  const handleFilterChange = (newFilters: Partial<typeof filters>) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters
    }));
  };

  return (
    <div className="min-h-screen bg-black">
      <GlassHeader />
      
      <main className="container mx-auto px-4 pt-24 pb-20">
        <h1 className="text-4xl font-light mb-6 text-gradient-primary">Logs Viewer</h1>
        
        <LogsFilter
          currentFilters={filters}
          onFilterChange={handleFilterChange}
        />
        
        <LogsTabs 
          defaultValue="session"
          tabValues={[
            { value: 'session', label: 'Current Session', count: viewerLogs.length },
            { value: 'user', label: 'User Logs', count: 0 },
          ]}
        >
          <LogsTable logs={viewerLogs} isLoading={false} />
        </LogsTabs>
      </main>
      
      <Footer />
    </div>
  );
};

export default LogsPage;
