import { PropsWithChildren, createContext, useContext, useState } from "react";
import { CartItem } from "../types";
import { randomUUID } from "expo-crypto";
import { Tables } from "../database.types";
import { useInsertOrder } from "../api/orders";
import { useRouter } from "expo-router";
import { useInsertOrderItems } from "../api/order-items";

type Product = Tables<"products">;

type CartType = {
  items: CartItem[];
  addItem: (product: Product, size: CartItem["size"]) => void;
  updateQuantity: (itemId: string, amount: -1 | 1) => void;
  total: number;
  checkout: () => void;
};

const CartContext = createContext<CartType>({
  items: [],
  addItem: () => {},
  updateQuantity: () => {},
  total: 0,
  checkout: () => {},
});

const CartProvider = ({ children }: PropsWithChildren) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const { mutate: insertOrder } = useInsertOrder();
  const { mutate: insertOrderItems } = useInsertOrderItems();

  const router = useRouter();

  const addItem = (product: Product, size: CartItem["size"]) => {
    // if already in cart, increment 'quantity'
    const existingItem = items.find(
      (item) => item.product === product && item.size === size
    );

    if (existingItem) {
      updateQuantity(existingItem.id, 1);
      return;
    }

    // console.log(product);
    const newCartItem: CartItem = {
      id: randomUUID(), // this should be generated, not hardcoded
      product,
      product_id: product.id,
      size,
      quantity: 1,
    };

    setItems([newCartItem, ...items]);
  };

  // updateQuantity function
  const updateQuantity = (itemId: string, amount: -1 | 1) => {
    // console.log(itemId, amount);
    setItems(
      items
        .map((item) =>
          item.id !== itemId
            ? item
            : { ...item, quantity: item.quantity + amount }
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const total = items.reduce(
    (sum, item) => (sum += item.product.price * item.quantity),
    0
  );

  const clearCart = () => {
    setItems([]);
  };

  const checkout = () => {
    // console.warn("Checkout");
    insertOrder(
      { total },
      {
        onSuccess: saveOrderItems,
      }
    );
  };

  const saveOrderItems = (order: Tables<"orders">) => {
    // const item1 = items[0];

    const orderItems = items.map((cartItem) => ({
      order_id: order.id,
      product_id: cartItem.product_id,
      quantity: cartItem.quantity,
      size: cartItem.size,
    }));

    insertOrderItems(
      orderItems,

      // {
      //   order_id: order.id,
      //   product_id: item1.product_id,
      //   quantity: item1.quantity,
      //   size: item1.size,
      // },
      {
        onSuccess() {
          // console.log(data);
          clearCart();
          router.push(`/(user)/orders/${order.id}`);
        },
      }
    );
    // save order items logic goes here
  };

  // console.log(items);

  return (
    <CartContext.Provider
      value={{ items: items, addItem, updateQuantity, total, checkout }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;

export const useCart = () => useContext(CartContext);
