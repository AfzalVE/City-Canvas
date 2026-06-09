import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Leaf, Loader2, Lock } from 'lucide-react';
import { adminLogin } from '../../../lib/admin-api';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      await adminLogin(username, password);
      navigate('/admin');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to sign in');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[var(--cream)] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <Link to="/" className="mb-8 flex items-center justify-center gap-2">
          <div className="w-9 h-9 bg-[var(--forest-green)] rounded-md flex items-center justify-center">
            <Leaf className="w-5 h-5 text-[var(--cream)]" />
          </div>
          <div>
            <div className="text-base font-semibold text-[var(--charcoal)] font-serif">Virtual Holidays</div>
            <div className="text-xs text-[var(--warm-gray)]">Admin Access</div>
          </div>
        </Link>

        <form onSubmit={submit} className="bg-[var(--cream)] border border-gray-200 rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 bg-[var(--forest-green)]/10 rounded-lg flex items-center justify-center">
              <Lock className="w-4 h-4 text-[var(--forest-green)]" />
            </div>
            <div>
              <h1 className="font-serif text-xl text-[var(--charcoal)]">Admin Login</h1>
              <p className="text-xs text-[var(--warm-gray)]">Use the backend admin credentials.</p>
            </div>
          </div>

          <label className="block text-xs font-medium text-gray-600 mb-1.5">Username</label>
          <input
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            autoComplete="username"
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[var(--forest-green)] mb-4"
            required
          />

          <label className="block text-xs font-medium text-gray-600 mb-1.5">Password</label>
          <input
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            type="password"
            autoComplete="current-password"
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[var(--forest-green)]"
            required
          />

          {error && (
            <div className="mt-4 rounded-lg bg-red-50 border border-red-100 px-3 py-2 text-xs text-red-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full justify-center text-xs mt-5 disabled:opacity-70"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}
