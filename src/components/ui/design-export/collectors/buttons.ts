
import { UISchemaItem } from '../types';

export const collectButtons = (items: UISchemaItem[]): void => {
  items.push({
    name: "Botão Padrão",
    type: "component",
    value: `<Button>
  Botão Padrão
</Button>`,
    component: "Button",
    className: "bg-primary text-primary-foreground hover:bg-primary/90"
  });
  
  items.push({
    name: "Botão Outline",
    type: "component",
    value: `<Button variant="outline">
  Botão Outline
</Button>`,
    component: "Button",
    className: "border border-input bg-background hover:bg-accent hover:text-accent-foreground"
  });
  
  items.push({
    name: "Botão Secundário",
    type: "component",
    value: `<Button variant="secondary">
  Botão Secundário
</Button>`,
    component: "Button",
    className: "bg-secondary text-secondary-foreground hover:bg-secondary/80"
  });
  
  items.push({
    name: "Botão Ghost",
    type: "component",
    value: `<Button variant="ghost">
  Botão Ghost
</Button>`,
    component: "Button",
    className: "hover:bg-accent hover:text-accent-foreground"
  });
  
  items.push({
    name: "Botão Link",
    type: "component",
    value: `<Button variant="link">
  Botão Link
</Button>`,
    component: "Button",
    className: "text-primary underline-offset-4 hover:underline"
  });
  
  items.push({
    name: "Botão Destructive",
    type: "component",
    value: `<Button variant="destructive">
  Botão Destructive
</Button>`,
    component: "Button",
    className: "bg-destructive text-destructive-foreground hover:bg-destructive/90"
  });
  
  // Tamanhos de botão
  items.push({
    name: "Botão Pequeno",
    type: "component",
    value: `<Button size="sm">
  Botão Pequeno
</Button>`,
    component: "Button",
    className: "h-9 rounded-md px-3"
  });
  
  items.push({
    name: "Botão Grande",
    type: "component",
    value: `<Button size="lg">
  Botão Grande
</Button>`,
    component: "Button",
    className: "h-11 rounded-md px-8"
  });
  
  items.push({
    name: "Botão Ícone",
    type: "component",
    value: `<Button size="icon">
  <IconName />
</Button>`,
    component: "Button",
    className: "h-10 w-10"
  });
};
