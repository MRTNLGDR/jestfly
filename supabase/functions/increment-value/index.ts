
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { row_id, column_name, table_name, increment_amount } = await req.json()

    // Validate inputs
    if (!row_id || !column_name || !table_name || increment_amount === undefined) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') as string
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') as string
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Get current value
    const { data: currentData, error: fetchError } = await supabase
      .from(table_name)
      .select(column_name)
      .eq('id', row_id)
      .single()

    if (fetchError) {
      return new Response(
        JSON.stringify({ error: 'Error fetching data', details: fetchError }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const currentValue = currentData[column_name] || 0
    const newValue = currentValue + increment_amount

    // Update the value
    const { data, error: updateError } = await supabase
      .from(table_name)
      .update({ [column_name]: newValue })
      .eq('id', row_id)
      .select()

    if (updateError) {
      return new Response(
        JSON.stringify({ error: 'Error updating data', details: updateError }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        previous_value: currentValue, 
        new_value: newValue,
        data 
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
