import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';
import { FormField } from '../../components/FormField/FormField';
import { Spinner } from '../../components/Spinner/Spinner';
import { useToast } from '../../components/Toast/ToastProvider';
import { authApi } from '../../api/auth/AuthApi';

export const SignIn = () => {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const { showToast } = useToast();
    const navigate = useNavigate();

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!email) newErrors.email = 'Email é obrigatório';
        else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email inválido';
        if (!senha) newErrors.senha = 'Senha é obrigatória';
        else if (senha.length < 8) newErrors.senha = 'Senha deve ter pelo menos 8 caracteres';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);
        try {
            const response = await authApi.signin({ email, senha });
            localStorage.setItem('token', response.token);
            showToast('Login realizado com sucesso!', 'success');
            navigate('/dashboard');
        } catch (error: unknown) {
            const axiosError = error as { response?: { data?: { message?: string } } };
            const message = axiosError.response?.data?.message || 'Erro ao fazer login';
            showToast(message, 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center px-4 py-8">
            <div className="w-full max-w-sm sm:max-w-md bg-white rounded-2xl p-6 sm:p-10 shadow-2xl mx-auto">
                <h1 className="text-2xl sm:text-3xl font-bold text-center text-black mb-2">Acessar Plataforma</h1>
                <p className="text-center text-gray-600 text-sm mb-6 sm:mb-8">Inicia suas credenciais para continuar</p>
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                    <FormField
                        label="E-mail"
                        type="email"
                        placeholder="seu@email.com"
                        value={email}
                        onChange={setEmail}
                        error={errors.email}
                        required
                        icon={<Mail size={20} />}
                    />
                    <div>
                        <FormField
                            label="Senha"
                            type="password"
                            placeholder="Sua senha"
                            value={senha}
                            onChange={setSenha}
                            error={errors.senha}
                            required
                            icon={<Lock size={20} />}
                        />
                        <div className="text-right mt-2">
                            <Link to="#" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                                Esqueceu a senha?
                            </Link>
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-lg font-bold text-white flex items-center justify-center gap-2 mt-6 sm:mt-8"
                    >
                        {loading && <Spinner />}
                        Entrar
                    </button>
                </form>
                <p className="text-center mt-4 sm:mt-6 text-gray-600 text-sm">
                    Ainda não tem conta? <Link to="/signup" className="text-blue-600 hover:text-blue-700 font-semibold">Criar uma conta</Link>
                </p>
            </div>
        </div>
    );
};