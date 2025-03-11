
-- Habilitar RLS nas tabelas da comunidade
ALTER TABLE IF EXISTS public.community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.post_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.comment_likes ENABLE ROW LEVEL SECURITY;

-- Políticas para community_posts
DROP POLICY IF EXISTS "Qualquer pessoa pode visualizar posts" ON public.community_posts;
CREATE POLICY "Qualquer pessoa pode visualizar posts" 
ON public.community_posts FOR SELECT 
TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS "Usuários autenticados podem criar posts" ON public.community_posts;
CREATE POLICY "Usuários autenticados podem criar posts" 
ON public.community_posts FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Usuários podem atualizar seus próprios posts" ON public.community_posts;
CREATE POLICY "Usuários podem atualizar seus próprios posts" 
ON public.community_posts FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Usuários podem excluir seus próprios posts" ON public.community_posts;
CREATE POLICY "Usuários podem excluir seus próprios posts" 
ON public.community_posts FOR DELETE 
TO authenticated
USING (auth.uid() = user_id);

-- Políticas para post_comments
DROP POLICY IF EXISTS "Qualquer pessoa pode visualizar comentários" ON public.post_comments;
CREATE POLICY "Qualquer pessoa pode visualizar comentários" 
ON public.post_comments FOR SELECT 
TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS "Usuários autenticados podem criar comentários" ON public.post_comments;
CREATE POLICY "Usuários autenticados podem criar comentários" 
ON public.post_comments FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Usuários podem atualizar seus próprios comentários" ON public.post_comments;
CREATE POLICY "Usuários podem atualizar seus próprios comentários" 
ON public.post_comments FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Usuários podem excluir seus próprios comentários" ON public.post_comments;
CREATE POLICY "Usuários podem excluir seus próprios comentários" 
ON public.post_comments FOR DELETE 
TO authenticated
USING (auth.uid() = user_id);

-- Políticas para post_likes
DROP POLICY IF EXISTS "Qualquer pessoa pode visualizar curtidas de posts" ON public.post_likes;
CREATE POLICY "Qualquer pessoa pode visualizar curtidas de posts" 
ON public.post_likes FOR SELECT 
TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS "Usuários autenticados podem curtir posts" ON public.post_likes;
CREATE POLICY "Usuários autenticados podem curtir posts" 
ON public.post_likes FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Usuários podem remover suas próprias curtidas" ON public.post_likes;
CREATE POLICY "Usuários podem remover suas próprias curtidas" 
ON public.post_likes FOR DELETE 
TO authenticated
USING (auth.uid() = user_id);

-- Políticas para comment_likes
DROP POLICY IF EXISTS "Qualquer pessoa pode visualizar curtidas de comentários" ON public.comment_likes;
CREATE POLICY "Qualquer pessoa pode visualizar curtidas de comentários" 
ON public.comment_likes FOR SELECT 
TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS "Usuários autenticados podem curtir comentários" ON public.comment_likes;
CREATE POLICY "Usuários autenticados podem curtir comentários" 
ON public.comment_likes FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Usuários podem remover suas próprias curtidas de comentários" ON public.comment_likes;
CREATE POLICY "Usuários podem remover suas próprias curtidas de comentários" 
ON public.comment_likes FOR DELETE 
TO authenticated
USING (auth.uid() = user_id);
