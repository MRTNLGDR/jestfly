
-- Create a function to increment a value safely
CREATE OR REPLACE FUNCTION public.increment_value(row_id UUID, column_name TEXT, increment_amount NUMERIC)
RETURNS NUMERIC 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_val NUMERIC;
  new_val NUMERIC;
  table_name TEXT := 'wallets'; -- Assumimos que é a tabela wallets, mas poderia ser parametrizada
BEGIN
  -- Get current value
  EXECUTE format('SELECT %I FROM %I WHERE id = $1', column_name, table_name)
  INTO current_val
  USING row_id;
  
  -- Calculate new value
  new_val := current_val + increment_amount;
  
  -- Update value
  EXECUTE format('UPDATE %I SET %I = $1 WHERE id = $2', table_name, column_name)
  USING new_val, row_id;
  
  RETURN new_val;
END;
$$;
