
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LogsFilter, LogLevel, LogSource } from "@/components/logs/LogsFilter";
import { LogsTable } from "@/components/logs/LogsTable";
import { LogsTabs } from "@/components/logs/LogsTabs";
import { AnyLogEntry, SystemLogEntry, LogEntry } from '@/types/logs';

// This component would be used to view logs for a specific resource
// For example: /logs/user/123 or /logs/post/456
const LogsViewer = () => {
  const { resourceType, resourceId } = useParams<{ resourceType?: string, resourceId?: string }>();
  
  const [activeTab, setActiveTab] = useState<string>('system');
  const [filters, setFilters] = useState({
    search: '',
    level: 'all' as LogLevel,
    source: 'all' as LogSource
  });
  
  const [logs, setLogs] = useState<AnyLogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLogs = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // In a real app, this would be an API call filtered by resourceType and resourceId
        // For example: await api.getLogs({ resourceType, resourceId, ...filters })
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Example response based on the resource being viewed
        const dummyLogs: AnyLogEntry[] = [
          {
            id: `log-${resourceType}-1`,
            timestamp: new Date().toISOString(),
            message: `Activity for ${resourceType} ${resourceId}`,
            action: 'view',
            user_id: 'current-user'
          },
          {
            id: `log-${resourceType}-2`,
            timestamp: new Date(Date.now() - 3600000).toISOString(),
            level: 'info',
            source: 'system',
            message: `System processed ${resourceType} ${resourceId}`,
            metadata: { details: 'Example metadata' }
          } as SystemLogEntry
        ];
        
        setLogs(dummyLogs);
      } catch (err) {
        setError(`Failed to load logs for ${resourceType} ${resourceId}`);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (resourceType && resourceId) {
      fetchLogs();
    }
  }, [resourceType, resourceId, activeTab, filters]);

  // Corrected handler function that accepts partial filter updates
  const handleFilterChange = (newFilters: Partial<typeof filters>) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      ...newFilters
    }));
  };

  if (!resourceType || !resourceId) {
    return (
      <div className="container mx-auto py-6 px-4">
        <Alert variant="destructive">
          <AlertDescription>
            Invalid resource specification. Please provide both resource type and ID.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <h1 className="text-2xl font-bold mb-6">
        Logs for {resourceType.charAt(0).toUpperCase() + resourceType.slice(1)}: {resourceId}
      </h1>
      
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <Card>
        <CardHeader>
          <CardTitle>Activity Log</CardTitle>
        </CardHeader>
        <CardContent>
          <LogsTabs activeTab={activeTab} onTabChange={setActiveTab}>
            <div>
              <LogsFilter 
                filters={filters}
                onFilterChange={handleFilterChange}
              />
              
              <LogsTable 
                logs={logs}
                isLoading={isLoading}
              />
            </div>
          </LogsTabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default LogsViewer;
