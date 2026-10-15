/* eslint-disable @typescript-eslint/no-explicit-any */
export type TProduct = {
  _id: string;
  productId: string;
  imageUrls: string[];
  name: string;
  description: string;
  clothDetails?: string;
  productStory?: string;
  category: string;
  madeIn?: string;
  colors: {
    colorName: string;
    sizes: {
      size: string;
      quantity: number;
      basePrice: number;
      discountedPrice: number;
    }[];
  }[];
  file?:any;
  createdAt?: Date;
  updatedAt?: Date;
};
