'use client'
import { useEffect, useState } from 'react'
import { Camera } from 'lucide-react'
import { useContextApi } from '@/context-api/use-context';
import { DEFAULT_USER_IMAGE } from '@/lib/constants';
import ChangePasswordForm from '@/components/auth/ChangePasswordForm';
import UserDetailsForm from '../customer/UserDetailsForm';
import UserAddressForm from '@/components/admin/settings/UserAddressForm';
import Preloader from '@/components/layout/Preloader';
import type { UserAddressesByType } from '@/types/user-address';
import { toast } from 'react-toastify';

const emptyAddresses = (): UserAddressesByType => ({
    billing: null,
    shipping: null,
});

export default function AdminSetting() {
    const { user, loading } = useContextApi();
    const [addresses, setAddresses] = useState<UserAddressesByType>(emptyAddresses);
    const [addressesLoading, setAddressesLoading] = useState(true);

    useEffect(() => {
        if (!user?.id) {
            setAddresses(emptyAddresses());
            setAddressesLoading(false);
            return;
        }

        const controller = new AbortController();
        let active = true;

        const loadAddresses = async () => {
            setAddressesLoading(true);

            try {
                const response = await fetch("/api/account/addresses", {
                    method: "GET",
                    signal: controller.signal,
                    cache: "no-store",
                });
                const data = await response.json().catch(() => ({}));

                if (!active) return;

                if (!response.ok || !data.success) {
                    toast.error(data.message ?? "Failed to load addresses.");
                    setAddresses(emptyAddresses());
                    return;
                }

                setAddresses(data.data?.addresses ?? emptyAddresses());
            } catch (error) {
                if (!active || controller.signal.aborted) return;
                toast.error(
                    error instanceof Error ? error.message : "Failed to load addresses.",
                );
                setAddresses(emptyAddresses());
            } finally {
                if (active) {
                    setAddressesLoading(false);
                }
            }
        };

        void loadAddresses();

        return () => {
            active = false;
            controller.abort();
        };
    }, [user?.id]);

    return (
        <div className="">
            <div className="p-6 border rounded-lg border-default-200 mb-6">
                <h4 className="text-xl font-medium text-default-900 mb-4">Personal Details</h4>

                <div className="grid gap-6">
                    <div className="lg:col-span-1">
                        <div className="w-60 h-60 relative">
                            <img src={DEFAULT_USER_IMAGE} className="w-full h-full rounded-full" />
                            <div className="absolute bottom-2 end-4">
                                <button className="w-11 h-11 flex items-center justify-center rounded-full bg-primary border-2 border-default-50">
                                    <Camera className="size-5 text-white" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {loading && !user ? <Preloader /> : <UserDetailsForm user={user ?? undefined} />}
                </div>
            </div>

            <div className="p-6 border rounded-lg border-default-200 mb-6">
                <h4 className="text-xl font-medium text-default-900 mb-4">Change Password</h4>
                <ChangePasswordForm />
            </div>

            {addressesLoading ? (
                <div className="mb-6">
                    <Preloader />
                </div>
            ) : (
                <div className="grid lg:grid-cols-2 gap-6">
                    <UserAddressForm
                        title="Billing Address"
                        addressType="billing"
                        initialAddress={addresses.billing}
                        onSaved={(address) =>
                            setAddresses((current) => ({ ...current, billing: address }))
                        }
                    />
                    <UserAddressForm
                        title="Shipping Address"
                        addressType="shipping"
                        initialAddress={addresses.shipping}
                        onSaved={(address) =>
                            setAddresses((current) => ({ ...current, shipping: address }))
                        }
                    />
                </div>
            )}
        </div>
    )
}

