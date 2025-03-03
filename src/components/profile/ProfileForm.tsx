
import React from 'react';
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";

interface ProfileFormProps {
  formData: {
    displayName: string;
    username: string;
    bio: string;
  };
  loading: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

const ProfileForm: React.FC<ProfileFormProps> = ({
  formData,
  loading,
  onInputChange,
  onSubmit,
  onCancel
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-zinc-300">Display Name</label>
        <Input
          name="displayName"
          value={formData.displayName}
          onChange={onInputChange}
          className="bg-zinc-900/60 border-zinc-800 text-white"
        />
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium text-zinc-300">Username</label>
        <Input
          name="username"
          value={formData.username}
          onChange={onInputChange}
          className="bg-zinc-900/60 border-zinc-800 text-white"
        />
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium text-zinc-300">Bio</label>
        <Textarea
          name="bio"
          value={formData.bio}
          onChange={onInputChange}
          className="bg-zinc-900/60 border-zinc-800 text-white min-h-[100px] resize-none"
        />
      </div>
      
      <div className="flex justify-end space-x-2 pt-4">
        <Button 
          type="button" 
          onClick={onCancel}
          variant="outline"
          className="bg-zinc-900/70 text-white border-zinc-700"
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={loading}
          className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600"
        >
          {loading ? 'Saving...' : 'Save changes'}
        </Button>
      </div>
    </form>
  );
};

export default ProfileForm;
