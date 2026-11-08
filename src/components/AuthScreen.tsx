import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { loadRegisteredUsers, saveActiveUser, saveRegisteredUsers } from '../utils/storage';
import { Phone, Mail, Lock, Store, ShieldCheck, User, ArrowRight, Eye, EyeOff, CheckCircle2 } from 'lucide-react';

interface AuthScreenProps {
  onLogin: (user: UserProfile) => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin }) => {
  const [loginMethod, setLoginMethod] = useState<'phone' | 'email'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [error, setError] = useState('');
  const [registeredUsers, setRegisteredUsers] = useState<UserProfile[]>([]);

  useEffect(() => {
    setRegisteredUsers(loadRegisteredUsers());
  }, []);

  const handleRemoveSavedUser = (userId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = registeredUsers.filter((u) => u.id !== userId);
    setRegisteredUsers(updated);
    saveRegisteredUsers(updated);
  };

  const handleQuickSelectUser = (user: UserProfile) => {
    saveActiveUser(user);
    onLogin(user);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    let identifier = '';
    if (loginMethod === 'phone') {
      const cleaned = phoneNumber.replace(/[^0-9]/g, '');
      if (!cleaned || cleaned.length < 10) {
        setError('Barah-e-karam durust 10-11 hindson ka Pakistani mobile number darj karein (e.g. 0300-1234567)');
        return;
      }
      identifier = cleaned.startsWith('0') ? cleaned : `0${cleaned}`;
    } else {
      const emailTrimmed = email.trim().toLowerCase();
      if (!emailTrimmed || !emailTrimmed.includes('@') || !emailTrimmed.includes('.')) {
        setError('Barah-e-karam durust email address darj karein');
        return;
      }
      identifier = emailTrimmed;
    }

    if (pin && pin.length < 4) {
      setError('Security PIN kam az kam 4 hindson ka hona chaye');
      return;
    }

    // Check if user already exists
    const existing = registeredUsers.find((u) => u.identifier.toLowerCase() === identifier.toLowerCase());
    
    if (existing) {
      // If PIN was set on account, verify
      if (existing.pin && pin && existing.pin !== pin) {
        setError('Ghalat Security PIN! Barah-e-karam sahi PIN lagayein');
        return;
      }
      const updatedUser: UserProfile = {
        ...existing,
        lastLoginAt: Date.now(),
      };
      saveActiveUser(updatedUser);
      onLogin(updatedUser);
    } else {
      // New User Registration
      const userName = name.trim() || (loginMethod === 'phone' ? `User ${identifier.slice(-4)}` : identifier.split('@')[0]);
      const newUser: UserProfile = {
        id: `user_${Date.now()}`,
        name: userName,
        loginType: loginMethod,
        identifier,
        pin: pin || undefined,
        businessName: name.trim() ? `${name.trim()} Ka Khata` : 'Mera Easy Khata Book',
        createdAt: Date.now(),
        lastLoginAt: Date.now(),
      };

      const updatedList = [newUser, ...registeredUsers.filter((u) => u.id !== newUser.id)];
      saveRegisteredUsers(updatedList);
      saveActiveUser(newUser);
      onLogin(newUser);
    }
  };

  const handleGuestLogin = () => {
    const guestUser: UserProfile = {
      id: `guest_${Date.now()}`,
      name: 'Mera Khata (Mehman)',
      loginType: 'phone',
      identifier: '0300-0000000',
      businessName: 'Mera Karobar',
      createdAt: Date.now(),
      lastLoginAt: Date.now(),
    };
    saveActiveUser(guestUser);
    onLogin(guestUser);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-700 via-emerald-800 to-slate-900 flex flex-col justify-center items-center p-4">
      {/* Container */}
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-emerald-100">
        {/* Brand Header */}
        <div className="bg-emerald-600 px-6 pt-7 pb-6 text-white text-center relative overflow-hidden">
          <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-emerald-500/30 rounded-full blur-xl pointer-events-none" />
          
          <img
            src="/app-icon.png"
            alt="Easy Khata Book"
            className="w-16 h-16 rounded-2xl shadow-xl mx-auto mb-3 object-cover border border-emerald-400/40"
          />

          <div className="flex items-center justify-center gap-1.5">
            <h1 className="text-xl font-black tracking-tight">Easy Khata Book</h1>
            <span className="text-[10px] uppercase font-black bg-emerald-800 text-emerald-200 px-2 py-0.5 rounded-full">
              Bazaar
            </span>
          </div>
          <p className="text-xs text-emerald-100 font-medium mt-1">
            Digital Udhaar & Rozana Cash Book (Pakistan)
          </p>
        </div>

        {/* Existing Accounts quick picker if any exist */}
        {registeredUsers.length > 0 && (
          <div className="bg-slate-50 border-b border-slate-100 px-5 py-3">
            <div className="text-[11px] font-bold text-slate-500 mb-2 uppercase tracking-wide">
              Saved Accounts (1-Tap Se Kholein):
            </div>
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
              {registeredUsers.map((u) => (
                <div
                  key={u.id}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white border border-emerald-200 rounded-xl hover:bg-emerald-50 transition-colors shadow-2xs shrink-0"
                >
                  <button
                    type="button"
                    onClick={() => handleQuickSelectUser(u)}
                    className="flex items-center gap-2 text-left"
                  >
                    <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[11px] font-bold">
                      {u.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-800 leading-tight">{u.name}</div>
                      <div className="text-[10px] text-slate-400">{u.identifier}</div>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={(e) => handleRemoveSavedUser(u.id, e)}
                    className="p-1 text-slate-400 hover:text-rose-600 rounded-md transition-colors ml-1"
                    title="Account list se hatayein"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Body Content */}
        <div className="p-6">
          {/* Method Tabs: Phone vs Email */}
          <div className="flex rounded-xl bg-slate-100 p-1 mb-5">
            <button
              type="button"
              onClick={() => {
                setLoginMethod('phone');
                setError('');
              }}
              className={`flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                loginMethod === 'phone'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Mobile Number</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setLoginMethod('email');
                setError('');
              }}
              className={`flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                loginMethod === 'email'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Email Address</span>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Input by method */}
            {loginMethod === 'phone' ? (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Mobile Phone Number
                </label>
                <div className="flex items-center border border-slate-300 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-emerald-500 focus-within:border-emerald-500 bg-white shadow-2xs">
                  <div className="bg-slate-100 px-3 py-2.5 text-xs font-bold text-slate-700 border-r border-slate-200 flex items-center gap-1">
                    <span>🇵🇰</span>
                    <span>+92</span>
                  </div>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="300 1234567"
                    className="w-full px-3 py-2.5 text-sm font-semibold text-slate-900 focus:outline-hidden"
                    autoFocus
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  Misaal: 03001234567 ya 3001234567
                </p>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Email Address
                </label>
                <div className="flex items-center border border-slate-300 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-emerald-500 focus-within:border-emerald-500 bg-white shadow-2xs">
                  <div className="bg-slate-100 px-3 py-2.5 text-slate-500 border-r border-slate-200">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="aapka.email@gmail.com"
                    className="w-full px-3 py-2.5 text-sm font-semibold text-slate-900 focus:outline-hidden"
                    autoFocus
                  />
                </div>
              </div>
            )}

            {/* User / Business Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Aapka Naam Ya Dukan Ka Naam
              </label>
              <div className="flex items-center border border-slate-300 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-emerald-500 focus-within:border-emerald-500 bg-white shadow-2xs">
                <div className="bg-slate-100 px-3 py-2.5 text-slate-500 border-r border-slate-200">
                  <Store className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Apna Naam ya Dukan Ka Naam (e.g. Bismillah Store)"
                  className="w-full px-3 py-2.5 text-sm font-semibold text-slate-900 focus:outline-hidden"
                />
              </div>
            </div>

            {/* 4-Digit Security PIN */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700">
                  4-Digit Security PIN (Ikhtiyari)
                </label>
                <span className="text-[10px] text-slate-400">Hisaab Mehfooz Rakhne Ke Liye</span>
              </div>
              <div className="flex items-center border border-slate-300 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-emerald-500 focus-within:border-emerald-500 bg-white shadow-2xs">
                <div className="bg-slate-100 px-3 py-2.5 text-slate-500 border-r border-slate-200">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPin ? 'text' : 'password'}
                  maxLength={6}
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="4 Hindsay PIN (e.g. 1234)"
                  className="w-full px-3 py-2.5 text-sm font-mono font-bold tracking-widest text-slate-900 focus:outline-hidden"
                />
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  className="px-3 py-2.5 text-slate-400 hover:text-slate-600"
                >
                  {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error banner */}
            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs font-semibold text-rose-700">
                {error}
              </div>
            )}

            {/* Submit Primary CTA */}
            <button
              type="submit"
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.99] cursor-pointer"
            >
              <span>Aagay Barhein (Login / Shuru Karein)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Guest / Mehman mode */}
          <div className="mt-4 pt-4 border-t border-slate-100 text-center">
            <button
              type="button"
              onClick={handleGuestLogin}
              className="text-xs font-bold text-slate-500 hover:text-emerald-700 transition-colors py-1 inline-flex items-center gap-1"
            >
              <User className="w-3.5 h-3.5" />
              <span>Baghair Login Ke Shuru Karein (Mehman Mode)</span>
            </button>
          </div>

          {/* Privacy & Security Features Badges */}
          <div className="mt-5 p-3 bg-emerald-50/60 border border-emerald-100 rounded-2xl space-y-1.5 text-[11px] text-emerald-900">
            <div className="flex items-center gap-1.5 font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>100% Muft Aur Mahfooz Hisaab</span>
            </div>
            <ul className="text-slate-600 space-y-1 pl-5 list-disc text-[10px]">
              <li>Aapka tamam data sirf aapke mobile me mehfooz rehta hai.</li>
              <li>Baghair internet (Offline) bighair kisi rukawat ke chalta hai.</li>
              <li>Bhai, dosto aur customers ka udhaar 1 click par likhein.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
