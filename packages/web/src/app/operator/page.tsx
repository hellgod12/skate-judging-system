'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { EventService } from '@/lib/event';
import { CompetitionService } from '@/lib/competition';
import { TimerService } from '@/lib/timer';
import { HeatAssignmentService } from '@/lib/heat-assignment';
import { LeaderboardService } from '@/lib/leaderboard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function OperatorPage() {
  const { user } = useAuth();
  const [eventId, setEventId] = useState<string>('');
  const [selectedHeatId, setSelectedHeatId] = useState<string>('');
  const [event, setEvent] = useState<any>(null);
  const [rounds, setRounds] = useState<any[]>([]);
  const [heats, setHeats] = useState<any[]>([]);
  const [heatAssignments, setHeatAssignments] = useState<any[]>([]);
  const [timer, setTimer] = useState<any>(null);
  const [leaderboard, setLeaderboard] = useState<any>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (eventId) {
      loadEventData();
    }
  }, [eventId]);

  useEffect(() => {
    if (selectedHeatId) {
      loadHeatData();
    }
  }, [selectedHeatId]);

  const loadEventData = async () => {
    try {
      setIsLoading(true);
      const [eventData, roundsData] = await Promise.all([
        EventService.getEventById(eventId),
        CompetitionService.getRounds(eventId),
      ]);
      
      setEvent(eventData);
      setRounds(roundsData);
      
      if (roundsData.length > 0) {
        const heatsData = await CompetitionService.getHeats(roundsData[0].id);
        setHeats(heatsData);
        if (heatsData.length > 0) {
          setSelectedHeatId(heatsData[0].id);
        }
      }

      // Load active timer
      const activeTimer = await TimerService.getActiveTimer(eventId);
      setTimer(activeTimer);

      // Load leaderboard
      const leaderboardData = await LeaderboardService.getLeaderboard(eventId);
      setLeaderboard(leaderboardData);
    } catch (err) {
      setError('Failed to load event data');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadHeatData = async () => {
    try {
      const assignments = await HeatAssignmentService.getHeatAssignments(selectedHeatId);
      setHeatAssignments(assignments);
    } catch (err) {
      console.error('Failed to load heat data:', err);
    }
  };

  const startTimer = async () => {
    try {
      if (timer) {
        await TimerService.startTimer(timer.id);
      } else {
        const newTimer = await TimerService.createRunTimer(eventId, 45);
        await TimerService.startTimer(newTimer.id);
      }
      loadEventData();
    } catch (err) {
      setError('Failed to start timer');
      console.error(err);
    }
  };

  const pauseTimer = async () => {
    try {
      if (timer) {
        await TimerService.pauseTimer(timer.id);
        loadEventData();
      }
    } catch (err) {
      setError('Failed to pause timer');
      console.error(err);
    }
  };

  const stopTimer = async () => {
    try {
      if (timer) {
        await TimerService.stopTimer(timer.id);
        loadEventData();
      }
    } catch (err) {
      setError('Failed to stop timer');
      console.error(err);
    }
  };

  const startHeat = async () => {
    try {
      await CompetitionService.startHeat(selectedHeatId);
      loadEventData();
    } catch (err) {
      setError('Failed to start heat');
      console.error(err);
    }
  };

  const completeHeat = async () => {
    try {
      await CompetitionService.completeHeat(selectedHeatId);
      loadEventData();
    } catch (err) {
      setError('Failed to complete heat');
      console.error(err);
    }
  };

  const updateLeaderboard = async () => {
    try {
      await LeaderboardService.updateLeaderboard(eventId);
      const updatedLeaderboard = await LeaderboardService.getLeaderboard(eventId);
      setLeaderboard(updatedLeaderboard);
    } catch (err) {
      setError('Failed to update leaderboard');
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-neon-blue">Operator Panel</h1>
          <div className="text-sm text-gray-400">
            {user?.display_name || `${user?.first_name} ${user?.last_name}`}
          </div>
        </div>

        <Card className="bg-gray-800 border-gray-700 mb-8">
          <CardHeader>
            <CardTitle>Event Selection</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <Label htmlFor="eventId">Event ID</Label>
              <Input
                id="eventId"
                value={eventId}
                onChange={(e) => setEventId(e.target.value)}
                className="bg-gray-700 border-gray-600"
                placeholder="Enter event ID"
              />
            </div>
          </CardContent>
        </Card>

        {error && (
          <Alert variant="destructive" className="mb-8">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {event && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle>Event Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Status:</span>
                      <span className="font-bold">{event.status}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Type:</span>
                      <span>{event.event_type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Start Date:</span>
                      <span>{new Date(event.start_date).toLocaleDateString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle>Timer Control</CardTitle>
                </CardHeader>
                <CardContent>
                  {timer ? (
                    <div className="space-y-4">
                      <div className="text-center">
                        <div className="text-4xl font-bold text-neon-green">
                          {Math.floor(timer.remaining_seconds / 60)}:
                          {(timer.remaining_seconds % 60).toString().padStart(2, '0')}
                        </div>
                        <div className="text-sm text-gray-400 mt-2">
                          Status: {timer.status}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={startTimer} className="flex-1" disabled={timer.status === 'running'}>
                          Start
                        </Button>
                        <Button onClick={pauseTimer} className="flex-1" disabled={timer.status !== 'running'}>
                          Pause
                        </Button>
                        <Button onClick={stopTimer} className="flex-1" variant="destructive">
                          Stop
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center text-gray-400">
                      No active timer
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle>Heat Control</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label>Round</Label>
                      <select
                        value={rounds.find(r => heats.some(h => h.round_id === r.id))?.id || ''}
                        onChange={async (e) => {
                          const roundId = e.target.value;
                          const heatsData = await CompetitionService.getHeats(roundId);
                          setHeats(heatsData);
                          if (heatsData.length > 0) {
                            setSelectedHeatId(heatsData[0].id);
                          }
                        }}
                        className="w-full p-2 bg-gray-700 border border-gray-600 rounded"
                      >
                        {rounds.map(round => (
                          <option key={round.id} value={round.id}>
                            {round.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label>Heat</Label>
                      <select
                        value={selectedHeatId}
                        onChange={(e) => setSelectedHeatId(e.target.value)}
                        className="w-full p-2 bg-gray-700 border border-gray-600 rounded"
                      >
                        {heats.map(heat => (
                          <option key={heat.id} value={heat.id}>
                            {heat.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={startHeat} className="flex-1">
                        Start Heat
                      </Button>
                      <Button onClick={completeHeat} className="flex-1" variant="outline">
                        Complete Heat
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-gray-800 border-gray-700 mb-8">
              <CardHeader>
                <CardTitle>Rider Queue</CardTitle>
                <CardDescription>Current heat assignments</CardDescription>
              </CardHeader>
              <CardContent>
                {heatAssignments.length > 0 ? (
                  <div className="space-y-2">
                    {heatAssignments.map((assignment, index) => (
                      <div key={assignment.id} className="flex justify-between items-center p-3 bg-gray-700 rounded">
                        <div className="flex items-center gap-4">
                          <span className="text-2xl font-bold text-neon-blue">#{index + 1}</span>
                          <div>
                            <div className="font-medium">{assignment.riders?.first_name} {assignment.riders?.last_name}</div>
                            <div className="text-sm text-gray-400">Lane: {assignment.lane || index + 1}</div>
                          </div>
                        </div>
                        <div className="text-sm text-gray-400">
                          Start Order: {assignment.start_order}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-gray-400 py-8">
                    No riders assigned to this heat
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700 mb-8">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Live Leaderboard</CardTitle>
                    <CardDescription>Real-time standings</CardDescription>
                  </div>
                  <Button onClick={updateLeaderboard} variant="outline">
                    Refresh
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {leaderboard && leaderboard.entries.length > 0 ? (
                  <div className="space-y-2">
                    {leaderboard.entries.slice(0, 10).map((entry: any) => (
                      <div key={entry.rider_id} className="flex justify-between items-center p-3 bg-gray-700 rounded">
                        <div className="flex items-center gap-4">
                          <span className={`text-2xl font-bold ${entry.rank <= 3 ? 'text-neon-green' : 'text-gray-400'}`}>
                            #{entry.rank}
                          </span>
                          <div>
                            <div className="font-medium">{entry.rider_name}</div>
                            <div className="text-sm text-gray-400">
                              Best Trick: {entry.best_trick_score.toFixed(2)} | Run: {entry.run_score.toFixed(2)}
                            </div>
                          </div>
                        </div>
                        <div className="text-2xl font-bold text-neon-blue">
                          {entry.total_score.toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-gray-400 py-8">
                    No scores yet
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
