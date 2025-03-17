
import { UISchemaItem } from '../types';

export const collectCards = (items: UISchemaItem[]): void => {
  items.push({
    name: "Card Padrão",
    type: "component",
    value: `<Card>
  <CardHeader>
    <CardTitle>Título do Card</CardTitle>
    <CardDescription>Descrição do card</CardDescription>
  </CardHeader>
  <CardContent>
    Conteúdo do card
  </CardContent>
  <CardFooter>
    Footer do card
  </CardFooter>
</Card>`,
    component: "Card"
  });
  
  items.push({
    name: "Glass Card",
    type: "component",
    value: `<Card className="glass-card">
  <CardContent>
    Card com efeito de vidro
  </CardContent>
</Card>`,
    component: "Card",
    className: "glass-card"
  });
  
  items.push({
    name: "Neo Blur Card",
    type: "component",
    value: `<Card className="neo-blur rounded-xl">
  <CardContent>
    Card com efeito neo-blur
  </CardContent>
</Card>`,
    component: "Card",
    className: "neo-blur"
  });
  
  items.push({
    name: "Hover Scale Card",
    type: "component",
    value: `<Card className="hover-scale">
  <CardContent>
    Card com escala no hover
  </CardContent>
</Card>`,
    component: "Card",
    className: "hover-scale"
  });
};
