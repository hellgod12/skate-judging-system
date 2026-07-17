'use client';

import { useState, useEffect } from 'react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';

interface Trick {
  id: number;
  name: string;
  difficulty: number;
}

interface TrickModifiers {
  execution: number;
  style: number;
  amplitude: number;
  landing: number;
  risk: number;
}

export default function JudgePage() {
  const [tricks, setTricks] = useState<Trick[]>([]);
  const [selectedTrick, setSelectedTrick] = useState<string>('');
  const [modifiers, setModifiers] = useState<TrickModifiers>({
    execution: 1.0,
    style: 1.0,
    amplitude: 1.0,
    landing: 1.0,
    risk: 1.0,
  });
  const [mode, setMode] = useState<'single' | 'combo'>('single');
  const [comboTricks, setComboTricks] = useState<Array<{ name: string; modifiers: TrickModifiers }>>([]);
  const [calculatedScore, setCalculatedScore] = useState<number | null>(null);
  const [riderId, setRiderId] = useState<number>(1);
  const [eventId, setEventId] = useState<number>(1);
  const [attemptNo, setAttemptNo] = useState<number>(1);

  useEffect(() => {
    fetchTricks();
  }, []);

  const fetchTricks = async () => {
    try {
      const response = await fetch('/api/tricks');
      const data = await response.json();
      setTricks(data);
    } catch (error) {
      console.error('Failed to fetch tricks:', error);
    }
  };

  const handleModifierChange = (key: keyof TrickModifiers, value: number) => {
    setModifiers(prev => ({ ...prev, [key]: value }));
  };

  const calculateScore = async () => {
    try {
      const attempt = mode === 'single' 
        ? { type: 'single' as const, trick: selectedTrick, modifiers }
        : { type: 'combo' as const, tricks: comboTricks };

      const response = await fetch('/api/attempts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rider_id: riderId,
          event_id: eventId,
          attempt_no: attemptNo,
          attempt
        })
      });

      const data = await response.json();
      setCalculatedScore(data.score);
      setAttemptNo(prev => prev + 1);
    } catch (error) {
      console.error('Failed to calculate score:', error);
    }
  };

  const addToCombo = () => {
    if (!selectedTrick) return;
    setComboTricks(prev => [...prev, { name: selectedTrick, modifiers: { ...modifiers } }]);
    setSelectedTrick('');
    setModifiers({ execution: 1.0, style: 1.0, amplitude: 1.0, landing: 1.0, risk: 1.0 });
  };

  const removeFromCombo = (index: number) => {
    setComboTricks(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-neon-blue mb-8">Judge Panel</h1>
        
        <div className="grid gap-6 mb-8">
          <div>
            <label className="block text-sm font-medium mb-2">Rider ID</label>
            <input
              type="number"
              value={riderId}
              onChange={(e) => setRiderId(parseInt(e.target.value))}
              className="w-full p-2 bg-gray-800 border border-gray-700 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Event ID</label>
            <input
              type="number"
              value={eventId}
              onChange={(e) => setEventId(parseInt(e.target.value))}
              className="w-full p-2 bg-gray-800 border border-gray-700 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Attempt No</label>
            <input
              type="number"
              value={attemptNo}
              onChange={(e) => setAttemptNo(parseInt(e.target.value))}
              className="w-full p-2 bg-gray-800 border border-gray-700 rounded"
            />
          </div>
        </div>

        <div className="flex gap-4 mb-8">
          <Button
            onClick={() => setMode('single')}
            className={mode === 'single' ? 'bg-neon-blue' : 'bg-gray-700'}
          >
            Single Trick
          </Button>
          <Button
            onClick={() => setMode('combo')}
            className={mode === 'combo' ? 'bg-neon-blue' : 'bg-gray-700'}
          >
            Combo
          </Button>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Select Trick</label>
            <select
              value={selectedTrick}
              onChange={(e) => setSelectedTrick(e.target.value)}
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded"
            >
              <option value="">Choose a trick...</option>
              {tricks.map(trick => (
                <option key={trick.id} value={trick.name}>
                  {trick.name} (Difficulty: {trick.difficulty})
                </option>
              ))}
            </select>
          </div>

          {Object.entries(modifiers).map(([key, value]) => (
            <div key={key} className="mb-4">
              <label className="block text-sm font-medium mb-2 capitalize">
                {key}: {value.toFixed(2)}
              </label>
              <input
                type="range"
                min={key === 'landing' ? 0.7 : key === 'risk' ? 1.0 : 0.8}
                max={key === 'risk' ? 1.4 : key === 'amplitude' ? 1.3 : key === 'execution' ? 1.2 : 1.1}
                step={0.05}
                value={value}
                onChange={(e) => handleModifierChange(key as keyof TrickModifiers, parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
          ))}

          {mode === 'combo' && (
            <Button onClick={addToCombo} className="w-full mb-4">
              Add to Combo
            </Button>
          )}
        </div>

        {mode === 'combo' && comboTricks.length > 0 && (
          <div className="bg-gray-800 rounded-lg p-6 mb-8">
            <h3 className="text-xl font-semibold mb-4">Combo Tricks ({comboTricks.length})</h3>
            {comboTricks.map((trick, index) => (
              <div key={index} className="flex justify-between items-center mb-2 p-2 bg-gray-700 rounded">
                <span>{trick.name}</span>
                <Button onClick={() => removeFromCombo(index)} variant="destructive">
                  Remove
                </Button>
              </div>
            ))}
          </div>
        )}

        <Button onClick={calculateScore} className="w-full text-xl py-4">
          Calculate & Save Score
        </Button>

        {calculatedScore !== null && (
          <div className="mt-8 text-center">
            <h2 className="text-6xl font-bold text-neon-green">
              {calculatedScore.toFixed(2)}
            </h2>
            <p className="text-gray-400 mt-2">SLS Score</p>
          </div>
        )}
      </div>
    </div>
  );
}
