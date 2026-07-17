-- Create tables for skate judging system

-- Tricks table
CREATE TABLE tricks (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  difficulty INTEGER NOT NULL CHECK (difficulty >= 1 AND difficulty <= 15),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Riders table
CREATE TABLE riders (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  team TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Events table
CREATE TABLE events (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  use_run BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Attempts table
CREATE TABLE attempts (
  id SERIAL PRIMARY KEY,
  rider_id INTEGER NOT NULL REFERENCES riders(id),
  event_id INTEGER NOT NULL REFERENCES events(id),
  attempt_no INTEGER NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('single', 'combo')),
  raw_json JSONB NOT NULL,
  score FLOAT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_attempts_rider_event ON attempts(rider_id, event_id);
CREATE INDEX idx_attempts_event ON attempts(event_id);
CREATE INDEX idx_tricks_name ON tricks(name);
