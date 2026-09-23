"use client";

import { ShoppingCart } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useCartStore } from "@/app/store/cart-store";

interface Props {
  listingId: string;
}

export default function AddToCartButton({ listingId }: Props) {
  const addItem = useCartStore((s) => s.addItem);

  const handleClick = async () => {
    await addItem(listingId, 1);

    toast.success("Added to cart");
  };

  return (
    <Button onClick={handleClick}>
      <ShoppingCart className="mr-2 h-4 w-4" />
      Add to Cart
    </Button>
  );
}
