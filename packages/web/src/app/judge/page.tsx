'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { TrickService } from '@/lib/trick';
import { CompetitionSettingsService } from '@/lib/competition-settings';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Trick {
  id: string;
  name: string;
  difficulty: number;
  base_score: number;
}

interface TrickModifiers {
  landing: number;
  risk: number;
  amplitude: number;
  variety: number;
  execution: number;
}

export default function JudgePage() {
  const { user } = useAuth();
  const [tricks, setTricks] = useState<Trick[]>([]);
  const [selectedTrick, setSelectedTrick] = useState<string>('');
  const [modifiers, setModifiers] = useState<TrickModifiers>({
    landing: 1.0,
    risk: 1.0,
    amplitude: 1.0,
    variety: 1.0,
    execution: 1.0,
  });
  const [modifierRanges, setModifierRanges] = useState({
    landing: { min: 0.7, max: 1.1 },
    risk: { min: 1.0, max: 1.4 },
    amplitude: { min: 0.8, max: 1.3 },
    variety: { min: 0.8, max: 1.2 },
    execution: { min: 0.8, max: 1.2 },
  });
  const [mode, setMode] = useState<'single' | 'combo'>('single');
  const [comboTricks, setComboTricks] = useState<Array<{ trickId: string; modifiers: TrickModifiers }>>([]);
  const [calculatedScore, setCalculatedScore] = useState<number | null>(null);
  const [riderId, setRiderId] = useState<string>('');
  const [eventId, setEventId] = useState<string>('');
  const [attemptNo, setAttemptNo] = useState<number>(1);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (eventId) {
      loadEventSettings();
    }
  }, [eventId]);

  useEffect(() => {
    loadTricks();
  }, []);

  const loadTricks = async () => {
    try {
      const data = await TrickService.getTricks();
      setTricks(data);
    } catch (err) {
      console.error('Failed to load tricks:', err);
    }
  };

  const loadEventSettings = async () => {
    try {
      const settings = await CompetitionSettingsService.getEventSettings(eventId);
      if (settings.scoring_config?.modifier_ranges) {
        setModifierRanges(settings.scoring_config.modifier_ranges);
      }
    } catch (err) {
      console.error('Failed to load event settings:', err);
    }
  };

  const handleModifierChange = (key: keyof TrickModifiers, value: number) => {
    setModifiers(prev => ({ ...prev, [key]: value }));
  };

  const calculateScore = () => {
    try {
      if (!selectedTrick && mode === 'single') {
        setError('Please select a trick');
        return;
      }

      if (mode === 'combo' && comboTricks.length === 0) {
        setError('Please add tricks to combo');
        return;
      }

      const selectedTrickData = tricks.find(t => t.id === selectedTrick);
      
      let score = 0;
      
      if (mode === 'single' && selectedTrickData) {
        const baseScore = selectedTrickData.base_score;
        const modifierSum = Object.values(modifiers).reduce((sum, val) => sum + val, 0);
        score = baseScore * (modifierSum / 5);
      } else if (mode === 'combo') {
        const trickScores = comboTricks.map(ct => {
          const trick = tricks.find(t => t.id === ct.trickId);
          if (!trick) return 0;
          const baseScore = trick.base_score;
          const modifierSum = Object.values(ct.modifiers).reduce((sum, val) => sum + val, 0);
          return baseScore * (modifierSum / 5);
        });
        
        // Apply combo multiplier based on number of tricks
        const comboMultipliers = [0, 1.0, 1.2, 1.35, 1.5, 1.7];
        const multiplier = comboMultipliers[Math.min(comboTricks.length, 5)];
        const sum = trickScores.reduce((sum, val) => sum + val, 0);
        score = sum * multiplier;
      }

      setCalculatedScore(score);
      setError('');
      setAttemptNo(prev => prev + 1);
    } catch (err) {
      setError('Failed to calculate score');
      console.error(err);
    }
  };

  const addToCombo = () => {
    if (!selectedTrick) return;
    setComboTricks(prev => [...prev, { trickId: selectedTrick, modifiers: { ...modifiers } }]);
    setSelectedTrick('');
    setModifiers({ landing: 1.0, risk: 1.0, amplitude: 1.0, variety: 1.0, execution: 1.0 });
  };

  const removeFromCombo = (index: number) => {
    setComboTricks(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-neon-blue">Judge Panel</h1>
          <div className="text-sm text-gray-400">
            {user?.display_name || `${user?.first_name} ${user?.last_name}`}
          </div>
        </div>
        
        <Card className="bg-gray-800 border-gray-700 mb-8">
          <CardHeader>
            <CardTitle>Session Info</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
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
            <div>
              <Label htmlFor="riderId">Rider ID</Label>
              <Input
                id="riderId"
                value={riderId}
                onChange={(e) => setRiderId(e.target.value)}
                className="bg-gray-700 border-gray-600"
                placeholder="Enter rider ID"
              />
            </div>
            <div>
              <Label htmlFor="attemptNo">Attempt No</Label>
              <Input
                id="attemptNo"
                type="number"
                value={attemptNo}
                onChange={(e) => setAttemptNo(parseInt(e.target.value))}
                className="bg-gray-700 border-gray-600"
              />
            </div>
          </CardContent>
        </Card>

        {error && (
          <Alert variant="destructive" className="mb-8">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

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

        <Card className="bg-gray-800 border-gray-700 mb-8">
          <CardHeader>
            <CardTitle>Trick Selection</CardTitle>
            <CardDescription>Select a trick and adjust modifiers</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="trick">Select Trick</Label>
              <select
                id="trick"
                value={selectedTrick}
                onChange={(e) => setSelectedTrick(e.target.value)}
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded"
              >
                <option value="">Choose a trick...</option>
                {tricks.map(trick => (
                  <option key={trick.id} value={trick.id}>
                    {trick.name} (Difficulty: {trick.difficulty}, Base Score: {trick.base_score})
                  </option>
                ))}
              </select>
            </div>

            {Object.entries(modifiers).map(([key, value]) => (
              <div key={key}>
                <Label className="capitalize">
                  {key}: {value.toFixed(2)}
                </Label>
                <input
                  type="range"
                  min={modifierRanges[key as keyof TrickModifiers].min}
                  max={modifierRanges[key as keyof TrickModifiers].max}
                  step={0.05}
                  value={value}
                  onChange={(e) => handleModifierChange(key as keyof TrickModifiers, parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
            ))}

            {mode === 'combo' && (
              <Button onClick={addToCombo} className="w-full">
                Add to Combo
              </Button>
            )}
          </CardContent>
        </Card>

        {mode === 'combo' && comboTricks.length > 0 && (
          <Card className="bg-gray-800 border-gray-700 mb-8">
            <CardHeader>
              <CardTitle>Combo Tricks ({comboTricks.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {comboTricks.map((comboTrick, index) => {
                const trick = tricks.find(t => t.id === comboTrick.trickId);
                return (
                  <div key={index} className="flex justify-between items-center mb-2 p-2 bg-gray-700 rounded">
                    <span>{trick?.name || 'Unknown'}</span>
                    <Button onClick={() => removeFromCombo(index)} variant="destructive">
                      Remove
                    </Button>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        )}

        <Button onClick={calculateScore} className="w-full text-xl py-4">
          Calculate Score
        </Button>

        {calculatedScore !== null && (
          <Card className="mt-8 bg-gray-800 border-gray-700">
            <CardContent className="pt-6 text-center">
              <h2 className="text-6xl font-bold text-neon-green">
                {calculatedScore.toFixed(2)}
              </h2>
              <p className="text-gray-400 mt-2">SLS Score</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
