
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

interface RequestBody {
  userId: string
  adminCode: string
}

serve(async (req) => {
  try {
    // Get the authorization header from the request
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Não autorizado', success: false }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Create a Supabase client with the auth header
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    )
    
    // Get the request body
    const { userId, adminCode } = await req.json() as RequestBody
    
    // Validate inputs
    if (!userId || !adminCode) {
      return new Response(
        JSON.stringify({ 
          error: 'ID do usuário e código de admin são obrigatórios', 
          success: false 
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }
    
    // Call the RPC function to verify and process the admin code
    const { data, error } = await supabaseClient.rpc(
      'mark_admin_code_used_and_assign_role',
      { user_id: userId, admin_code: adminCode }
    )
    
    if (error) {
      console.error('Erro ao verificar código de admin:', error)
      return new Response(
        JSON.stringify({ 
          error: 'Erro ao verificar código de admin', 
          details: error.message,
          success: false 
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }
    
    // Return success response if the code was valid and role was assigned
    if (data) {
      return new Response(
        JSON.stringify({ 
          message: 'Código de admin válido, papel de admin atribuído', 
          success: true 
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      )
    } else {
      // Return error if the code was invalid or already used
      return new Response(
        JSON.stringify({ 
          error: 'Código de admin inválido ou já utilizado', 
          success: false 
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }
  } catch (error) {
    console.error('Erro no processamento:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Erro interno no servidor', 
        details: error.message,
        success: false 
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
})
