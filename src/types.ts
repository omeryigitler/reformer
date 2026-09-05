export type UserType = {
  uid: string;
  email: string;
  role: "admin" | "user";
};

export type AuthRequest = "login" | "register" | null;

export type ManagementState = {
  contactInfo: {
    phone: string;
    email: string;
    address: string;
  };
  socialLinks: {
    instagram: string;
    facebook: string;
  };
};
