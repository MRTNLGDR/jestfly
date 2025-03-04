
-- Tabela para tipos de reserva
CREATE TABLE IF NOT EXISTS public.booking_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price NUMERIC NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Inserir tipos de reserva padrão
INSERT INTO public.booking_types (name, description, price)
VALUES 
  ('dj', 'Contrate DJs profissionais para seu evento, com equipamento de som incluso.', 1500),
  ('studio', 'Reserve nosso estúdio profissional para gravações, mixagens e masterizações.', 800),
  ('consultoria', 'Consultoria personalizada para artistas e produtores musicais.', 500);

-- Tabela para reservas
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id),
  booking_type TEXT NOT NULL,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  time_slot TEXT NOT NULL,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Trigger para atualizar o campo updated_at
CREATE OR REPLACE FUNCTION public.update_booking_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_bookings_updated_at
BEFORE UPDATE ON public.bookings
FOR EACH ROW
EXECUTE FUNCTION public.update_booking_updated_at_column();

-- Tabela para disponibilidade
CREATE TABLE IF NOT EXISTS public.availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_id UUID,
  resource_type TEXT NOT NULL,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Função para gerar slots de disponibilidade padrão para os próximos 30 dias
CREATE OR REPLACE FUNCTION public.generate_default_availability()
RETURNS VOID AS $$
DECLARE
  start_date DATE := CURRENT_DATE + INTERVAL '1 DAY';
  end_date DATE := CURRENT_DATE + INTERVAL '30 DAYS';
  current_date DATE;
  resource_types TEXT[] := ARRAY['dj', 'studio', 'consultoria'];
  resource_type TEXT;
  hour_value INTEGER;
BEGIN
  -- Loop pelos tipos de recurso
  FOREACH resource_type IN ARRAY resource_types
  LOOP
    -- Loop pelos dias
    current_date := start_date;
    WHILE current_date <= end_date LOOP
      -- Pular fins de semana (6 = sábado, 0 = domingo)
      IF EXTRACT(DOW FROM current_date) NOT IN (0, 6) THEN
        -- Loop pelas horas de trabalho (9h às 18h)
        FOR hour_value IN 9..17 LOOP
          -- Inserir slot de disponibilidade
          INSERT INTO public.availability (
            resource_type, 
            start_time, 
            end_time, 
            is_available
          )
          VALUES (
            resource_type,
            current_date + (hour_value * INTERVAL '1 hour'),
            current_date + ((hour_value + 1) * INTERVAL '1 hour'),
            TRUE
          );
        END LOOP;
      END IF;
      
      current_date := current_date + INTERVAL '1 DAY';
    END LOOP;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Executar função para gerar disponibilidade inicial
SELECT public.generate_default_availability();

-- Criar políticas RLS para as tabelas

-- Permitir acesso de leitura aos tipos de reserva para todos
ALTER TABLE public.booking_types ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Qualquer pessoa pode ver tipos de reserva"
ON public.booking_types FOR SELECT
TO public
USING (true);

-- Políticas para reservas
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Usuários autenticados podem criar suas próprias reservas
CREATE POLICY "Usuários podem criar suas próprias reservas"
ON public.bookings FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Usuários podem ver suas próprias reservas
CREATE POLICY "Usuários podem ver suas próprias reservas"
ON public.bookings FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Usuários podem atualizar suas próprias reservas
CREATE POLICY "Usuários podem atualizar suas próprias reservas"
ON public.bookings FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

-- Políticas para disponibilidade
ALTER TABLE public.availability ENABLE ROW LEVEL SECURITY;

-- Qualquer pessoa pode ver a disponibilidade
CREATE POLICY "Qualquer pessoa pode ver a disponibilidade"
ON public.availability FOR SELECT
TO public
USING (true);

-- Apenas administradores podem modificar a disponibilidade (você pode ajustar isto conforme necessário)
CREATE POLICY "Apenas administradores podem modificar a disponibilidade"
ON public.availability FOR INSERT
TO authenticated
WITH CHECK (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);

CREATE POLICY "Apenas administradores podem atualizar a disponibilidade"
ON public.availability FOR UPDATE
TO authenticated
USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);
