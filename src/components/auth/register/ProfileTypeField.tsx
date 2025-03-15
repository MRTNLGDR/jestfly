
import React from 'react';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useFormContext } from 'react-hook-form';

const ProfileTypeField: React.FC = () => {
  const form = useFormContext();
  
  return (
    <FormField
      control={form.control}
      name="profileType"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Tipo de Perfil</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um tipo de perfil" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="fan">Fã</SelectItem>
              <SelectItem value="artist">Artista</SelectItem>
              <SelectItem value="collaborator">Colaborador</SelectItem>
              <SelectItem value="admin">Administrador</SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default ProfileTypeField;
