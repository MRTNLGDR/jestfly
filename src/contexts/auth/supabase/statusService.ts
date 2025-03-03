// ATENÇÃO: Este arquivo é um placeholder para manter a compatibilidade de build
// A aplicação migrou para Firebase e não usa mais os serviços Supabase
console.warn('[Deprecated] statusService.ts foi carregado, mas não está mais em uso ativo. A aplicação migrou para Firebase.');

export const getAuthStatus = async () => {
  console.warn('getAuthStatus chamado, mas não está mais em uso ativo.');
  return { isAuthenticated: false, user: null };
};

export const watchAuthStatus = (callback: (status: any) => void) => {
  console.warn('watchAuthStatus chamado, mas não está mais em uso ativo.');
  return { unsubscribe: () => {} };
};
