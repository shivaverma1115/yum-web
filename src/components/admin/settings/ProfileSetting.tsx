'use client'
import { useEffect, useState } from 'react'
import { useCallback, useRef } from 'react';
import { useContextApi } from '@/context-api/use-context';
import ImageUploadField, { type ImageUploadValue } from '@/components/common/image/ImageUploadField';
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

export default function ProfileSetting() {
    const { user, loading } = useContextApi();
    const [addresses, setAddresses] = useState<UserAddressesByType>(emptyAddresses);
    const [addressesLoading, setAddressesLoading] = useState(true);
    const avatarUploadRef = useRef<ImageUploadValue>({ files: [], existingUrls: [] });
    const handleAvatarChange = useCallback((value: ImageUploadValue) => {
        avatarUploadRef.current = value;
    }, []);

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
                        <ImageUploadField
                            variant="avatar"
                            multiple={false}
                            aspect={1}
                            onChange={handleAvatarChange}
                        />
                    </div>

                    {loading && !user ? <Preloader /> : <UserDetailsForm user={user ?? undefined} mode="self" />}
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

