export type BusinessSettingsGeneral = {
  site_name: string;
  site_url: string;
  currency: string;
  currency_symbol: string;
};

export type BusinessSettingsOrder = {
  cod_enabled: boolean;
  online_payment_enabled: boolean;
  min_order_amount: number;
  delivery_charge: number;
  /** When false, ignore hours and always allow orders */
  store_hours_enabled: boolean;
  /** "HH:mm" 24h, e.g. "09:00" */
  open_time: string;
  /** "HH:mm" 24h, e.g. "22:00" */
  close_time: string;
  /** IANA timezone used to evaluate open/close */
  timezone: string;
};

export type PhoneOtpMode = "off" | "test" | "test_local" | "production";

export type PhoneVerificationFlow = "registration" | "checkout" | "profile_update";

export type BusinessSettingsPhoneVerification = {
  mode: PhoneOtpMode;
  required_for: {
    registration: boolean;
    checkout: boolean;
    profile_update: boolean;
  };
};

export type BusinessSettingsPayment = {
  razorpay_enabled: boolean;
};

export type BusinessSettingsSupport = {
  email: string;
  phone: string;
};

export type BusinessSettingsSocial = {
  instagram: string;
  twitter: string;
};

export type BusinessSettingsAuth = {
  email_login_register: boolean;
  google_login_register: boolean;
  phone_login_register: boolean;
};

export type BusinessSettings = {
  general: BusinessSettingsGeneral;
  order: BusinessSettingsOrder;
  phone_verification: BusinessSettingsPhoneVerification;
  auth: BusinessSettingsAuth;
  payment: BusinessSettingsPayment;
  support: BusinessSettingsSupport;
  social: BusinessSettingsSocial;
};

export const DEFAULT_BUSINESS_SETTINGS: BusinessSettings = {
  general: {
    site_name: "Yum",
    site_url: "https://yum-web.vercel.app",
    currency: "INR",
    currency_symbol: "₹",
  },
  order: {
    cod_enabled: true,
    online_payment_enabled: true,
    min_order_amount: 100,
    delivery_charge: 40,
    store_hours_enabled: true,
    open_time: "09:00",
    close_time: "22:00",
    timezone: "Asia/Kolkata",
  },
  phone_verification: {
    mode: "test",
    required_for: {
      registration: true,
      checkout: false,
      profile_update: false,
    },
  },
  auth: {
    email_login_register: true,
    google_login_register: true,
    phone_login_register: true,
  },
  payment: {
    razorpay_enabled: true,
  },
  support: {
    email: "support@yum.com",
    phone: "9876543210",
  },
  social: {
    instagram: "",
    twitter: "",
  },
};
