
import React, { useState } from 'react';
import { UserProfile, SkinType, SkinGoal, SkinConcern } from '../types';
import { Button, Input, Card, Badge } from '../components/UI';
import { SKIN_TYPES, SKIN_CONCERNS, SKIN_GOALS, GENDERS } from '../constants';
import { db } from '../services/storageService';

interface ProfileViewProps {
  user: UserProfile;
  onLogout: () => void;
  onUpdate: (user: UserProfile) => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({ user, onLogout, onUpdate }) => {
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<UserProfile>(user);

  const handleSave = () => {
    db.saveUser(formData);
    onUpdate(formData);
    setEditing(false);
  };

  const toggleConcern = (concern: SkinConcern) => {
    setFormData(prev => ({
      ...prev,
      concerns: prev.concerns.includes(concern) 
        ? prev.concerns.filter(c => c !== concern) 
        : [...prev.concerns, concern]
    }));
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      <header className="flex items-center justify-between">
        <h1 className="text-3xl font-serif text-white">Your Studio</h1>
        <Button variant="outline" className="!py-2 !px-4 !text-xs" onClick={() => editing ? handleSave() : setEditing(true)}>
          {editing ? 'Save Profile' : 'Edit Details'}
        </Button>
      </header>

      <div className="flex flex-col items-center">
        <div className="relative">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-[#c5a059] p-1 shadow-2xl">
            <img src={formData.photoUrl || `https://picsum.photos/seed/${user.id}/200/200`} className="w-full h-full object-cover rounded-full" alt="Profile" />
          </div>
          {editing && (
            <button className="absolute bottom-0 right-0 bg-[#c5a059] text-black w-8 h-8 rounded-full flex items-center justify-center border-2 border-[#0f1115]">
              ✏️
            </button>
          )}
        </div>
        <h2 className="mt-4 text-2xl font-serif">{user.name}</h2>
        <p className="text-gray-500 text-sm tracking-widest uppercase">{user.email}</p>
      </div>

      <div className="space-y-6">
        <Card className="space-y-6">
          <h3 className="text-xs font-semibold text-[#c5a059] uppercase tracking-widest border-b border-white/5 pb-2">Account Statistics</h3>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-2xl font-serif text-white">{db.getUserProducts(user.id).length}</p>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest">Products</p>
            </div>
            <div>
              <p className="text-2xl font-serif text-white">{db.getUserPhotos(user.id).length}</p>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest">Memories</p>
            </div>
          </div>
        </Card>

        <section className="space-y-4">
          <h3 className="text-xs font-semibold text-[#c5a059] uppercase tracking-widest px-2">Core Profile</h3>
          <div className="space-y-4">
            {editing ? (
              <>
                <Input label="Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                <Input label="Age" type="number" value={formData.age || 0} onChange={(e) => setFormData({...formData, age: parseInt(e.target.value)})} />
                
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-[#c5a059] uppercase tracking-wider">Skin Type</label>
                  <div className="grid grid-cols-2 gap-2">
                    {SKIN_TYPES.map(t => (
                      <Badge key={t} active={formData.skinType === t} onClick={() => setFormData({...formData, skinType: t})}>{t}</Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-[#c5a059] uppercase tracking-wider">Goal</label>
                  <div className="flex flex-wrap gap-2">
                    {SKIN_GOALS.map(g => (
                      <Badge key={g} active={formData.goal === g} onClick={() => setFormData({...formData, goal: g})}>{g}</Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-[#c5a059] uppercase tracking-wider">Concerns</label>
                  <div className="flex flex-wrap gap-2">
                    {SKIN_CONCERNS.map(c => (
                      <Badge key={c} active={formData.concerns.includes(c)} onClick={() => toggleConcern(c)}>{c}</Badge>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="space-y-3">
                <ProfileItem label="Skin Type" value={user.skinType || 'Not set'} />
                <ProfileItem label="Primary Goal" value={user.goal || 'Not set'} />
                <ProfileItem label="Focus Areas" value={user.concerns.join(', ') || 'None selected'} />
                <ProfileItem label="Member Since" value={new Date(user.createdAt).toLocaleDateString()} />
              </div>
            )}
          </div>
        </section>

        <section className="space-y-4 pt-4 border-t border-white/5">
          <h3 className="text-xs font-semibold text-[#c5a059] uppercase tracking-widest px-2">Reminders</h3>
          <div className="space-y-2">
            <ToggleItem label="Morning Routine" checked={true} />
            <ToggleItem label="Night Routine" checked={true} />
            <ToggleItem label="Sunscreen Re-apply" checked={false} />
            <ToggleItem label="Weekly Progress Check" checked={true} />
          </div>
        </section>

        <Button variant="danger" className="w-full mt-8" onClick={onLogout}>Logout Session</Button>
      </div>
    </div>
  );
};

const ProfileItem: React.FC<{ label: string, value: string }> = ({ label, value }) => (
  <div className="flex justify-between items-center py-3 border-b border-white/5">
    <span className="text-gray-400 text-sm">{label}</span>
    <span className="text-white font-medium">{value}</span>
  </div>
);

const ToggleItem: React.FC<{ label: string, checked: boolean }> = ({ label, checked }) => (
  <div className="flex justify-between items-center py-2">
    <span className="text-gray-300 text-sm">{label}</span>
    <div className={`w-10 h-5 rounded-full relative transition-colors ${checked ? 'bg-[#c5a059]' : 'bg-gray-700'}`}>
      <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${checked ? 'right-1' : 'left-1'}`}></div>
    </div>
  </div>
);

export default ProfileView;
