# Estrutura Completa do Projeto JESTFLY

## Estrutura de Diretórios e Arquivos

/
├── public/                           # Arquivos estáticos públicos
│   ├── textures/                     # Texturas para modelos 3D
│   │   ├── environments/             # Ambientes HDRI para modelos 3D
│   │   ├── presets/                  # Thumbnails de presets de materiais
│   ├── envmap/                       # Cubemaps para ambiente 3D
│   ├── placeholder.svg               # Imagem placeholder
│   ├── favicon.ico                   # Favicon do site
│   └── og-image.png                  # Imagem para Open Graph (compartilhamento)
│
├── src/                              # Código fonte principal
│   ├── components/                   # Componentes React reutilizáveis
│   │   ├── admin/                    # Componentes do painel administrativo
│   │   │   ├── lighting/             # Componentes de iluminação para modelos 3D
│   │   │   │   ├── EnvironmentTab.tsx
│   │   │   │   ├── LightControls.tsx
│   │   │   │   ├── LightEditor.tsx
│   │   │   │   ├── LightsList.tsx
│   │   │   │   ├── LightsTab.tsx
│   │   │   │   ├── index.tsx
│   │   │   │   └── types.ts
│   │   │   ├── sketchfab/            # Componentes para integração com Sketchfab
│   │   │   │   ├── ModelCard.tsx
│   │   │   │   ├── SavedModelCard.tsx
│   │   │   │   ├── SavedModels.tsx
│   │   │   │   ├── SearchForm.tsx
│   │   │   │   └── SearchResults.tsx
│   │   │   ├── AdminSidebar.tsx      # Sidebar do painel administrativo
│   │   │   ├── ColorsTab.tsx         # Aba de cores no painel administrativo
│   │   │   ├── CrystalPreview.tsx    # Visualização de cristal no admin
│   │   │   ├── ElementsTab.tsx       # Aba de elementos no painel
│   │   │   ├── FontsTab.tsx          # Aba de fontes no painel
│   │   │   ├── LayoutTab.tsx         # Aba de layout no painel
│   │   │   ├── MaterialTab.tsx       # Aba de materiais para modelos 3D
│   │   │   ├── ModelEditor.tsx       # Editor de modelos 3D
│   │   │   ├── ModelGallery.tsx      # Galeria de modelos 3D
│   │   │   ├── ModelTab.tsx          # Aba de modelos 3D
│   │   │   ├── SettingsTab.tsx       # Aba de configurações
│   │   │   ├── SketchfabTab.tsx      # Aba para integração Sketchfab
│   │   │   └── TextureEditor.tsx     # Editor de texturas
│   │   │
│   │   ├── airdrop/                  # Componentes do sistema de Airdrop
│   │   │   ├── AirdropClaim.tsx      # Componente para reclamar airdrops
│   │   │   ├── AirdropCreator.tsx    # Criador de campanhas de airdrop
│   │   │   ├── AirdropList.tsx       # Lista de airdrops disponíveis
│   │   │   ├── ClaimHistory.tsx      # Histórico de reclamações
│   │   │   └── EligibilityCheck.tsx  # Verificador de elegibilidade
│   │   │
│   │   ├── auth/                     # Componentes de autenticação
│   │   │   ├── LoginForm.tsx         # Formulário de login
│   │   │   ├── ProtectedRoute.tsx    # Rota protegida por autenticação
│   │   │   ├── RegisterForm.tsx      # Formulário de registro
│   │   │   ├── ResetPassword.tsx     # Recuperação de senha
│   │   │   ├── TwoFactorAuth.tsx     # Autenticação em duas etapas
│   │   │   └── UserSection.tsx       # Seção do usuário logado
│   │   │
│   │   ├── bookings/                 # Componentes do sistema de reservas
│   │   │   ├── AvailabilityCalendar.tsx  # Calendário de disponibilidade
│   │   │   ├── BookingConfirmation.tsx   # Confirmação de reserva
│   │   │   ├── BookingForm.tsx       # Formulário de reserva
│   │   │   ├── BookingsList.tsx      # Lista de reservas
│   │   │   ├── BookingTypeSelector.tsx   # Seletor de tipo de reserva
│   │   │   └── ResourceCalendar.tsx  # Calendário de recursos
│   │   │
│   │   ├── community/                # Componentes da comunidade
│   │   │   ├── CommentList.tsx       # Lista de comentários
│   │   │   ├── CommentForm.tsx       # Formulário de comentários
│   │   │   ├── CommunityHome.tsx     # Página inicial da comunidade
│   │   │   ├── CommunityNav.tsx      # Navegação da comunidade
│   │   │   ├── EventCard.tsx         # Card de evento
│   │   │   ├── EventsPage.tsx        # Página de eventos
│   │   │   ├── GiveawayCard.tsx      # Card de sorteio
│   │   │   ├── GiveawaysPage.tsx     # Página de sorteios
│   │   │   ├── JestFlyersHubPage.tsx # Hub para a comunidade JestFlyers
│   │   │   ├── NewPostPage.tsx       # Página para nova postagem
│   │   │   ├── PostCard.tsx          # Card de postagem
│   │   │   ├── PostDetailPage.tsx    # Página de detalhes da postagem
│   │   │   └── PostFilter.tsx        # Filtro de postagens
│   │   │
│   │   ├── creativeflow/             # Sistema CreativeFlow Board (estilo Miro)
│   │   │   ├── Canvas.tsx            # Canvas principal
│   │   │   ├── CanvasControls.tsx    # Controles do canvas
│   │   │   ├── CanvasElement.tsx     # Elemento do canvas
│   │   │   ├── FlowNode.tsx          # Nó de automação
│   │   │   ├── FlowNodeEditor.tsx    # Editor de nós
│   │   │   ├── IntegrationNode.tsx   # Nó de integração externa
│   │   │   ├── NodeConnection.tsx    # Conexão entre nós
│   │   │   ├── Sidebar.tsx           # Barra lateral do canvas
│   │   │   ├── ToolPalette.tsx       # Paleta de ferramentas
│   │   │   └── ToolSettings.tsx      # Configurações de ferramentas
│   │   │
│   │   ├── demos/                    # Submissão de demos musicais
│   │   │   ├── DemoForm.tsx          # Formulário de submissão
│   │   │   ├── DemoList.tsx          # Lista de demos
│   │   │   ├── DemoPlayer.tsx        # Reprodutor de demos
│   │   │   ├── DemoReview.tsx        # Interface de revisão
│   │   │   ├── DemoStatus.tsx        # Status da submissão
│   │   │   └── DemoUploader.tsx      # Uploader de arquivos
│   │   │
│   │   ├── file-uploader/            # Sistema de upload de arquivos
│   │   │   ├── FileList.tsx          # Lista de arquivos
│   │   │   ├── FolderUploader.tsx    # Upload de pasta
│   │   │   ├── UploadArea.tsx        # Área de upload
│   │   │   ├── index.ts              # Exportações
│   │   │   ├── types.ts              # Tipos
│   │   │   └── utils.ts              # Utilitários
│   │   │
│   │   ├── jestcoin/                 # Sistema de moeda interna JestCoin
│   │   │   ├── CoinExchange.tsx      # Interface de troca de moedas
│   │   │   ├── JestWallet.tsx        # Carteira digital
│   │   │   ├── RewardsSystem.tsx     # Sistema de recompensas
│   │   │   ├── TransactionHistory.tsx # Histórico de transações
│   │   │   └── TransactionItem.tsx   # Item de transação
│   │   │
│   │   ├── livestream/               # Sistema de transmissão ao vivo
│   │   │   ├── LiveChat.tsx          # Chat ao vivo
│   │   │   ├── StreamAnalytics.tsx   # Análises de streaming
│   │   │   ├── StreamList.tsx        # Lista de transmissões
│   │   │   ├── StreamSchedule.tsx    # Agenda de transmissões
│   │   │   ├── StreamerDashboard.tsx # Dashboard para streamers
│   │   │   └── VideoPlayer.tsx       # Reprodutor de vídeo
│   │   │
│   │   ├── nft/                      # Sistema de NFTs
│   │   │   ├── NFTCard.tsx           # Card de NFT
│   │   │   ├── NFTCollection.tsx     # Coleção de NFTs
│   │   │   ├── NFTDetail.tsx         # Detalhes do NFT
│   │   │   ├── NFTGallery.tsx        # Galeria de NFTs
│   │   │   ├── NFTMint.tsx           # Interface para cunhagem
│   │   │   └── WalletConnect.tsx     # Conexão com carteira
│   │   │
│   │   ├── presskit/                 # Sistema de Press Kit
│   │   │   ├── ArtistBio.tsx         # Biografia do artista
│   │   │   ├── AssetGallery.tsx      # Galeria de assets
│   │   │   ├── MaterialsDownload.tsx # Downloads de materiais
│   │   │   ├── MediaContact.tsx      # Contato com mídia
│   │   │   └── PressForm.tsx         # Formulário para imprensa
│   │   │
│   │   ├── profile/                  # Componentes de perfil
│   │   │   ├── ActivityHistory.tsx   # Histórico de atividades
│   │   │   ├── EditProfile.tsx       # Edição de perfil
│   │   │   ├── ProfileDetails.tsx    # Detalhes do perfil
│   │   │   ├── ProfileForm.tsx       # Formulário de perfil
│   │   │   ├── ProfileHeader.tsx     # Cabeçalho do perfil
│   │   │   ├── ProfileTabs.tsx       # Abas do perfil
│   │   │   └── WalletIntegration.tsx # Integração com carteira
│   │   │
│   │   ├── store/                    # Componentes da loja
│   │   │   ├── Cart.tsx              # Carrinho de compras
│   │   │   ├── Checkout.tsx          # Finalização de compra
│   │   │   ├── OrderHistory.tsx      # Histórico de pedidos
│   │   │   ├── OrderSummary.tsx      # Resumo do pedido
│   │   │   ├── PaymentForm.tsx       # Formulário de pagamento
│   │   │   ├── ProductCard.tsx       # Card de produto
│   │   │   ├── ProductCatalog.tsx    # Catálogo de produtos
│   │   │   ├── ProductDetail.tsx     # Detalhes do produto
│   │   │   └── ProductFilter.tsx     # Filtro de produtos
│   │   │
│   │   ├── ui/                       # Componentes de UI genéricos
│   │   │   ├── alert-dialog.tsx      # Diálogo de alerta
│   │   │   ├── alert.tsx             # Alerta
│   │   │   ├── aspect-ratio.tsx      # Proporção de aspecto
│   │   │   ├── avatar.tsx            # Avatar
│   │   │   ├── badge.tsx             # Badge
│   │   │   ├── breadcrumb.tsx        # Navegação breadcrumb
│   │   │   ├── button.tsx            # Botão
│   │   │   ├── calendar.tsx          # Calendário
│   │   │   ├── card.tsx              # Card
│   │   │   ├── carousel.tsx          # Carrossel
│   │   │   ├── chart.tsx             # Gráfico
│   │   │   ├── checkbox.tsx          # Checkbox
│   │   │   └── ... 
│   │   │   ├── toast.tsx             # Toast
│   │   │   ├── toaster.tsx           # Sistema de toasts
│   │   │   ├── tooltip.tsx           # Tooltip
│   │   │   ├── typography.tsx        # Componentes de tipografia
│   │   │   └── use-toast.ts          # Hook para toasts
│   │   │
│   │   ├── ArtistShowcase.tsx        # Showcase de artistas
│   │   ├── AuthForm.tsx              # Formulário de autenticação
│   │   ├── ConnectionSection.tsx     # Seção de conexão na página inicial
│   │   ├── CrystalGallery.tsx        # Galeria com efeito cristal
│   │   ├── CrystalHero.tsx           # Hero com cristal 3D
│   │   ├── CyberMenu.tsx             # Menu com estilo futurista
│   │   ├── EventsSection.tsx         # Seção de eventos na homepage
│   │   ├── Footer.tsx                # Rodapé
│   │   ├── GlassAudioPlayer.tsx      # Player de áudio com efeito glass
│   │   ├── GlassHeader.tsx           # Cabeçalho com efeito glass
│   │   ├── GoldCoin3D.tsx            # Modelo 3D da moeda JestCoin
│   │   ├── JestCoinTicker.tsx        # Ticker da JestCoin
│   │   ├── NFTModel.tsx              # Modelo 3D para NFTs
│   │   ├── NFTSection.tsx            # Seção de NFTs na homepage
│   │   ├── RoadmapSection.tsx        # Seção de roadmap
│   │   ├── ShopPreview.tsx           # Prévia da loja
│   │   └── TypographyShowcase.tsx    # Showcase de tipografia
│   │
│   ├── contexts/                     # Contextos React
│   │   ├── AuthContext.tsx           # Contexto de autenticação
│   │   ├── CartContext.tsx           # Contexto do carrinho
│   │   ├── LanguageContext.tsx       # Contexto de idioma
│   │   ├── NotificationsContext.tsx  # Contexto de notificações
│   │   ├── ThemeContext.tsx          # Contexto de tema
│   │   ├── UserPreferencesContext.tsx # Contexto de preferências
│   │   └── WalletContext.tsx         # Contexto de carteira digital
│   │
│   ├── hooks/                        # Custom hooks
│   │   ├── admin/                    # Hooks do painel administrativo
│   │   │   ├── useAdminActions.ts    # Ações de administrador
│   │   │   ├── useDemoReview.ts      # Revisão de demos
│   │   │   ├── useJestCoinAdmin.ts   # Administração da JestCoin
│   │   │   ├── useSystemLogs.ts      # Logs do sistema
│   │   │   └── useUserManagement.ts  # Gestão de usuários
│   │   │
│   │   ├── airdrop/                  # Hooks para sistema de airdrop
│   │   │   ├── useAirdrop.ts         # Hook principal
│   │   │   ├── useAirdropClaims.ts   # Reclamações de airdrop
│   │   │   └── useEligibility.ts     # Verificação de elegibilidade
│   │   │
│   │   ├── auth/                     # Hooks de autenticação
│   │   │   ├── useAuth.backup        # Backup do hook de autenticação
│   │   │   ├── useAuth.tsx           # Hook de autenticação
│   │   │   ├── useAuthActions.ts     # Ações de autenticação
│   │   │   └── useProfile.ts         # Acesso ao perfil
│   │   │
│   │   ├── bookings/                 # Hooks de reservas
│   │   │   ├── useAvailability.ts    # Disponibilidade
│   │   │   ├── useBookingActions.ts  # Ações de reserva
│   │   │   └── useBookings.ts        # Acesso a reservas
│   │   │
│   │   ├── community/                # Hooks da comunidade
│   │   │   ├── useComments.ts        # Comentários
│   │   │   ├── useCommunityActions.ts # Ações da comunidade
│   │   │   ├── useEvents.ts          # Eventos comunitários
│   │   │   ├── useGiveaways.ts       # Sorteios
│   │   │   └── usePosts.ts           # Postagens
│   │   │
│   │   ├── creativeflow/             # Hooks para o CreativeFlow Board
│   │   │   ├── useCanvas.ts          # Canvas
│   │   │   ├── useFlowNodes.ts       # Nós de fluxo
│   │   │   ├── useIntegrations.ts    # Integrações
│   │   │   └── useSaveBoard.ts       # Salvamento do quadro
│   │   │
│   │   ├── demos/                    # Hooks para submissão de demos
│   │   │   ├── useDemoSubmission.ts  # Submissão de demos
│   │   │   ├── useDemoUpload.ts      # Upload de arquivos
│   │   │   └── usePlayerState.ts     # Estado do reprodutor
│   │   │
│   │   ├── jestcoin/                 # Hooks para JestCoin
│   │   │   ├── useRewards.ts         # Recompensas
│   │   │   ├── useTransactions.ts    # Transações
│   │   │   └── useWallet.ts          # Carteira digital
│   │   │
│   │   ├── livestream/               # Hooks para transmissão ao vivo
│   │   │   ├── useChat.ts            # Chat ao vivo
│   │   │   ├── useStream.ts          # Streaming
│   │   │   └── useViewers.ts         # Visualizadores
│   │   │
│   │   ├── nft/                      # Hooks para NFTs
│   │   │   ├── useNFTCollection.ts   # Coleção de NFTs
│   │   │   ├── useNFTMint.ts         # Cunhagem de NFTs
│   │   │   └── useWalletConnection.ts # Conexão com carteira
│   │   │
│   │   ├── profile/                  # Hooks para perfil
│   │   │   ├── useActivityHistory.ts # Histórico de atividades
│   │   │   ├── useProfileActions.ts  # Ações de perfil
│   │   │   └── useUserLibrary.ts     # Biblioteca do usuário
│   │   │
│   │   ├── store/                    # Hooks para loja
│   │   │   ├── useCart.ts            # Carrinho
│   │   │   ├── useCheckout.ts        # Checkout
│   │   │   ├── useOrders.ts          # Pedidos
│   │   │   └── useProducts.ts        # Produtos
│   │   │
│   │   ├── useActivityLogger.ts      # Logger de atividades
│   │   ├── useAvatarUpload.tsx       # Upload de avatar
│   │   ├── useDebounce.ts            # Debounce para inputs
│   │   ├── useFetch.ts               # Fetch com React Query
│   │   ├── useLocalStorage.ts        # Manipulação de localStorage
│   │   ├── useMedia.ts               # Queries de media
│   │   ├── use-mobile.tsx            # Detecção de dispositivo mobile
│   │   ├── useOutsideClick.ts        # Detecção de clique fora do elemento
│   │   ├── usePagination.ts          # Paginação
│   │   ├── useSearch.ts              # Funcionalidade de busca
│   │   ├── useTheme.ts               # Acesso ao tema
│   │   └── use-toast.ts              # Utilização de toasts
│   │
│   ├── integrations/                 # Integrações externas
│   │   ├── payment/                  # Integração com pagamentos
│   │   │   ├── stripe.ts             # Integração com Stripe
│   │   │   └── paypal.ts             # Integração com PayPal
│   │   │
│   │   ├── blockchain/               # Integração com blockchain
│   │   │   ├── ethers.ts             # Integração com Ethers.js
│   │   │   ├── nft.ts                # Operações com NFTs
│   │   │   └── wallet.ts             # Conexão com carteira
│   │   │
│   │   ├── social/                   # Integração com redes sociais
│   │   │   ├── instagram.ts          # Integração com Instagram
│   │   │   ├── twitter.ts            # Integração com Twitter
│   │   │   ├── discord.ts            # Integração com Discord
│   │   │   └── index.ts              # Exportações
│   │   │
│   │   ├── google/                   # Integração com serviços Google
│   │   │   ├── calendar.ts           # Integração com Google Calendar
│   │   │   ├── drive.ts              # Integração com Google Drive
│   │   │   └── sheets.ts             # Integração com Google Sheets
│   │   │
│   │   ├── streaming/                # Integração com plataformas de streaming
│   │   │   ├── spotify.ts            # Integração com Spotify
│   │   │   ├── appleMusic.ts         # Integração com Apple Music
│   │   │   └── soundcloud.ts         # Integração com SoundCloud
│   │   │
│   │   ├── communication/            # Integração com comunicação
│   │   │   ├── email.ts              # Integração com email
│   │   │   ├── sms.ts                # Integração com SMS
│   │   │   └── push.ts               # Notificações push
│   │   │
│   │   └── supabase/                 # Integração com Supabase
│   │       ├── client.ts             # Cliente Supabase
│   │       └── types.ts              # Tipos do Supabase
│   │
│   ├── lib/                          # Bibliotecas e utilitários
│   │   ├── api.ts                    # Funções de API
│   │   ├── date-utils.ts             # Utilitários de data
│   │   ├── format-utils.ts           # Utilitários de formatação
│   │   ├── storage-utils.ts          # Utilitários de armazenamento
│   │   ├── theme-utils.ts            # Utilitários de tema
│   │   ├── validation-utils.ts       # Utilitários de validação
│   │   └── utils.ts                  # Utilitários gerais
│   │
│   ├── pages/                        # Páginas principais
│   │   ├── Admin.tsx                 # Página de administração
│   │   ├── AdminDashboardPage.tsx    # Dashboard de administração
│   │   ├── AirdropPage.tsx           # Página de airdrop
│   │   ├── AssetUploader.tsx         # Uploader de assets
│   │   ├── AuthPage.tsx              # Página de autenticação
│   │   ├── BookingsPage.tsx          # Página de reservas
│   │   ├── CheckoutPage.tsx          # Página de checkout
│   │   ├── CommunityPage.tsx         # Página da comunidade
│   │   ├── CreativeFlowPage.tsx      # Página do CreativeFlow Board
│   │   ├── DemoSubmissionPage.tsx    # Página de submissão de demos
│   │   ├── HomePage.tsx              # Página inicial
│   │   ├── Index.tsx                 # Redirecionamento
│   │   ├── JestCoinPage.tsx          # Página do sistema JestCoin
│   │   ├── LiveStreamPage.tsx        # Página de transmissão ao vivo
│   │   ├── LogsPage.tsx              # Página de logs
│   │   ├── NFTMarketplacePage.tsx    # Marketplace de NFTs
│   │   ├── NotFound.tsx              # Página 404
│   │   ├── OrderSuccessPage.tsx      # Página de sucesso do pedido
│   │   ├── PressKitPage.tsx          # Página de press kit
│   │   ├── ProductDetailPage.tsx     # Página de detalhes do produto
│   │   ├── ProfilePage.tsx           # Página de perfil
│   │   └── StorePage.tsx             # Página da loja
│   │
│   ├── services/                     # Serviços para comunicação com APIs
│   │   ├── admin.service.ts          # Serviços administrativos
│   │   ├── airdrop.service.ts        # Serviços de airdrop
│   │   ├── auth.service.ts           # Serviços de autenticação
│   │   ├── bookings.service.ts       # Serviços de reservas
│   │   ├── community.service.ts      # Serviços da comunidade
│   │   ├── creativeflow.service.ts   # Serviços do CreativeFlow Board
│   │   ├── demo.service.ts           # Serviços de demos
│   │   ├── jestcoin.service.ts       # Serviços da JestCoin
│   │   ├── livestream.service.ts     # Serviços de transmissão ao vivo
│   │   ├── nft.service.ts            # Serviços de NFT
│   │   ├── presskit.service.ts       # Serviços de press kit
│   │   ├── profile.service.ts        # Serviços de perfil
│   │   └── store.service.ts          # Serviços da loja
│   │
│   ├── styles/                       # Estilos e temas
│   │   ├── animations.css            # Animações CSS
│   │   ├── globalStyles.css          # Estilos globais
│   │   ├── theme-placeholder.ts      # Placeholder de tema
│   │   ├── theme-types.ts            # Tipos para tema
│   │   └── theme.tsx                 # Definição do tema
│   │
│   ├── types/                        # Definições de tipos TypeScript
│   │   ├── admin.ts                  # Tipos administrativos
│   │   ├── airdrop.ts                # Tipos de airdrop
│   │   ├── assetTypes.ts             # Tipos de assets
│   │   ├── auth.ts                   # Tipos de autenticação
│   │   ├── booking.ts                # Tipos de reservas
│   │   ├── community.ts              # Tipos da comunidade
│   │   ├── creativeflow.ts           # Tipos do CreativeFlow Board
│   │   ├── demo.ts                   # Tipos de demos
│   │   ├── environmentPresets.ts     # Presets de ambiente 3D
│   │   ├── jestcoin.ts               # Tipos da JestCoin
│   │   ├── livestream.ts             # Tipos de transmissão ao vivo
│   │   ├── logs.ts                   # Tipos de logs
│   │   ├── materialPresets.ts        # Presets de materiais 3D
│   │   ├── model.ts                  # Agregador de tipos de modelo
│   │   ├── modelParameters.ts        # Parâmetros de modelo 3D
│   │   ├── nft.ts                    # Tipos de NFT
│   │   ├── payment.ts                # Tipos de pagamento
│   │   ├── presskit.ts               # Tipos de press kit
│   │   ├── product.ts                # Tipos de produto
│   │   ├── profile.ts                # Tipos de perfil
│   │   └── user.ts                   # Tipos de usuário
│   │
│   ├── utils/                        # Funções utilitárias
│   │   ├── audio-utils.ts            # Utilitários de áudio
│   │   ├── date-utils.ts             # Utilitários de data
│   │   ├── file-utils.ts             # Utilitários de arquivo
│   │   ├── format-utils.ts           # Utilitários de formatação
│   │   ├── storage-utils.ts          # Utilitários de armazenamento
│   │   └── validation-utils.ts       # Utilitários de validação
│   │
│   ├── App.css                       # Estilos do App
│   ├── App.tsx                       # Componente principal da aplicação
│   ├── CrystalComponent.tsx          # Componente de cristal 3D
│   ├── index.css                     # Estilos do index
│   ├── main.tsx                      # Ponto de entrada da aplicação
│   └── vite-env.d.ts                 # Definições de ambiente Vite
│
├── supabase/                         # Configurações do Supabase
│   ├── functions/                    # Edge Functions
│   │   ├── blockchain-integration/   # Integração com blockchain
│   │   │   ├── index.ts              # Função principal
│   │   │   └── config.toml           # Configuração
│   │   │
│   │   ├── demo-processor/           # Processador de arquivos de demo
│   │   │   ├── index.ts              # Função principal
│   │   │   └── config.toml           # Configuração
│   │   │
│   │   ├── payment-webhook/          # Webhook de pagamento
│   │   │   ├── index.ts              # Função principal
│   │   │   └── config.toml           # Configuração
│   │   │
│   │   ├── sketchfab-fetch/          # Integração com Sketchfab
│   │   │   ├── index.ts              # Função principal
│   │   │   └── config.toml           # Configuração
│   │   │
│   │   └── user-notifications/       # Notificações de usuário
│   │       ├── index.ts              # Função principal
│   │       └── config.toml           # Configuração
│   │
│   ├── migrations/                   # Migrações SQL
│   │   ├── create_storage_buckets.sql    # Criação de buckets
│   │   ├── create_user_tables.sql        # Tabelas de usuário
│   │   ├── create_community_tables.sql   # Tabelas da comunidade
│   │   ├── create_store_tables.sql       # Tabelas da loja
│   │   ├── create_booking_tables.sql     # Tabelas de reserva
│   │   ├── create_demo_tables.sql        # Tabelas de demo
│   │   ├── create_stream_tables.sql      # Tabelas de streaming
│   │   ├── create_jestcoin_tables.sql    # Tabelas de JestCoin
│   │   ├── create_nft_tables.sql         # Tabelas de NFT
│   │   └── create_creativeflow_tables.sql # Tabelas do CreativeFlow
│   │
│   └── config.toml                   # Configuração do Supabase
│
├── .gitignore                        # Arquivos ignorados pelo Git
├── README.md                         # Documentação do projeto
├── bun.lockb                         # Arquivo de lock do Bun
├── components.json                   # Configuração de componentes
├── eslint.config.js                  # Configuração do ESLint
├── index.html                        # HTML principal
├── package-lock.json                 # Arquivo de lock do npm
├── package.json                      # Dependências do projeto
├── postcss.config.js                 # Configuração do PostCSS
├── tailwind.config.ts                # Configuração do Tailwind CSS
├── tsconfig.app.json                 # Configuração do TypeScript para o app
├── tsconfig.json                     # Configuração do TypeScript principal
├── tsconfig.node.json                # Configuração do TypeScript para Node
└── vite.config.ts                    # Configuração do Vite

## Esquema do Banco de Dados Supabase

### Tabelas no Schema public

#### 1. profiles

`CREATE TABLE public.profiles (   id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,  display_name TEXT NOT NULL,  username TEXT NOT NULL UNIQUE,  email TEXT NOT NULL,  avatar TEXT,  bio TEXT,  profile_type PROFILE_TYPE NOT NULL DEFAULT 'fan',  wallet_address TEXT,  social_links JSONB DEFAULT '{}',  permissions TEXT[] DEFAULT '{}',  roles TEXT[] DEFAULT '{}',  preferences JSONB DEFAULT '{"theme": "dark", "currency": "USD", "language": "en", "notifications": {}}',  two_factor_enabled BOOLEAN DEFAULT false,  is_verified BOOLEAN DEFAULT false,  last_login TIMESTAMP WITH TIME ZONE DEFAULT now(),  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now() ); -- Tipo enumerado para perfil de usuário CREATE TYPE PROFILE_TYPE AS ENUM ('fan', 'artist', 'collaborator', 'admin');`

#### 2. user_activity_logs

`CREATE TABLE public.user_activity_logs (   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),  user_id UUID REFERENCES profiles(id),  action VARCHAR NOT NULL,  entity_type VARCHAR,  entity_id UUID,  ip_address VARCHAR,  user_agent TEXT,  details JSONB DEFAULT '{}',  success BOOLEAN DEFAULT true,  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() );`

#### 3. products

`CREATE TABLE public.products (   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),  title TEXT NOT NULL,  description TEXT,  price NUMERIC NOT NULL,  image_url TEXT,  type PRODUCT_TYPE NOT NULL,  stock INTEGER DEFAULT 0,  metadata JSONB DEFAULT '{}',  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now() ); -- Tipo enumerado para produto CREATE TYPE PRODUCT_TYPE AS ENUM ('nft', 'music', 'merch', 'collectible');`

#### 4. orders

`CREATE TABLE public.orders (   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),  user_id UUID NOT NULL REFERENCES profiles(id),  total NUMERIC NOT NULL,  status TEXT NOT NULL DEFAULT 'pending',  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now() );`

#### 5. order_items

`CREATE TABLE public.order_items (   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),  order_id UUID NOT NULL REFERENCES orders(id),  product_id UUID NOT NULL REFERENCES products(id),  quantity INTEGER NOT NULL,  price_at_time NUMERIC NOT NULL,  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now() );`

#### 6. community_posts

`CREATE TABLE public.community_posts (   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),  user_id UUID NOT NULL REFERENCES profiles(id),  title TEXT NOT NULL,  content TEXT NOT NULL,  category TEXT NOT NULL,  likes_count INTEGER DEFAULT 0,  comments_count INTEGER DEFAULT 0,  is_pinned BOOLEAN DEFAULT false,  is_featured BOOLEAN DEFAULT false,  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() );`

#### 7. post_comments

`CREATE TABLE public.post_comments (   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),  post_id UUID NOT NULL REFERENCES community_posts(id) ON DELETE CASCADE,  user_id UUID NOT NULL REFERENCES profiles(id),  content TEXT NOT NULL,  likes_count INTEGER DEFAULT 0,  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() );`

#### 8. post_likes

`CREATE TABLE public.post_likes (   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),  post_id UUID NOT NULL REFERENCES community_posts(id) ON DELETE CASCADE,  user_id UUID NOT NULL REFERENCES profiles(id),  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),  UNIQUE(post_id, user_id) );`

#### 9. comment_likes

`CREATE TABLE public.comment_likes (   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),  comment_id UUID NOT NULL REFERENCES post_comments(id) ON DELETE CASCADE,  user_id UUID NOT NULL REFERENCES profiles(id),  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),  UNIQUE(comment_id, user_id) );`

#### 10. notes

`CREATE TABLE public.notes (   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),  user_id UUID NOT NULL REFERENCES profiles(id),  title TEXT NOT NULL,  content TEXT,  tags TEXT[] DEFAULT '{}',  links TEXT[] DEFAULT '{}',  is_pinned BOOLEAN DEFAULT false,  is_archived BOOLEAN DEFAULT false,  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now() );`

#### 11. models

`CREATE TABLE public.models (   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),  name TEXT NOT NULL,  url TEXT,  thumbnail_url TEXT,  model_type MODEL_TYPE NOT NULL,  params JSONB DEFAULT '{}',  is_active BOOLEAN DEFAULT false,  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now() ); -- Tipo enumerado para modelo CREATE TYPE MODEL_TYPE AS ENUM ('crystal', 'nft', 'environment', 'character', 'prop');`

#### 12. bookings

`CREATE TABLE public.bookings (   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),  user_id UUID REFERENCES profiles(id),  booking_type TEXT NOT NULL,  resource_id UUID,  resource_type TEXT,  start_time TIMESTAMP WITH TIME ZONE NOT NULL,  end_time TIMESTAMP WITH TIME ZONE NOT NULL,  price NUMERIC NOT NULL,  status TEXT NOT NULL DEFAULT 'pending',  customer_name TEXT,  customer_email TEXT,  customer_phone TEXT,  location TEXT,  details TEXT,  notes TEXT,  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() );`

#### 13. availability

`CREATE TABLE public.availability (   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),  resource_id UUID NOT NULL,  resource_type TEXT NOT NULL,  start_time TIMESTAMP WITH TIME ZONE NOT NULL,  end_time TIMESTAMP WITH TIME ZONE NOT NULL,  is_available BOOLEAN DEFAULT true,  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() );`

#### 14. demo_submissions

`CREATE TABLE public.demo_submissions (   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),  artist_name TEXT NOT NULL,  email TEXT NOT NULL,  file_path TEXT NOT NULL,  genre TEXT,  biography TEXT,  social_links TEXT,  status TEXT NOT NULL DEFAULT 'pending',  reviewed_by UUID REFERENCES profiles(id),  reviewed_at TIMESTAMP WITH TIME ZONE,  reviewer_notes TEXT,  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now() );`

#### 15. live_streams

`CREATE TABLE public.live_streams (   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),  title TEXT NOT NULL,  description TEXT,  streamer_id UUID NOT NULL REFERENCES profiles(id),  scheduled_start TIMESTAMP WITH TIME ZONE NOT NULL,  actual_start TIMESTAMP WITH TIME ZONE,  actual_end TIMESTAMP WITH TIME ZONE,  status TEXT NOT NULL DEFAULT 'scheduled',  stream_url TEXT,  thumbnail_url TEXT,  viewers_count INTEGER DEFAULT 0,  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() );`

#### 16. stream_chat_messages

`CREATE TABLE public.stream_chat_messages (   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),  stream_id UUID NOT NULL REFERENCES live_streams(id) ON DELETE CASCADE,  user_id UUID NOT NULL REFERENCES profiles(id),  message TEXT NOT NULL,  is_pinned BOOLEAN DEFAULT false,  is_highlighted BOOLEAN DEFAULT false,  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() );`

#### 17. press_contacts

`CREATE TABLE public.press_contacts (   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),  name TEXT NOT NULL,  email TEXT NOT NULL,  outlet TEXT,  role PRESS_ROLE,  verified BOOLEAN NOT NULL DEFAULT false,  date_requested TIMESTAMP WITH TIME ZONE NOT NULL,  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now() ); -- Tipo enumerado para papel na imprensa CREATE TYPE PRESS_ROLE AS ENUM ('journalist', 'blogger', 'influencer', 'media', 'other');`

#### 18. wallets

`CREATE TABLE public.wallets (   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),  user_id UUID NOT NULL REFERENCES profiles(id) UNIQUE,  balance NUMERIC NOT NULL DEFAULT 0,  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() );`

#### 19. transactions

`CREATE TABLE public.transactions (   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),  wallet_id UUID NOT NULL REFERENCES wallets(id),  amount NUMERIC NOT NULL,  transaction_type TEXT NOT NULL,  reference_id UUID,  reference_type TEXT,  description TEXT,  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() );`

#### 20. airdrops

`CREATE TABLE public.airdrops (   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),  title TEXT NOT NULL,  description TEXT,  token_type TEXT NOT NULL,  token_amount NUMERIC NOT NULL,  start_date TIMESTAMP WITH TIME ZONE NOT NULL,  end_date TIMESTAMP WITH TIME ZONE NOT NULL,  eligibility_criteria JSONB,  created_by UUID NOT NULL REFERENCES profiles(id),  is_active BOOLEAN DEFAULT true,  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() );`

#### 21. airdrop_claims

`CREATE TABLE public.airdrop_claims (   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),  airdrop_id UUID NOT NULL REFERENCES airdrops(id),  user_id UUID NOT NULL REFERENCES profiles(id),  wallet_address TEXT,  claimed_amount NUMERIC NOT NULL,  status TEXT NOT NULL DEFAULT 'pending',  transaction_hash TEXT,  claimed_at TIMESTAMP WITH TIME ZONE DEFAULT now() );`

#### 22. community_events

`CREATE TABLE public.community_events (   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),  title TEXT NOT NULL,  description TEXT NOT NULL,  location TEXT,  start_date TIMESTAMP WITH TIME ZONE NOT NULL,  end_date TIMESTAMP WITH TIME ZONE NOT NULL,  image_url TEXT,  is_online BOOLEAN DEFAULT false,  event_url TEXT,  organizer_id UUID NOT NULL REFERENCES profiles(id),  is_featured BOOLEAN DEFAULT false,  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() );`

#### 23. giveaways

`CREATE TABLE public.giveaways (   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),  title TEXT NOT NULL,  description TEXT NOT NULL,  prize TEXT NOT NULL,  image_url TEXT,  start_date TIMESTAMP WITH TIME ZONE NOT NULL,  end_date TIMESTAMP WITH TIME ZONE NOT NULL,  winner_count INTEGER NOT NULL DEFAULT 1,  creator_id UUID NOT NULL REFERENCES profiles(id),  is_active BOOLEAN DEFAULT true,  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() );`

#### 24. giveaway_entries

`CREATE TABLE public.giveaway_entries (   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),  giveaway_id UUID NOT NULL REFERENCES giveaways(id),  user_id UUID NOT NULL REFERENCES profiles(id),  is_winner BOOLEAN DEFAULT false,  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),  UNIQUE(giveaway_id, user_id) );`

#### 25. creative_boards

`CREATE TABLE public.creative_boards (   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),  user_id UUID NOT NULL REFERENCES profiles(id),  title TEXT NOT NULL,  description TEXT,  is_template BOOLEAN DEFAULT false,  is_public BOOLEAN DEFAULT false,  content JSONB DEFAULT '{}',  last_edited TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now() );`

#### 26. board_elements

`CREATE TABLE public.board_elements (   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),  board_id UUID NOT NULL REFERENCES creative_boards(id) ON DELETE CASCADE,  element_type TEXT NOT NULL,  position JSONB NOT NULL,  content JSONB,  style JSONB,  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now() );`

#### 27. automation_flows

`CREATE TABLE public.automation_flows (   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),  user_id UUID NOT NULL REFERENCES profiles(id),  board_id UUID REFERENCES creative_boards(id),  title TEXT NOT NULL,  description TEXT,  is_active BOOLEAN DEFAULT true,  nodes JSONB DEFAULT '[]',  connections JSONB DEFAULT '[]',  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now() );`

#### 28. integration_configs

`CREATE TABLE public.integration_configs (   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),  user_id UUID NOT NULL REFERENCES profiles(id),  service_name TEXT NOT NULL,  config JSONB NOT NULL,  is_active BOOLEAN DEFAULT true,  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),  UNIQUE(user_id, service_name) );`

#### 29. system_logs

`CREATE TABLE public.system_logs (   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),  level TEXT NOT NULL,  message TEXT NOT NULL,  metadata JSONB DEFAULT '{}',  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now() );`

#### 30. system_config

`CREATE TABLE public.system_config (   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),  key TEXT NOT NULL UNIQUE,  value JSONB NOT NULL,  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now() );`

#### 31. system_tasks

`CREATE TABLE public.system_tasks (   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),  type TEXT NOT NULL,  status TEXT NOT NULL DEFAULT 'pending',  data JSONB DEFAULT '{}',  result JSONB,  error TEXT,  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now() );`

#### 32. system_metrics

`CREATE TABLE public.system_metrics (   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),  metric_type TEXT NOT NULL,  value NUMERIC NOT NULL,  metadata JSONB DEFAULT '{}',  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now() );`

#### 33. nft_collections

`CREATE TABLE public.nft_collections (   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),  creator_id UUID NOT NULL REFERENCES profiles(id),  name TEXT NOT NULL,  description TEXT,  image_url TEXT,  total_supply INTEGER,  blockchain TEXT NOT NULL,  contract_address TEXT,  is_verified BOOLEAN DEFAULT false,  is_featured BOOLEAN DEFAULT false,  metadata JSONB DEFAULT '{}',  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now() );`

#### 34. nft_items

`CREATE TABLE public.nft_items (   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),  collection_id UUID NOT NULL REFERENCES nft_collections(id),  token_id TEXT NOT NULL,  owner_id UUID REFERENCES profiles(id),  name TEXT NOT NULL,  description TEXT,  image_url TEXT,  animation_url TEXT,  external_url TEXT,  attributes JSONB DEFAULT '[]',  metadata JSONB DEFAULT '{}',  price NUMERIC,  is_for_sale BOOLEAN DEFAULT false,  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),  UNIQUE(collection_id, token_id) );`

#### 35. press_materials

`CREATE TABLE public.press_materials (   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),  title TEXT NOT NULL,  description TEXT,  file_path TEXT NOT NULL,  file_type TEXT NOT NULL,  file_size INTEGER NOT NULL,  is_public BOOLEAN DEFAULT true,  created_by UUID NOT NULL REFERENCES profiles(id),  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now() );`

#### 36. press_kit_downloads

`CREATE TABLE public.press_kit_downloads (   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),  material_id UUID NOT NULL REFERENCES press_materials(id),  user_id UUID REFERENCES profiles(id),  email TEXT,  ip_address TEXT,  downloaded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now() );`

### Buckets do Storage

`-- Bucket para avatares de usuário INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'Avatares de Usuário', true); -- Bucket para uploads de demo INSERT INTO storage.buckets (id, name, public) VALUES ('demos', 'Uploads de Demo', false); -- Bucket para imagens da comunidade INSERT INTO storage.buckets (id, name, public) VALUES ('community', 'Conteúdo da Comunidade', true); -- Bucket para imagens de produtos INSERT INTO storage.buckets (id, name, public) VALUES ('products', 'Imagens de Produtos', true); -- Bucket para NFTs INSERT INTO storage.buckets (id, name, public) VALUES ('nfts', 'Arquivos de NFT', true); -- Bucket para materiais de imprensa INSERT INTO storage.buckets (id, name, public) VALUES ('press_kit', 'Materiais para Imprensa', true); -- Bucket para arquivos do CreativeFlow Board INSERT INTO storage.buckets (id, name, public) VALUES ('creativeflow', 'Arquivos do CreativeFlow', false); -- Bucket para arquivos temporários INSERT INTO storage.buckets (id, name, public) VALUES ('temp', 'Arquivos Temporários', false);`

### Edge Functions

1. **blockchain-integration**
    
    - Integração com operações de blockchain
    - Verificação de transações
    - Mint de NFTs
    - Verificação de propriedade
2. **demo-processor**
    
    - Processamento de uploads de demos
    - Geração de waveforms
    - Extração de metadados
3. **payment-webhook**
    
    - Processamento de webhooks de pagamento
    - Confirmação de transações
    - Atualização de status de pedidos
4. **sketchfab-fetch**
    
    - Integração com a API do Sketchfab
    - Busca de modelos 3D
    - Download e processamento de modelos
5. **user-notifications**
    
    - Sistema de notificações
    - Envio de emails, SMS, notificações push
    - Agendamento de notificações

Esta estrutura completa representa todos os componentes necessários para a plataforma JESTFLY, incluindo frontend, backend, banco de dados e integrações externas. A organização modular permite um desenvolvimento escalável e manutenível, com cada módulo focado em uma área específica de funcionalidade.