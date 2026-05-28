import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Loader2, Mail, Lock } from 'lucide-react';
import { authApi } from '../../api/auth/AuthApi';

export const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    senha: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.senha) {
      toast.error('Preencha email e senha!');
      return;
    }

    try {
      setLoading(true);
      await authApi.login(formData);
      toast.success('Login realizado com sucesso!');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Email ou senha incorretos');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden px-4 py-12">
      {/* Light Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-100/40 via-transparent to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-blue-100/40 via-transparent to-transparent pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
              Acessar Plataforma
            </h1>
            <p className="text-slate-500 mt-2 text-sm">Insira suas credenciais para continuar</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">E-mail</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-200 bg-white shadow-sm"
                  placeholder="seu@email.com"
                />
              </div>
            </div>

            {/* Senha */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Senha</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="password"
                  name="senha"
                  value={formData.senha}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-200 bg-white shadow-sm"
                  placeholder="••••••••"
                />
              </div>
              <div className="flex justify-end mt-2">
                <a href="#" className="text-xs font-medium text-indigo-600 hover:text-indigo-500 transition-colors">
                  Esqueceu a senha?
                </a>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-[0_4px_14px_0_rgb(79,70,229,0.39)] text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 hover:shadow-[0_6px_20px_rgba(79,70,229,0.23)] hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 transition-all duration-200 mt-6"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" />
                  Autenticando...
                </>
              ) : (
                'Entrar'
              )}
            </button>
          </form>

          <div className="mt-8 text-center border-t border-slate-100 pt-6">
            <p className="text-sm text-slate-500">
              Ainda não tem conta?{' '}
              <Link to="/register" className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors">
                Criar uma conta
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
