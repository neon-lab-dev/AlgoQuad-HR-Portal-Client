export type TProductOrderItem = {
  productId: string;
  quantity: number;
  price: number;
};

export type TProductOrder = {
  _id: string;
  orderId: string;
  userId: {
    _id: string;
    name: string;
    email: string;
    phoneNumber:string;
  };
  userCustomId: string;
  orderedItems: TProductOrderItem[];
  totalAmount: number;
  status: "pending" | "shipped" | "cancelled";
  razorpayOrderId?: string;
  createdAt?: Date;
  updatedAt?: Date;
};
