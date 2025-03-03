
-- Criar bucket para avatares
CREATE POLICY "Permitir acesso público para avatares"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatares' AND auth.role() = 'authenticated');

CREATE POLICY "Permitir uploads de avatares para usuários autenticados"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'avatares' AND auth.role() = 'authenticated');

CREATE POLICY "Permitir atualizações de avatares para proprietários"
ON storage.objects FOR UPDATE
USING (bucket_id = 'avatares' AND auth.uid() = owner);

CREATE POLICY "Permitir exclusão de avatares para proprietários"
ON storage.objects FOR DELETE
USING (bucket_id = 'avatares' AND auth.uid() = owner);
