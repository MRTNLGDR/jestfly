
import { supabase } from '@/integrations/supabase/client';
import { CartItem } from '@/contexts/CartContext';

export const createOrder = async (userId: string, cartItems: CartItem[], cartTotal: number) => {
  // Create the order
  const { data: orderData, error: orderError } = await supabase
    .from('orders')
    .insert({
      user_id: userId,
      status: 'pending',
      total: cartTotal
    })
    .select()
    .single();
  
  if (orderError) {
    throw orderError;
  }
  
  // Add order items
  for (const item of cartItems) {
    const { error: itemError } = await supabase
      .from('order_items')
      .insert({
        order_id: orderData.id,
        product_id: item.productId,
        quantity: item.quantity,
        price_at_time: item.price
      });
    
    if (itemError) {
      throw itemError;
    }
  }
  
  // Update order status
  const { error: updateError } = await supabase
    .from('orders')
    .update({ status: 'completed' })
    .eq('id', orderData.id);
  
  if (updateError) {
    throw updateError;
  }
  
  return orderData;
};
