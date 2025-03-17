
export interface UISchemaItem {
  name: string;
  description?: string;
  type: string;
  value: string;
  usage?: string;
  className?: string;
  component?: string;
  cssProperties?: Record<string, string>;
  example?: string;
}

export interface UISchemaSection {
  title: string;
  description: string;
  items: UISchemaItem[];
}

export type UISchemaData = Record<string, UISchemaSection>;
