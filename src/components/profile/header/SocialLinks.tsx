
import React from 'react';
import { Link as LinkIcon, Instagram, Twitter, Music } from 'lucide-react';
import { UserProfile } from '../../../models/Post';

interface SocialLinksProps {
  profile: UserProfile;
}

const SocialLinks: React.FC<SocialLinksProps> = ({ profile }) => {
  if (!profile.social_links && !profile.website) {
    return null;
  }

  return (
    <div className="mt-4 flex flex-wrap gap-3">
      {profile.website && (
        <a 
          href={profile.website} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center text-gray-300 hover:text-white"
        >
          <LinkIcon size={16} className="mr-1" />
          Website
        </a>
      )}
      
      {profile.social_links?.instagram && (
        <a 
          href={`https://instagram.com/${profile.social_links.instagram}`} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center text-gray-300 hover:text-white"
        >
          <Instagram size={16} className="mr-1" />
          Instagram
        </a>
      )}
      
      {profile.social_links?.twitter && (
        <a 
          href={`https://twitter.com/${profile.social_links.twitter}`} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center text-gray-300 hover:text-white"
        >
          <Twitter size={16} className="mr-1" />
          Twitter
        </a>
      )}
      
      {profile.social_links?.soundcloud && (
        <a 
          href={`https://soundcloud.com/${profile.social_links.soundcloud}`} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center text-gray-300 hover:text-white"
        >
          <Music size={16} className="mr-1" />
          SoundCloud
        </a>
      )}
      
      {profile.social_links?.spotify && (
        <a 
          href={`https://open.spotify.com/artist/${profile.social_links.spotify}`} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center text-gray-300 hover:text-white"
        >
          <Music size={16} className="mr-1" />
          Spotify
        </a>
      )}
    </div>
  );
};

export default SocialLinks;
