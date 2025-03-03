
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'

// Este é um código simples - em uma aplicação real, você deve armazenar isso de forma segura
// e possivelmente usar um serviço de gerenciamento de segredos ou configuração
const VALID_ADMIN_CODES = ['JEST2023', 'FLYADMIN'];

interface RequestBody {
  userId: string;
  adminCode: string;
}

serve(async (req) => {
  // Verificar se o método é POST
  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Método não permitido' }),
      { headers: { 'Content-Type': 'application/json' }, status: 405 }
    )
  }

  try {
    // Obter o corpo da requisição
    const body: RequestBody = await req.json()
    const { userId, adminCode } = body

    // Validar os dados de entrada
    if (!userId || !adminCode) {
      return new Response(
        JSON.stringify({ error: 'Parâmetros inválidos' }),
        { headers: { 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Verificar se o código de administrador é válido
    const isValid = VALID_ADMIN_CODES.includes(adminCode)

    // Retornar o resultado
    return new Response(
      JSON.stringify({ valid: isValid }),
      { headers: { 'Content-Type': 'application/json' }, status: 200 }
    )
  } catch (error) {
    // Lidar com erros
    console.error('Erro ao verificar código de administrador:', error)
    
    return new Response(
      JSON.stringify({ error: 'Erro interno do servidor' }),
      { headers: { 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
