INSERT INTO users (username)
VALUES ('local-dev-user')
ON CONFLICT (username) DO NOTHING;