import { useEffect, useState } from 'react';
import { getAllStudents, getSystemState } from '../services/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Users, Radio } from "lucide-react";
import { useNavigate } from 'react-router-dom';

export default function WaitingPage() {
  const [students, setStudents] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const checkStateAndFetch = async () => {
      try {
        // Check state first
        const stateRes = await getSystemState();
        if (stateRes.success && stateRes.data?.state === 'RAFFLE_STARTED') {
          alert('Raffle has started!');
          navigate('/raffle');
          return;
        }

        // Fetch students if allowed
        const response = await getAllStudents();
        if (response.success && response.data) {
          setStudents(response.data);
        }
      } catch (err) {
        console.error('Failed to update:', err);
      }
    };

    checkStateAndFetch();
    const interval = setInterval(checkStateAndFetch, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <Badge variant="default" className="animate-pulse bg-green-500 hover:bg-green-500">
            <Radio className="w-3 h-3 mr-1" />
            LIVE - Registration Open
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-bold">Waiting Room</h1>
          <p className="text-muted-foreground">Students registered and waiting for raffle to begin</p>
        </div>

        {/* Student Count Card */}
        <Card className="shadow-2xl border-2">
          <CardContent className="p-8 sm:p-12 text-center">
            <p className="text-sm text-muted-foreground uppercase tracking-wider mb-4">Total Registered</p>
            <div className="text-7xl sm:text-8xl lg:text-9xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4 slide-in">
              {students.length}
            </div>
            <p className="text-lg text-muted-foreground">Students</p>
          </CardContent>
        </Card>

        {/* All Registered Students */}
        <Card className="shadow-xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Registered Students
                </CardTitle>
                <CardDescription>All students waiting for raffle ({students.length})</CardDescription>
              </div>
              <Badge variant="outline" className="gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                Live
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {students.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>No students registered yet</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {students.map((student, index) => (
                  <div
                    key={student.studentId}
                    className="flex items-center gap-2 px-3 py-2 bg-secondary rounded-lg hover:bg-secondary/80 transition-all fade-in"
                    style={{ animationDelay: `${index * 0.02}s` }}
                  >
                    <Avatar className="w-6 h-6">
                      <AvatarFallback className="text-xs bg-primary/10">
                        {student.studentId.slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">{student.studentId}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground">
          © 2026 Raffle System
        </p>
      </div>
    </div>
  );
}
