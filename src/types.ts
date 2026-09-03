export type UserType = {
  uid: string;
  email: string;
  role: "admin" | "user";
};

export type ManagementState = {
  holidayMode: boolean;
  springMode: boolean;
  loveRainMode: boolean;
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
