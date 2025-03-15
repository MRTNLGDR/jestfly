
import React, { useState } from 'react';
import { Rocket, Music, Gamepad2, Share2, Users, Gift, Layers, Zap, Code, ExternalLink } from 'lucide-react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import { Button } from './ui/button';

const RoadmapSection = () => {
  const [activeFeature, setActiveFeature] = useState<string | null>(null);
  
  // Detalhes completos das funcionalidades
  const featureDetails = {
    music: {
      title: "Integração com Plataformas Musicais",
      objective: "Permitir que artistas sincronizem seus lançamentos e que os usuários reproduzam faixas direto da plataforma.",
      features: [
        "API para conectar com Beatport, Amazon Music e SoundCloud.",
        "Players embutidos para ouvir trechos das músicas antes de comprar.",
        "Sistema de \"Sync my music\", permitindo que artistas conectem suas contas e importem suas faixas."
      ],
      apis: ["SoundCloud API", "Beatport API", "Amazon Music API"],
      icon: <Music className="h-6 w-6" />
    },
    game: {
      title: "Game Estilo Runner - DJ Collect Run",
      objective: "Criar um jogo runner urbano estilo cartoon, onde um DJ loiro de cartola marrom, smoke de zebra, calça estilosa e tênis com spikes corre pela cidade coletando moedas para ganhar prêmios.",
      features: [
        "Personagem principal: Um DJ estiloso correndo por uma cidade vibrante e neon.",
        "Coletáveis: Moedas JestCoin (ouro com símbolo de copas).",
        "Obstáculos: Trânsito, caixas de som, raios de luz, NPCs dançantes.",
        "Poderes especiais: Speed Boost, Magnet para moedas, Slow Motion.",
        "Ranking global: Jogadores no topo do ranking ganham ingressos para shows, brindes e NFTs.",
        "Controles: Mobile-friendly (Swipe para pular, desviar e deslizar).",
        "Mecânica de competição: Quem compartilha o jogo nas redes sociais ganha pontos extras."
      ],
      technologies: ["Babylon.js + Phaser.js para renderização 3D e física.", "Supabase para armazenar rankings e prêmios."],
      icon: <Gamepad2 className="h-6 w-6" />
    },
    rewards: {
      title: "Sistema de Pontuação e Airdrop via Compartilhamento",
      objective: "Criar um sistema de recompensas para quem compartilha conteúdos da plataforma.",
      features: [
        "Cada vez que o usuário compartilha um evento, música ou NFT no Instagram ou Facebook, ele ganha pontos JestCoin.",
        "O sistema verifica o compartilhamento via API do Facebook e Instagram.",
        "Os pontos acumulados podem ser trocados por prêmios, como ingressos, NFTs exclusivos e acesso VIP."
      ],
      apis: ["Meta Graph API", "Instagram Basic Display API"],
      icon: <Share2 className="h-6 w-6" />
    },
    community: {
      title: "Comunidade Interativa (Base de Fãs)",
      objective: "Criar um hub social para os fãs interagirem, compartilharem conteúdos e divulgarem novidades.",
      features: [
        "Feed de postagens para divulgação de lançamentos e eventos.",
        "Sistema de reações e comentários (com emojis interativos).",
        "Gamificação: Quem interage mais, ganha mais pontos JestCoin.",
        "Sistema de missões: Compartilhar X vezes, comentar Y vezes, ganhar seguidores.",
        "Integração com eventos e shows: Notificações sobre próximos lançamentos."
      ],
      tools: ["Supabase Realtime para feed de postagens ao vivo.", "WebSockets para chat interativo."],
      icon: <Users className="h-6 w-6" />
    },
    lootbox: {
      title: "NFT Loot Boxes para Recompensas",
      objective: "Incentivar a participação ativa dos usuários e aumentar o valor dos NFTs.",
      features: [
        "Ao completar missões (compartilhar, jogar, interagir na comunidade), o usuário ganha uma loot box NFT.",
        "Dentro da loot box pode haver JestCoins, ingressos VIP, músicas exclusivas ou skins para o jogo."
      ],
      benefit: "Incentiva os usuários a participarem ativamente e aumenta o valor dos NFTs.",
      icon: <Gift className="h-6 w-6" />
    },
    studio: {
      title: "Modo DJ Studio (Produção Musical no Browser)",
      objective: "Transformar a plataforma em um espaço criativo para DJs.",
      features: [
        "Adicionar uma seção onde os usuários podem mixar músicas diretamente no JESTFLY.",
        "Criar um DJ Pad interativo, permitindo que qualquer pessoa brinque de produtor musical.",
        "Quem criar remixes populares pode vendê-los como NFTs exclusivos."
      ],
      benefit: "Transforma a plataforma não só em um marketplace, mas também em um espaço criativo para DJs.",
      icon: <Rocket className="h-6 w-6" />
    }
  };

  return (
    <section className="w-full py-20 relative overflow-hidden bg-black">
      {/* Background gradients */}
      <div className="absolute -top-60 -left-60 w-[600px] h-[600px] rounded-full bg-purple-900/10 blur-[150px]"></div>
      <div className="absolute -bottom-60 -right-60 w-[600px] h-[600px] rounded-full bg-blue-900/10 blur-[150px]"></div>
      
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tighter">
            <span className="text-gradient-primary">ROADMAP</span> & FUTURE FEATURES
          </h2>
          <p className="text-white/70 max-w-2xl mx-auto">
            Nossa visão para o JESTFLY vai além do que você vê hoje. Estamos criando um ecossistema completo para artistas e fãs, com jogos, integrações musicais e muito mais.
          </p>
        </div>

        {/* Architecture Layers Section */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold mb-6 text-center">
            <span className="text-gradient-primary">Arquitetura</span> JESTFLY
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Layer 1 */}
            <div className="neo-blur rounded-lg p-6 border border-white/10 hover:border-white/20 transition-all group">
              <div className="w-12 h-12 rounded-xl mb-6 flex items-center justify-center bg-gradient-to-br from-pink-600 to-purple-900 group-hover:scale-105 transition-transform">
                <Layers className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Camada 1 - Plataforma Principal</h3>
              <ul className="text-white/70 space-y-2 list-disc list-inside mb-4">
                <li>Marketplace de NFTs 🎨</li>
                <li>Streaming de música 🎶</li>
                <li>Sistema de sorteios (Giveaways) 🎁</li>
                <li>Eventos e agenda interativa 📅</li>
                <li>Sistema de bookings e agenda 📋</li>
              </ul>
            </div>
            
            {/* Layer 2 */}
            <div className="neo-blur rounded-lg p-6 border border-white/10 hover:border-white/20 transition-all group">
              <div className="w-12 h-12 rounded-xl mb-6 flex items-center justify-center bg-gradient-to-br from-blue-600 to-cyan-700 group-hover:scale-105 transition-transform">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Camada 2 - Novos Recursos</h3>
              <ul className="text-white/70 space-y-2 list-disc list-inside mb-4">
                <li>Game estilo runner "DJ Collect Run" 🎮</li>
                <li>Sistema de recompensas via JestCoin 🏆</li>
                <li>Airdrop para compartilhamento 🔄</li>
                <li>Hub social com feed de postagens 👥</li>
              </ul>
            </div>
            
            {/* Layer 3 */}
            <div className="neo-blur rounded-lg p-6 border border-white/10 hover:border-white/20 transition-all group">
              <div className="w-12 h-12 rounded-xl mb-6 flex items-center justify-center bg-gradient-to-br from-green-600 to-emerald-800 group-hover:scale-105 transition-transform">
                <Code className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Camada 3 - Conexões Externas</h3>
              <ul className="text-white/70 space-y-2 list-disc list-inside mb-4">
                <li>Integração com Beatport, Amazon Music e SoundCloud 🎵</li>
                <li>Autenticação com redes sociais (Facebook, Instagram) 🔗</li>
                <li>Wallet Connect para criptomoedas e NFTs 💰</li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {/* Music Integration */}
          <Sheet>
            <SheetTrigger asChild>
              <div className="neo-blur rounded-lg p-6 border border-white/10 hover:border-white/20 transition-all group cursor-pointer">
                <div className="w-12 h-12 rounded-xl mb-6 flex items-center justify-center bg-gradient-to-br from-pink-600 to-purple-900 group-hover:scale-105 transition-transform">
                  <Music className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">Integração com Plataformas Musicais</h3>
                <p className="text-white/70 mb-4">
                  Conecte-se com Beatport, Amazon Music e SoundCloud para sincronizar música, reproduzir trechos e permitir que artistas importem suas faixas.
                </p>
                <div className="text-xs text-white/50 uppercase tracking-wider flex items-center">
                  <span>Saiba mais</span>
                  <ExternalLink className="ml-1 h-3 w-3" />
                </div>
              </div>
            </SheetTrigger>
            <SheetContent className="bg-black/95 border-white/10 text-white overflow-y-auto">
              <SheetHeader>
                <SheetTitle className="text-gradient-primary text-2xl">{featureDetails.music.title}</SheetTitle>
                <SheetDescription className="text-white/70">
                  {featureDetails.music.objective}
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6">
                <h4 className="font-bold mb-2 text-white">Funcionalidades:</h4>
                <ul className="space-y-2 text-white/80 list-disc pl-5">
                  {featureDetails.music.features.map((feature, idx) => (
                    <li key={idx}>{feature}</li>
                  ))}
                </ul>
                
                <h4 className="font-bold mb-2 mt-4 text-white">APIs Sugeridas:</h4>
                <ul className="space-y-2 text-white/80 list-disc pl-5">
                  {featureDetails.music.apis.map((api, idx) => (
                    <li key={idx}>{api}</li>
                  ))}
                </ul>
              </div>
            </SheetContent>
          </Sheet>
          
          {/* Runner Game */}
          <Sheet>
            <SheetTrigger asChild>
              <div className="neo-blur rounded-lg p-6 border border-white/10 hover:border-white/20 transition-all group cursor-pointer">
                <div className="w-12 h-12 rounded-xl mb-6 flex items-center justify-center bg-gradient-to-br from-blue-600 to-cyan-700 group-hover:scale-105 transition-transform">
                  <Gamepad2 className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">DJ Collect Run Game</h3>
                <p className="text-white/70 mb-4">
                  Um jogo estilizado onde um DJ corre coletando JestCoins para ganhar prêmios reais, incluindo ingressos para eventos e NFTs exclusivos.
                </p>
                <div className="text-xs text-white/50 uppercase tracking-wider flex items-center">
                  <span>Saiba mais</span>
                  <ExternalLink className="ml-1 h-3 w-3" />
                </div>
              </div>
            </SheetTrigger>
            <SheetContent className="bg-black/95 border-white/10 text-white overflow-y-auto">
              <SheetHeader>
                <SheetTitle className="text-gradient-primary text-2xl">{featureDetails.game.title}</SheetTitle>
                <SheetDescription className="text-white/70">
                  {featureDetails.game.objective}
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6">
                <h4 className="font-bold mb-2 text-white">Funcionalidades:</h4>
                <ul className="space-y-2 text-white/80 list-disc pl-5">
                  {featureDetails.game.features.map((feature, idx) => (
                    <li key={idx}>{feature}</li>
                  ))}
                </ul>
                
                <h4 className="font-bold mb-2 mt-4 text-white">Tecnologias Sugeridas:</h4>
                <ul className="space-y-2 text-white/80 list-disc pl-5">
                  {featureDetails.game.technologies.map((tech, idx) => (
                    <li key={idx}>{tech}</li>
                  ))}
                </ul>
              </div>
            </SheetContent>
          </Sheet>
          
          {/* Social Sharing System */}
          <Sheet>
            <SheetTrigger asChild>
              <div className="neo-blur rounded-lg p-6 border border-white/10 hover:border-white/20 transition-all group cursor-pointer">
                <div className="w-12 h-12 rounded-xl mb-6 flex items-center justify-center bg-gradient-to-br from-green-600 to-emerald-800 group-hover:scale-105 transition-transform">
                  <Share2 className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">Sistema de Recompensas & Airdrop</h3>
                <p className="text-white/70 mb-4">
                  Compartilhe conteúdo nas redes sociais para ganhar JestCoins, que podem ser trocados por ingressos, NFTs e acesso VIP.
                </p>
                <div className="text-xs text-white/50 uppercase tracking-wider flex items-center">
                  <span>Saiba mais</span>
                  <ExternalLink className="ml-1 h-3 w-3" />
                </div>
              </div>
            </SheetTrigger>
            <SheetContent className="bg-black/95 border-white/10 text-white overflow-y-auto">
              <SheetHeader>
                <SheetTitle className="text-gradient-primary text-2xl">{featureDetails.rewards.title}</SheetTitle>
                <SheetDescription className="text-white/70">
                  {featureDetails.rewards.objective}
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6">
                <h4 className="font-bold mb-2 text-white">Como funciona?</h4>
                <ul className="space-y-2 text-white/80 list-disc pl-5">
                  {featureDetails.rewards.features.map((feature, idx) => (
                    <li key={idx}>{feature}</li>
                  ))}
                </ul>
                
                <h4 className="font-bold mb-2 mt-4 text-white">APIs Sugeridas:</h4>
                <ul className="space-y-2 text-white/80 list-disc pl-5">
                  {featureDetails.rewards.apis.map((api, idx) => (
                    <li key={idx}>{api}</li>
                  ))}
                </ul>
              </div>
            </SheetContent>
          </Sheet>
          
          {/* Community Hub */}
          <Sheet>
            <SheetTrigger asChild>
              <div className="neo-blur rounded-lg p-6 border border-white/10 hover:border-white/20 transition-all group cursor-pointer">
                <div className="w-12 h-12 rounded-xl mb-6 flex items-center justify-center bg-gradient-to-br from-orange-600 to-red-800 group-hover:scale-105 transition-transform">
                  <Users className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">Hub Comunitário Interativo</h3>
                <p className="text-white/70 mb-4">
                  Um espaço social para fãs interagirem, compartilharem conteúdo e participarem de missões para ganhar recompensas através da gamificação.
                </p>
                <div className="text-xs text-white/50 uppercase tracking-wider flex items-center">
                  <span>Saiba mais</span>
                  <ExternalLink className="ml-1 h-3 w-3" />
                </div>
              </div>
            </SheetTrigger>
            <SheetContent className="bg-black/95 border-white/10 text-white overflow-y-auto">
              <SheetHeader>
                <SheetTitle className="text-gradient-primary text-2xl">{featureDetails.community.title}</SheetTitle>
                <SheetDescription className="text-white/70">
                  {featureDetails.community.objective}
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6">
                <h4 className="font-bold mb-2 text-white">Funcionalidades:</h4>
                <ul className="space-y-2 text-white/80 list-disc pl-5">
                  {featureDetails.community.features.map((feature, idx) => (
                    <li key={idx}>{feature}</li>
                  ))}
                </ul>
                
                <h4 className="font-bold mb-2 mt-4 text-white">Ferramentas Sugeridas:</h4>
                <ul className="space-y-2 text-white/80 list-disc pl-5">
                  {featureDetails.community.tools.map((tool, idx) => (
                    <li key={idx}>{tool}</li>
                  ))}
                </ul>
              </div>
            </SheetContent>
          </Sheet>
          
          {/* NFT Loot Boxes */}
          <Sheet>
            <SheetTrigger asChild>
              <div className="neo-blur rounded-lg p-6 border border-white/10 hover:border-white/20 transition-all group cursor-pointer">
                <div className="w-12 h-12 rounded-xl mb-6 flex items-center justify-center bg-gradient-to-br from-yellow-600 to-amber-800 group-hover:scale-105 transition-transform">
                  <Gift className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">NFT Loot Boxes</h3>
                <p className="text-white/70 mb-4">
                  Complete missões para ganhar caixas NFT contendo JestCoins, ingressos VIP, músicas exclusivas e skins para o jogo.
                </p>
                <div className="text-xs text-white/50 uppercase tracking-wider flex items-center">
                  <span>Saiba mais</span>
                  <ExternalLink className="ml-1 h-3 w-3" />
                </div>
              </div>
            </SheetTrigger>
            <SheetContent className="bg-black/95 border-white/10 text-white overflow-y-auto">
              <SheetHeader>
                <SheetTitle className="text-gradient-primary text-2xl">{featureDetails.lootbox.title}</SheetTitle>
                <SheetDescription className="text-white/70">
                  {featureDetails.lootbox.objective}
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6">
                <h4 className="font-bold mb-2 text-white">Como funciona?</h4>
                <ul className="space-y-2 text-white/80 list-disc pl-5">
                  {featureDetails.lootbox.features.map((feature, idx) => (
                    <li key={idx}>{feature}</li>
                  ))}
                </ul>
                
                <h4 className="font-bold mb-2 mt-4 text-white">Benefício:</h4>
                <p className="text-white/80">{featureDetails.lootbox.benefit}</p>
              </div>
            </SheetContent>
          </Sheet>
          
          {/* DJ Studio */}
          <Sheet>
            <SheetTrigger asChild>
              <div className="neo-blur rounded-lg p-6 border border-white/10 hover:border-white/20 transition-all group cursor-pointer">
                <div className="w-12 h-12 rounded-xl mb-6 flex items-center justify-center bg-gradient-to-br from-indigo-600 to-violet-900 group-hover:scale-105 transition-transform">
                  <Rocket className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">DJ Studio no Browser</h3>
                <p className="text-white/70 mb-4">
                  Mixe músicas diretamente no navegador com um DJ Pad interativo, e venda remixes populares como NFTs exclusivos.
                </p>
                <div className="text-xs text-white/50 uppercase tracking-wider flex items-center">
                  <span>Saiba mais</span>
                  <ExternalLink className="ml-1 h-3 w-3" />
                </div>
              </div>
            </SheetTrigger>
            <SheetContent className="bg-black/95 border-white/10 text-white overflow-y-auto">
              <SheetHeader>
                <SheetTitle className="text-gradient-primary text-2xl">{featureDetails.studio.title}</SheetTitle>
                <SheetDescription className="text-white/70">
                  {featureDetails.studio.objective}
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6">
                <h4 className="font-bold mb-2 text-white">Funcionalidades:</h4>
                <ul className="space-y-2 text-white/80 list-disc pl-5">
                  {featureDetails.studio.features.map((feature, idx) => (
                    <li key={idx}>{feature}</li>
                  ))}
                </ul>
                
                <h4 className="font-bold mb-2 mt-4 text-white">Benefício:</h4>
                <p className="text-white/80">{featureDetails.studio.benefit}</p>
              </div>
            </SheetContent>
          </Sheet>
        </div>
        
        {/* Next Steps Section */}
        <div className="neo-blur rounded-lg p-8 border border-white/10 max-w-3xl mx-auto">
          <h3 className="text-2xl font-bold mb-6 text-center">
            <span className="text-gradient-primary">Próximos</span> Passos
          </h3>
          <ul className="space-y-3 text-white/80">
            <li className="flex items-start">
              <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                <span className="text-white text-xs">1</span>
              </div>
              <p>Implementar as novas funcionalidades na ordem de prioridade</p>
            </li>
            <li className="flex items-start">
              <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                <span className="text-white text-xs">2</span>
              </div>
              <p>Otimizar a experiência mobile para o game e app principal</p>
            </li>
            <li className="flex items-start">
              <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                <span className="text-white text-xs">3</span>
              </div>
              <p>Integrar APIs externas e blockchain</p>
            </li>
            <li className="flex items-start">
              <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                <span className="text-white text-xs">4</span>
              </div>
              <p>Testar e escalar a plataforma</p>
            </li>
          </ul>
          
          <div className="mt-8 text-center">
            <p className="text-white/70 mb-4">
              O JESTFLY está evoluindo para ser muito mais que uma plataforma de música e NFTs - será um ecossistema completo para artistas e fãs!
            </p>
            <Button className="group bg-gradient-to-r from-purple-700 to-blue-700 hover:from-purple-600 hover:to-blue-600 px-6 py-3 rounded-full text-white font-medium">
              Explore nossa visão completa
              <span className="ml-2 inline-block transition-transform group-hover:translate-x-1">→</span>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RoadmapSection;
