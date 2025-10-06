import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { AlertCircle } from 'lucide-react';

interface LoginFormProps {
  onSwitchToSignup: () => void;
}

export const LoginForm = ({ onSwitchToSignup }: LoginFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.message || 'Failed to log in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 font-mono text-xs uppercase">
      {error && (
        <div className="p-3 bg-red-900/20 border border-red-500/30 rounded flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-red-400 tracking-wider">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="flex flex-col gap-3">
          <label htmlFor="email" className="text-xs text-white/80 tracking-[0.15em]">
            EMAIL ADDRESS
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 bg-black/50 border border-white/20 text-white text-xs tracking-wider placeholder:text-white/40 focus:outline-none focus:border-white/60 transition-colors font-mono uppercase"
            placeholder="USER@DOMAIN.COM"
            required
          />
        </div>

        <div className="flex flex-col gap-3">
          <label htmlFor="password" className="text-xs text-white/80 tracking-[0.15em]">
            PASSWORD
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 bg-black/50 border border-white/20 text-white text-xs tracking-wider placeholder:text-white/40 focus:outline-none focus:border-white/60 transition-colors font-mono uppercase"
            placeholder="ENTER SECURITY KEY"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-6 bg-white text-black font-mono text-xs uppercase tracking-[0.2em] font-bold hover:bg-white/90 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 border-2 border-white hover:scale-105"
        >
          {loading ? 'AUTHENTICATING...' : 'INITIALIZE SESSION'}
        </button>
      </form>

      <div className="text-center text-xs text-white/60 tracking-[0.15em]">
        <p>NO ACCOUNT DETECTED?</p>
        <button
          onClick={onSwitchToSignup}
          className="text-white hover:text-white/80 font-bold underline underline-offset-4 mt-2 tracking-wider"
        >
          CREATE NEW USER
        </button>
      </div>
    </div>
  );
};