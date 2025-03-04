
import React from 'react';
import { useJestCoin } from '@/hooks/jestcoin/useJestCoin';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Award, CheckCircle, Share2, Star, Zap } from 'lucide-react';
import { toast } from 'sonner';

const RewardsSection: React.FC = () => {
  const { claimDailyReward, isClaiming, hasClaimedToday } = useJestCoin();

  const handleShareClick = () => {
    // Implementação futura para integração de compartilhamento
    navigator.clipboard.writeText('https://jestfly.com/?ref=sharing')
      .then(() => {
        toast.success('Link copiado para a área de transferência!');
      })
      .catch(err => {
        toast.error('Erro ao copiar link');
        console.error('Erro ao copiar link:', err);
      });
  };

  return (
    <GlassCard className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white">Recompensas</h3>
        <Badge variant="outline" className="border-yellow-500/30 text-yellow-400">
          <Star className="h-3 w-3 mr-1" /> Recompensas
        </Badge>
      </div>

      <div className="space-y-4">
        <div className="p-4 rounded-lg bg-black/30 border border-white/5">
          <div className="flex items-center mb-2">
            <Award className="h-5 w-5 text-yellow-400 mr-2" />
            <h4 className="text-white font-medium">Recompensa Diária</h4>
            {hasClaimedToday && (
              <Badge className="ml-2 bg-green-600/30 text-green-400 border-green-700/30">
                <CheckCircle className="h-3 w-3 mr-1" /> Coletado hoje
              </Badge>
            )}
          </div>
          <p className="text-sm text-white/60 mb-3">Receba 10 JestCoins gratuitamente uma vez por dia</p>
          <Button 
            variant="default" 
            className="w-full bg-yellow-600 hover:bg-yellow-700"
            onClick={claimDailyReward}
            disabled={isClaiming || hasClaimedToday}
          >
            {isClaiming ? 'Processando...' : hasClaimedToday ? 'Já coletado hoje' : 'Coletar 10 JestCoins'}
          </Button>
        </div>

        <div className="p-4 rounded-lg bg-black/30 border border-white/5">
          <div className="flex items-center mb-2">
            <Share2 className="h-5 w-5 text-blue-400 mr-2" />
            <h4 className="text-white font-medium">Compartilhar e Ganhar</h4>
          </div>
          <p className="text-sm text-white/60 mb-3">Ganhe 50 JestCoins para cada amigo que se registrar com seu link</p>
          <Button 
            variant="outline" 
            className="w-full border-blue-500/30 hover:border-blue-500 text-white"
            onClick={handleShareClick}
          >
            Copiar Link de Convite
          </Button>
        </div>

        <div className="p-4 rounded-lg bg-black/30 border border-white/5">
          <div className="flex items-center mb-2">
            <Zap className="h-5 w-5 text-purple-400 mr-2" />
            <h4 className="text-white font-medium">Missões</h4>
          </div>
          <p className="text-sm text-white/60 mb-3">Complete ações para ganhar JestCoins adicionais</p>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/80">Complete seu perfil</span>
              <span className="text-xs font-mono text-yellow-400">+20 JC</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/80">Primeiro comentário</span>
              <span className="text-xs font-mono text-yellow-400">+15 JC</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/80">Primeira compra</span>
              <span className="text-xs font-mono text-yellow-400">+30 JC</span>
            </div>
          </div>
        </div>
      </div>
    </GlassCard>
  );
};

export default RewardsSection;
