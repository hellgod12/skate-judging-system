'use client';

import { useState } from 'react';

export default function DebugAttemptsPage() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testDebugEndpoint = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/debug-attempts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rider_id: 1,
          event_id: 1,
          attempt_no: 1,
          attempt: {
            type: 'single',
            trick: 'Kickflip',
            modifiers: {
              execution: 1.0,
              style: 1.0,
              amplitude: 1.0,
              landing: 1.0,
              risk: 1.0
            }
          }
        })
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ error: 'Failed to fetch', message: String(error) });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Debug Attempts API</h1>
        
        <button
          onClick={testDebugEndpoint}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded mb-8"
        >
          {loading ? 'Testing...' : 'Test Debug Endpoint'}
        </button>

        {result && (
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Result:</h2>
            <pre className="bg-gray-900 p-4 rounded overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
