
import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';
import { useAuth } from '../../contexts/auth';
import PersonalInfoFields from './register/PersonalInfoFields';
import PasswordFields from './register/PasswordFields';
import ProfileTypeField from './register/ProfileTypeField';

interface RegisterFormProps {
  onSuccess?: () => void;
}

const formSchema = z.object({
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

const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess }) => {
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
      profileType: 'fan',
    },
  });

  const password = form.watch("password");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      await register(form.getValues('email'), password, {
        display_name: form.getValues('name'),
        username: form.getValues('username'),
        profile_type: form.getValues('profileType') as "fan" | "artist" | "collaborator" | "admin"
      });
      
      toast.success('Conta criada com sucesso! Verifique seu e-mail.');
      if (onSuccess) onSuccess();
    } catch (err: any) {
      console.error('Erro no registro:', err);
      setError(err.message || 'Erro ao criar conta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col space-y-4 w-full">
      <FormProvider {...form}>
        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-4">
            <PersonalInfoFields />
            <PasswordFields 
              confirmPassword={confirmPassword}
              setConfirmPassword={setConfirmPassword}
              error={error}
            />
            <ProfileTypeField />
            <Button disabled={loading} type="submit">
              {loading ? 'Criando...' : 'Criar Conta'}
            </Button>
          </form>
        </Form>
      </FormProvider>
    </div>
  );
};

export default RegisterForm;
