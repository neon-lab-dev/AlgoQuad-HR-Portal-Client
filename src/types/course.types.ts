export type TCourse = {
  _id: string;
  imageUrl?: string;
  title: string;
  subtitle: string;
  tagline: string;
  duration: string;
  benefits : string[];
  overview : string;
  courseCoverage : {
    title : string;
    description : string;
  }[];
  accessType : "Lifetime" | "Limited";
  accessValidity: Date;
  category: string;
  basePrice: number;
  discountedPrice: number;
  createdAt?: Date;
  updatedAt?: Date;
};

export type TLecture = {
  _id: string;
  title: string;
  description: string;
  videoUrl: string;
  duration: string;
};
