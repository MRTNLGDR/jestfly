
import React, { useState } from 'react';
import GlassHeader from '@/components/GlassHeader';
import Footer from '@/components/Footer';
import LogsFilter from '@/components/logs/LogsFilter';
import { LogLevel, LogSource } from '@/components/logs/LogsFilter';
import LogsTable from '@/components/logs/LogsTable';
import LogsTabs from '@/components/logs/LogsTabs';
import { LogType } from '@/types/logs';

const LogsPage: React.FC = () => {
  const [filters, setFilters] = useState({
    level: null as LogLevel | null,
    source: null as LogSource | null,
    search: '',
    startDate: null as Date | null,
    endDate: null as Date | null,
  });

  // Sample logs data (in a real app, this would come from API)
  const sampleLogs: LogType[] = [
    {
      id: '1',
      timestamp: new Date().toISOString(),
      level: LogLevel.INFO,
      source: LogSource.SYSTEM,
      message: 'Application started',
      userId: null,
      metadata: {}
    },
    {
      id: '2',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      level: LogLevel.ERROR,
      source: LogSource.CLIENT,
      message: 'Failed to load resource',
      userId: 'user123',
      metadata: { resource: 'image.jpg', error: 'Not found' }
    },
  ];

  const menuItems = [
    { label: 'Home', href: '/' },
    { label: 'Logs', href: '/logs' },
    { label: 'Admin', href: '/admin' },
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
        <h1 className="text-4xl font-light mb-6 text-gradient-primary">System Logs</h1>
        
        <LogsFilter
          onFilterChange={handleFilterChange}
          currentFilters={filters}
        />
        
        <LogsTabs 
          defaultValue="all"
          tabValues={[
            { value: 'all', label: 'All Logs', count: sampleLogs.length },
            { value: 'errors', label: 'Errors', count: sampleLogs.filter(log => log.level === LogLevel.ERROR).length },
            { value: 'warnings', label: 'Warnings', count: sampleLogs.filter(log => log.level === LogLevel.WARN).length },
          ]}
        >
          <LogsTable logs={sampleLogs} />
        </LogsTabs>
      </main>
      
      <Footer />
    </div>
  );
};

export default LogsPage;
