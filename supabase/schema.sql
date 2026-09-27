-- ==============================================================================
-- E-TERNAL FASE 1: BASE DE DATOS DE PERSONAS Y RECUERDOS (SUPABASE POSTGRESQL)
-- ==============================================================================

-- 1. Extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- 2. TABLA: people
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.people (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    first_name TEXT NOT NULL,
    last_name TEXT,
    display_name TEXT NOT NULL,
    birth_date DATE,
    death_date DATE,
    profile_photo_url TEXT,
    bio TEXT,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'deceased', 'archived')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índices de people
CREATE INDEX IF NOT EXISTS idx_people_user_id ON public.people(user_id);
CREATE INDEX IF NOT EXISTS idx_people_status ON public.people(status);

-- ==============================================================================
-- 3. TABLA: memories
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.memories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    person_id UUID NOT NULL REFERENCES public.people(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    content TEXT,
    memory_type TEXT NOT NULL CHECK (
        memory_type IN ('text', 'voice', 'video', 'letter', 'story', 'life_event', 'photo', 'special_message')
    ),
    category TEXT NOT NULL CHECK (
        category IN ('family', 'childhood', 'love', 'work', 'life_lesson', 'humor', 'tradition', 'important_event', 'advice', 'personal', 'special_message', 'legacy')
    ),
    event_date DATE,
    location TEXT,
    importance TEXT NOT NULL DEFAULT 'normal' CHECK (
        importance IN ('low', 'normal', 'high', 'critical')
    ),
    status TEXT NOT NULL DEFAULT 'ready' CHECK (
        status IN ('draft', 'ready', 'archived')
    ),
    is_locked BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índices de memories
CREATE INDEX IF NOT EXISTS idx_memories_person_id ON public.memories(person_id);
CREATE INDEX IF NOT EXISTS idx_memories_type ON public.memories(memory_type);
CREATE INDEX IF NOT EXISTS idx_memories_category ON public.memories(category);
CREATE INDEX IF NOT EXISTS idx_memories_status ON public.memories(status);

-- ==============================================================================
-- 4. TABLA: media_assets
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.media_assets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    memory_id UUID NOT NULL REFERENCES public.memories(id) ON DELETE CASCADE,
    person_id UUID REFERENCES public.people(id) ON DELETE SET NULL,
    storage_path TEXT NOT NULL,
    public_url TEXT,
    media_type TEXT NOT NULL CHECK (media_type IN ('photo', 'audio', 'video')),
    mime_type TEXT,
    file_size BIGINT,
    duration_seconds NUMERIC(10,2),
    thumbnail_url TEXT,
    transcript TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índices de media_assets
CREATE INDEX IF NOT EXISTS idx_media_assets_memory_id ON public.media_assets(memory_id);
CREATE INDEX IF NOT EXISTS idx_media_assets_person_id ON public.media_assets(person_id);
CREATE INDEX IF NOT EXISTS idx_media_assets_type ON public.media_assets(media_type);

-- ==============================================================================
-- 5. TABLA: memory_people (Relación N:M recuerdos y personas)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.memory_people (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    memory_id UUID NOT NULL REFERENCES public.memories(id) ON DELETE CASCADE,
    person_id UUID NOT NULL REFERENCES public.people(id) ON DELETE CASCADE,
    relationship_context TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_memory_people UNIQUE (memory_id, person_id)
);

-- Índices de memory_people
CREATE INDEX IF NOT EXISTS idx_memory_people_memory_id ON public.memory_people(memory_id);
CREATE INDEX IF NOT EXISTS idx_memory_people_person_id ON public.memory_people(person_id);

-- ==============================================================================
-- 6. TRIGGER: updated_at automático
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.set_current_timestamp_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_people_updated_at ON public.people;
CREATE TRIGGER trg_people_updated_at
BEFORE UPDATE ON public.people
FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();

DROP TRIGGER IF EXISTS trg_memories_updated_at ON public.memories;
CREATE TRIGGER trg_memories_updated_at
BEFORE UPDATE ON public.memories
FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();

-- ==============================================================================
-- 7. ROW LEVEL SECURITY (RLS) - NINGUNA POLÍTICA USING (true) PÚBLICA
-- ==============================================================================
ALTER TABLE public.people ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memory_people ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------------------------------------------
-- Políticas para people: Solo el usuario propietario
-- ------------------------------------------------------------------------------
CREATE POLICY "people_select_owner" ON public.people
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "people_insert_owner" ON public.people
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "people_update_owner" ON public.people
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "people_delete_owner" ON public.people
    FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

-- ------------------------------------------------------------------------------
-- Políticas para memories: Acceso si pertenece a una persona del usuario
-- ------------------------------------------------------------------------------
CREATE POLICY "memories_select_owner" ON public.memories
    FOR SELECT
    TO authenticated
    USING (
        person_id IN (SELECT id FROM public.people WHERE user_id = auth.uid())
    );

CREATE POLICY "memories_insert_owner" ON public.memories
    FOR INSERT
    TO authenticated
    WITH CHECK (
        person_id IN (SELECT id FROM public.people WHERE user_id = auth.uid())
    );

CREATE POLICY "memories_update_owner" ON public.memories
    FOR UPDATE
    TO authenticated
    USING (
        person_id IN (SELECT id FROM public.people WHERE user_id = auth.uid())
    )
    WITH CHECK (
        person_id IN (SELECT id FROM public.people WHERE user_id = auth.uid())
    );

CREATE POLICY "memories_delete_owner" ON public.memories
    FOR DELETE
    TO authenticated
    USING (
        person_id IN (SELECT id FROM public.people WHERE user_id = auth.uid())
    );

-- ------------------------------------------------------------------------------
-- Políticas para media_assets: Solo accesibles a través de memorias autorizadas
-- ------------------------------------------------------------------------------
CREATE POLICY "media_assets_select_owner" ON public.media_assets
    FOR SELECT
    TO authenticated
    USING (
        memory_id IN (
            SELECT m.id FROM public.memories m
            JOIN public.people p ON m.person_id = p.id
            WHERE p.user_id = auth.uid()
        )
    );

CREATE POLICY "media_assets_insert_owner" ON public.media_assets
    FOR INSERT
    TO authenticated
    WITH CHECK (
        memory_id IN (
            SELECT m.id FROM public.memories m
            JOIN public.people p ON m.person_id = p.id
            WHERE p.user_id = auth.uid()
        )
    );

CREATE POLICY "media_assets_update_owner" ON public.media_assets
    FOR UPDATE
    TO authenticated
    USING (
        memory_id IN (
            SELECT m.id FROM public.memories m
            JOIN public.people p ON m.person_id = p.id
            WHERE p.user_id = auth.uid()
        )
    )
    WITH CHECK (
        memory_id IN (
            SELECT m.id FROM public.memories m
            JOIN public.people p ON m.person_id = p.id
            WHERE p.user_id = auth.uid()
        )
    );

CREATE POLICY "media_assets_delete_owner" ON public.media_assets
    FOR DELETE
    TO authenticated
    USING (
        memory_id IN (
            SELECT m.id FROM public.memories m
            JOIN public.people p ON m.person_id = p.id
            WHERE p.user_id = auth.uid()
        )
    );

-- ------------------------------------------------------------------------------
-- Políticas para memory_people: No permite saltarse reglas de acceso
-- ------------------------------------------------------------------------------
CREATE POLICY "memory_people_select_owner" ON public.memory_people
    FOR SELECT
    TO authenticated
    USING (
        memory_id IN (
            SELECT m.id FROM public.memories m
            JOIN public.people p ON m.person_id = p.id
            WHERE p.user_id = auth.uid()
        )
    );

CREATE POLICY "memory_people_insert_owner" ON public.memory_people
    FOR INSERT
    TO authenticated
    WITH CHECK (
        memory_id IN (
            SELECT m.id FROM public.memories m
            JOIN public.people p ON m.person_id = p.id
            WHERE p.user_id = auth.uid()
        )
    );

CREATE POLICY "memory_people_delete_owner" ON public.memory_people
    FOR DELETE
    TO authenticated
    USING (
        memory_id IN (
            SELECT m.id FROM public.memories m
            JOIN public.people p ON m.person_id = p.id
            WHERE p.user_id = auth.uid()
        )
    );

-- ==============================================================================
-- 8. STORAGE: BUCKET PRIVADO 'eternal-media'
-- ==============================================================================
-- Inserta el bucket privado si no existe en storage.buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'eternal-media',
    'eternal-media',
    FALSE,
    104857600, -- 100MB por archivo
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/webm', 'video/mp4', 'video/webm', 'video/quicktime']
)
ON CONFLICT (id) DO NOTHING;

-- Políticas de Storage RLS para 'eternal-media'
-- Path format: people/{person_id}/memories/{memory_id}/{filename}
CREATE POLICY "storage_eternal_media_select" ON storage.objects
    FOR SELECT
    TO authenticated
    USING (
        bucket_id = 'eternal-media'
        AND (
            EXISTS (
                SELECT 1 FROM public.people p
                WHERE p.user_id = auth.uid()
                AND (storage.foldername(name))[2] = p.id::text
            )
        )
    );

CREATE POLICY "storage_eternal_media_insert" ON storage.objects
    FOR INSERT
    TO authenticated
    WITH CHECK (
        bucket_id = 'eternal-media'
        AND (
            EXISTS (
                SELECT 1 FROM public.people p
                WHERE p.user_id = auth.uid()
                AND (storage.foldername(name))[2] = p.id::text
            )
        )
    );

CREATE POLICY "storage_eternal_media_delete" ON storage.objects
    FOR DELETE
    TO authenticated
    USING (
        bucket_id = 'eternal-media'
        AND (
            EXISTS (
                SELECT 1 FROM public.people p
                WHERE p.user_id = auth.uid()
                AND (storage.foldername(name))[2] = p.id::text
            )
        )
    );
