import Loading from "@/Loading";
import { useGetRestaurant } from "@/api/RestaurantApi";
import MenuItem from "@/components/MenuItem";
import RestaurantInfo from "@/components/RestaurantInfo";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card, CardFooter } from "@/components/ui/card";
import { useState } from "react";
import { useParams } from "react-router-dom";
import OrderSummary from "@/components/OrderSummary";
import { MenuItems } from "@/types";
import CheckoutButton from "@/components/CheckoutButton";
import { UserFormData } from "@/forms/user-profile-form/userProfileForm";
import { useCreateCheckoutSession } from "@/api/OrderApi";

export type CartItem = {
  _id: string;
  name: string;
  price: number;
  quantity: number;
};

const DetailPage = () => {
  const { restaurantId } = useParams();
  const { restaurant, isLoading } = useGetRestaurant(restaurantId);
  const { createCheckoutSession, isLoading: isCheckoutLoading } =
    useCreateCheckoutSession();

  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const storedCartItems = sessionStorage.getItem(`cartItems-${restaurantId}`);
    return storedCartItems ? JSON.parse(storedCartItems) : [];
  });

  const addToCart = (menuItem: MenuItems) => {
    setCartItems((prevCartItems) => {
      //1. check if item is already in the cart
      const existingItem = prevCartItems.find(
        (cartItem) => cartItem._id === menuItem._id
      );

      let updatedCartItems;

      if (existingItem) {
        //2. if it is, update the quantity
        updatedCartItems = prevCartItems.map((cartItem) =>
          cartItem._id === menuItem._id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        //3. if it is not, add it to the cart
        updatedCartItems = [...prevCartItems, { ...menuItem, quantity: 1 }];
      }
      sessionStorage.setItem(
        `cartItems-${restaurantId}`,
        JSON.stringify(updatedCartItems)
      );

      return updatedCartItems;
    });
  };

  const removeFromCart = (cartItem: CartItem) => {
    setCartItems((prevCartItems) => {
      const updatedCartItems = prevCartItems.filter(
        (item) => cartItem._id !== item._id
      );
      sessionStorage.setItem(
        `cartItems-${restaurantId}`,
        JSON.stringify(updatedCartItems)
      );
      return updatedCartItems;
    });
  };

  const incrementQuantity = (itemId: String) => {
    setCartItems((prevCartItems) => {
      const updatedCartItems = prevCartItems.map((cartItem) =>
        cartItem._id === itemId
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      );
      sessionStorage.setItem(
        `cartItems-${restaurantId}`,
        JSON.stringify(updatedCartItems)
      );
      return updatedCartItems;
    });
  };
  const decrementQuantity = (itemId: String) => {
    setCartItems((prevCartItems) => {
        const updatedCartItems = prevCartItems.reduce<CartItem[]>((acc, cartItem) => {
          if (cartItem._id === itemId) {
            if (cartItem.quantity > 1) {
              acc.push({ ...cartItem, quantity: cartItem.quantity - 1 });
            } else {
              removeFromCart(cartItem);
            }
          } else {
            acc.push(cartItem);
          }
          return acc;
        }, []);
    
        sessionStorage.setItem(
          `cartItems-${restaurantId}`,
          JSON.stringify(updatedCartItems)
        );
        return updatedCartItems;
      });
  };

  const onCheckout = async (userFormData: UserFormData) => {
    // console.log('userFormData', userFormData);
    if (!restaurant) {
      return;
    }
    const checoutData = {
      cartItems: cartItems.map((cartItem) => ({
        menuItemId: cartItem._id,
        name: cartItem.name,
        quantity: cartItem.quantity.toString(),
      })),
      deliveryDetails: {
        email: userFormData.email as string,
        name: userFormData.name,
        addressLine1: userFormData.addressLine1,
        city: userFormData.city,
        country: userFormData.country,
      },
      restaurantId: restaurant._id,
    };
    const data = await createCheckoutSession(checoutData);
    window.location.href = data.url;
  };

  if (isLoading || !restaurant) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col gap-10">
      <AspectRatio ratio={20 / 5}>
        <img
          src={restaurant?.imageUrl}
          alt={restaurant?.restaurantName}
          className="rounded-md w-full h-full object-cover"
        />
      </AspectRatio>
      <div className="grid md:grid-cols-[4fr_2fr] gap-5 md:px-32">
        <div className="flex flex-col gap-4">
          <RestaurantInfo restaurant={restaurant} />
          <span className="text-2xl font-bold tracking-tight">Menu</span>
          {restaurant?.menuItems.map((menuItem) => (
            <MenuItem
              menuItem={menuItem}
              addToCart={() => addToCart(menuItem)}
            />
          ))}
        </div>
        <div className="flex flex-col gap-4">
          <Card>
            <OrderSummary
              restaurant={restaurant}
              cartItems={cartItems}
              removeFromCart={removeFromCart}
              incrementQuantity={incrementQuantity}
              decrementQuantity={decrementQuantity}
            />
            <CardFooter>
              <CheckoutButton
                disabled={cartItems.length === 0}
                onCheckout={onCheckout}
                isLoading={isCheckoutLoading}
              />
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};
export default DetailPage;
