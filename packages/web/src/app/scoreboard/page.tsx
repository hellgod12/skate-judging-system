'use client';

import { useState, useEffect } from 'react';

interface LeaderboardEntry {
  rider_id: number;
  name: string;
  best_trick: number[];
  best_trick_total: number;
  run_score: number;
  final_score: number;
}

export default function ScoreboardPage() {
  const [eventId, setEventId] = useState<number>(1);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [currentRider, setCurrentRider] = useState<LeaderboardEntry | null>(null);

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch(`/api/events/${eventId}/leaderboard`);
      const data = await response.json();
      const leaderboardArray = Array.isArray(data) ? data : [];
      setLeaderboard(leaderboardArray);
      if (leaderboardArray.length > 0 && (!currentRider || leaderboardArray[0].rider_id !== currentRider.rider_id)) {
        setCurrentRider(leaderboardArray[0]);
      }
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error);
      setLeaderboard([]);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
    const interval = setInterval(fetchLeaderboard, 1500);
    return () => clearInterval(interval);
  }, [eventId]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-4 flex justify-between items-center">
          <input
            type="number"
            value={eventId}
            onChange={(e) => setEventId(parseInt(e.target.value))}
            className="w-32 p-2 bg-gray-800 border border-gray-700 rounded"
          />
          <span className="text-gray-400">Auto-refresh: 1.5s</span>
        </div>

        {currentRider && (
          <div className="text-center mb-12">
            <h2 className="text-8xl font-bold text-neon-blue mb-4">{currentRider.name}</h2>
            <div className="text-9xl font-bold text-neon-green mb-4">
              {currentRider.final_score?.toFixed(2) || '0.00'}
            </div>
            <p className="text-3xl text-gray-400">Final Score</p>
          </div>
        )}

        <div className="bg-gray-800/50 rounded-lg p-6">
          <h3 className="text-2xl font-bold text-neon-blue mb-4">Leaderboard</h3>
          <div className="space-y-3">
            {leaderboard.map((entry, index) => (
              <div
                key={entry.rider_id}
                className={`flex justify-between items-center p-4 rounded ${
                  index === 0 ? 'bg-neon-blue/20 border-2 border-neon-blue' : 'bg-gray-700/50'
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className={`text-2xl font-bold ${index === 0 ? 'text-neon-green' : 'text-gray-400'}`}>
                    #{index + 1}
                  </span>
                  <span className={`text-xl ${index === 0 ? 'font-bold' : ''}`}>{entry.name}</span>
                </div>
                <span className={`text-3xl font-bold ${index === 0 ? 'text-neon-pink' : 'text-gray-300'}`}>
                  {entry.final_score?.toFixed(2) || '0.00'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
