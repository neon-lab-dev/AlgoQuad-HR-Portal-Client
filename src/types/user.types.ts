export type TUser = {
  _id: string;
  userId: string;
  name: string;
  email: string;
  phoneNumber:string;
  role: "hr" | "user" | "moderator";
  avatar: string;
};

export type TAuthState = {
  token: string | null;
  user: string | null;
  _persist?: {
    version: number;
    rehydrated: boolean;
  };
};
