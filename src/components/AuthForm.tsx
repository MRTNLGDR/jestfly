import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { useAuth } from '../contexts/auth';

interface AuthFormProps {
  mode?: 'login' | 'register';
  onSuccess?: () => void;
}

const loginFormSchema = z.object({
  email: z.string().email({
    message: "Por favor, insira um email válido.",
  }),
  password: z.string().min(8, {
    message: "Senha deve ter pelo menos 8 caracteres",
  }),
});

const registerFormSchema = z.object({
  name: z.string().min(2, {
    message: "Nome deve ter pelo menos 2 caracteres.",
  }),
  username: z.string().min(2, {
    message: "Username deve ter pelo menos 2 caracteres.",
  }),
  email: z.string().email({
    message: "Por favor, insira um email válido.",
  }),
  password: z.string().min(8, {
    message: "Senha deve ter pelo menos 8 caracteres",
  }),
  profileType: z.enum(['fan', 'artist', 'collaborator', 'admin']).default('fan'),
});

const AuthForm: React.FC<AuthFormProps> = ({ mode = 'login', onSuccess }) => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();

  const form = useForm({
    resolver: zodResolver(mode === 'login' ? loginFormSchema : registerFormSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
      username: "",
      profileType: 'fan',
    },
  });

  const onSubmit = async (data: any) => {
    setLoading(true);
    setError(null);

    try {
      if (mode === 'login') {
        await login(data.email, data.password);
        toast.success('Login realizado com sucesso!');
      } else {
        await register(data.email, data.password, {
          display_name: data.name, // changed from displayName to display_name
          username: data.username,
          profile_type: data.profileType || 'fan'
        });
        toast.success('Account created successfully!');
      }
      if (onSuccess) onSuccess();
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col space-y-4 w-full">
      {error && <p className="text-sm text-red-500">{error}</p>}
      {mode === 'register' && (
        <>
          <div>
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed" htmlFor="name">Nome</label>
            <input
              type="text"
              id="name"
              placeholder="Seu nome"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              {...form.register("name")}
            />
            {form.formState.errors.name && (
              <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
            )}
          </div>
          <div>
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed" htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              placeholder="username"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              {...form.register("username")}
            />
            {form.formState.errors.username && (
              <p className="text-sm text-red-500">{form.formState.errors.username.message}</p>
            )}
          </div>
        </>
      )}
      <div>
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed" htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          placeholder="mail@example.com"
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          {...form.register("email")}
        />
        {form.formState.errors.email && (
          <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>
        )}
      </div>
      <div>
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed" htmlFor="password">Senha</label>
        <input
          type="password"
          id="password"
          placeholder="Senha"
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          {...form.register("password")}
        />
        {form.formState.errors.password && (
          <p className="text-sm text-red-500">{form.formState.errors.password.message}</p>
        )}
      </div>
      {mode === 'register' && (
        <div>
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed" htmlFor="profileType">Tipo de Perfil</label>
          <select
            id="profileType"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            {...form.register("profileType")}
          >
            <option value="fan">Fã</option>
            <option value="artist">Artista</option>
            <option value="collaborator">Colaborador</option>
            <option value="admin">Administrador</option>
          </select>
          {form.formState.errors.profileType && (
            <p className="text-sm text-red-500">{form.formState.errors.profileType.message}</p>
          )}
        </div>
      )}
      <button type="submit" disabled={loading} className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
        {loading ? 'Carregando...' : (mode === 'login' ? 'Login' : 'Criar Conta')}
      </button>
    </form>
  );
};

export default AuthForm;
