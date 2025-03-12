```
-- Criar tipos enumerados
CREATE TYPE public.profile_type AS ENUM ('fan', 'artist', 'collaborator', 'admin');
CREATE TYPE public.product_type AS ENUM ('nft', 'music', 'merch', 'collectible');
CREATE TYPE public.model_type AS ENUM ('diamond', 'sphere', 'torus', 'crystal', 'sketchfab', 'nft', 'environment', 'character', 'prop');
CREATE TYPE public.press_role AS ENUM ('journalist', 'blogger', 'editor', 'podcaster', 'other');
CREATE TYPE public.app_role AS ENUM ('admin', 'manager', 'creator', 'user');

-- Atualizar/criar tabela de perfis
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  username TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL,
  avatar TEXT,
  bio TEXT,
  profile_type profile_type NOT NULL DEFAULT 'fan',
  wallet_address TEXT,
  social_links JSONB DEFAULT '{}'::jsonb,
  permissions TEXT[] DEFAULT '{}'::text[],
  roles TEXT[] DEFAULT '{}'::text[],
  preferences JSONB DEFAULT '{"theme": "dark", "currency": "BRL", "language": "pt", "notifications": {"email": true, "push": true, "sms": false}}'::jsonb,
  two_factor_enabled BOOLEAN DEFAULT false,
  is_verified BOOLEAN DEFAULT false,
  last_login TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criação das tabelas da comunidade que faltam
CREATE TABLE IF NOT EXISTS public.community_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  location TEXT,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  image_url TEXT,
  is_online BOOLEAN DEFAULT false,
  event_url TEXT,
  organizer_id UUID NOT NULL REFERENCES profiles(id),
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.giveaways (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  prize TEXT NOT NULL,
  image_url TEXT,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  winner_count INTEGER NOT NULL DEFAULT 1,
  creator_id UUID NOT NULL REFERENCES profiles(id),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.giveaway_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  giveaway_id UUID NOT NULL REFERENCES giveaways(id),
  user_id UUID NOT NULL REFERENCES profiles(id),
  is_winner BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(giveaway_id, user_id)
);

-- Tabelas para o sistema de JestCoin
CREATE TABLE IF NOT EXISTS public.wallets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) UNIQUE,
  balance NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_id UUID NOT NULL REFERENCES wallets(id),
  amount NUMERIC NOT NULL,
  transaction_type TEXT NOT NULL,
  reference_id UUID,
  reference_type TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabelas para o sistema de Airdrop
CREATE TABLE IF NOT EXISTS public.airdrops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  token_type TEXT NOT NULL,
  token_amount NUMERIC NOT NULL,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  eligibility_criteria JSONB,
  created_by UUID NOT NULL REFERENCES profiles(id),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.airdrop_claims (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  airdrop_id UUID NOT NULL REFERENCES airdrops(id),
  user_id UUID NOT NULL REFERENCES profiles(id),
  wallet_address TEXT,
  claimed_amount NUMERIC NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  transaction_hash TEXT,
  claimed_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabelas para NFTs
CREATE TABLE IF NOT EXISTS public.nft_collections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID NOT NULL REFERENCES profiles(id),
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  total_supply INTEGER,
  blockchain TEXT NOT NULL,
  contract_address TEXT,
  is_verified BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.nft_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  collection_id UUID NOT NULL REFERENCES nft_collections(id),
  token_id TEXT NOT NULL,
  owner_id UUID REFERENCES profiles(id),
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  animation_url TEXT,
  external_url TEXT,
  attributes JSONB DEFAULT '[]'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  price NUMERIC,
  is_for_sale BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(collection_id, token_id)
);

-- Tabelas para Press Kit
CREATE TABLE IF NOT EXISTS public.press_materials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  file_path TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  is_public BOOLEAN DEFAULT true,
  created_by UUID NOT NULL REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.press_kit_downloads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  material_id UUID NOT NULL REFERENCES press_materials(id),
  user_id UUID REFERENCES profiles(id),
  email TEXT,
  ip_address TEXT,
  downloaded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabelas para CreativeFlow Board
CREATE TABLE IF NOT EXISTS public.creative_boards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id),
  title TEXT NOT NULL,
  description TEXT,
  is_template BOOLEAN DEFAULT false,
  is_public BOOLEAN DEFAULT false,
  content JSONB DEFAULT '{}'::jsonb,
  last_edited TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.board_elements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  board_id UUID NOT NULL REFERENCES creative_boards(id) ON DELETE CASCADE,
  element_type TEXT NOT NULL,
  position JSONB NOT NULL,
  content JSONB,
  style JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.automation_flows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id),
  board_id UUID REFERENCES creative_boards(id),
  title TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  nodes JSONB DEFAULT '[]'::jsonb,
  connections JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.integration_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id),
  service_name TEXT NOT NULL,
  config JSONB NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, service_name)
);

-- Função para criar usuários de demonstração
CREATE OR REPLACE FUNCTION create_demo_users()
RETURNS void AS $$
DECLARE
  admin_id UUID;
  artist_id UUID;
  collaborator_id UUID;
  fan_id UUID;
BEGIN
  -- Criar usuário admin
  INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, confirmation_sent_at, 
                         raw_user_meta_data, created_at, updated_at)
  VALUES (gen_random_uuid(), 'admin@jestfly.com', 
          crypt('admin123', gen_salt('bf')), 
          now(), now(), 
          '{"display_name":"Administrador JestFly", "username":"admin_jestfly", "profileType":"admin"}'::jsonb,
          now(), now())
  RETURNING id INTO admin_id;
  
  -- Criar usuário artista
  INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, confirmation_sent_at, 
                         raw_user_meta_data, created_at, updated_at)
  VALUES (gen_random_uuid(), 'artist@jestfly.com', 
          crypt('artist123', gen_salt('bf')), 
          now(), now(), 
          '{"display_name":"DJ SoundMaster", "username":"dj_soundmaster", "profileType":"artist"}'::jsonb,
          now(), now())
  RETURNING id INTO artist_id;
          
  -- Criar usuário colaborador
  INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, confirmation_sent_at, 
                         raw_user_meta_data, created_at, updated_at)
  VALUES (gen_random_uuid(), 'collaborator@jestfly.com', 
          crypt('collab123', gen_salt('bf')), 
          now(), now(), 
          '{"display_name":"Tech Support", "username":"tech_support", "profileType":"collaborator"}'::jsonb,
          now(), now())
  RETURNING id INTO collaborator_id;
  
  -- Criar usuário fã
  INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, confirmation_sent_at, 
                         raw_user_meta_data, created_at, updated_at)
  VALUES (gen_random_uuid(), 'fan@jestfly.com', 
          crypt('fan123', gen_salt('bf')), 
          now(), now(), 
          '{"display_name":"Fã de Música", "username":"music_fan", "profileType":"fan"}'::jsonb,
          now(), now())
  RETURNING id INTO fan_id;
  
  -- Adicionar os usuários na tabela de mfas (necessário para autenticação)
  INSERT INTO auth.mfa_factors (id, user_id, created_at, updated_at, factor_type, status)
  VALUES 
    (gen_random_uuid(), admin_id, now(), now(), 'totp', 'verified'),
    (gen_random_uuid(), artist_id, now(), now(), 'totp', 'verified'),
    (gen_random_uuid(), collaborator_id, now(), now(), 'totp', 'verified'),
    (gen_random_uuid(), fan_id, now(), now(), 'totp', 'verified');
    
  -- Criar wallets para os usuários
  INSERT INTO public.wallets (user_id, balance)
  VALUES 
    (admin_id, 1000),
    (artist_id, 500),
    (collaborator_id, 300),
    (fan_id, 100);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para criar perfil automaticamente após criação de usuário
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    email,
    display_name,
    username,
    profile_type,
    avatar,
    created_at,
    updated_at,
    last_login,
    is_verified,
    two_factor_enabled,
    preferences
  ) VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'username', CONCAT('user_', SUBSTR(NEW.id::text, 1, 8))),
    COALESCE((NEW.raw_user_meta_data->>'profileType')::profile_type, 'fan'),
    NULL,
    NOW(),
    NOW(),
    NOW(),
    NEW.email_confirmed_at IS NOT NULL,
    false,
    '{
      "theme": "dark",
      "language": "pt",
      "currency": "BRL",
      "notifications": {
        "email": true,
        "push": true,
        "sms": false
      }
    }'::JSONB
  );
  
  -- Criar carteira para o novo usuário
  INSERT INTO public.wallets (user_id, balance)
  VALUES (NEW.id, 50);
  
  RETURN NEW;
END;
$$;

-- Criar trigger para novos usuários se não existir
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Funções para verificar o tipo de perfil do usuário
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND profile_type = 'admin'
  );
$$;

CREATE OR REPLACE FUNCTION public.is_artist()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND profile_type = 'artist'
  );
$$;

CREATE OR REPLACE FUNCTION public.is_collaborator()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND profile_type = 'collaborator'
  );
$$;

CREATE OR REPLACE FUNCTION public.is_fan()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND profile_type = 'fan'
  );
$$;

CREATE OR REPLACE FUNCTION public.is_admin_or_collaborator()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND profile_type IN ('admin', 'collaborator')
  );
$$;

CREATE OR REPLACE FUNCTION public.is_admin_or_artist()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND profile_type IN ('admin', 'artist')
  );
$$;

-- Criar políticas de RLS para as tabelas
-- Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários podem visualizar seus próprios perfis"
ON public.profiles FOR SELECT
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Usuários podem editar seus próprios perfis"
ON public.profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Administradores podem visualizar todos os perfis"
ON public.profiles FOR SELECT
TO authenticated
USING (is_admin());

CREATE POLICY "Administradores podem editar todos os perfis"
ON public.profiles FOR UPDATE
TO authenticated
USING (is_admin());

-- NFTs
ALTER TABLE public.nft_collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nft_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Visualização pública de coleções NFT"
ON public.nft_collections FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Criação de coleções NFT por artistas e admins"
ON public.nft_collections FOR INSERT
TO authenticated
WITH CHECK (is_admin_or_artist());

CREATE POLICY "Edição de coleções NFT pelo criador ou admin"
ON public.nft_collections FOR UPDATE
TO authenticated
USING (creator_id = auth.uid() OR is_admin());

CREATE POLICY "Visualização pública de itens NFT"
ON public.nft_items FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Adição de NFTs por admins e artistas"
ON public.nft_items FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.nft_collections
    WHERE id = collection_id AND (creator_id = auth.uid() OR is_admin())
  )
);

CREATE POLICY "Edição de NFTs pelo dono ou admin"
ON public.nft_items FOR UPDATE
TO authenticated
USING (owner_id = auth.uid() OR is_admin());

-- Wallets
ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários podem ver suas carteiras"
ON public.wallets FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Admins podem ver todas as carteiras"
ON public.wallets FOR SELECT
TO authenticated
USING (is_admin());

CREATE POLICY "Apenas sistema pode inserir e atualizar carteiras"
ON public.wallets FOR ALL
TO authenticated
USING (is_admin());

CREATE POLICY "Usuários podem ver suas transações"
ON public.transactions FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.wallets
    WHERE id = wallet_id AND user_id = auth.uid()
  )
);

CREATE POLICY "Admins podem ver todas as transações"
ON public.transactions FOR SELECT
TO authenticated
USING (is_admin());

-- Executar função para criar usuários de demonstração
SELECT create_demo_users();

-- Criar Buckets de Storage
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('avatars', 'Avatares de Usuário', true),
  ('demos', 'Uploads de Demo', false),
  ('community', 'Conteúdo da Comunidade', true),
  ('products', 'Imagens de Produtos', true),
  ('nfts', 'Arquivos de NFT', true),
  ('press_kit', 'Materiais para Imprensa', true),
  ('creativeflow', 'Arquivos do CreativeFlow', false),
  ('temp', 'Arquivos Temporários', false)
ON CONFLICT (id) DO NOTHING;

-- Políticas para Storage
CREATE POLICY "Acesso público para visualizar avatares"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'avatars');

CREATE POLICY "Usuários autenticados podem fazer upload de avatares"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Usuários podem atualizar seus próprios avatares"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'avatars' AND owner = auth.uid());

CREATE POLICY "Usuários podem excluir seus próprios avatares"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'avatars' AND owner = auth.uid());

```


```
-- Adjust existing types if needed (wrap in try-catch)
DO $$ 
BEGIN
  -- Only create types if they don't exist
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'product_type') THEN
    CREATE TYPE public.product_type AS ENUM ('nft', 'music', 'merch', 'collectible');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'model_type') THEN
    CREATE TYPE public.model_type AS ENUM ('diamond', 'sphere', 'torus', 'crystal', 'sketchfab', 'nft', 'environment', 'character', 'prop');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'press_role') THEN
    CREATE TYPE public.press_role AS ENUM ('journalist', 'blogger', 'editor', 'podcaster', 'other');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role') THEN
    CREATE TYPE public.app_role AS ENUM ('admin', 'manager', 'creator', 'user');
  END IF;
END $$;

-- Drop triggers if they exist to avoid conflicts
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Recreate trigger and functions
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    email,
    display_name,
    username,
    profile_type,
    avatar,
    created_at,
    updated_at,
    last_login,
    is_verified,
    two_factor_enabled,
    preferences
  ) VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'username', CONCAT('user_', SUBSTR(NEW.id::text, 1, 8))),
    COALESCE((NEW.raw_user_meta_data->>'profileType')::profile_type, 'fan'),
    NULL,
    NOW(),
    NOW(),
    NOW(),
    NEW.email_confirmed_at IS NOT NULL,
    false,
    '{
      "theme": "dark",
      "language": "pt",
      "currency": "BRL",
      "notifications": {
        "email": true,
        "push": true,
        "sms": false
      }
    }'::JSONB
  );
  
  -- Create wallet for new user
  INSERT INTO public.wallets (user_id, balance)
  VALUES (NEW.id, 50);
  
  RETURN NEW;
END;
$$;

-- Create trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Recreate RLS policies after dropping existing ones
DROP POLICY IF EXISTS "Usuários podem visualizar seus próprios perfis" ON public.profiles;
DROP POLICY IF EXISTS "Usuários podem editar seus próprios perfis" ON public.profiles;
DROP POLICY IF EXISTS "Administradores podem visualizar todos os perfis" ON public.profiles;
DROP POLICY IF EXISTS "Administradores podem editar todos os perfis" ON public.profiles;

-- Enable RLS on profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Recreate policies
CREATE POLICY "Usuários podem visualizar seus próprios perfis"
ON public.profiles FOR SELECT
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Usuários podem editar seus próprios perfis"
ON public.profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Administradores podem visualizar todos os perfis"
ON public.profiles FOR SELECT
TO authenticated
USING (is_admin());

CREATE POLICY "Administradores podem editar todos os perfis"
ON public.profiles FOR UPDATE
TO authenticated
USING (is_admin());

-- Ensure storage buckets exist
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('avatars', 'Avatares de Usuário', true),
  ('demos', 'Uploads de Demo', false),
  ('community', 'Conteúdo da Comunidade', true),
  ('products', 'Imagens de Produtos', true),
  ('nfts', 'Arquivos de NFT', true),
  ('press_kit', 'Materiais para Imprensa', true),
  ('creativeflow', 'Arquivos do CreativeFlow', false),
  ('temp', 'Arquivos Temporários', false)
ON CONFLICT (id) DO NOTHING;

-- Create demo users if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'admin@jestfly.com') THEN
    PERFORM create_demo_users();
  END IF;
END $$;

```


```
-- Create the demo users function first
CREATE OR REPLACE FUNCTION create_demo_users()
RETURNS void AS $$
DECLARE
  admin_id UUID;
  artist_id UUID;
  collaborator_id UUID;
  fan_id UUID;
BEGIN
  -- Create admin user
  INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, confirmation_sent_at, 
                         raw_user_meta_data, created_at, updated_at)
  VALUES (gen_random_uuid(), 'admin@jestfly.com', 
          crypt('admin123', gen_salt('bf')), 
          now(), now(), 
          '{"display_name":"Administrador JestFly", "username":"admin_jestfly", "profileType":"admin"}'::jsonb,
          now(), now())
  RETURNING id INTO admin_id;
  
  -- Create artist user
  INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, confirmation_sent_at, 
                         raw_user_meta_data, created_at, updated_at)
  VALUES (gen_random_uuid(), 'artist@jestfly.com', 
          crypt('artist123', gen_salt('bf')), 
          now(), now(), 
          '{"display_name":"DJ SoundMaster", "username":"dj_soundmaster", "profileType":"artist"}'::jsonb,
          now(), now())
  RETURNING id INTO artist_id;
          
  -- Create collaborator user
  INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, confirmation_sent_at, 
                         raw_user_meta_data, created_at, updated_at)
  VALUES (gen_random_uuid(), 'collaborator@jestfly.com', 
          crypt('collab123', gen_salt('bf')), 
          now(), now(), 
          '{"display_name":"Tech Support", "username":"tech_support", "profileType":"collaborator"}'::jsonb,
          now(), now())
  RETURNING id INTO collaborator_id;
  
  -- Create fan user
  INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, confirmation_sent_at, 
                         raw_user_meta_data, created_at, updated_at)
  VALUES (gen_random_uuid(), 'fan@jestfly.com', 
          crypt('fan123', gen_salt('bf')), 
          now(), now(), 
          '{"display_name":"Fã de Música", "username":"music_fan", "profileType":"fan"}'::jsonb,
          now(), now())
  RETURNING id INTO fan_id;
  
  -- Add users to mfa table (required for authentication)
  INSERT INTO auth.mfa_factors (id, user_id, created_at, updated_at, factor_type, status)
  VALUES 
    (gen_random_uuid(), admin_id, now(), now(), 'totp', 'verified'),
    (gen_random_uuid(), artist_id, now(), now(), 'totp', 'verified'),
    (gen_random_uuid(), collaborator_id, now(), now(), 'totp', 'verified'),
    (gen_random_uuid(), fan_id, now(), now(), 'totp', 'verified');
    
  -- Create wallets for users
  INSERT INTO public.wallets (user_id, balance)
  VALUES 
    (admin_id, 1000),
    (artist_id, 500),
    (collaborator_id, 300),
    (fan_id, 100);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Now run the previous migration again
DO $$ 
BEGIN
  -- Only create types if they don't exist
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'product_type') THEN
    CREATE TYPE public.product_type AS ENUM ('nft', 'music', 'merch', 'collectible');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'model_type') THEN
    CREATE TYPE public.model_type AS ENUM ('diamond', 'sphere', 'torus', 'crystal', 'sketchfab', 'nft', 'environment', 'character', 'prop');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'press_role') THEN
    CREATE TYPE public.press_role AS ENUM ('journalist', 'blogger', 'editor', 'podcaster', 'other');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role') THEN
    CREATE TYPE public.app_role AS ENUM ('admin', 'manager', 'creator', 'user');
  END IF;
END $$;

-- Drop and recreate the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Recreate profile creation trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    email,
    display_name,
    username,
    profile_type,
    avatar,
    created_at,
    updated_at,
    last_login,
    is_verified,
    two_factor_enabled,
    preferences
  ) VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'username', CONCAT('user_', SUBSTR(NEW.id::text, 1, 8))),
    COALESCE((NEW.raw_user_meta_data->>'profileType')::profile_type, 'fan'),
    NULL,
    NOW(),
    NOW(),
    NOW(),
    NEW.email_confirmed_at IS NOT NULL,
    false,
    '{
      "theme": "dark",
      "language": "pt",
      "currency": "BRL",
      "notifications": {
        "email": true,
        "push": true,
        "sms": false
      }
    }'::JSONB
  );
  
  -- Create wallet for new user
  INSERT INTO public.wallets (user_id, balance)
  VALUES (NEW.id, 50);
  
  RETURN NEW;
END;
$$;

-- Create the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Recreate RLS policies
DROP POLICY IF EXISTS "Usuários podem visualizar seus próprios perfis" ON public.profiles;
DROP POLICY IF EXISTS "Usuários podem editar seus próprios perfis" ON public.profiles;
DROP POLICY IF EXISTS "Administradores podem visualizar todos os perfis" ON public.profiles;
DROP POLICY IF EXISTS "Administradores podem editar todos os perfis" ON public.profiles;

-- Enable RLS on profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Recreate policies
CREATE POLICY "Usuários podem visualizar seus próprios perfis"
ON public.profiles FOR SELECT
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Usuários podem editar seus próprios perfis"
ON public.profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Administradores podem visualizar todos os perfis"
ON public.profiles FOR SELECT
TO authenticated
USING (is_admin());

CREATE POLICY "Administradores podem editar todos os perfis"
ON public.profiles FOR UPDATE
TO authenticated
USING (is_admin());

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('avatars', 'Avatares de Usuário', true),
  ('demos', 'Uploads de Demo', false),
  ('community', 'Conteúdo da Comunidade', true),
  ('products', 'Imagens de Produtos', true),
  ('nfts', 'Arquivos de NFT', true),
  ('press_kit', 'Materiais para Imprensa', true),
  ('creativeflow', 'Arquivos do CreativeFlow', false),
  ('temp', 'Arquivos Temporários', false)
ON CONFLICT (id) DO NOTHING;

-- Create demo users if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'admin@jestfly.com') THEN
    PERFORM create_demo_users();
  END IF;
END $$;

```


The SQL migration failed with the following error:

ERROR: 42P01: relation "public.wallets" does not exist
QUERY: INSERT INTO public.wallets (user_id, balance) VALUES (NEW.id, 50)

This indicates that the public.wallets table doesn't exist yet, but the functions are trying to insert data into it. Let me fix this by creating the missing wallet tables first.

```
-- Create wallet table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.wallets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) UNIQUE,
  balance NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create transactions table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_id UUID NOT NULL REFERENCES wallets(id),
  amount NUMERIC NOT NULL,
  transaction_type TEXT NOT NULL,
  reference_id UUID,
  reference_type TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Modify handle_new_user function to handle missing wallet table
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    email,
    display_name,
    username,
    profile_type,
    avatar,
    created_at,
    updated_at,
    last_login,
    is_verified,
    two_factor_enabled,
    preferences
  ) VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'username', CONCAT('user_', SUBSTR(NEW.id::text, 1, 8))),
    COALESCE((NEW.raw_user_meta_data->>'profileType')::profile_type, 'fan'),
    NULL,
    NOW(),
    NOW(),
    NOW(),
    NEW.email_confirmed_at IS NOT NULL,
    false,
    '{
      "theme": "dark",
      "language": "pt",
      "currency": "BRL",
      "notifications": {
        "email": true,
        "push": true,
        "sms": false
      }
    }'::JSONB
  );
  
  -- Only create wallet if table exists
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'wallets') THEN
    INSERT INTO public.wallets (user_id, balance)
    VALUES (NEW.id, 50);
  END IF;
  
  RETURN NEW;
END;
$$;

-- Update create_demo_users function to handle missing wallet table
CREATE OR REPLACE FUNCTION create_demo_users()
RETURNS void AS $$
DECLARE
  admin_id UUID;
  artist_id UUID;
  collaborator_id UUID;
  fan_id UUID;
BEGIN
  -- Create admin user
  INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, confirmation_sent_at, 
                         raw_user_meta_data, created_at, updated_at)
  VALUES (gen_random_uuid(), 'admin@jestfly.com', 
          crypt('admin123', gen_salt('bf')), 
          now(), now(), 
          '{"display_name":"Administrador JestFly", "username":"admin_jestfly", "profileType":"admin"}'::jsonb,
          now(), now())
  RETURNING id INTO admin_id;
  
  -- Create artist user
  INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, confirmation_sent_at, 
                         raw_user_meta_data, created_at, updated_at)
  VALUES (gen_random_uuid(), 'artist@jestfly.com', 
          crypt('artist123', gen_salt('bf')), 
          now(), now(), 
          '{"display_name":"DJ SoundMaster", "username":"dj_soundmaster", "profileType":"artist"}'::jsonb,
          now(), now())
  RETURNING id INTO artist_id;
          
  -- Create collaborator user
  INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, confirmation_sent_at, 
                         raw_user_meta_data, created_at, updated_at)
  VALUES (gen_random_uuid(), 'collaborator@jestfly.com', 
          crypt('collab123', gen_salt('bf')), 
          now(), now(), 
          '{"display_name":"Tech Support", "username":"tech_support", "profileType":"collaborator"}'::jsonb,
          now(), now())
  RETURNING id INTO collaborator_id;
  
  -- Create fan user
  INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, confirmation_sent_at, 
                         raw_user_meta_data, created_at, updated_at)
  VALUES (gen_random_uuid(), 'fan@jestfly.com', 
          crypt('fan123', gen_salt('bf')), 
          now(), now(), 
          '{"display_name":"Fã de Música", "username":"music_fan", "profileType":"fan"}'::jsonb,
          now(), now())
  RETURNING id INTO fan_id;
  
  -- Add users to mfa table (required for authentication)
  INSERT INTO auth.mfa_factors (id, user_id, created_at, updated_at, factor_type, status)
  VALUES 
    (gen_random_uuid(), admin_id, now(), now(), 'totp', 'verified'),
    (gen_random_uuid(), artist_id, now(), now(), 'totp', 'verified'),
    (gen_random_uuid(), collaborator_id, now(), now(), 'totp', 'verified'),
    (gen_random_uuid(), fan_id, now(), now(), 'totp', 'verified');
    
  -- Only create wallets if table exists
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'wallets') THEN
    INSERT INTO public.wallets (user_id, balance)
    VALUES 
      (admin_id, 1000),
      (artist_id, 500),
      (collaborator_id, 300),
      (fan_id, 100);
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Create demo users if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'admin@jestfly.com') THEN
    PERFORM create_demo_users();
  END IF;
END $$;

```

```
-- Create wallet table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.wallets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) UNIQUE,
  balance NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create transactions table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_id UUID NOT NULL REFERENCES wallets(id),
  amount NUMERIC NOT NULL,
  transaction_type TEXT NOT NULL,
  reference_id UUID,
  reference_type TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Modify handle_new_user function to check if wallet exists before creating
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    email,
    display_name,
    username,
    profile_type,
    avatar,
    created_at,
    updated_at,
    last_login,
    is_verified,
    two_factor_enabled,
    preferences
  ) VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'username', CONCAT('user_', SUBSTR(NEW.id::text, 1, 8))),
    COALESCE((NEW.raw_user_meta_data->>'profileType')::profile_type, 'fan'),
    NULL,
    NOW(),
    NOW(),
    NOW(),
    NEW.email_confirmed_at IS NOT NULL,
    false,
    '{
      "theme": "dark",
      "language": "pt",
      "currency": "BRL",
      "notifications": {
        "email": true,
        "push": true,
        "sms": false
      }
    }'::JSONB
  );
  
  -- Only create wallet if it doesn't already exist
  IF NOT EXISTS (SELECT 1 FROM public.wallets WHERE user_id = NEW.id) THEN
    INSERT INTO public.wallets (user_id, balance)
    VALUES (NEW.id, 50);
  END IF;
  
  RETURN NEW;
END;
$$;

-- Update create_demo_users function to check if wallets exist
CREATE OR REPLACE FUNCTION create_demo_users()
RETURNS void AS $$
DECLARE
  admin_id UUID;
  artist_id UUID;
  collaborator_id UUID;
  fan_id UUID;
BEGIN
  -- Create admin user
  INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, confirmation_sent_at, 
                         raw_user_meta_data, created_at, updated_at)
  VALUES (gen_random_uuid(), 'admin@jestfly.com', 
          crypt('admin123', gen_salt('bf')), 
          now(), now(), 
          '{"display_name":"Administrador JestFly", "username":"admin_jestfly", "profileType":"admin"}'::jsonb,
          now(), now())
  RETURNING id INTO admin_id;
  
  -- Create artist user
  INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, confirmation_sent_at, 
                         raw_user_meta_data, created_at, updated_at)
  VALUES (gen_random_uuid(), 'artist@jestfly.com', 
          crypt('artist123', gen_salt('bf')), 
          now(), now(), 
          '{"display_name":"DJ SoundMaster", "username":"dj_soundmaster", "profileType":"artist"}'::jsonb,
          now(), now())
  RETURNING id INTO artist_id;
          
  -- Create collaborator user
  INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, confirmation_sent_at, 
                         raw_user_meta_data, created_at, updated_at)
  VALUES (gen_random_uuid(), 'collaborator@jestfly.com', 
          crypt('collab123', gen_salt('bf')), 
          now(), now(), 
          '{"display_name":"Tech Support", "username":"tech_support", "profileType":"collaborator"}'::jsonb,
          now(), now())
  RETURNING id INTO collaborator_id;
  
  -- Create fan user
  INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, confirmation_sent_at, 
                         raw_user_meta_data, created_at, updated_at)
  VALUES (gen_random_uuid(), 'fan@jestfly.com', 
          crypt('fan123', gen_salt('bf')), 
          now(), now(), 
          '{"display_name":"Fã de Música", "username":"music_fan", "profileType":"fan"}'::jsonb,
          now(), now())
  RETURNING id INTO fan_id;
  
  -- Add users to mfa table (required for authentication)
  INSERT INTO auth.mfa_factors (id, user_id, created_at, updated_at, factor_type, status)
  VALUES 
    (gen_random_uuid(), admin_id, now(), now(), 'totp', 'verified'),
    (gen_random_uuid(), artist_id, now(), now(), 'totp', 'verified'),
    (gen_random_uuid(), collaborator_id, now(), now(), 'totp', 'verified'),
    (gen_random_uuid(), fan_id, now(), now(), 'totp', 'verified');
    
  -- Create wallets only if they don't exist
  IF NOT EXISTS (SELECT 1 FROM public.wallets WHERE user_id = admin_id) THEN
    INSERT INTO public.wallets (user_id, balance)
    VALUES (admin_id, 1000);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM public.wallets WHERE user_id = artist_id) THEN
    INSERT INTO public.wallets (user_id, balance)
    VALUES (artist_id, 500);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM public.wallets WHERE user_id = collaborator_id) THEN
    INSERT INTO public.wallets (user_id, balance)
    VALUES (collaborator_id, 300);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM public.wallets WHERE user_id = fan_id) THEN
    INSERT INTO public.wallets (user_id, balance)
    VALUES (fan_id, 100);
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Create demo users if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'admin@jestfly.com') THEN
    PERFORM create_demo_users();
  END IF;
END $$;

```