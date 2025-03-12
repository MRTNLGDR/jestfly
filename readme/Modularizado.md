# Estrutura de Módulos do Projeto JestFly

## Módulo 1: Público
- **Diretório:** `/public`
- **Descrição:** Contém arquivos estáticos públicos, como texturas, imagens e favicon.

## Módulo 2: Componentes Reutilizáveis
- **Diretório:** `/src/components`
- **Descrição:** Contém componentes React reutilizáveis divididos em submódulos conforme sua funcionalidade.

### Submódulos:
- **Admin:** Componentes do painel administrativo.
- **Airdrop:** Componentes do sistema de Airdrop.
- **Auth:** Componentes de autenticação.
- **Bookings:** Componentes do sistema de reservas.
- **Community:** Componentes da comunidade.
- **CreativeFlow:** Sistema CreativeFlow Board.
- **Demos:** Submissão de demos musicais.
- **FileUploader:** Sistema de upload de arquivos.
- **JestCoin:** Sistema de moeda interna JestCoin.
- **Livestream:** Sistema de transmissão ao vivo.
- **NFT:** Sistema de NFTs.
- **PressKit:** Sistema de Press Kit.
- **Profile:** Componentes de perfil.
- **Store:** Componentes da loja.
- **UI:** Componentes de UI genéricos.

## Módulo 3: Páginas
- **Diretório:** `/src/pages`
- **Descrição:** Contém as páginas principais da aplicação, cada uma representando uma rota distinta.

## Módulo 4: Contextos
- **Diretório:** `/src/contexts`
- **Descrição:** Contém contextos React para gerenciar estados globais.

## Módulo 5: Hooks
- **Diretório:** `/src/hooks`
- **Descrição:** Contém hooks customizados divididos em submódulos conforme sua funcionalidade.

### Submódulos:
- **Admin:** Hooks do painel administrativo.
- **Airdrop:** Hooks para sistema de airdrop.
- **Auth:** Hooks de autenticação.
- **Bookings:** Hooks de reservas.
- **Community:** Hooks da comunidade.
- **CreativeFlow:** Hooks para o CreativeFlow Board.
- **Demos:** Hooks para submissão de demos.
- **JestCoin:** Hooks para JestCoin.
- **Livestream:** Hooks para transmissão ao vivo.
- **NFT:** Hooks para NFTs.
- **Profile:** Hooks para perfil.
- **Store:** Hooks para loja.
- **Outros:** Hooks genéricos e utilitários.

## Módulo 6: Integrações
- **Diretório:** `/src/integrations`
- **Descrição:** Contém integrações com serviços e APIs externas.

### Submódulos:
- **Payment:** Integração com pagamentos (Stripe, PayPal).
- **Blockchain:** Integração com blockchain (Ethers.js, NFTs, Carteira).
- **Social:** Integração com redes sociais (Instagram, Twitter, Discord).
- **Google:** Integração com serviços Google (Calendar, Drive, Sheets).
- **Streaming:** Integração com plataformas de streaming (Spotify, Apple Music, SoundCloud).
- **Communication:** Integração com comunicação (Email, SMS, Push).
- **Supabase:** Integração com Supabase.

## Módulo 7: Serviços
- **Diretório:** `/src/services`
- **Descrição:** Contém serviços para comunicação com APIs.

### Submódulos:
- **Admin:** Serviços administrativos.
- **Airdrop:** Serviços de airdrop.
- **Auth:** Serviços de autenticação.
- **Bookings:** Serviços de reservas.
- **Community:** Serviços da comunidade.
- **CreativeFlow:** Serviços do CreativeFlow Board.
- **Demo:** Serviços de demos.
- **JestCoin:** Serviços da JestCoin.
- **Livestream:** Serviços de transmissão ao vivo.
- **NFT:** Serviços de NFT.
- **PressKit:** Serviços de press kit.
- **Profile:** Serviços de perfil.
- **Store:** Serviços da loja.

## Módulo 8: Estilos
- **Diretório:** `/src/styles`
- **Descrição:** Contém estilos e temas da aplicação.

## Módulo 9: Tipos
- **Diretório:** `/src/types`
- **Descrição:** Definições de tipos TypeScript.

## Módulo 10: Utilitários
- **Diretório:** `/src/utils`
- **Descrição:** Funções utilitárias.

## Módulo 11: Configurações Supabase
- **Diretório:** `/supabase`
- **Descrição:** Configurações do Supabase, incluindo Edge Functions e migrações SQL.

## Módulo 12: Raiz do Projeto
- **Diretório:** `/`
- **Descrição:** Arquivos de configuração e documentação do projeto.