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

export type BusinessSettings = {
  general: BusinessSettingsGeneral;
  order: BusinessSettingsOrder;
  phone_verification: BusinessSettingsPhoneVerification;
  payment: BusinessSettingsPayment;
  support: BusinessSettingsSupport;
};

export const DEFAULT_BUSINESS_SETTINGS: BusinessSettings = {
  general: {
    site_name: "Yum",
    site_url: "https://yum.com",
    currency: "INR",
    currency_symbol: "₹",
  },
  order: {
    cod_enabled: true,
    online_payment_enabled: true,
    min_order_amount: 100,
    delivery_charge: 40,
  },
  phone_verification: {
    mode: "test",
    required_for: {
      registration: true,
      checkout: false,
      profile_update: false,
    },
  },
  payment: {
    razorpay_enabled: true,
  },
  support: {
    email: "support@yum.com",
    phone: "9876543210",
  },
};
