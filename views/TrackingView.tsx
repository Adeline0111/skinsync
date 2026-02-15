
import React, { useState, useMemo } from 'react';
import { UserProfile, SkinPhoto } from '../types';
import { db } from '../services/storageService';
import { Button, Input, Card } from '../components/UI';

const TrackingView: React.FC<{ user: UserProfile }> = ({ user }) => {
  const [showUpload, setShowUpload] = useState(false);
  const [note, setNote] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const photos = useMemo(() => db.getUserPhotos(user.id), [user.id, refreshTrigger]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSavePhoto = () => {
    if (!image) return;
    const newPhoto: SkinPhoto = {
      id: Math.random().toString(36).substring(7),
      timestamp: new Date().toISOString(),
      imageUrl: image,
      note
    };
    db.savePhoto(user.id, newPhoto);
    setImage(null);
    setNote('');
    setShowUpload(false);
    setRefreshTrigger(v => v + 1);
  };

  const deletePhoto = (id: string) => {
    if (window.confirm("Delete this memory?")) {
      db.deletePhoto(user.id, id);
      setRefreshTrigger(v => v + 1);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-serif text-white">Visual Log</h1>
          <p className="text-gray-400 text-sm">See the transformation happen.</p>
        </div>
        {!showUpload && <Button onClick={() => setShowUpload(true)} className="!py-2 !px-4">+ New</Button>}
      </header>

      {showUpload && (
        <Card className="border border-[#c5a059]/30 bg-[#c5a059]/5 animate-slideUp">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-serif text-xl">Capture Progress</h3>
            <button onClick={() => setShowUpload(false)} className="text-gray-400">✕</button>
          </div>
          
          <div className="space-y-6">
            <div className="relative group">
              <div className={`w-full aspect-[3/4] rounded-2xl border-2 border-dashed border-[#c5a059]/40 flex flex-col items-center justify-center overflow-hidden transition-all bg-[#0f1115] ${image ? 'border-none' : 'hover:bg-[#1a1c23]'}`}>
                {image ? (
                  <img src={image} className="w-full h-full object-cover" alt="Preview" />
                ) : (
                  <>
                    <span className="text-4xl mb-2">📸</span>
                    <span className="text-sm font-semibold text-[#c5a059]">Take Photo</span>
                    <input type="file" accept="image/*" capture="user" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                  </>
                )}
              </div>
              {image && <button onClick={() => setImage(null)} className="absolute top-4 right-4 bg-black/50 p-2 rounded-full text-white">✕</button>}
            </div>

            <Input label="Observation Notes" value={note} onChange={(e) => setNote(e.target.value)} placeholder="How does your skin feel today?" />
            
            <Button onClick={handleSavePhoto} disabled={!image} className="w-full">Upload to Timeline</Button>
          </div>
        </Card>
      )}

      {photos.length === 0 ? (
        <div className="py-24 text-center space-y-4">
          <div className="text-6xl opacity-10">🖼️</div>
          <p className="text-gray-500 italic max-w-xs mx-auto">No photos yet. Start your visual journey today to track your progress over time.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8">
          {photos.map((photo, i) => (
            <div key={photo.id} className="relative group">
              {/* Timeline dot */}
              <div className="absolute -left-3 top-0 bottom-0 w-0.5 bg-white/5"></div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-[#c5a059] -ml-[1.125rem] border-4 border-[#0f1115]"></div>
                  <p className="text-xs font-bold uppercase tracking-widest text-[#c5a059]">
                    {new Date(photo.timestamp).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>

                <div className="bg-[#16181d] rounded-3xl overflow-hidden border border-white/5 shadow-2xl">
                  <img src={photo.imageUrl} alt="Skin progress" className="w-full aspect-[4/5] object-cover" />
                  {photo.note && (
                    <div className="p-5 border-t border-white/5">
                      <p className="text-gray-300 italic text-sm">"{photo.note}"</p>
                    </div>
                  )}
                </div>

                <button 
                  onClick={() => deletePhoto(photo.id)}
                  className="opacity-0 group-hover:opacity-100 text-xs text-red-500 uppercase tracking-widest font-bold px-2 py-1 transition-opacity"
                >
                  Delete Entry
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TrackingView;
