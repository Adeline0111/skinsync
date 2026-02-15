
import React, { useState } from 'react';
import { UserProfile } from '../types';
import { auth } from '../services/authService';
import { Button, Input } from '../components/UI';

interface AuthViewProps {
  onAuthSuccess: (user: UserProfile) => void;
}

const AuthView: React.FC<AuthViewProps> = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        const user = auth.login(email, password);
        onAuthSuccess(user);
      } else {
        const user = auth.signUp(email, password, name);
        onAuthSuccess(user);
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  if (forgotPassword) {
    return (
      <div className="min-h-screen bg-[#0f1115] p-8 flex flex-col justify-center max-w-md mx-auto">
        <h2 className="text-3xl font-serif text-white mb-2">Reset Password</h2>
        <p className="text-gray-400 mb-8">Enter your email and we'll send you a recovery link.</p>
        <form onSubmit={(e) => { e.preventDefault(); auth.resetPassword(email); alert("Sent!"); setForgotPassword(false); }} className="space-y-6">
          <Input label="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" required />
          <Button type="submit" className="w-full">Send Link</Button>
          <button type="button" onClick={() => setForgotPassword(false)} className="w-full text-gray-500 text-sm hover:text-white">Back to Login</button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f1115] p-8 flex flex-col justify-center max-w-md mx-auto">
      <div className="mb-12">
        <h1 className="text-5xl font-serif text-[#c5a059] mb-2">SkinSync</h1>
        <p className="text-gray-400 text-lg">Sophisticated skincare, synchronized for you.</p>
      </div>

      <div className="flex bg-[#1a1c23] p-1 rounded-xl mb-8">
        <button onClick={() => setIsLogin(true)} className={`flex-1 py-3 rounded-lg text-sm font-semibold transition-all ${isLogin ? 'bg-[#c5a059] text-black shadow-lg' : 'text-gray-400 hover:text-white'}`}>Login</button>
        <button onClick={() => setIsLogin(false)} className={`flex-1 py-3 rounded-lg text-sm font-semibold transition-all ${!isLogin ? 'bg-[#c5a059] text-black shadow-lg' : 'text-gray-400 hover:text-white'}`}>Sign Up</button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {!isLogin && (
          <Input label="Full Name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Eleanor Vance" required />
        )}
        <Input label="Email Address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="eleanor@example.com" required />
        <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />

        {error && <p className="text-red-500 text-sm bg-red-500/10 p-3 rounded-lg border border-red-500/20">{error}</p>}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
        </Button>
      </form>

      {isLogin && (
        <button 
          onClick={() => setForgotPassword(true)}
          className="mt-6 w-full text-center text-gray-500 text-sm hover:text-[#c5a059] transition-colors"
        >
          Forgot Password?
        </button>
      )}

      <div className="mt-12 text-center text-xs text-gray-600 uppercase tracking-widest leading-relaxed">
        By continuing, you agree to our<br/>Terms of Service & Privacy Policy
      </div>
    </div>
  );
};

export default AuthView;
