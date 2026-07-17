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

export default function LeaderboardPage() {
  const [eventId, setEventId] = useState<number>(1);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/events/${eventId}/leaderboard`);
      const data = await response.json();
      setLeaderboard(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error);
      setLeaderboard([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
    const interval = setInterval(fetchLeaderboard, 2000);
    return () => clearInterval(interval);
  }, [eventId]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-neon-blue mb-8">MC Leaderboard</h1>
        
        <div className="mb-8">
          <label className="block text-sm font-medium mb-2">Event ID</label>
          <input
            type="number"
            value={eventId}
            onChange={(e) => setEventId(parseInt(e.target.value))}
            className="w-64 p-2 bg-gray-800 border border-gray-700 rounded"
          />
        </div>

        {loading ? (
          <div className="text-center text-gray-400">Loading...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="p-4 text-left text-neon-blue">Rank</th>
                  <th className="p-4 text-left text-neon-blue">Rider</th>
                  <th className="p-4 text-right text-neon-blue">BT1</th>
                  <th className="p-4 text-right text-neon-blue">BT2</th>
                  <th className="p-4 text-right text-neon-blue">BT3</th>
                  <th className="p-4 text-right text-neon-blue">BT4</th>
                  <th className="p-4 text-right text-neon-blue">Total</th>
                  <th className="p-4 text-right text-neon-blue">Run</th>
                  <th className="p-4 text-right text-neon-blue">Final</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((entry, index) => (
                  <tr key={entry.rider_id} className="border-b border-gray-800 hover:bg-gray-800/50">
                    <td className="p-4 font-bold text-neon-green">{index + 1}</td>
                    <td className="p-4 font-semibold">{entry.name}</td>
                    <td className="p-4 text-right">{entry.best_trick[0]?.toFixed(2) || '-'}</td>
                    <td className="p-4 text-right">{entry.best_trick[1]?.toFixed(2) || '-'}</td>
                    <td className="p-4 text-right">{entry.best_trick[2]?.toFixed(2) || '-'}</td>
                    <td className="p-4 text-right">{entry.best_trick[3]?.toFixed(2) || '-'}</td>
                    <td className="p-4 text-right font-bold text-neon-blue">{entry.best_trick_total?.toFixed(2) || '0.00'}</td>
                    <td className="p-4 text-right">{entry.run_score?.toFixed(2) || '0.00'}</td>
                    <td className="p-4 text-right font-bold text-neon-pink text-xl">{entry.final_score?.toFixed(2) || '0.00'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
