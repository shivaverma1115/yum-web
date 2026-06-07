"use client";

import CustomerLoadState from "@/components/admin/customer/CustomerLoadState";
import CustomerOrderHistory from "@/components/admin/customer/CustomerOrderHistory";
import CustomerProfileCard from "@/components/admin/customer/CustomerProfileCard";
import { useAdminCustomer } from "@/hooks/use-admin-customer";

interface UserDetailsProps {
    userId: string;
}

export default function UserDetails({ userId }: UserDetailsProps) {
    const { user, loading, error } = useAdminCustomer(userId);

    return (
        <CustomerLoadState user={user} loading={loading} error={error}>
            {(customer) => (
                <div className="grid lg:grid-cols-3 grid-cols-1 gap-6">
                    <div className="lg:col-span-1">
                        <CustomerProfileCard customer={customer} />
                    </div>

                    <div className="lg:col-span-2">
                        <CustomerOrderHistory userId={userId} />
                    </div>
                </div>
            )}
        </CustomerLoadState>
    );

}

