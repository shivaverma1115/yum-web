"use client";

import { Loader2, Plus, Power, Trash2 } from "lucide-react";
import { FormEvent, useState } from "react";
import { toast } from "react-toastify";
import Input from "@/components/ui/Input";
import {
  createCoupon,
  deleteCoupon,
  updateCoupon,
} from "@/lib/coupons/client";
import { formatCurrency } from "@/lib/constants";
import type { CouponDiscountType, ICoupon } from "@/types/coupon";

const errorClassName = "text-red-500 text-sm mt-1";

function formatDiscount(coupon: ICoupon) {
  if (coupon.discount_type === "percent") {
    return `${coupon.discount_value}% off`;
  }
  return `${formatCurrency(coupon.discount_value)} off`;
}

function toDatetimeLocalValue(iso: string | null) {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export default function CouponsManager({
  initialCoupons = [],
}: {
  initialCoupons?: ICoupon[];
}) {
  const [coupons, setCoupons] = useState<ICoupon[]>(initialCoupons);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [discountType, setDiscountType] =
    useState<CouponDiscountType>("percent");
  const [discountValue, setDiscountValue] = useState("10");
  const [minOrderAmount, setMinOrderAmount] = useState("0");
  const [maxDiscountAmount, setMaxDiscountAmount] = useState("");
  const [startsAt, setStartsAt] = useState("");
  const [endsAt, setEndsAt] = useState("");

  const resetForm = () => {
    setCode("");
    setDescription("");
    setDiscountType("percent");
    setDiscountValue("10");
    setMinOrderAmount("0");
    setMaxDiscountAmount("");
    setStartsAt("");
    setEndsAt("");
    setErrors({});
  };

  const onCreate = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setErrors({});

    try {
      const result = await createCoupon({
        code,
        description: description.trim() || null,
        discount_type: discountType,
        discount_value: Number(discountValue),
        min_order_amount: Number(minOrderAmount) || 0,
        max_discount_amount: maxDiscountAmount
          ? Number(maxDiscountAmount)
          : null,
        starts_at: startsAt || null,
        ends_at: endsAt || null,
        is_active: true,
      });

      if (!result.ok) {
        setErrors(result.data.errors ?? {});
        toast.error(result.data.message ?? "Failed to create coupon.");
        return;
      }

      const coupon = result.data.data?.coupon as ICoupon | undefined;
      if (coupon) {
        setCoupons((prev) => [coupon, ...prev]);
      }
      toast.success(result.data.message ?? "Coupon created.");
      resetForm();
    } finally {
      setSaving(false);
    }
  };

  const onToggleActive = async (coupon: ICoupon) => {
    setTogglingId(coupon.id);
    try {
      const result = await updateCoupon(coupon.id, {
        is_active: !coupon.is_active,
      });
      if (!result.ok) {
        toast.error(result.data.message ?? "Failed to update coupon.");
        return;
      }
      const updated = result.data.data?.coupon as ICoupon | undefined;
      if (updated) {
        setCoupons((prev) =>
          prev.map((item) => (item.id === updated.id ? updated : item)),
        );
      }
      toast.success(
        updated?.is_active ? "Coupon activated." : "Coupon deactivated.",
      );
    } finally {
      setTogglingId(null);
    }
  };

  const onDelete = async (couponId: string) => {
    if (!window.confirm("Delete this coupon? This cannot be undone.")) return;
    setDeletingId(couponId);
    try {
      const result = await deleteCoupon(couponId);
      if (!result.ok) {
        toast.error(result.data.message ?? "Failed to delete coupon.");
        return;
      }
      setCoupons((prev) => prev.filter((item) => item.id !== couponId));
      toast.success("Coupon deleted.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-8">
      <form
        onSubmit={onCreate}
        className="rounded-xl border border-default-200 bg-white p-5 dark:bg-default-50"
      >
        <h4 className="mb-4 text-lg font-semibold text-default-900">
          Create coupon
        </h4>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-default-700">
              Code
            </label>
            <Input
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="WELCOME10"
              required
            />
            {errors.code ? <p className={errorClassName}>{errors.code}</p> : null}
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-default-700">
              Description
            </label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="First order discount"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-default-700">
              Discount type
            </label>
            <Input
              as="select"
              value={discountType}
              onChange={(e) =>
                setDiscountType(e.target.value as CouponDiscountType)
              }
            >
              <option value="percent">Percent (%)</option>
              <option value="fixed">Fixed amount (₹)</option>
            </Input>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-default-700">
              Discount value
            </label>
            <Input
              type="number"
              min="0.01"
              step="0.01"
              value={discountValue}
              onChange={(e) => setDiscountValue(e.target.value)}
              required
            />
            {errors.discount_value ? (
              <p className={errorClassName}>{errors.discount_value}</p>
            ) : null}
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-default-700">
              Minimum order (₹)
            </label>
            <Input
              type="number"
              min="0"
              step="0.01"
              value={minOrderAmount}
              onChange={(e) => setMinOrderAmount(e.target.value)}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-default-700">
              Max discount (₹, optional)
            </label>
            <Input
              type="number"
              min="0.01"
              step="0.01"
              value={maxDiscountAmount}
              onChange={(e) => setMaxDiscountAmount(e.target.value)}
              placeholder="No cap"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-default-700">
              Starts at (optional)
            </label>
            <Input
              type="datetime-local"
              value={startsAt}
              onChange={(e) => setStartsAt(e.target.value)}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-default-700">
              Ends at (optional)
            </label>
            <Input
              type="datetime-local"
              value={endsAt}
              onChange={(e) => setEndsAt(e.target.value)}
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="mt-5 inline-flex items-center justify-center gap-2 rounded-full border border-primary bg-primary px-5 py-2.5 text-sm font-medium text-white transition hover:bg-primary-500 disabled:opacity-60"
        >
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Plus className="h-4 w-4" />
          )}
          Create coupon
        </button>
      </form>

      <div>
        <h4 className="mb-3 text-lg font-semibold text-default-900">
          All coupons
        </h4>
        {coupons.length === 0 ? (
          <p className="rounded-xl border border-dashed border-default-200 px-4 py-10 text-center text-sm text-default-500">
            No coupons yet. Create one above — customers can apply it on the cart
            page once.
          </p>
        ) : (
          <div className="overflow-hidden rounded-xl border border-default-200">
            <table className="min-w-full divide-y divide-default-200 text-sm">
              <thead className="bg-default-50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-default-600">
                    Code
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-default-600">
                    Discount
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-default-600">
                    Validity
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-default-600">
                    Status
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-default-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-default-200 bg-white dark:bg-default-50">
                {coupons.map((coupon) => {
                  const isDeleting = deletingId === coupon.id;
                  const isToggling = togglingId === coupon.id;
                  return (
                    <tr key={coupon.id}>
                      <td className="px-4 py-3">
                        <p className="font-semibold text-default-900">
                          {coupon.code}
                        </p>
                        {coupon.description ? (
                          <p className="mt-0.5 text-xs text-default-500">
                            {coupon.description}
                          </p>
                        ) : null}
                        {coupon.min_order_amount > 0 ? (
                          <p className="mt-0.5 text-xs text-default-400">
                            Min {formatCurrency(coupon.min_order_amount)}
                          </p>
                        ) : null}
                      </td>
                      <td className="px-4 py-3 text-default-800">
                        {formatDiscount(coupon)}
                        {coupon.max_discount_amount != null ? (
                          <span className="block text-xs text-default-400">
                            Cap {formatCurrency(coupon.max_discount_amount)}
                          </span>
                        ) : null}
                      </td>
                      <td className="px-4 py-3 text-xs text-default-500">
                        {coupon.starts_at || coupon.ends_at ? (
                          <>
                            {coupon.starts_at
                              ? toDatetimeLocalValue(coupon.starts_at).replace(
                                  "T",
                                  " ",
                                )
                              : "—"}
                            {" → "}
                            {coupon.ends_at
                              ? toDatetimeLocalValue(coupon.ends_at).replace(
                                  "T",
                                  " ",
                                )
                              : "—"}
                          </>
                        ) : (
                          "No date limit"
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            coupon.is_active
                              ? "bg-green-100 text-green-700"
                              : "bg-default-200 text-default-600"
                          }`}
                        >
                          {coupon.is_active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            disabled={isToggling || isDeleting}
                            onClick={() => onToggleActive(coupon)}
                            title={
                              coupon.is_active ? "Deactivate" : "Activate"
                            }
                            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-default-200 text-default-700 transition hover:bg-default-100 disabled:opacity-50"
                          >
                            {isToggling ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Power className="h-4 w-4" />
                            )}
                          </button>
                          <button
                            type="button"
                            disabled={isDeleting || isToggling}
                            onClick={() => onDelete(coupon.id)}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-red-200 text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                          >
                            {isDeleting ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
