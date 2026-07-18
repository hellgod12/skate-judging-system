-- Seed riders data (with conflict handling)
INSERT INTO riders (name, team) VALUES
('Nyjah Huston', 'Nike SB'),
('Yuto Horigome', 'Nike SB'),
('Jagger Eaton', 'Plan B'),
('Gustavo Ribeiro', 'Primitive'),
('Kelvin Hoefler', 'Primitive'),
('Shane O Neill', 'Nike SB'),
('Luan Oliveira', 'Nike SB'),
('Chris Joslin', 'Plan B'),
('Milton Martinez', 'Primitive'),
('Cory Juneau', 'Powell Peralta')
ON CONFLICT (name) DO NOTHING;

-- Seed events data (with conflict handling)
INSERT INTO events (name, use_run) VALUES
('SLS Championship 2024', false),
('Street League Paris 2024', true),
('World Championship Final', false)
ON CONFLICT (name) DO NOTHING;
