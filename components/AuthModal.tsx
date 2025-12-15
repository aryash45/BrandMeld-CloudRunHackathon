
import React, { useState } from 'react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: { name: string; email: string }) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API delay
    setTimeout(() => {
      setIsLoading(false);
      // Mock user data
      const mockUser = {
        name: isLogin ? (email.split('@')[0] || 'Creator') : (name || 'Creator'),
        email: email
      };
      onSuccess(mockUser);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
       <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-8 relative shadow-2xl shadow-black/50">
          <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
          
          <div className="text-center mb-8">
            <div className="inline-block p-3 rounded-full bg-teal-500/10 mb-4">
               <svg className="w-8 h-8 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
               </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
            <p className="text-slate-400">{isLogin ? 'Log in to access your brand voice.' : 'Start building your personal brand today.'}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
             {!isLogin && (
                <div>
                   <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Full Name</label>
                   <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all" placeholder="John Doe" required />
                </div>
             )}
             <div>
                 <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Email Address</label>
                 <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all" placeholder="you@example.com" required />
             </div>
             <div>
                 <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Password</label>
                 <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all" placeholder="••••••••" required />
             </div>

             <button type="submit" disabled={isLoading} className="w-full bg-teal-600 hover:bg-teal-500 text-white font-bold py-3.5 rounded-lg transition-all transform active:scale-95 flex justify-center items-center shadow-lg shadow-teal-900/20">
                {isLoading ? (
                   <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                ) : (
                   isLogin ? 'Log In' : 'Sign Up Free'
                )}
             </button>
          </form>

          <div className="mt-6 text-center border-t border-slate-800 pt-6">
             <button onClick={() => setIsLogin(!isLogin)} className="text-slate-400 text-sm hover:text-teal-400 transition-colors">
                {isLogin ? "Don't have an account? Sign up" : "Already have an account? Log in"}
             </button>
          </div>
       </div>
    </div>
  );
}
export default AuthModal;
