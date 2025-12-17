CREATE TABLE
    IF NOT EXISTS owner (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
        name VARCHAR NOT NULL,
        username VARCHAR NOT NULL UNIQUE,
        password VARCHAR NOT NULL,
        email VARCHAR NOT NULL UNIQUE,
        avatar_url VARCHAR,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW (),
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW ()
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

CREATE TABLE
    IF NOT EXISTS invalid_token (
        token TEXT PRIMARY KEY,
        expires TIMESTAMPTZ NOT NULL DEFAULT NOW ()
    );

INSERT INTO
    owner (id, name, username, password, email)
VALUES
    (
        gen_random_uuid (),
        'devanadindra',
        'devanadindra',
        '$2a$12$uWKbKpJVPz65kqb1RIHhHeYr.cuokKHA1lKfNLPyg9MbZlabGrkha',
        'owner@gmail.com'
    );

INSERT INTO about (
    id,
    name,
    nim,
    major,
    faculty,
    biography,
    slogan,
    img_url
)
VALUES (
    'd0299dd2-8d63-4562-9294-a916b7e1e82e',
    'Deva Nadindra Pramudya',
    '2702329374',
    'Digital Creative Technology',
    'School of Computer Science',
    'Born in 2004 in Madiun City, I completed my education at SMKN 1 Madiun before continuing my studies at Bina Nusantara University, majoring in Computer Science. During my studies, I studied programming, software development, and artificial intelligence. I believe that technology is the solution to life challenges. With a passion for learning and innovation, I continue to hone my skills in order to contribute to creating positive change.',
    'I''m a Computer Science student at Binus University.',
    '/uploads/personal/profile_1.jpeg'
);
