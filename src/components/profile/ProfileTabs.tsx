
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { UserProfile } from '../../models/Post';
import ProfilePosts from './ProfilePosts';

interface ProfileTabsProps {
  userId: string;
  profile: UserProfile;
}

const ProfileTabs: React.FC<ProfileTabsProps> = ({ userId, profile }) => {
  const [activeTab, setActiveTab] = useState('posts');

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 mt-6">
      <Tabs defaultValue="posts" value={activeTab} onValueChange={setActiveTab}>
        <div className="neo-blur rounded-lg border border-white/10 p-1">
          <TabsList className="w-full bg-transparent">
            <TabsTrigger 
              value="posts" 
              className="flex-1 data-[state=active]:bg-purple-900/40 data-[state=active]:text-white"
            >
              Posts
            </TabsTrigger>
            <TabsTrigger 
              value="about" 
              className="flex-1 data-[state=active]:bg-purple-900/40 data-[state=active]:text-white"
            >
              Sobre
            </TabsTrigger>
            <TabsTrigger 
              value="jestcoin" 
              className="flex-1 data-[state=active]:bg-purple-900/40 data-[state=active]:text-white"
            >
              JestCoin
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="posts" className="mt-4">
          <ProfilePosts userId={userId} />
        </TabsContent>

        <TabsContent value="about" className="mt-4">
          <div className="neo-blur rounded-xl border border-white/10 p-6">
            <h2 className="text-xl font-bold text-white mb-4">Sobre {profile.display_name}</h2>
            
            {profile.bio ? (
              <p className="text-white/80">{profile.bio}</p>
            ) : (
              <p className="text-white/60 italic">Nenhuma informação adicional disponível.</p>
            )}
            
            <div className="mt-6 border-t border-white/10 pt-6">
              <h3 className="text-lg font-semibold text-white mb-3">Detalhes</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-white/60 text-sm">Membro desde</p>
                  <p className="text-white">{new Date(profile.created_at).toLocaleDateString()}</p>
                </div>
                
                <div>
                  <p className="text-white/60 text-sm">Tipo de perfil</p>
                  <p className="text-white capitalize">{profile.profile_type}</p>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="jestcoin" className="mt-4">
          <div className="neo-blur rounded-xl border border-white/10 p-6">
            <h2 className="text-xl font-bold text-white mb-4">JestCoin</h2>
            
            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 rounded-full bg-gradient-to-r from-yellow-500 to-amber-600 flex items-center justify-center">
                <span className="text-2xl font-bold text-white">JC</span>
              </div>
              
              <div>
                <p className="text-white/60 text-sm">Saldo</p>
                <p className="text-white text-2xl font-bold">
                  {profile.jest_coins || 0} <span className="text-amber-400">JC</span>
                </p>
              </div>
            </div>
            
            <div className="mt-6 border-t border-white/10 pt-6">
              <h3 className="text-lg font-semibold text-white mb-3">Transações recentes</h3>
              
              <div className="text-center py-8">
                <p className="text-white/60 italic">Histórico de transações em breve...</p>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfileTabs;
