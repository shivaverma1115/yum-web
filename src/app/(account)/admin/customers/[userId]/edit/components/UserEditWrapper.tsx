"use client";

import UserDetailsForm from "@/components/admin/customer/UserDetailsForm";
import CustomerLoadState from "@/components/admin/customer/CustomerLoadState";
import { useAdminCustomer } from "@/hooks/use-admin-customer";
import { useParams } from "next/navigation";

export default function UserEditWrapper() {
  const params = useParams();
  const userId = typeof params.userId === "string" ? params.userId : "";
  const { user, loading, error } = useAdminCustomer(userId);

  return (
    <CustomerLoadState user={user} loading={loading} error={error}>
      {(customer) => <UserDetailsForm user={customer} />}
    </CustomerLoadState>
  );
}
