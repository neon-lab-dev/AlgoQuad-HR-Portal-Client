
export type THelpDesk = {
  _id: string;
  imageUrl?: string;
  userId:{
    name: string;
    email: string;
    phoneNumber: string;
  };
  userCustomId: string;
  name: string;
  email: string;
  phoneNumber: string;
  message: string;
  status: "pending" | "resolved";
  createdAt?: Date;
  updatedAt?: Date;
};
