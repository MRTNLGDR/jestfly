
-- Inserir usuários de demonstração para testes
-- IMPORTANTE: Em ambiente de produção, remover estes usuários

-- Primeiro, inserir os usuários na tabela auth.users (isso normalmente seria feito pelo signup)
-- Como alternativa, use comandos de criação de usuário na interface do Supabase

-- Em seguida, certificar-se de que os perfis correspondentes existem
INSERT INTO public.profiles (
  id, 
  email, 
  display_name, 
  username, 
  profile_type, 
  avatar, 
  created_at, 
  updated_at,
  is_verified
)
VALUES 
-- Admin
(
  '00000000-0000-0000-0000-000000000001', 
  'admin@jestfly.com',
  'Administrador',
  'admin',
  'admin',
  NULL,
  NOW(),
  NOW(),
  TRUE
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  display_name = EXCLUDED.display_name,
  username = EXCLUDED.username,
  profile_type = EXCLUDED.profile_type,
  updated_at = NOW(),
  is_verified = TRUE,

-- Artista
(
  '00000000-0000-0000-0000-000000000002', 
  'artist@jestfly.com',
  'Artista Demo',
  'artist',
  'artist',
  NULL,
  NOW(),
  NOW(),
  TRUE
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  display_name = EXCLUDED.display_name,
  username = EXCLUDED.username,
  profile_type = EXCLUDED.profile_type,
  updated_at = NOW(),
  is_verified = TRUE,

-- Colaborador
(
  '00000000-0000-0000-0000-000000000003', 
  'collaborator@jestfly.com',
  'Colaborador Demo',
  'collaborator',
  'collaborator',
  NULL,
  NOW(),
  NOW(),
  TRUE
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  display_name = EXCLUDED.display_name,
  username = EXCLUDED.username,
  profile_type = EXCLUDED.profile_type,
  updated_at = NOW(),
  is_verified = TRUE,

-- Fã
(
  '00000000-0000-0000-0000-000000000004', 
  'fan@jestfly.com',
  'Fã Demo',
  'fan',
  'fan',
  NULL,
  NOW(),
  NOW(),
  TRUE
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  display_name = EXCLUDED.display_name,
  username = EXCLUDED.username,
  profile_type = EXCLUDED.profile_type,
  updated_at = NOW(),
  is_verified = TRUE;

-- NOTA: É necessário criar estes usuários no painel do Supabase (Authentication > Users) com as senhas correspondentes
-- admin@jestfly.com / adminpassword
-- artist@jestfly.com / artistpassword
-- collaborator@jestfly.com / collaboratorpassword
-- fan@jestfly.com / fanpassword
