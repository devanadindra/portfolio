CREATE TABLE
    IF NOT EXISTS about (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
        user_id UUID NOT NULL REFERENCES owner (id) ON DELETE CASCADE,
        name VARCHAR NOT NULL,
        ratio INT (11) NOT NULL,
        experience INT (11) NOT NULL,
        period VARCHAR,
        img_url TEXT,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW (),
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW ()
    );