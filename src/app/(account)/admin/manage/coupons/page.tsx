import { Metadata } from "next";
import CouponsManager from "@/components/admin/coupons/CouponsManager";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { createAdminClient } from "@/lib/supabase/admin";
import { listCouponsWithSupabase } from "@/lib/supabase/coupons/coupons";
import type { ICoupon } from "@/types/coupon";

export const metadata: Metadata = {
  title: "Coupons",
  description: "Create and manage discount coupons for customers",
};

export default async function AdminCouponsPage() {
  let initialCoupons: ICoupon[] = [];

  const auth = await requireAdmin();
  if (auth.authorized) {
    const result = await listCouponsWithSupabase(createAdminClient());
    if (result.success) {
      initialCoupons = result.coupons;
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-semibold text-default-900">Coupons</h3>
        <p className="mt-1 text-sm text-default-600">
          Create coupon codes customers can apply on the cart. Each user can use
          a coupon once — it becomes invalid for them after successful payment.
        </p>
      </div>

      <CouponsManager initialCoupons={initialCoupons} />
    </div>
  );
}
