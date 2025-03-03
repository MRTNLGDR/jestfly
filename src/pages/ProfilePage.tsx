import React, { useState, useEffect } from 'react';
import Footer from '../components/Footer';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Separator } from '../components/ui/separator';
import { supabase } from '@/integrations/supabase/client';

const ProfilePage: React.FC = () => {
  const { profile, updateProfile, signOut, refreshProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'nfts' | 'settings'>('overview');
  const [isUpdating, setIsUpdating] = useState(false);
  const [profileData, setProfileData] = useState({
    display_name: '',
    username: '',
    bio: '',
    location: '',
    website: '',
    avatar: '',
  });

  const [nftCollection, setNftCollection] = useState([
    { id: 1, name: 'Future Beats #12', image: '/assets/imagem1.jpg' },
    { id: 2, name: 'Neon Dreams #7', image: '/assets/imagem1.jpg' },
    { id: 3, name: 'Sonic Wave #3', image: '/assets/imagem1.jpg' }
  ]);

  const [upcomingEvents, setUpcomingEvents] = useState([
    { id: 1, name: 'JESTFLY Summer Tour', date: '2023-07-15', location: 'Club Neon' }
  ]);

  const [purchaseHistory, setPurchaseHistory] = useState([
    { id: 1, date: '2023-06-01', item: 'JESTFLY T-Shirt', price: '$29.99' },
    { id: 2, date: '2023-05-20', item: 'Digital Album', price: '$12.99' }
  ]);

  useEffect(() => {
    if (profile) {
      setProfileData({
        display_name: profile.display_name || '',
        username: profile.username || '',
        bio: profile.bio || '',
        location: profile.preferences?.location || '',
        website: profile.preferences?.website || '',
        avatar: profile.avatar || '',
      });
    }
  }, [profile]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    setIsUpdating(true);

    try {
      const updates: any = {};
      if (profileData.display_name !== profile.display_name) {
        updates.display_name = profileData.display_name;
      }
      if (profileData.username !== profile.username) {
        updates.username = profileData.username;
      }
      if (profileData.bio !== profile.bio) {
        updates.bio = profileData.bio;
      }

      const currentPreferences = profile.preferences || {};
      const updatedPreferences = {
        ...currentPreferences,
        location: profileData.location,
        website: profileData.website,
      };

      if (JSON.stringify(updatedPreferences) !== JSON.stringify(currentPreferences)) {
        updates.preferences = updatedPreferences;
      }

      if (Object.keys(updates).length > 0) {
        const { error } = await updateProfile(updates);
        if (error) {
          toast.error('Erro ao atualizar perfil');
        } else {
          toast.success('Perfil atualizado com sucesso!');
        }
      } else {
        toast.info('Nenhuma alteração detectada');
      }
    } catch (error) {
      toast.error('Erro ao atualizar perfil');
      console.error('Error updating profile:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0 || !profile) {
      return;
    }

    const file = e.target.files[0];
    const fileExt = file.name.split('.').pop();
    const filePath = `avatars/${profile.id}.${fileExt}`;

    try {
      const { error: uploadError } = await supabase.storage
        .from('profiles')
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from('profiles')
        .getPublicUrl(filePath);

      if (data?.publicUrl) {
        const { error: updateError } = await updateProfile({
          avatar: data.publicUrl,
        });

        if (updateError) {
          throw updateError;
        }

        setProfileData(prev => ({ ...prev, avatar: data.publicUrl }));
        toast.success('Avatar atualizado com sucesso!');
      }
    } catch (error) {
      toast.error('Erro ao atualizar avatar');
      console.error('Error uploading avatar:', error);
    }
  };

  if (!profile) {
    return (
      <div className="min-h-screen bg-black text-white pt-24 flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl mb-4">Você precisa estar logado para acessar esta página</p>
          <Button asChild className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
            <a href="/auth">Fazer Login</a>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pt-24">
      <div className="container mx-auto px-6 pb-20">
        <div className="flex flex-col md:flex-row items-start gap-8">
          <div className="w-full md:w-1/4 bg-black/40 backdrop-blur-md border border-white/10 rounded-lg p-6 sticky top-24">
            <div className="flex flex-col items-center mb-6">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 mb-4 overflow-hidden">
                {profileData.avatar ? (
                  <img src={profileData.avatar} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white text-4xl font-bold">
                    {profile.display_name.substring(0, 2).toUpperCase()}
                  </div>
                )}
              </div>
              <h2 className="text-2xl font-bold text-white">{profile.display_name}</h2>
              <p className="text-white/70 text-sm mt-1">Membro desde {new Date(profile.created_at).toLocaleDateString()}</p>
            </div>
            
            <div className="mb-6 p-4 bg-gradient-to-r from-purple-900/40 to-blue-900/40 rounded-lg">
              <div className="flex justify-between mb-2">
                <span className="text-white/80">JestCoins</span>
                <span className="text-white font-bold">750</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2">
                <div className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full" 
                     style={{ width: `${(750 / 1000) * 100}%` }}></div>
              </div>
              <div className="flex justify-between text-xs text-white/60 mt-1">
                <span>Level 3</span>
                <span>Level 4 (1000 JC)</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <button 
                onClick={() => setActiveTab('overview')}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                  activeTab === 'overview' 
                    ? 'bg-white/10 text-white' 
                    : 'text-white/70 hover:bg-white/5'
                }`}
              >
                Overview
              </button>
              <button 
                onClick={() => setActiveTab('nfts')}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                  activeTab === 'nfts' 
                    ? 'bg-white/10 text-white' 
                    : 'text-white/70 hover:bg-white/5'
                }`}
              >
                NFT Collection
              </button>
              <button 
                onClick={() => setActiveTab('settings')}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                  activeTab === 'settings' 
                    ? 'bg-white/10 text-white' 
                    : 'text-white/70 hover:bg-white/5'
                }`}
              >
                Profile Settings
              </button>
              <button className="w-full text-left px-4 py-3 rounded-lg text-white/70 hover:bg-white/5 transition-colors">
                Purchase History
              </button>
              <button className="w-full text-left px-4 py-3 rounded-lg text-white/70 hover:bg-white/5 transition-colors">
                Saved Events
              </button>
              <button 
                onClick={() => signOut()}
                className="w-full text-left px-4 py-3 rounded-lg text-red-400 hover:bg-red-900/20 transition-colors mt-4"
              >
                Sign Out
              </button>
            </div>
          </div>
          
          <div className="flex-1">
            {activeTab === 'overview' && (
              <div className="space-y-8">
                <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-lg p-6">
                  <h2 className="text-2xl font-semibold text-white mb-4">Profile Overview</h2>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-white/80 font-medium">Bio</h3>
                      <p className="text-white mt-1">{profile.bio || "Nenhuma biografia adicionada"}</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-white/80 font-medium">Location</h3>
                        <p className="text-white mt-1">{profileData.location || "Não especificado"}</p>
                      </div>
                      <div>
                        <h3 className="text-white/80 font-medium">Website</h3>
                        <p className="text-white mt-1">{profileData.website || "Não especificado"}</p>
                      </div>
                      <div>
                        <h3 className="text-white/80 font-medium">NFTs Owned</h3>
                        <p className="text-white mt-1">{nftCollection.length}</p>
                      </div>
                      <div>
                        <h3 className="text-white/80 font-medium">Email</h3>
                        <p className="text-white mt-1">{profile.email}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-lg p-6">
                  <h2 className="text-2xl font-semibold text-white mb-4">Your NFT Collection</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {nftCollection.map(nft => (
                      <div key={nft.id} className="bg-white/5 rounded-lg overflow-hidden">
                        <div className="aspect-square bg-gradient-to-br from-purple-900 to-blue-900">
                          <img src={nft.image} alt={nft.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="p-3">
                          <h3 className="text-white font-medium">{nft.name}</h3>
                          <div className="flex justify-between items-center mt-2">
                            <span className="text-xs text-white/60">ID: {nft.id}</span>
                            <button className="text-xs text-purple-400">View Details</button>
                          </div>
                        </div>
                      </div>
                    ))}
                    <div className="bg-white/5 rounded-lg overflow-hidden border border-dashed border-white/30 flex flex-col items-center justify-center p-6 aspect-square">
                      <span className="text-3xl mb-2">➕</span>
                      <p className="text-white/70 text-center">Discover more NFTs in the store</p>
                      <button className="mt-4 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors">
                        Browse Store
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-lg p-6">
                  <h2 className="text-2xl font-semibold text-white mb-4">Upcoming Events</h2>
                  {upcomingEvents.length > 0 ? (
                    <div className="space-y-4">
                      {upcomingEvents.map(event => (
                        <div key={event.id} className="bg-white/5 p-4 rounded-lg flex flex-col md:flex-row md:items-center gap-4">
                          <div className="w-full md:w-1/4 aspect-video bg-gradient-to-br from-purple-800 to-blue-900 rounded-lg flex items-center justify-center">
                            <span className="text-3xl">🎉</span>
                          </div>
                          <div className="flex-1">
                            <h3 className="text-xl font-medium text-white">{event.name}</h3>
                            <div className="flex flex-wrap gap-2 mt-2">
                              <span className="text-sm bg-white/10 px-2 py-1 rounded-full text-white/80">{event.date}</span>
                              <span className="text-sm bg-white/10 px-2 py-1 rounded-full text-white/80">{event.location}</span>
                            </div>
                          </div>
                          <div>
                            <button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
                              View Details
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-white/5 p-6 rounded-lg text-center">
                      <p className="text-white/70">You don't have any upcoming events.</p>
                      <button className="mt-4 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors">
                        Browse Events
                      </button>
                    </div>
                  )}
                </div>
                
                <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-lg p-6">
                  <h2 className="text-2xl font-semibold text-white mb-4">Recent Purchases</h2>
                  {purchaseHistory.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="text-left text-white/70 border-b border-white/10">
                          <tr>
                            <th className="pb-3">Date</th>
                            <th className="pb-3">Item</th>
                            <th className="pb-3">Price</th>
                            <th className="pb-3"></th>
                          </tr>
                        </thead>
                        <tbody>
                          {purchaseHistory.map(purchase => (
                            <tr key={purchase.id} className="border-b border-white/5">
                              <td className="py-3">{purchase.date}</td>
                              <td className="py-3">{purchase.item}</td>
                              <td className="py-3">{purchase.price}</td>
                              <td className="py-3 text-right">
                                <button className="text-purple-400 hover:text-purple-300 transition-colors">
                                  Details
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="bg-white/5 p-6 rounded-lg text-center">
                      <p className="text-white/70">You haven't made any purchases yet.</p>
                      <button className="mt-4 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors">
                        Visit Store
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {activeTab === 'nfts' && (
              <div className="space-y-6">
                <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-lg p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold text-white">Your NFT Collection</h2>
                    <div className="flex gap-2">
                      <button className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors">
                        Browse Store
                      </button>
                      <button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
                        Connect Wallet
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {nftCollection.map(nft => (
                      <div key={nft.id} className="bg-white/5 rounded-lg overflow-hidden hover:bg-white/10 transition-colors cursor-pointer">
                        <div className="aspect-square bg-gradient-to-br from-purple-900 to-blue-900">
                          <img src={nft.image} alt={nft.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="p-4">
                          <h3 className="text-xl font-medium text-white">{nft.name}</h3>
                          <div className="flex justify-between items-center mt-3">
                            <div>
                              <p className="text-xs text-white/60">Acquired on</p>
                              <p className="text-white/90">Jun 15, 2023</p>
                            </div>
                            <div className="bg-purple-900/40 text-purple-300 px-3 py-1 rounded-full text-xs">
                              Rare
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    {[1, 2, 3, 4, 5, 6].map(item => (
                      <div key={`placeholder-${item}`} className="bg-white/5 rounded-lg overflow-hidden opacity-30 hover:opacity-40 transition-opacity">
                        <div className="aspect-square bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                          <span className="text-6xl">?</span>
                        </div>
                        <div className="p-4">
                          <h3 className="text-xl font-medium text-white">Locked NFT #{item}</h3>
                          <div className="flex justify-between items-center mt-3">
                            <div>
                              <p className="text-xs text-white/60">Status</p>
                              <p className="text-white/90">Locked</p>
                            </div>
                            <button className="bg-white/20 text-white px-3 py-1 rounded-full text-xs">
                              Unlock
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-lg p-6">
                  <h2 className="text-2xl font-semibold text-white mb-4">NFT Achievements</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gradient-to-br from-purple-900/40 to-blue-900/40 rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-2xl">
                          🏆
                        </div>
                        <div>
                          <h3 className="text-white font-medium">Collector</h3>
                          <p className="text-white/70 text-sm">Collect 5 NFTs</p>
                        </div>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <div className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                      </div>
                      <div className="flex justify-between text-xs text-white/60 mt-1">
                        <span>3/5</span>
                        <span>In Progress</span>
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-green-900/40 to-teal-900/40 rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-teal-600 rounded-full flex items-center justify-center text-2xl">
                          ✅
                        </div>
                        <div>
                          <h3 className="text-white font-medium">First Purchase</h3>
                          <p className="text-white/70 text-sm">Buy your first NFT</p>
                        </div>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <div className="bg-gradient-to-r from-green-500 to-teal-500 h-2 rounded-full" style={{ width: '100%' }}></div>
                      </div>
                      <div className="flex justify-between text-xs text-white/60 mt-1">
                        <span>1/1</span>
                        <span>Completed</span>
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-red-900/40 to-orange-900/40 rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-orange-600 rounded-full flex items-center justify-center text-2xl">
                          🔥
                        </div>
                        <div>
                          <h3 className="text-white font-medium">Rare Find</h3>
                          <p className="text-white/70 text-sm">Collect a rare NFT</p>
                        </div>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <div className="bg-gradient-to-r from-red-500 to-orange-500 h-2 rounded-full" style={{ width: '100%' }}></div>
                      </div>
                      <div className="flex justify-between text-xs text-white/60 mt-1">
                        <span>1/1</span>
                        <span>Completed</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'settings' && (
              <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-lg p-6">
                <h2 className="text-2xl font-semibold text-white mb-6">Profile Settings</h2>
                <form onSubmit={handleProfileUpdate}>
                  <div className="space-y-6">
                    <div className="flex flex-col md:flex-row gap-6 items-start">
                      <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 overflow-hidden">
                        {profileData.avatar ? (
                          <img src={profileData.avatar} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-white text-4xl font-bold">
                            {profile.display_name.substring(0, 2).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-white mb-3">Profile Picture</h3>
                        <div className="flex gap-3">
                          <Button type="button" variant="outline" className="relative border-white/20" onClick={() => document.getElementById('avatar-upload')?.click()}>
                            Upload Image
                            <input
                              id="avatar-upload"
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={handleAvatarUpload}
                            />
                          </Button>
                          <Button 
                            type="button" 
                            variant="destructive"
                            onClick={async () => {
                              await updateProfile({ avatar: null });
                              setProfileData(prev => ({ ...prev, avatar: '' }));
                              toast.success('Avatar removido');
                            }}
                            disabled={!profileData.avatar}
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-white/80 mb-2">Display Name</label>
                      <Input
                        type="text"
                        name="display_name"
                        value={profileData.display_name}
                        onChange={handleInputChange}
                        className="w-full bg-white/5 border border-white/20 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-white/80 mb-2">Username</label>
                      <Input
                        type="text"
                        name="username"
                        value={profileData.username}
                        onChange={handleInputChange}
                        className="w-full bg-white/5 border border-white/20 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-white/80 mb-2">Bio</label>
                      <Textarea
                        name="bio"
                        value={profileData.bio}
                        onChange={handleInputChange}
                        className="w-full bg-white/5 border border-white/20 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500"
                        rows={4}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-white/80 mb-2">Location</label>
                        <Input
                          type="text"
                          name="location"
                          value={profileData.location}
                          onChange={handleInputChange}
                          className="w-full bg-white/5 border border-white/20 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500"
                        />
                      </div>
                      <div>
                        <label className="block text-white/80 mb-2">Website</label>
                        <Input
                          type="text"
                          name="website"
                          value={profileData.website}
                          onChange={handleInputChange}
                          className="w-full bg-white/5 border border-white/20 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500"
                        />
                      </div>
                    </div>
                    
                    <div className="border-t border-white/10 pt-6">
                      <h3 className="text-lg font-medium text-white mb-4">Account Settings</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-white/80 mb-2">Email Address</label>
                          <Input
                            type="email"
                            value={profile.email}
                            disabled
                            className="w-full bg-white/5 border border-white/20 rounded-lg p-3 text-white/50"
                          />
                          <p className="text-white/60 text-xs mt-1">Contact support to change your email</p>
                        </div>
                        <div>
                          <label className="block text-white/80 mb-2">Password</label>
                          <Button type="button" variant="outline" className="border-white/20">
                            Change Password
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border-t border-white/10 pt-6">
                      <h3 className="text-lg font-medium text-white mb-4">Notification Preferences</h3>
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <input type="checkbox" id="emailNotif" className="mr-3" defaultChecked />
                          <label htmlFor="emailNotif" className="text-white/80">Email notifications for events</label>
                        </div>
                        <div className="flex items-center">
                          <input type="checkbox" id="promoNotif" className="mr-3" defaultChecked />
                          <label htmlFor="promoNotif" className="text-white/80">Promotional emails and offers</label>
                        </div>
                        <div className="flex items-center">
                          <input type="checkbox" id="nftNotif" className="mr-3" defaultChecked />
                          <label htmlFor="nftNotif" className="text-white/80">New NFT drop notifications</label>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between border-t border-white/10 pt-6">
                      <Button
                        type="button"
                        variant="destructive"
                        onClick={() => {
                          if (confirm("Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.")) {
                            toast.error('Funcionalidade ainda não implementada');
                          }
                        }}
                      >
                        Delete Account
                      </Button>
                      <Button
                        type="submit"
                        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                        disabled={isUpdating}
                      >
                        {isUpdating ? 'Salvando...' : 'Save Changes'}
                      </Button>
                    </div>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ProfilePage;
