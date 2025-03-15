
import React, { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Diamond, ExternalLink } from 'lucide-react';
import CrystalComponent from '../CrystalComponent';
import { defaultModelParams } from '../types/model';
import NFTModel from './NFTModel';

interface NFTItem {
  id: string;
  name: string;
  price: string;
  image: string;
  video?: string;
  available: boolean;
}

const NFTSection: React.FC = () => {
  // Exemplo de dados NFT
  const nfts: NFTItem[] = [
    {
      id: '001',
      name: 'CRYSTAL BEAST',
      price: '0.85 ETH',
      image: '/assets/imagem1.jpg',
      available: true
    },
    {
      id: '002',
      name: 'SONIC FRAGMENT',
      price: '1.2 ETH',
      image: '/assets/imagem1.jpg',
      video: '/assets/video-background.mp4',
      available: true
    },
    {
      id: '003',
      name: 'DIGITAL RELIC',
      price: '2.5 ETH',
      image: '/assets/imagem1.jpg',
      available: false
    }
  ];

  const [hoveredNft, setHoveredNft] = useState<string | null>(null);

  const nftCrystalParams = {
    ...defaultModelParams,
    color: "#a78bfa",
    emissiveIntensity: 0.15,
    emissiveColor: "#d8b4fe",
    transmission: 0.92,
    thickness: 0.8,
    opacity: 0.9
  };

  return (
    <section className="w-full bg-black py-20 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-purple-900/20 blur-[120px]"></div>
      <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-blue-900/20 blur-[120px]"></div>
      
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl md:text-5xl font-bold mb-3 tracking-tighter">
              <span className="text-gradient-primary">NFT</span> COLLECTION
            </h2>
            <p className="text-white/70 max-w-md">
              Exclusive digital collectibles with unique ownership verification on the blockchain.
            </p>
          </div>
          
          <div className="mt-6 md:mt-0">
            <button className="group flex items-center space-x-2 px-5 py-2.5 rounded-full border border-white/30 text-white bg-black/40 hover:bg-black/60 transition-colors">
              <span className="text-sm font-medium uppercase">Explore All</span>
              <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center group-hover:scale-110 transition-transform">
                <ExternalLink className="h-3 w-3 text-black" />
              </div>
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {nfts.map((nft) => (
            <Card 
              key={nft.id} 
              className="neo-blur overflow-hidden rounded-lg border-white/10 group hover:border-white/20 transition-all"
              onMouseEnter={() => setHoveredNft(nft.id)}
              onMouseLeave={() => setHoveredNft(null)}
            >
              <CardContent className="p-0 relative">
                <div className="relative h-64 w-full overflow-hidden">
                  {/* Background media (image or video) */}
                  <div className="absolute inset-0 w-full h-full">
                    {nft.video && (
                      <video 
                        src={nft.video} 
                        autoPlay 
                        muted 
                        loop 
                        className="w-full h-full object-cover"
                      />
                    )}
                    {!nft.video && (
                      <img 
                        src={nft.image} 
                        alt={nft.name} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    )}
                  </div>
                  
                  {/* 3D Model overlay */}
                  {hoveredNft === nft.id && (
                    <div className="absolute inset-0 w-full h-full flex items-center justify-center z-10">
                      <NFTModel modelType={nft.id} />
                    </div>
                  )}
                  
                  {/* Crystal overlay */}
                  <div className="absolute top-4 right-4 w-20 h-20 opacity-80 pointer-events-none z-20">
                    <CrystalComponent parameters={nftCrystalParams} />
                  </div>
                  
                  {/* Availability badge */}
                  <div className={`absolute bottom-4 left-4 px-3 py-1 rounded-full text-xs font-medium uppercase z-20 ${
                    nft.available ? 'bg-green-500/80' : 'bg-red-500/80'
                  }`}>
                    {nft.available ? 'Available' : 'Sold'}
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-xl font-bold">{nft.name}</h3>
                    <Diamond className="h-5 w-5 text-purple-400" />
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="text-white/70 text-sm">ID: {nft.id}</div>
                    <div className="text-lg font-semibold text-gradient-primary">{nft.price}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NFTSection;
