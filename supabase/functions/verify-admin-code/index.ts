
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1'

interface AdminCodeRequest {
  userId: string;
  adminCode: string;
}

serve(async (req) => {
  // Configurar CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      },
    })
  }

  try {
    // Verificar se é um POST
    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      })
    }

    // Obter o token de autenticação
    const authHeader = req.headers.get('Authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      })
    }

    const token = authHeader.replace('Bearer ', '')

    // Criar cliente Supabase com o token do usuário
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
      global: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    })

    // Verificar o usuário atual
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser(token)

    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized', details: userError }), {
        status: 401,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      })
    }

    // Obter os dados da requisição
    const { userId, adminCode } = await req.json() as AdminCodeRequest

    // Verificar se o userId corresponde ao usuário autenticado
    if (user.id !== userId) {
      return new Response(JSON.stringify({ error: 'User ID mismatch' }), {
        status: 403,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      })
    }

    // Verificar código de administrador
    const { data: codeData, error: codeError } = await supabase
      .from('admin_codes')
      .select('*')
      .eq('code', adminCode)
      .eq('used', false)
      .single()

    if (codeError || !codeData) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Invalid admin code', 
        details: codeError 
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      })
    }

    // Iniciar transação para atualizar código e adicionar role de admin
    const serviceClient = createClient(supabaseUrl, supabaseServiceKey)
    
    // 1. Marcar código como usado
    const { error: updateError } = await serviceClient
      .from('admin_codes')
      .update({
        used: true,
        used_by: userId,
        used_at: new Date().toISOString(),
      })
      .eq('id', codeData.id)

    if (updateError) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Failed to update admin code', 
        details: updateError 
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      })
    }

    // 2. Adicionar role de admin ao usuário
    const { error: roleError } = await serviceClient
      .from('user_roles')
      .insert({
        user_id: userId,
        role: 'admin',
      })
      .select()

    if (roleError) {
      // Se o erro for de duplicação, é porque o usuário já tem a role
      if (!roleError.message.includes('duplicate key value')) {
        return new Response(JSON.stringify({ 
          success: false, 
          error: 'Failed to add admin role', 
          details: roleError 
        }), {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        })
      }
    }

    // Atualizar o tipo de perfil para admin
    const { error: profileError } = await serviceClient
      .from('profiles')
      .update({
        profile_type: 'admin',
      })
      .eq('id', userId)

    if (profileError) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Failed to update profile', 
        details: profileError 
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      })
    }

    // Tudo deu certo
    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Admin code verified and role assigned'
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    })
  } catch (error) {
    return new Response(JSON.stringify({ 
      success: false, 
      error: 'Server error', 
      details: error.message 
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    })
  }
})
