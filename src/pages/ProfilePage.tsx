import React, { useState, useEffect } from 'react';
import Footer from '../components/Footer';
import { useAuth } from '../contexts/auth';
import { toast } from 'sonner';

// Mock data for demonstration
const mockUserData = {
  username: 'JESTFLYfan123',
  email: 'fan@example.com',
  joinDate: '2023-05-12',
  jestCoins: 750,
  nftCollection: [
    { id: 1, name: 'Future Beats #12', image: '/assets/imagem1.jpg' },
    { id: 2, name: 'Neon Dreams #7', image: '/assets/imagem1.jpg' },
    { id: 3, name: 'Sonic Wave #3', image: '/assets/imagem1.jpg' }
  ],
  upcomingEvents: [
    { id: 1, name: 'JESTFLY Summer Tour', date: '2023-07-15', location: 'Club Neon' }
  ],
  purchaseHistory: [
    { id: 1, date: '2023-06-01', item: 'JESTFLY T-Shirt', price: '$29.99' },
    { id: 2, date: '2023-05-20', item: 'Digital Album', price: '$12.99' }
  ]
};

const ProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'nfts' | 'settings'>('overview');
  const [profileData, setProfileData] = useState({
    displayName: mockUserData.username,
    bio: "Electronic music enthusiast and proud member of the JESTFLY community!",
    location: "New York, NY",
    website: "music.example.com",
    avatarUrl: "/assets/imagem1.jpg"
  });

  const { user, logout } = useAuth();

  useEffect(() => {
    if (!user) {
      toast.error('You are not logged in.');
      logout();
    }
  }, [user, logout]);

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Profile updated:', profileData);
    alert('Profile updated successfully!');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-black text-white pt-24">
      <div className="container mx-auto px-6 pb-20">
        <div className="flex flex-col md:flex-row items-start gap-8">
          {/* Profile Sidebar */}
          <div className="w-full md:w-1/4 bg-black/40 backdrop-blur-md border border-white/10 rounded-lg p-6 sticky top-24">
            <div className="flex flex-col items-center mb-6">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 mb-4 overflow-hidden">
                <img src={profileData.avatarUrl} alt="Profile" className="w-full h-full object-cover" />
              </div>
              <h2 className="text-2xl font-bold text-white">{profileData.displayName}</h2>
              <p className="text-white/70 text-sm mt-1">Member since {mockUserData.joinDate}</p>
            </div>
            
            <div className="mb-6 p-4 bg-gradient-to-r from-purple-900/40 to-blue-900/40 rounded-lg">
              <div className="flex justify-between mb-2">
                <span className="text-white/80">JestCoins</span>
                <span className="text-white font-bold">{mockUserData.jestCoins}</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2">
                <div className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full" 
                     style={{ width: `${(mockUserData.jestCoins / 1000) * 100}%` }}></div>
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
              <button className="w-full text-left px-4 py-3 rounded-lg text-red-400 hover:bg-red-900/20 transition-colors mt-4">
                Sign Out
              </button>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="flex-1">
            {activeTab === 'overview' && (
              <div className="space-y-8">
                <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-lg p-6">
                  <h2 className="text-2xl font-semibold text-white mb-4">Profile Overview</h2>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-white/80 font-medium">Bio</h3>
                      <p className="text-white mt-1">{profileData.bio}</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-white/80 font-medium">Location</h3>
                        <p className="text-white mt-1">{profileData.location}</p>
                      </div>
                      <div>
                        <h3 className="text-white/80 font-medium">Website</h3>
                        <p className="text-white mt-1">{profileData.website}</p>
                      </div>
                      <div>
                        <h3 className="text-white/80 font-medium">NFTs Owned</h3>
                        <p className="text-white mt-1">{mockUserData.nftCollection.length}</p>
                      </div>
                      <div>
                        <h3 className="text-white/80 font-medium">Email</h3>
                        <p className="text-white mt-1">{mockUserData.email}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-lg p-6">
                  <h2 className="text-2xl font-semibold text-white mb-4">Your NFT Collection</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {mockUserData.nftCollection.map(nft => (
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
                  {mockUserData.upcomingEvents.length > 0 ? (
                    <div className="space-y-4">
                      {mockUserData.upcomingEvents.map(event => (
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
                  {mockUserData.purchaseHistory.length > 0 ? (
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
                          {mockUserData.purchaseHistory.map(purchase => (
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
                    {mockUserData.nftCollection.map(nft => (
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
                        <img src={profileData.avatarUrl} alt="Profile" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-white mb-3">Profile Picture</h3>
                        <div className="flex gap-3">
                          <button type="button" className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors">
                            Upload Image
                          </button>
                          <button type="button" className="bg-red-900/20 hover:bg-red-900/30 text-red-400 px-4 py-2 rounded-lg transition-colors">
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-white/80 mb-2">Display Name</label>
                      <input
                        type="text"
                        name="displayName"
                        value={profileData.displayName}
                        onChange={handleInputChange}
                        className="w-full bg-white/5 border border-white/20 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-white/80 mb-2">Bio</label>
                      <textarea
                        name="bio"
                        value={profileData.bio}
                        onChange={handleInputChange}
                        className="w-full bg-white/5 border border-white/20 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500"
                        rows={4}
                      ></textarea>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-white/80 mb-2">Location</label>
                        <input
                          type="text"
                          name="location"
                          value={profileData.location}
                          onChange={handleInputChange}
                          className="w-full bg-white/5 border border-white/20 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500"
                        />
                      </div>
                      <div>
                        <label className="block text-white/80 mb-2">Website</label>
                        <input
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
                          <input
                            type="email"
                            value={mockUserData.email}
                            disabled
                            className="w-full bg-white/5 border border-white/20 rounded-lg p-3 text-white/50"
                          />
                          <p className="text-white/60 text-xs mt-1">Contact support to change your email</p>
                        </div>
                        <div>
                          <label className="block text-white/80 mb-2">Password</label>
                          <button type="button" className="bg-white/10 hover:bg-white/20 text-white px-4 py-3 rounded-lg transition-colors">
                            Change Password
                          </button>
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
                      <button
                        type="button"
                        className="bg-red-900/20 hover:bg-red-900/30 text-red-400 px-6 py-3 rounded-lg transition-colors"
                      >
                        Delete Account
                      </button>
                      <button
                        type="submit"
                        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
                      >
                        Save Changes
                      </button>
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
