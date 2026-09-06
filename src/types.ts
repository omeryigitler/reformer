export type UserRole = "admin" | "instructor" | "member";

export type UserType = {
  uid: string;
  email: string;
  role: UserRole;
  displayName?: string;
  phone?: string;
  registeredAt?: string;
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
