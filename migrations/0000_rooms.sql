CREATE TABLE rooms (id TEXT PRIMARY KEY, salt TEXT NOT NULL, password TEXT NOT NULL, expires INTEGER NOT NULL, version INTEGER NOT NULL, state TEXT NOT NULL);
CREATE INDEX rooms_expiry ON rooms(expires);
CREATE TABLE room_limits (key TEXT NOT NULL, bucket INTEGER NOT NULL, n INTEGER NOT NULL, PRIMARY KEY (key,bucket));
