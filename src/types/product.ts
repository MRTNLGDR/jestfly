
export enum ProductType {
  NFT = 'nft',
  MUSIC = 'music',
  MERCH = 'merch',
  COLLECTIBLE = 'collectible'
}

export interface Product {
  id: string;
  name: string;
  title?: string; // For backward compatibility
  description: string;
  price: number;
  image: string;
  image_url?: string; // For backward compatibility
  type: ProductType;
  stock: number;
  category?: string;
  artist?: string;
  releaseDate?: string;
  createdAt: string;
  updatedAt?: string;
  metadata?: any;
}

// Helper function to transform backend data to our Product type
export const mapDbProductToProduct = (dbProduct: any): Product => {
  return {
    id: dbProduct.id,
    name: dbProduct.title,
    title: dbProduct.title,
    description: dbProduct.description,
    price: dbProduct.price,
    image: dbProduct.image_url,
    image_url: dbProduct.image_url,
    type: dbProduct.type as ProductType,
    stock: dbProduct.stock,
    createdAt: dbProduct.created_at,
    updatedAt: dbProduct.updated_at,
    metadata: dbProduct.metadata,
    // Extract these from metadata if available
    category: dbProduct.metadata?.category,
    artist: dbProduct.metadata?.artist,
    releaseDate: dbProduct.metadata?.releaseDate,
  };
};
