import { CartItem } from "@/pages/DetailPage";
import { Restaurant } from "@/types";
import { CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { CircleMinus, CirclePlus, Trash } from "lucide-react";

type Props = {
    restaurant: Restaurant;
    cartItems: CartItem[];
    removeFromCart: (cartItem: CartItem) => void;
    decrementQuantity: (item: String)=>void;
    incrementQuantity: (item: String)=>void;
};

const OrderSummary = ({ restaurant, cartItems, removeFromCart, incrementQuantity,decrementQuantity }: Props) => {
  const getTotalCost = () => {
    const totalInPence = cartItems.reduce(
      (total, cartItem) => total + cartItem.price * cartItem.quantity,
      0
    );
    const totalWithDelivery = totalInPence + restaurant.deliveryPrice;

    return (totalWithDelivery / 100).toFixed(2);
  };

  return (
    <>
      <CardHeader>
        <CardTitle className="text-2xl font-bold tracking-tight flex justify-between">
          <span>Your Order</span>
          <span>£{getTotalCost()}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        {cartItems.map((item, index) => (
          <div className="flex justify-between" key={index}>
            <span>
              <Badge variant="outline" className="mr-2">
                {item.quantity}
              </Badge>
              {item.name}
              <span>
                <Badge variant="outline" className="mr-2 ml-2">
                  <CircleMinus size={18} onClick={()=>decrementQuantity(item._id)}/>
                </Badge>
              </span>
              <span>
                <Badge variant="outline" className="mr-2 ml-2">
                  <CirclePlus size={18} onClick={()=>incrementQuantity(item._id)}/>
                </Badge>
              </span>
            </span>
            <span className="flex items-center gap-1">
              <Trash
                className="cursor-pointer"
                color="red"
                size={20}
                onClick={() => removeFromCart(item)}
              />
              £{((item.price * item.quantity) / 100).toFixed(2)}
            </span>
          </div>
        ))}
        <Separator />
        <div className="flex justify-between">
          <span>Delivery</span>
          <span>£{(restaurant.deliveryPrice / 100).toFixed(2)}</span>
        </div>
        <Separator />
      </CardContent>
    </>
  );
};

export default OrderSummary;