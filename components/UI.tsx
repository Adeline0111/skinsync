
import React from 'react';

export const Button: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  className?: string;
  type?: 'button' | 'submit';
  disabled?: boolean;
}> = ({ children, onClick, variant = 'primary', className = '', type = 'button', disabled = false }) => {
  const base = "px-6 py-3 rounded-xl font-medium transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center gap-2";
  const variants = {
    primary: "bg-[#c5a059] text-black hover:bg-[#d4af37]",
    secondary: "bg-[#1a1c23] text-white hover:bg-[#252830]",
    outline: "border border-[#c5a059] text-[#c5a059] hover:bg-[#c5a059] hover:text-black",
    danger: "bg-red-900/20 text-red-500 border border-red-900/30 hover:bg-red-900/40"
  };

  return (
    <button 
      type={type} 
      onClick={onClick} 
      disabled={disabled}
      className={`${base} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

export const Input: React.FC<{
  label?: string;
  type?: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
  required?: boolean;
}> = ({ label, type = 'text', value, onChange, placeholder, className = '', required }) => {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && <label className="text-xs font-semibold text-[#c5a059] uppercase tracking-wider">{label}</label>}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="bg-[#1a1c23] border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-[#c5a059] transition-all"
      />
    </div>
  );
};

export const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`bg-[#16181d] border border-white/5 rounded-2xl p-6 shadow-xl ${className}`}>
    {children}
  </div>
);

export const Badge: React.FC<{ children: React.ReactNode; active?: boolean; onClick?: () => void }> = ({ children, active, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
      active 
        ? 'bg-[#c5a059] text-black' 
        : 'bg-[#1a1c23] text-gray-400 hover:text-white border border-white/5'
    }`}
  >
    {children}
  </button>
);
