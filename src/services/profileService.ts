
// Este arquivo agora serve como um ponto de entrada para os serviços de perfil
// reorganizados em módulos menores para maior manutenibilidade

export {
  fetchUserProfile,
  updateUserProfile,
  followUser,
  unfollowUser,
  checkIfFollowing,
  fetchUserPosts
} from './profile';
