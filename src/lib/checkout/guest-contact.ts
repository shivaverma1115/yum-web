// import type { CheckoutPayload, FulfillmentType } from "@/types/order";

// function optionalEmail(email?: string | null): string | undefined {
//   const trimmed = email?.trim();
//   return trimmed || undefined;
// }

// /** Fills DB-required contact fields for minimal checkout (e.g. dine-in table only). */
// export function enrichCheckoutContact(
//   payload: CheckoutPayload,
// ): CheckoutPayload {
//   const fulfillment = payload.fulfillment_type;
//   const email = optionalEmail(payload.email);

//   if (fulfillment === "dine_in") {
//     const table = payload.table_number?.trim() ?? "";
//     return {
//       ...payload,
//       first_name: payload.first_name?.trim() || "Guest",
//       last_name: payload.last_name?.trim() || "-",
//       phone: payload.phone?.trim() || "-",
//       email,
//       address: undefined,
//       city: undefined,
//       country: undefined,
//       state: undefined,
//       zip_code: undefined,
//       pickup_time: undefined,
//     };
//   }

//   if (fulfillment === "pickup") {
//     return {
//       ...payload,
//       first_name: payload.first_name?.trim() || "Guest",
//       last_name: payload.last_name?.trim() || "-",
//       email,
//       address: undefined,
//       city: undefined,
//       country: undefined,
//       state: undefined,
//       zip_code: undefined,
//       table_number: undefined,
//     };
//   }

//   return {
//     ...payload,
//     first_name: payload.first_name?.trim() || "Guest",
//     last_name: payload.last_name?.trim() || "-",
//     email,
//     city: undefined,
//     country: undefined,
//     state: undefined,
//     zip_code: undefined,
//     table_number: undefined,
//     pickup_time: undefined,
//   };
// }

// export function requiresCheckoutContact(
//   fulfillment: FulfillmentType,
// ): boolean {
//   return fulfillment === "delivery" || fulfillment === "pickup";
// }
