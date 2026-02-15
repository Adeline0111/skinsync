
import React, { useState } from 'react';
import { UserProfile, SkinType, SkinConcern, SkinGoal } from '../types';
import { db } from '../services/storageService';
import { Button, Input, Badge } from '../components/UI';
import { SKIN_TYPES, SKIN_CONCERNS, SKIN_GOALS, GENDERS } from '../constants';

interface OnboardingViewProps {
  user: UserProfile;
  onComplete: (user: UserProfile) => void;
}

const OnboardingView: React.FC<OnboardingViewProps> = ({ user, onComplete }) => {
  const [step, setStep] = useState(1);
  const [age, setAge] = useState(25);
  const [gender, setGender] = useState(GENDERS[0]);
  const [skinType, setSkinType] = useState<SkinType>(SkinType.Combination);
  const [concerns, setConcerns] = useState<SkinConcern[]>([]);
  const [goal, setGoal] = useState<SkinGoal>(SkinGoal.ClearSkin);

  const toggleConcern = (concern: SkinConcern) => {
    setConcerns(prev => prev.includes(concern) ? prev.filter(c => c !== concern) : [...prev, concern]);
  };

  const handleFinish = () => {
    const updatedUser: UserProfile = {
      ...user,
      age,
      gender,
      skinType,
      concerns,
      goal,
      onboardingCompleted: true
    };
    db.saveUser(updatedUser);
    onComplete(updatedUser);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-8 animate-fadeIn">
            <div>
              <h2 className="text-3xl font-serif text-white mb-2">Tell us about you</h2>
              <p className="text-gray-400">We customize your journey based on profile.</p>
            </div>
            <Input label="Age" type="number" value={age} onChange={(e) => setAge(parseInt(e.target.value))} />
            <div className="space-y-3">
              <label className="text-xs font-semibold text-[#c5a059] uppercase tracking-wider">Gender Identity</label>
              <div className="grid grid-cols-2 gap-3">
                {GENDERS.map(g => (
                  <Badge key={g} active={gender === g} onClick={() => setGender(g)}>{g}</Badge>
                ))}
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-8 animate-fadeIn">
            <div>
              <h2 className="text-3xl font-serif text-white mb-2">Your Skin Type</h2>
              <p className="text-gray-400">Essential for product recommendations.</p>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {SKIN_TYPES.map(type => (
                <button
                  key={type}
                  onClick={() => setSkinType(type)}
                  className={`p-6 rounded-2xl text-left border transition-all ${
                    skinType === type ? 'bg-[#c5a059] border-[#c5a059] text-black' : 'bg-[#1a1c23] border-white/5 text-white hover:border-white/20'
                  }`}
                >
                  <div className="font-bold text-lg">{type}</div>
                  <div className={`text-sm opacity-70`}>Recommended for {type.toLowerCase()} skin types.</div>
                </button>
              ))}
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-8 animate-fadeIn">
            <div>
              <h2 className="text-3xl font-serif text-white mb-2">Focus Areas</h2>
              <p className="text-gray-400">Select all that apply to you.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              {SKIN_CONCERNS.map(c => (
                <Badge key={c} active={concerns.includes(c)} onClick={() => toggleConcern(c)}>{c}</Badge>
              ))}
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-8 animate-fadeIn">
            <div>
              <h2 className="text-3xl font-serif text-white mb-2">Your Skin Goal</h2>
              <p className="text-gray-400">What is the main result you want?</p>
            </div>
            <div className="space-y-4">
              {SKIN_GOALS.map(g => (
                <button
                  key={g}
                  onClick={() => setGoal(g)}
                  className={`w-full p-5 rounded-2xl border text-left transition-all flex items-center justify-between ${
                    goal === g ? 'bg-[#c5a059] border-[#c5a059] text-black' : 'bg-[#1a1c23] border-white/5 text-white'
                  }`}
                >
                  <span className="font-medium">{g}</span>
                  {goal === g && <span>✓</span>}
                </button>
              ))}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#0f1115] p-8 flex flex-col justify-between max-w-md mx-auto">
      <div className="flex gap-2 mb-12">
        {[1, 2, 3, 4].map(s => (
          <div key={s} className={`h-1.5 flex-1 rounded-full transition-all ${s <= step ? 'bg-[#c5a059]' : 'bg-white/10'}`}></div>
        ))}
      </div>

      <div className="flex-1">
        {renderStep()}
      </div>

      <div className="flex gap-4 mt-12">
        {step > 1 && (
          <Button variant="secondary" onClick={() => setStep(step - 1)} className="flex-1">Back</Button>
        )}
        <Button 
          onClick={() => step < 4 ? setStep(step + 1) : handleFinish()} 
          className="flex-[2]"
        >
          {step === 4 ? 'Complete Setup' : 'Continue'}
        </Button>
      </div>
    </div>
  );
};

export default OnboardingView;
