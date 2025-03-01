
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
  PanelLeft
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
    <Sidebar className="border-r border-white/10 backdrop-blur-xl">
      <SidebarHeader className="p-4 flex justify-between items-center">
        <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
          JESTFLY Admin
        </h2>
        <SidebarTrigger>
          <PanelLeft className="h-5 w-5" />
        </SidebarTrigger>
      </SidebarHeader>
      
      <SidebarContent className="px-3">
        <div className="py-2">
          <div className="text-xs font-semibold text-gray-400 py-2">
            Navegação
          </div>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link to="/" className="flex items-center gap-3">
                  <Home className="h-5 w-5" />
                  <span>Página Inicial</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link to="/admin" className="flex items-center gap-3">
                  <Settings className="h-5 w-5" />
                  <span>Painel de Controle</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </div>
        
        <div className="py-2 mt-4">
          <div className="text-xs font-semibold text-gray-400 py-2">
            Gerenciamento
          </div>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton className="flex items-center gap-3">
                <Layers className="h-5 w-5" />
                <span>Modelos 3D</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            
            <SidebarMenuItem>
              <SidebarMenuButton className="flex items-center gap-3">
                <SunMoon className="h-5 w-5" />
                <span>Iluminação</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            
            <SidebarMenuItem>
              <SidebarMenuButton className="flex items-center gap-3">
                <FileImage className="h-5 w-5" />
                <span>Texturas</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            
            <SidebarMenuItem>
              <SidebarMenuButton className="flex items-center gap-3">
                <Upload className="h-5 w-5" />
                <span>Uploads</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            
            <SidebarMenuItem>
              <SidebarMenuButton className="flex items-center gap-3">
                <Save className="h-5 w-5" />
                <span>Presets Salvos</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            
            <SidebarMenuItem>
              <SidebarMenuButton className="flex items-center gap-3">
                <Eye className="h-5 w-5" />
                <span>Visualizar</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </div>
      </SidebarContent>
      
      <SidebarFooter className="p-4 text-center text-xs text-gray-400">
        JESTFLY © {new Date().getFullYear()}
      </SidebarFooter>
    </Sidebar>
  );
};

export default AdminSidebar;
