CREATE TABLE IF NOT EXISTS owner (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR NOT NULL,
    username VARCHAR NOT NULL UNIQUE,
    password VARCHAR NOT NULL,
    email VARCHAR NOT NULL UNIQUE,
    avatar_url VARCHAR,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE
    IF NOT EXISTS about (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
        name VARCHAR NOT NULL,
        nim VARCHAR(11) NOT NULL,
        major VARCHAR,
        faculty VARCHAR,
        biography VARCHAR,
        slogan TEXT,
        img_url TEXT,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW (),
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW ()
    );

CREATE TABLE IF NOT EXISTS invalid_token (
    token TEXT PRIMARY KEY,
    expires TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO owner (id, name, username, password, email)
VALUES (
    gen_random_uuid(),
    'devanadindra',
    'devanadindra',
    '$2a$12$uWKbKpJVPz65kqb1RIHhHeYr.cuokKHA1lKfNLPyg9MbZlabGrkha',
    'owner@gmail.com'
);