import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, FileText, Phone } from 'lucide-react';
import { FormField } from '../../components/FormField/FormField';
import { Spinner } from '../../components/Spinner/Spinner';
import { useToast } from '../../components/Toast/ToastProvider';
import { authApi } from '../../api/auth/AuthApi';


export const SignUp = () => {
    const [nome, setNome] = useState('');
    const [cpf, setCpf] = useState('');
    const [email, setEmail] = useState('');
    const [telefone, setTelefone] = useState('');
    const [senha, setSenha] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const { showToast } = useToast();
    const navigate = useNavigate();

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!nome) newErrors.nome = 'Nome é obrigatório';
        if (!cpf) newErrors.cpf = 'CPF é obrigatório';
        else if (cpf.replace(/\D/g, '').length !== 11) newErrors.cpf = 'CPF deve ter 11 dígitos';
        if (!email) newErrors.email = 'Email é obrigatório';
        else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email inválido';
        if (!telefone) newErrors.telefone = 'Telefone é obrigatório';
        else if (telefone.replace(/\D/g, '').length < 10) newErrors.telefone = 'Telefone deve ter pelo menos 10 dígitos';
        if (!senha) newErrors.senha = 'Senha é obrigatória';
        else if (senha.length < 8) newErrors.senha = 'Senha deve ter pelo menos 8 caracteres';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const sanitizeCpf = (value: string) => value.replace(/\D/g, '');
    const sanitizeTelefone = (value: string) => value.replace(/\D/g, '');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);
        try {
            await authApi.signup({
                nome,
                cpf: sanitizeCpf(cpf),
                email,
                telefone: sanitizeTelefone(telefone),
                senha,
            });
            showToast('Cadastro realizado com sucesso!', 'success');
            navigate('/signin');
        } catch (error: unknown) {
            const axiosError = error as { response?: { data?: { message?: string } } };
            const message = axiosError.response?.data?.message || 'Erro ao cadastrar';
            showToast(message, 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center px-4 py-8">
            <div className="w-full max-w-sm sm:max-w-md bg-white rounded-2xl p-6 sm:p-10 shadow-2xl mx-auto">
                <h1 className="text-2xl sm:text-3xl font-bold text-center text-black mb-2">Criar Conta</h1>
                <p className="text-center text-gray-600 text-sm mb-6 sm:mb-8">Preencha seus dados para continuar</p>
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                    <FormField
                        label="Nome"
                        placeholder="Seu nome completo"
                        value={nome}
                        onChange={setNome}
                        error={errors.nome}
                        required
                        icon={<User size={20} />}
                    />
                    <FormField
                        label="CPF"
                        placeholder="000.000.000-00"
                        value={cpf}
                        onChange={setCpf}
                        error={errors.cpf}
                        required
                        icon={<FileText size={20} />}
                    />
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
                    <FormField
                        label="Telefone"
                        placeholder="(00) 00000-0000"
                        value={telefone}
                        onChange={setTelefone}
                        error={errors.telefone}
                        required
                        icon={<Phone size={20} />}
                    />
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
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-lg font-bold text-white flex items-center justify-center gap-2 mt-6 sm:mt-8"
                    >
                        {loading && <Spinner />}
                        Cadastrar
                    </button>
                </form>
                <p className="text-center mt-4 sm:mt-6 text-gray-600 text-sm">
                    Já tem conta? <Link to="/signin" className="text-blue-600 hover:text-blue-700 font-semibold">Entrar</Link>
                </p>
            </div>
        </div>
    );
};