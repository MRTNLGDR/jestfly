
// ATENÇÃO: Este arquivo é um placeholder para manter a compatibilidade de build
// A aplicação migrou para Firebase e não usa mais os serviços Supabase
console.warn('[Deprecated] profileService.ts foi carregado, mas não está mais em uso ativo. A aplicação migrou para Firebase.');

export const getProfile = async (userId: string) => {
  console.warn('getProfile chamado, mas não está mais em uso ativo.');
  return null;
};

export const updateProfile = async (userId: string, data: any) => {
  console.warn('updateProfile chamado, mas não está mais em uso ativo.');
  return null;
};
