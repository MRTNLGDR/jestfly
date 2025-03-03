
/**
 * Validates registration form data
 */
export const validateRegistrationForm = (formData: {
  email: string;
  password: string;
  confirmPassword: string;
  display_name: string;
  username: string;
  profile_type: string;
}) => {
  // Validate email
  if (!formData.email) {
    return 'O email é obrigatório';
  }
  
  if (!formData.email.includes('@')) {
    return 'Email inválido';
  }

  // Validate password
  if (formData.password.length < 6) {
    return 'A senha deve ter pelo menos 6 caracteres';
  }

  // Validate password confirmation
  if (formData.password !== formData.confirmPassword) {
    return 'As senhas não coincidem';
  }

  // Validate username
  if (!formData.username) {
    return 'Nome de usuário é obrigatório';
  }
  
  if (formData.username.length < 3) {
    return 'Nome de usuário deve ter pelo menos 3 caracteres';
  }

  // Validate display name
  if (!formData.display_name) {
    return 'Nome de exibição é obrigatório';
  }

  // Validate profile type
  if (formData.profile_type === 'admin') {
    return 'Não é permitido criar contas de administrador';
  }

  return null; // No validation errors
};
