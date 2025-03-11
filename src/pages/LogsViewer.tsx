
import React, { useState } from 'react';
import GlassHeader from '@/components/GlassHeader';
import Footer from '@/components/Footer';
import LogsFilter from '@/components/logs/LogsFilter';
import LogsTable from '@/components/logs/LogsTable';
import LogsTabs from '@/components/logs/LogsTabs';
import { LogLevel, LogSource, LogType } from '@/types/logs';

const LogsViewer: React.FC = () => {
  const [filters, setFilters] = useState({
    level: null as LogLevel | null,
    source: null as LogSource | null,
    search: '',
    startDate: null as Date | null,
    endDate: null as Date | null,
  });

  // Sample logs data for the viewer
  const viewerLogs: LogType[] = [
    {
      id: '1',
      timestamp: new Date().toISOString(),
      level: LogLevel.INFO,
      source: LogSource.SYSTEM,
      message: 'User session started',
      userId: 'user123',
      metadata: { browser: 'Chrome', os: 'Windows' }
    },
    {
      id: '2',
      timestamp: new Date(Date.now() - 1800000).toISOString(),
      level: LogLevel.DEBUG,
      source: LogSource.CLIENT,
      message: 'Component mounted',
      userId: 'user123',
      metadata: { component: 'Dashboard' }
    },
  ];

  const menuItems = [
    { label: 'Home', href: '/' },
    { label: 'Logs', href: '/logs' },
    { label: 'Back', href: '/admin' },
  ];

  const handleFilterChange = (newFilters: {
    level?: LogLevel;
    source?: LogSource;
    search?: string;
    startDate?: Date;
    endDate?: Date;
  }) => {
    setFilters({
      level: newFilters.level || null,
      source: newFilters.source || null,
      search: newFilters.search !== undefined ? newFilters.search : filters.search,
      startDate: newFilters.startDate || null,
      endDate: newFilters.endDate || null,
    });
  };

  return (
    <div className="min-h-screen bg-black">
      <GlassHeader menuItems={menuItems} />
      
      <main className="container mx-auto px-4 pt-24 pb-20">
        <h1 className="text-4xl font-light mb-6 text-gradient-primary">Logs Viewer</h1>
        
        <LogsFilter
          onFilterChange={handleFilterChange}
          currentFilters={filters}
        />
        
        <LogsTabs 
          defaultValue="session"
          tabValues={[
            { value: 'session', label: 'Current Session', count: viewerLogs.length },
            { value: 'user', label: 'User Logs', count: 0 },
          ]}
        >
          <LogsTable logs={viewerLogs} />
        </LogsTabs>
      </main>
      
      <Footer />
    </div>
  );
};

export default LogsViewer;
