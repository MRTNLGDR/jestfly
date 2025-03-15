
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Settings, 
  Upload, 
  Save, 
  Layers, 
  Eye, 
  FileImage, 
  SunMoon, 
  Home,
  PanelLeft,
  Diamond
} from 'lucide-react';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarFooter, 
  SidebarHeader,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton
} from '../ui/sidebar';

const AdminSidebar = () => {
  return (
    <Sidebar className="neo-blur border-r border-white/10 backdrop-blur-xl">
      <SidebarHeader className="p-4 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2 text-xl font-bold">
          <Diamond className="h-6 w-6 text-purple-400 glow-purple" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
            JESTFLY
          </span>
        </Link>
        <SidebarTrigger>
          <PanelLeft className="h-5 w-5" />
        </SidebarTrigger>
      </SidebarHeader>
      
      <SidebarContent className="px-3">
        <div className="py-2">
          <div className="text-xs font-semibold text-white/50 py-2 uppercase tracking-wider">
            Navegação
          </div>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link to="/" className="flex items-center gap-3 text-white/80 hover:text-white">
                  <Home className="h-5 w-5" />
                  <span>Página Inicial</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link to="/admin" className="flex items-center gap-3 text-white hover:text-purple-400">
                  <Settings className="h-5 w-5" />
                  <span>Painel de Controle</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </div>
        
        <div className="py-2 mt-4">
          <div className="text-xs font-semibold text-white/50 py-2 uppercase tracking-wider">
            Gerenciamento
          </div>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton className="flex items-center gap-3 text-white/80 hover:text-white">
                <Layers className="h-5 w-5" />
                <span>Modelos 3D</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            
            <SidebarMenuItem>
              <SidebarMenuButton className="flex items-center gap-3 text-white/80 hover:text-white">
                <SunMoon className="h-5 w-5" />
                <span>Iluminação</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            
            <SidebarMenuItem>
              <SidebarMenuButton className="flex items-center gap-3 text-white/80 hover:text-white">
                <FileImage className="h-5 w-5" />
                <span>Texturas</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            
            <SidebarMenuItem>
              <SidebarMenuButton className="flex items-center gap-3 text-white/80 hover:text-white">
                <Upload className="h-5 w-5" />
                <span>Uploads</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            
            <SidebarMenuItem>
              <SidebarMenuButton className="flex items-center gap-3 text-white/80 hover:text-white">
                <Save className="h-5 w-5" />
                <span>Presets Salvos</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            
            <SidebarMenuItem>
              <SidebarMenuButton className="flex items-center gap-3 text-white/80 hover:text-white">
                <Eye className="h-5 w-5" />
                <span>Visualizar</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </div>
      </SidebarContent>
      
      <SidebarFooter className="p-4 text-center border-t border-white/10">
        <p className="text-xs text-white/50">
          JESTFLY © {new Date().getFullYear()}
        </p>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AdminSidebar;
