import { useState, useEffect } from 'react';
import { registerStudent, getSystemState } from '../services/api';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Gift, CheckCircle2, AlertCircle, Lock, Trophy } from "lucide-react";

export default function RegisterPage() {
  const [studentId, setStudentId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [systemState, setSystemState] = useState('REGISTRATION_OPEN');
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    checkSystemState();
  }, []);

  const checkSystemState = async () => {
    try {
      const response = await getSystemState();
      if (response.success && response.data) {
        setSystemState(response.data.state);
      }
    } catch (error) {
      console.error('Failed to check system state');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (studentId.length !== 8) {
      setError('Student ID must be 8 digits');
      return;
    }

    setLoading(true);
    try {
      const response = await registerStudent(studentId);
      if (response.success) {
        localStorage.setItem('studentId', studentId);
        setIsRegistered(true); // Show success state instead of navigating
      } else {
        setError(response.message || 'Registration failed');
        if (response.statusCode === 403) {
          setSystemState('RAFFLE_STARTED');
        }
      }
    } catch (err) {
      setError('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  if (systemState === 'RAFFLE_STARTED' || systemState === 'RAFFLE_ENDED') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-2xl border-2">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto bg-muted p-4 rounded-full w-20 h-20 flex items-center justify-center">
              {systemState === 'RAFFLE_ENDED' ? (
                <Trophy className="w-10 h-10 text-yellow-600" />
              ) : (
                <Lock className="w-10 h-10 text-muted-foreground" />
              )}
            </div>
            <CardTitle className="text-2xl">
              {systemState === 'RAFFLE_ENDED' ? 'Raffle Ended' : 'Registration Closed'}
            </CardTitle>
            <CardDescription className="text-base">
              {systemState === 'RAFFLE_ENDED' 
                ? 'The raffle event has concluded. Thank you for participating!'
                : 'The raffle is currently in progress. No new registrations are accepted.'}
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (isRegistered) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-teal-50 to-emerald-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-2xl border-green-200">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto bg-green-100 p-4 rounded-full w-20 h-20 flex items-center justify-center animate-in zoom-in duration-300">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            <CardTitle className="text-2xl text-green-900">Registration Successful!</CardTitle>
            <CardDescription className="text-base text-green-700">
              You have been registered for the raffle.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-white/50 p-4 rounded-lg text-center border border-green-100">
              <p className="text-sm text-muted-foreground mb-1">Your Student ID</p>
              <p className="text-3xl font-bold text-green-800 tracking-wider font-mono">{studentId}</p>
            </div>
            <div className="text-center text-sm text-muted-foreground">
              <p>You can now close this page.</p>
              <p>Good luck!</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo/Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl shadow-lg">
            <Gift className="w-8 h-8 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Raffle System</h1>
            <p className="text-muted-foreground mt-2">Enter your student ID to register</p>
          </div>
        </div>

        {/* Registration Card */}
        <Card className="shadow-2xl">
          <CardHeader>
            <CardTitle>Student Registration</CardTitle>
            <CardDescription>Join the raffle by entering your 8-digit student ID</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="student-id">Student ID</Label>
                <Input
                  id="student-id"
                  type="text"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value.replace(/\D/g, '').slice(0, 8))}
                  placeholder="00000000"
                  maxLength={8}
                  required
                  autoFocus
                  className="text-lg h-12"
                />
                <p className="text-xs text-muted-foreground">{studentId.length}/8 digits</p>
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              <Button 
                type="submit" 
                disabled={loading || studentId.length !== 8}
                className="w-full h-12 text-base"
                size="lg"
              >
                {loading ? 'Registering...' : 'Register for Raffle'}
              </Button>

              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground pt-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Secure & Encrypted</span>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground">
          © 2026 Raffle System. All rights reserved.
        </p>
      </div>
    </div>
  );
}