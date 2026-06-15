export type RazorpayCheckoutResponse = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};

export type RazorpayCreateOrderData = {
  keyId: string;
  orderId: string;
  amount: number;
  currency: string;
};

export type RazorpayCheckoutPrefill = {
  name: string;
  email?: string;
  contact: string;
};

export type OpenRazorpayCheckoutParams = {
  keyId: string;
  orderId: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  prefill: RazorpayCheckoutPrefill;
};

export type OnlinePaymentFlowResult = {
  status: "processing";
  orderId: string;
  redirectTo: string;
};
