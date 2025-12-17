CREATE TABLE
    IF NOT EXISTS certificate (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
        name VARCHAR(255) NOT NULL,
        img_url VARCHAR(255),
        certif_link VARCHAR(255),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW (),
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW ()
    );

INSERT INTO
    certificate (name, img_url)
VALUES
    (
        'Data Structure Certificate',
        '/uploads/certificate/5.jpg'
    ),
    ('C Language', '/uploads/certificate/6.jpg'),
    ('Certificate', '/uploads/certificate/7.jpg');