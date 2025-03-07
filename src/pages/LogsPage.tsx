
import React, { useState, useEffect } from 'react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LogsFilter, LogLevel, LogSource } from "@/components/logs/LogsFilter";
import { LogsTable } from "@/components/logs/LogsTable";
import { LogsTabs } from "@/components/logs/LogsTabs";
import { AnyLogEntry, SystemLogEntry, LogEntry } from '@/types/logs';

// Dummy data for demonstration purposes
const dummySystemLogs: SystemLogEntry[] = [
  {
    id: 'sys-1',
    timestamp: new Date().toISOString(),
    level: 'error',
    source: 'system',
    message: 'Failed to connect to database',
    metadata: { 
      error: 'ECONNREFUSED',
      attempts: 3
    }
  },
  {
    id: 'sys-2',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    level: 'warning',
    source: 'api',
    message: 'API rate limit approaching',
    metadata: { 
      limit: '100/hour',
      current: 85
    }
  },
  {
    id: 'sys-3',
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    level: 'info',
    source: 'auth',
    message: 'User login successful',
    metadata: { 
      userId: 'user-123'
    }
  },
];

const dummyUserLogs: LogEntry[] = [
  {
    id: 'user-1',
    timestamp: new Date().toISOString(),
    user_id: 'user-123',
    action: 'profile_update',
    message: 'Updated profile information',
    resource: 'profile',
    resource_id: 'user-123'
  },
  {
    id: 'user-2',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    user_id: 'user-456',
    action: 'post_create',
    message: 'Created a new post',
    resource: 'post',
    resource_id: 'post-789'
  },
  {
    id: 'user-3',
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    user_id: 'user-123',
    action: 'comment_delete',
    message: 'Deleted a comment',
    resource: 'comment',
    resource_id: 'comment-456'
  },
];

const LogsPage = () => {
  const [activeTab, setActiveTab] = useState<string>('system');
  const [filters, setFilters] = useState({
    search: '',
    level: 'all' as LogLevel,
    source: 'all' as LogSource
  });
  
  const [filteredLogs, setFilteredLogs] = useState<AnyLogEntry[]>(dummySystemLogs);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Apply filters whenever filters or activeTab changes
  useEffect(() => {
    setIsLoading(true);
    setError(null);

    try {
      // In a real app, this would be an API call
      setTimeout(() => {
        const logs = activeTab === 'system' ? dummySystemLogs : dummyUserLogs;
        
        let result = [...logs];
        
        // Apply search filter
        if (filters.search) {
          const searchLower = filters.search.toLowerCase();
          result = result.filter(log => 
            log.message.toLowerCase().includes(searchLower) ||
            log.id.toLowerCase().includes(searchLower)
          );
        }
        
        // Apply level filter for system logs
        if (activeTab === 'system' && filters.level !== 'all') {
          result = result.filter(log => 
            'level' in log && log.level === filters.level
          );
        }
        
        // Apply source filter for system logs
        if (activeTab === 'system' && filters.source !== 'all') {
          result = result.filter(log => 
            'source' in log && log.source === filters.source
          );
        }
        
        setFilteredLogs(result);
        setIsLoading(false);
      }, 500); // Simulate API delay
    } catch (err) {
      setError('Failed to load logs. Please try again.');
      setIsLoading(false);
    }
  }, [filters, activeTab]);

  // Updated to handle partial filter changes
  const handleFilterChange = (newFilters: Partial<typeof filters>) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      ...newFilters
    }));
  };

  return (
    <div className="container mx-auto py-6 px-4">
      <h1 className="text-2xl font-bold mb-6">System Logs & Activity</h1>
      
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Log Explorer</CardTitle>
        </CardHeader>
        <CardContent>
          <LogsTabs activeTab={activeTab} onTabChange={setActiveTab}>
            <div>
              <LogsFilter 
                filters={filters}
                onFilterChange={handleFilterChange}
              />
              
              <LogsTable 
                logs={filteredLogs}
                isLoading={isLoading}
              />
            </div>
          </LogsTabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default LogsPage;
