CREATE TABLE
    IF NOT EXISTS skills (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
        user_id UUID NOT NULL REFERENCES owner (id) ON DELETE CASCADE,
        name VARCHAR NOT NULL,
        ratio INT NOT NULL,
        experience INT NOT NULL,
        period VARCHAR,
        img_url TEXT,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW (),
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW ()
    );