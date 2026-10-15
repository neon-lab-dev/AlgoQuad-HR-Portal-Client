type TCourseOrderItem = {
  _id: string;
  courseId: string;
  courseTitle: string;
  coursePrice: number;
};
export interface TCourseOrder {
  _id: string;
  orderId: string;
  userId: string;
  userCustomId: string;
  name: string;
  email: string;
  phoneNumber: string;
  courses: TCourseOrderItem[];
  totalAmount: number;
  razorpayOrderId?: string;
  orderType? : "single" | "bundle";
  createdAt?: Date;
  updatedAt?: Date;
}

