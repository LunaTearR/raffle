import { useEffect, useState } from 'react';
import { getRaffleLogs, resetSystem, getSystemState, type RaffleLog } from '../services/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { History, Download, Trophy, Calendar, RotateCcw } from "lucide-react";
import { useNavigate } from 'react-router-dom';

export default function LogsPage() {
  const [logs, setLogs] = useState<RaffleLog[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkStateAndFetch = async () => {
      // Check state first
      try {
        const stateRes = await getSystemState();
        if (stateRes.success && stateRes.data?.state === 'RAFFLE_STARTED') {
          alert('Raffle is currently active!');
          navigate('/raffle');
          return;
        }
      } catch (e) {
        console.error('State check failed');
      }

      fetchLogs();
    };

    checkStateAndFetch();
  }, []);

  const fetchLogs = async () => {
    try {
      const response = await getRaffleLogs();
      if (response.success && response.data) {
        setLogs(response.data);
      }
    } catch (err) {
      console.error('Failed to fetch logs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStartNewRaffle = async () => {
    if (confirm('Start a new raffle session? This will open registration for new students.')) {
      try {
        await resetSystem();
        navigate('/waiting');
      } catch (err) {
        alert('Failed to reset system');
      }
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { 
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <History className="w-8 h-8" />
              Raffle History
            </h1>
            <p className="text-muted-foreground mt-1">
              {formatDate(new Date().toISOString())}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleStartNewRaffle} className="border-green-500 text-green-600 hover:bg-green-50">
              <RotateCcw className="w-4 h-4 mr-2" />
              Start New Raffle
            </Button>
            <Button variant="outline" onClick={fetchLogs}>
              <Download className="w-4 h-4 mr-2" />
              Download Log
            </Button>
          </div>
        </div>

        {/* Logs Content */}
        {loading ? (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading history...</p>
            </CardContent>
          </Card>
        ) : logs.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <History className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground">No raffle history yet</p>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Desktop Table View */}
            <Card className="hidden md:block">
              <CardHeader>
                <CardTitle>Winner Records</CardTitle>
                <CardDescription>Complete history of all raffle draws</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  {/* Table Header */}
                  <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-muted/50 rounded-lg font-medium text-sm text-muted-foreground">
                    <div className="col-span-1">#</div>
                    <div className="col-span-3">Student ID</div>
                    <div className="col-span-5">Prize</div>
                    <div className="col-span-3 text-right">Time</div>
                  </div>

                  {/* Table Body */}
                  {logs.map((log, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-12 gap-4 px-4 py-3 hover:bg-muted/50 rounded-lg transition-colors fade-in"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <div className="col-span-1 text-muted-foreground">
                        #{logs.length - index}
                      </div>
                      <div className="col-span-3 font-medium">
                        {log.studentId}
                      </div>
                      <div className="col-span-5 flex items-center gap-2">
                        <Trophy className="w-4 h-4 text-yellow-600" />
                        {log.item.name}
                      </div>
                      <div className="col-span-3 text-right text-muted-foreground">
                        {formatTime(log.timestamp)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-3">
              {logs.map((log, index) => (
                <Card
                  key={index}
                  className="fade-in"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <Badge variant="secondary">#{logs.length - index}</Badge>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        {formatTime(log.timestamp)}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div>
                      <p className="text-xs text-muted-foreground">Student ID</p>
                      <p className="font-semibold">{log.studentId}</p>
                    </div>
                    <Separator />
                    <div>
                      <p className="text-xs text-muted-foreground">Prize</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Trophy className="w-4 h-4 text-yellow-600" />
                        <p className="font-medium">{log.item.name}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground">
          © 2026 Raffle System
        </p>
      </div>
    </div>
  );
}
