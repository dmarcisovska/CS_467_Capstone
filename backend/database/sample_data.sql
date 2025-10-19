-- Add users
INSERT INTO public.users (user_id, email, password_hash, username, avatar_url, is_deleted) VALUES
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'john.smith@email.com', '$2a$10$abcdefghijklmnopqrstuvwxyz1234567890ABCDEFG', 'johnsmith', 'https://i.pravatar.cc/150?img=1', false),
('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'sarah.jones@email.com', '$2a$10$abcdefghijklmnopqrstuvwxyz1234567890ABCDEFH', 'sarahjones', 'https://i.pravatar.cc/150?img=2', false),
('c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'mike.wilson@email.com', '$2a$10$abcdefghijklmnopqrstuvwxyz1234567890ABCDEFI', 'mikewilson', 'https://i.pravatar.cc/150?img=3', false),
('d3eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', 'emily.brown@email.com', '$2a$10$abcdefghijklmnopqrstuvwxyz1234567890ABCDEFJ', 'emilybrown', 'https://i.pravatar.cc/150?img=4', false),
('e4eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', 'david.lee@email.com', '$2a$10$abcdefghijklmnopqrstuvwxyz1234567890ABCDEFK', 'davidlee', 'https://i.pravatar.cc/150?img=5', false),
('f5eebc99-9c0b-4ef8-bb6d-6bb9bd380a66', 'lisa.garcia@email.com', '$2a$10$abcdefghijklmnopqrstuvwxyz1234567890ABCDEFL', 'lisagarcia', NULL, false),
('a6eebc99-9c0b-4ef8-bb6d-6bb9bd380a77', 'deleted.user@email.com', '$2a$10$abcdefghijklmnopqrstuvwxyz1234567890ABCDEFM', 'deleteduser', NULL, true);

-- Add events
INSERT INTO public.events (event_id, creator_user_id, name, description, event_datetime, latitude, longitude, distance, elevation, difficulty) VALUES
(1, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Mountain Trail 5K', 'A scenic 5K through mountain trails with moderate elevation gain. Perfect for trail running enthusiasts!', '2025-11-15 09:00:00+00', 40.7128, -74.0060, 5.0, 350.5, 'Moderate'),
(2, 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'City Marathon', 'Annual city marathon through downtown streets. Flat course ideal for PR attempts.', '2025-12-01 08:00:00+00', 34.0522, -118.2437, 42.195, 120.0, 'Easy'),
(3, 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'Extreme Ultra Trail 50K', 'Challenging ultra trail with significant elevation. For experienced runners only.', '2026-01-20 07:00:00+00', 39.7392, -104.9903, 50.0, 1200.0, 'Hard'),
(4, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Sunset Beach 10K', 'Beautiful coastal run along the beach at sunset. Family-friendly event.', '2025-11-30 17:00:00+00', 32.7157, -117.1611, 10.0, 50.0, 'Easy'),
(5, 'd3eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', 'Forest Trail Half Marathon', 'Half marathon through peaceful forest trails with rolling hills.', '2025-12-15 09:30:00+00', 47.6062, -122.3321, 21.0975, 450.0, 'Moderate'),
(6, 'e4eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', 'Park Fun Run 2K', 'Short fun run in the local park. Great for beginners and families.', '2025-10-28 10:00:00+00', 41.8781, -87.6298, 2.0, 20.0, 'Easy');

-- Add event roles and limits
INSERT INTO public.event_roles (event_id, role, role_limit) VALUES

-- Mountain Trail 5K
(1, 'Runner', 100),
(1, 'Starting Official', 1),
(1, 'Finish Line Official', 3),

-- City Marathon
(2, 'Runner', 500),
(2, 'Starting Official', 1),
(2, 'Finish Line Official', 5),

-- Extreme Ultra Trail 50K
(3, 'Runner', 75),
(3, 'Starting Official', 1),
(3, 'Finish Line Official', 4),

-- Sunset Beach 10K
(4, 'Runner', 200),
(4, 'Starting Official', 1),
(4, 'Finish Line Official', 3),

-- Forest Trail Half Marathon
(5, 'Runner', 150),
(5, 'Starting Official', 1),
(5, 'Finish Line Official', 4),

-- Park Fun Run 2K
(6, 'Runner', 50),
(6, 'Starting Official', 1),
(6, 'Finish Line Official', 2);

-- Insert Registrations
INSERT INTO public.registrations (event_id, user_id, role, start_time, finish_time) VALUES

-- Mountain Trail 5K
(1, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Runner', '2025-11-15 09:00:00+00', '2025-11-15 09:28:45+00'),
(1, 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'Runner', '2025-11-15 09:00:00+00', '2025-11-15 09:32:15+00'),
(1, 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'Runner', '2025-11-15 09:00:00+00', '2025-11-15 09:25:30+00'),
(1, 'd3eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', 'Starting Official', NULL, NULL),
(1, 'e4eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', 'Finish Line Official', NULL, NULL),

-- City Marathon
(2, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Runner', NULL, NULL),
(2, 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'Runner', NULL, NULL),
(2, 'd3eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', 'Runner', NULL, NULL),
(2, 'e4eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', 'Starting Official', NULL, NULL),
(2, 'f5eebc99-9c0b-4ef8-bb6d-6bb9bd380a66', 'Finish Line Official', NULL, NULL),

-- Extreme Ultra Trail 50K
(3, 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'Runner', NULL, NULL),
(3, 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'Runner', NULL, NULL),
(3, 'f5eebc99-9c0b-4ef8-bb6d-6bb9bd380a66', 'Finish Line Official', NULL, NULL),

-- Sunset Beach 10K
(4, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Runner', NULL, NULL),
(4, 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'Runner', NULL, NULL),
(4, 'd3eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', 'Starting Official', NULL, NULL),

-- Forest Trail Half Marathon
(5, 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'Runner', NULL, NULL),
(5, 'e4eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', 'Finish Line Official', NULL, NULL),

-- Park Fun Run 2K
(6, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Runner', '2025-10-28 10:00:00+00', '2025-10-28 10:12:30+00'),
(6, 'd3eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', 'Runner', '2025-10-28 10:00:00+00', '2025-10-28 10:15:45+00'),
(6, 'f5eebc99-9c0b-4ef8-bb6d-6bb9bd380a66', 'Starting Official', NULL, NULL);
