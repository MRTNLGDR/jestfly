
import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Footer from '../components/Footer';

// Store sub-pages
const NFTsPage = () => (
  <div className="min-h-screen bg-gradient-to-b from-black to-purple-900 pt-24 px-6">
    <h1 className="text-4xl md:text-6xl font-bold text-white mb-8">NFT Collection</h1>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((item) => (
        <div key={item} className="bg-black/40 backdrop-blur-md border border-white/10 rounded-lg overflow-hidden hover:border-purple-500 transition-all">
          <div className="aspect-square bg-gradient-to-br from-purple-800 to-blue-900 flex items-center justify-center">
            <span className="text-6xl">🎵</span>
          </div>
          <div className="p-4">
            <h3 className="text-xl font-semibold text-white">JESTFLY NFT #{item}</h3>
            <p className="text-white/70 mt-2">Limited edition digital collectible</p>
            <div className="mt-4 flex justify-between items-center">
              <span className="text-white font-mono">0.05 ETH</span>
              <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-full transition-colors">
                Buy Now
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const MusicPage = () => (
  <div className="min-h-screen bg-gradient-to-b from-black to-blue-900 pt-24 px-6">
    <h1 className="text-4xl md:text-6xl font-bold text-white mb-8">Music</h1>
    <div className="space-y-6">
      {[1, 2, 3, 4, 5].map((item) => (
        <div key={item} className="bg-black/40 backdrop-blur-md border border-white/10 rounded-lg overflow-hidden hover:border-blue-500 transition-all p-4">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="w-full md:w-32 h-32 bg-gradient-to-br from-blue-800 to-purple-900 flex items-center justify-center rounded-md">
              <span className="text-4xl">🎧</span>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-white">Track Name #{item}</h3>
              <p className="text-white/70 mt-1">JESTFLY</p>
              <div className="mt-2 w-full bg-white/10 rounded-full h-1">
                <div className="bg-blue-500 h-1 rounded-full" style={{ width: '0%' }}></div>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="bg-blue-600 hover:bg-blue-700 text-white w-10 h-10 rounded-full flex items-center justify-center transition-colors">
                ▶
              </button>
              <button className="bg-transparent hover:bg-white/10 text-white w-10 h-10 rounded-full flex items-center justify-center transition-colors border border-white/30">
                ♡
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const MerchPage = () => (
  <div className="min-h-screen bg-gradient-to-b from-black to-red-900 pt-24 px-6">
    <h1 className="text-4xl md:text-6xl font-bold text-white mb-8">Merchandise</h1>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((item) => (
        <div key={item} className="bg-black/40 backdrop-blur-md border border-white/10 rounded-lg overflow-hidden hover:border-red-500 transition-all">
          <div className="aspect-square bg-gradient-to-br from-red-800 to-orange-900 flex items-center justify-center">
            <span className="text-6xl">👕</span>
          </div>
          <div className="p-4">
            <h3 className="text-xl font-semibold text-white">JESTFLY T-Shirt #{item}</h3>
            <p className="text-white/70 mt-2">Premium quality merchandise</p>
            <div className="mt-4 flex justify-between items-center">
              <span className="text-white font-mono">$29.99</span>
              <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full transition-colors">
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const CollectiblesPage = () => (
  <div className="min-h-screen bg-gradient-to-b from-black to-green-900 pt-24 px-6">
    <h1 className="text-4xl md:text-6xl font-bold text-white mb-8">Collectibles</h1>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((item) => (
        <div key={item} className="bg-black/40 backdrop-blur-md border border-white/10 rounded-lg overflow-hidden hover:border-green-500 transition-all">
          <div className="aspect-square bg-gradient-to-br from-green-800 to-teal-900 flex items-center justify-center">
            <span className="text-6xl">🎁</span>
          </div>
          <div className="p-4">
            <h3 className="text-xl font-semibold text-white">JESTFLY Collectible #{item}</h3>
            <p className="text-white/70 mt-2">Limited edition physical item</p>
            <div className="mt-4 flex justify-between items-center">
              <span className="text-white font-mono">$49.99</span>
              <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full transition-colors">
                Purchase
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const StorePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white pt-20">
      {/* Store Nav */}
      <div className="bg-black/80 backdrop-blur-md border-b border-white/10 sticky top-20 z-10">
        <div className="container mx-auto flex overflow-x-auto whitespace-nowrap py-4 px-6">
          <Link to="/store" className="text-white/80 hover:text-white px-4 py-2 mr-4 transition-colors">
            All Products
          </Link>
          <Link to="/store/nfts" className="text-white/80 hover:text-white px-4 py-2 mr-4 transition-colors">
            NFTs
          </Link>
          <Link to="/store/music" className="text-white/80 hover:text-white px-4 py-2 mr-4 transition-colors">
            Music
          </Link>
          <Link to="/store/merch" className="text-white/80 hover:text-white px-4 py-2 mr-4 transition-colors">
            Merch
          </Link>
          <Link to="/store/collectibles" className="text-white/80 hover:text-white px-4 py-2 transition-colors">
            Collectibles
          </Link>
        </div>
      </div>
      
      <div className="container mx-auto pb-20">
        <Routes>
          <Route path="/" element={
            <div className="pt-24 px-6">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-8">JESTFLY Store</h1>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Link to="/store/nfts" className="block group">
                  <div className="aspect-video bg-gradient-to-br from-purple-900 to-blue-900 rounded-lg flex items-center justify-center relative overflow-hidden border border-white/10 group-hover:border-purple-500 transition-all">
                    <h2 className="text-4xl font-bold text-white">NFTs</h2>
                    <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="bg-white/20 px-4 py-2 rounded-full text-white backdrop-blur-md">
                        Explore →
                      </span>
                    </div>
                  </div>
                </Link>
                <Link to="/store/music" className="block group">
                  <div className="aspect-video bg-gradient-to-br from-blue-900 to-cyan-900 rounded-lg flex items-center justify-center relative overflow-hidden border border-white/10 group-hover:border-blue-500 transition-all">
                    <h2 className="text-4xl font-bold text-white">Music</h2>
                    <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="bg-white/20 px-4 py-2 rounded-full text-white backdrop-blur-md">
                        Listen →
                      </span>
                    </div>
                  </div>
                </Link>
                <Link to="/store/merch" className="block group">
                  <div className="aspect-video bg-gradient-to-br from-red-900 to-orange-900 rounded-lg flex items-center justify-center relative overflow-hidden border border-white/10 group-hover:border-red-500 transition-all">
                    <h2 className="text-4xl font-bold text-white">Merch</h2>
                    <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="bg-white/20 px-4 py-2 rounded-full text-white backdrop-blur-md">
                        Shop →
                      </span>
                    </div>
                  </div>
                </Link>
                <Link to="/store/collectibles" className="block group">
                  <div className="aspect-video bg-gradient-to-br from-green-900 to-emerald-900 rounded-lg flex items-center justify-center relative overflow-hidden border border-white/10 group-hover:border-green-500 transition-all">
                    <h2 className="text-4xl font-bold text-white">Collectibles</h2>
                    <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="bg-white/20 px-4 py-2 rounded-full text-white backdrop-blur-md">
                        Collect →
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          } />
          <Route path="/nfts" element={<NFTsPage />} />
          <Route path="/music" element={<MusicPage />} />
          <Route path="/merch" element={<MerchPage />} />
          <Route path="/collectibles" element={<CollectiblesPage />} />
        </Routes>
      </div>
      
      <Footer />
    </div>
  );
};

export default StorePage;
