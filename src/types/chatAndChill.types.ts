
export type TChatAndChill = {
  _id: string;
  user: string;
  userCustomId?: string;
  name: string;
  email : string;
  phoneNumber: string;
  topicsToDiscuss?:string;
  bookingDate: Date;
  title?: string;
  amount?: number;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  status: "pending" | "booked" | "scheduled" | "cancelled" | "completed";
  meetingLink? :string;
  createdAt?: Date;
  updatedAt?: Date;
};