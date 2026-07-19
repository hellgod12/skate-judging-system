'use client';

import { useState, useEffect } from 'react';
import { LeaderboardService } from '@/lib/leaderboard';
import { TimerService } from '@/lib/timer';
import { EventService } from '@/lib/event';
import { Card, CardContent } from '@/components/ui/card';

export default function DisplayPage() {
  const [eventId, setEventId] = useState<string>('');
  const [event, setEvent] = useState<any>(null);
  const [leaderboard, setLeaderboard] = useState<any>(null);
  const [timer, setTimer] = useState<any>(null);
  const [currentRider, setCurrentRider] = useState<any>(null);
  const [currentScore, setCurrentScore] = useState<number | null>(null);

  useEffect(() => {
    // Get event ID from URL or localStorage
    const urlParams = new URLSearchParams(window.location.search);
    const eventIdParam = urlParams.get('event_id') || localStorage.getItem('display_event_id');
    
    if (eventIdParam) {
      setEventId(eventIdParam);
      localStorage.setItem('display_event_id', eventIdParam);
    }
  }, []);

  useEffect(() => {
    if (eventId) {
      loadData();
      // Subscribe to real-time updates
      const subscription = LeaderboardService.subscribeToLeaderboard(eventId, (updatedLeaderboard) => {
        setLeaderboard(updatedLeaderboard);
      });

      return () => {
        LeaderboardService.unsubscribeFromLeaderboard(eventId);
      };
    }
  }, [eventId]);

  useEffect(() => {
    if (eventId) {
      const interval = setInterval(async () => {
        try {
          const activeTimer = await TimerService.getActiveTimer(eventId);
          setTimer(activeTimer);
        } catch (err) {
          console.error('Failed to update timer:', err);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [eventId]);

  const loadData = async () => {
    try {
      const [eventData, leaderboardData, timerData] = await Promise.all([
        EventService.getEventById(eventId),
        LeaderboardService.getLeaderboard(eventId),
        TimerService.getActiveTimer(eventId),
      ]);

      setEvent(eventData);
      setLeaderboard(leaderboardData);
      setTimer(timerData);
    } catch (err) {
      console.error('Failed to load display data:', err);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {!eventId ? (
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Skate Judging Display</h1>
            <p className="text-gray-400 mb-4">Enter Event ID to start</p>
            <input
              type="text"
              value={eventId}
              onChange={(e) => setEventId(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && eventId) {
                  localStorage.setItem('display_event_id', eventId);
                  loadData();
                }
              }}
              className="px-4 py-2 bg-gray-800 border border-gray-700 rounded text-white text-center text-2xl"
              placeholder="Event ID"
              autoFocus
            />
          </div>
        </div>
      ) : (
        <div className="h-screen flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-neon-blue to-purple-600 p-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-4xl font-bold">{event?.name || 'Skate Competition'}</h1>
                <p className="text-xl opacity-80">{event?.event_type || 'Street'}</p>
              </div>
              {timer && (
                <div className="text-right">
                  <div className="text-6xl font-bold">
                    {Math.floor(timer.remaining_seconds / 60)}:
                    {(timer.remaining_seconds % 60).toString().padStart(2, '0')}
                  </div>
                  <div className="text-sm opacity-80 capitalize">{timer.status}</div>
                </div>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex">
            {/* Left: Current Rider/Score */}
            <div className="w-1/3 p-6 border-r border-gray-800">
              <Card className="bg-gray-900 border-gray-800 h-full">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold mb-6 text-neon-blue">Current Rider</h2>
                  
                  {currentRider ? (
                    <div className="space-y-6">
                      <div>
                        <div className="text-4xl font-bold">
                          {currentRider.first_name} {currentRider.last_name}
                        </div>
                        <div className="text-gray-400 mt-2">
                          {currentRider.sponsor_team || 'Independent'}
                        </div>
                      </div>

                      {currentScore !== null && (
                        <div className="text-center py-8">
                          <div className="text-8xl font-bold text-neon-green">
                            {currentScore.toFixed(2)}
                          </div>
                          <div className="text-2xl text-gray-400 mt-2">Current Score</div>
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-800 p-4 rounded">
                          <div className="text-sm text-gray-400">Best Trick</div>
                          <div className="text-2xl font-bold">--</div>
                        </div>
                        <div className="bg-gray-800 p-4 rounded">
                          <div className="text-sm text-gray-400">Run Score</div>
                          <div className="text-2xl font-bold">--</div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      Waiting for next rider...
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Right: Leaderboard */}
            <div className="w-2/3 p-6">
              <Card className="bg-gray-900 border-gray-800 h-full">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold mb-6 text-neon-blue">Leaderboard</h2>
                  
                  {leaderboard && leaderboard.entries.length > 0 ? (
                    <div className="space-y-3">
                      {leaderboard.entries.slice(0, 10).map((entry: any, index: number) => (
                        <div
                          key={entry.rider_id}
                          className={`flex justify-between items-center p-4 rounded ${
                            index === 0 ? 'bg-yellow-600' : 
                            index === 1 ? 'bg-gray-400 text-black' : 
                            index === 2 ? 'bg-orange-600' : 
                            'bg-gray-800'
                          }`}
                        >
                          <div className="flex items-center gap-6">
                            <span className="text-4xl font-bold w-12">#{entry.rank}</span>
                            <div>
                              <div className="text-2xl font-medium">{entry.rider_name}</div>
                              <div className={`text-sm ${index < 3 ? 'opacity-80' : 'text-gray-400'}`}>
                                Best: {entry.best_trick_score.toFixed(2)} | Run: {entry.run_score.toFixed(2)}
                              </div>
                            </div>
                          </div>
                          <div className="text-4xl font-bold">
                            {entry.total_score.toFixed(2)}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      No scores yet
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-900 p-4 border-t border-gray-800">
            <div className="flex justify-between items-center text-sm text-gray-400">
              <div>
                {event?.start_date && new Date(event.start_date).toLocaleDateString()}
              </div>
              <div>
                Powered by Skate Judging Platform Pro
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
