
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { searchTerm, modelUrl } = await req.json()
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Se for uma URL direta do Sketchfab
    if (modelUrl) {
      // Extrair ID do modelo da URL
      const modelIdMatch = modelUrl.match(/models\/([a-f0-9-]+)/) || modelUrl.match(/3d-models\/[^/]+-([a-f0-9-]+)/)
      if (!modelIdMatch || !modelIdMatch[1]) {
        return new Response(
          JSON.stringify({ error: 'URL de modelo inválida' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        )
      }

      const modelId = modelIdMatch[1]
      console.log(`Buscando modelo com ID: ${modelId}`)

      // Buscar detalhes do modelo do Sketchfab
      const modelDetailUrl = `https://api.sketchfab.com/v3/models/${modelId}`
      const response = await fetch(modelDetailUrl)

      if (!response.ok) {
        return new Response(
          JSON.stringify({ error: 'Erro ao obter detalhes do modelo', status: response.status }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: response.status }
        )
      }

      const modelDetails = await response.json()
      
      return new Response(
        JSON.stringify({ model: modelDetails }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Se for uma busca por termo
    if (searchTerm) {
      const searchUrl = `https://api.sketchfab.com/v3/search?type=models&q=${encodeURIComponent(searchTerm)}`
      const response = await fetch(searchUrl)

      if (!response.ok) {
        return new Response(
          JSON.stringify({ error: 'Erro ao buscar modelos', status: response.status }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: response.status }
        )
      }

      const searchResults = await response.json()
      
      return new Response(
        JSON.stringify({ results: searchResults.results }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ error: 'Parâmetro searchTerm ou modelUrl é obrigatório' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  } catch (error) {
    console.error('Erro:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
