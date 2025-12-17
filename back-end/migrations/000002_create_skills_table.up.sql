CREATE TABLE
    IF NOT EXISTS skills (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
        about_id UUID NOT NULL REFERENCES about (id) ON DELETE CASCADE,
        name VARCHAR NOT NULL,
        ratio INT NOT NULL,
        experience INT NOT NULL,
        period VARCHAR,
        img_url TEXT,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW (),
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW ()
    );

INSERT INTO
    skills (about_id, name, ratio, experience, period, img_url)
VALUES
    (
        'd0299dd2-8d63-4562-9294-a916b7e1e82e',
        'PHP Language',
        60,
        9,
        'MONTHS',
        '/uploads/skill/9.svg'
    ),
    (
        'd0299dd2-8d63-4562-9294-a916b7e1e82e',
        'Python Language',
        40,
        6,
        'MONTHS',
        '/uploads/skill/10.svg'
    ),
    (
        'd0299dd2-8d63-4562-9294-a916b7e1e82e',
        'HTML / CSS',
        90,
        2,
        'YEARS',
        '/uploads/skill/11.svg'
    );