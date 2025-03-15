
import React from 'react';
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useFormContext } from 'react-hook-form';

interface PasswordFieldsProps {
  confirmPassword: string;
  setConfirmPassword: (value: string) => void;
  error: string | null;
}

const PasswordFields: React.FC<PasswordFieldsProps> = ({
  confirmPassword,
  setConfirmPassword,
  error
}) => {
  const form = useFormContext();
  
  return (
    <>
      <FormItem>
        <FormLabel>Senha</FormLabel>
        <FormControl>
          <Input type="password" {...form.register("password")} />
        </FormControl>
        <FormMessage />
      </FormItem>
      
      <div className="grid gap-2">
        <FormItem>
          <FormLabel>Confirmar Senha</FormLabel>
          <FormControl>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </FormControl>
          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}
        </FormItem>
      </div>
    </>
  );
};

export default PasswordFields;
