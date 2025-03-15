
import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import { Download, FileText, Camera, Mail, MessageSquare } from 'lucide-react';

const PressKitPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-purple-900 pt-24 text-white">
      <div className="container mx-auto px-4 pb-20">
        {/* Hero Section with Welcome Message */}
        <div className="mb-16 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
            JESTFLY Press Kit
          </h1>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Agradecemos o seu interesse no JESTFLY. Este kit de imprensa contém todos os recursos necessários para a cobertura da nossa marca. O download é completamente livre.
          </p>
        </div>

        {/* Press Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <div className="bg-black/40 backdrop-blur-lg rounded-xl p-6 border border-white/10 hover:border-purple-500 transition-all">
            <div className="w-14 h-14 bg-purple-900/60 rounded-full flex items-center justify-center mb-4">
              <FileText className="w-7 h-7 text-purple-300" />
            </div>
            <h3 className="text-xl font-bold mb-2">Press Releases</h3>
            <p className="text-white/70 mb-4">
              Comunicados de imprensa oficiais e anúncios sobre novos lançamentos, eventos e parcerias.
            </p>
            <Link to="#" className="text-purple-400 hover:text-purple-300 inline-flex items-center">
              <Download className="w-4 h-4 mr-2" />
              Download grátis
            </Link>
          </div>

          <div className="bg-black/40 backdrop-blur-lg rounded-xl p-6 border border-white/10 hover:border-purple-500 transition-all">
            <div className="w-14 h-14 bg-purple-900/60 rounded-full flex items-center justify-center mb-4">
              <Camera className="w-7 h-7 text-purple-300" />
            </div>
            <h3 className="text-xl font-bold mb-2">Brand Media</h3>
            <p className="text-white/70 mb-4">
              Logos, imagens de alta resolução e material visual oficial para uso em publicações.
            </p>
            <Link to="#" className="text-purple-400 hover:text-purple-300 inline-flex items-center">
              <Download className="w-4 h-4 mr-2" />
              Download grátis
            </Link>
          </div>

          <div className="bg-black/40 backdrop-blur-lg rounded-xl p-6 border border-white/10 hover:border-purple-500 transition-all">
            <div className="w-14 h-14 bg-purple-900/60 rounded-full flex items-center justify-center mb-4">
              <MessageSquare className="w-7 h-7 text-purple-300" />
            </div>
            <h3 className="text-xl font-bold mb-2">Artist Bio</h3>
            <p className="text-white/70 mb-4">
              Biografia oficial, histórico e informações sobre a trajetória e visão do JESTFLY.
            </p>
            <Link to="#" className="text-purple-400 hover:text-purple-300 inline-flex items-center">
              <Download className="w-4 h-4 mr-2" />
              Download grátis
            </Link>
          </div>
        </div>

        {/* Credential Request Form */}
        <div className="bg-black/40 backdrop-blur-lg rounded-xl p-8 border border-white/10 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-center">Solicite Credenciais de Imprensa</h2>
          <p className="text-white/70 mb-6 text-center">
            Por fins de controle do nosso conteúdo, solicitamos que preencha suas credenciais. Agradecemos antecipadamente.
          </p>
          
          <form className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-white/80 mb-1">Nome</label>
                <input 
                  type="text" 
                  id="name" 
                  className="w-full bg-black/60 border border-white/20 rounded-lg px-4 py-2 text-white focus:border-purple-500 focus:outline-none"
                  placeholder="Seu nome completo"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-white/80 mb-1">Email</label>
                <input 
                  type="email" 
                  id="email" 
                  className="w-full bg-black/60 border border-white/20 rounded-lg px-4 py-2 text-white focus:border-purple-500 focus:outline-none"
                  placeholder="seu@email.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="outlet" className="block text-sm font-medium text-white/80 mb-1">Veículo/Outlet</label>
              <input 
                type="text" 
                id="outlet" 
                className="w-full bg-black/60 border border-white/20 rounded-lg px-4 py-2 text-white focus:border-purple-500 focus:outline-none"
                placeholder="Nome do seu veículo/publicação"
              />
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium text-white/80 mb-1">Cargo</label>
              <select 
                id="role" 
                className="w-full bg-black/60 border border-white/20 rounded-lg px-4 py-2 text-white focus:border-purple-500 focus:outline-none"
              >
                <option value="">Selecione seu cargo</option>
                <option value="journalist">Jornalista</option>
                <option value="blogger">Blogger</option>
                <option value="editor">Editor</option>
                <option value="podcaster">Podcaster</option>
                <option value="other">Outro</option>
              </select>
            </div>

            <div className="pt-4">
              <button 
                type="submit" 
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
              >
                Solicitar Acesso
              </button>
            </div>
          </form>

          <div className="mt-6 flex items-center justify-center text-sm text-white/60">
            <Mail className="w-4 h-4 mr-2" />
            <span>Para outras solicitações: press@jestfly.com</span>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PressKitPage;
