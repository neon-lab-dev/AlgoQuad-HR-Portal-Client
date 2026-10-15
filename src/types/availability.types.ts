
export type TAvailability = {
  _id: string;
  date: Date;
  slot?: string;
  isBooked: boolean;
  isAvailable?: boolean;
  user?: string;
  createdAt?: Date;
  updatedAt?: Date;
};
