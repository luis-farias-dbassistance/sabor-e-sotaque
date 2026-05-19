-- Schema for Sabor & Sotaque MVP

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    points INTEGER DEFAULT 0,
    current_level TEXT DEFAULT 'Ayudante', -- Ayudante, Garçom, Maître Bilingüe
    streak_days INTEGER DEFAULT 0,
    last_activity_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Learning Modules
CREATE TABLE IF NOT EXISTS modules (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    order_index INTEGER NOT NULL
);

-- Lessons per Module
CREATE TABLE IF NOT EXISTS lessons (
    id SERIAL PRIMARY KEY,
    module_id INTEGER REFERENCES modules(id),
    title TEXT NOT NULL,
    phrase_pt TEXT NOT NULL,
    phrase_es TEXT NOT NULL,
    image_url TEXT,
    audio_url TEXT,
    order_index INTEGER NOT NULL
);

-- User Progress tracking
CREATE TABLE IF NOT EXISTS user_progress (
    user_id UUID REFERENCES users(id),
    lesson_id INTEGER REFERENCES lessons(id),
    score FLOAT DEFAULT 0, -- Pronunciation accuracy score 0-1
    completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, lesson_id)
);

-- Initial Data
INSERT INTO modules (title, description, order_index) VALUES 
('Hospitalidad Cercana', 'Frases de bienvenida y servicio con tono amable.', 1),
('Maestría Parrillera', 'Cortes de carne y términos de cocción.', 2),
('Clásicos del Campo', 'Platos tradicionales y sus ingredientes.', 3),
('Sandwichería y Mar', 'Sándwiches icónicos y mariscos típicos.', 4);

-- First Module Lessons
INSERT INTO lessons (module_id, title, phrase_pt, phrase_es, order_index) VALUES 
(1, 'Bienvenida', 'Sejam bem-vindos! Fiquem à vontade.', '¡Sean bienvenidos! Siéntanse a gusto.', 1),
(2, 'Lomo Vetado', 'O Lomo Vetado é o nosso Contrafilé, muito suculento.', 'El Lomo Vetado es nuestro Contrafilé, muy jugoso.', 1);
