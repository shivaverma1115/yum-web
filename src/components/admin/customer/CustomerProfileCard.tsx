"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import {
  getCustomerDisplayName,
  getCustomerLocation,
} from "@/hooks/use-admin-customer";
import { formatCustomerSince } from "@/lib/constants";
import VerificationBadge from "@/components/admin/customer/VerificationBadge";
import UserAvatar from "@/components/common/UserAvatar";
import { richTextToPlainText } from "@/lib/rich-text";
import type { IUserWithVerification } from "@/types/user";

function displayValue(value: string | null | undefined) {
  if (!value?.trim()) return "—";
  return value.trim();
}

type CustomerProfileCardProps = {
  customer: IUserWithVerification;
};

export default function CustomerProfileCard({ customer }: CustomerProfileCardProps) {
  const [expanded, setExpanded] = useState(false);
  const displayName = getCustomerDisplayName(customer);

  return (
    <div className="rounded-lg border border-default-200 overflow-hidden">
      <button
        type="button"
        onClick={() => setExpanded((open) => !open)}
        aria-expanded={expanded}
        className="w-full p-6 text-start hover:bg-default-50/80 transition-colors"
      >
        <div className="flex items-start gap-4">
          <UserAvatar
            user={customer}
            className="w-16 shrink-0 rounded-full border border-default-200 bg-default-100 object-cover p-1 dark:bg-default-700 dark:border-default-600"
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <h4 className="text-lg font-medium text-default-900 truncate">
                {displayName}
              </h4>
              <ChevronDown
                className={`h-5 w-5 shrink-0 text-default-500 transition-transform ${expanded ? "rotate-180" : ""
                  }`}
                aria-hidden
              />
            </div>
            <p className="text-xs text-default-500 truncate mt-1">
              {displayValue(customer.id)}
            </p>
            <p className="text-sm text-default-500 truncate mt-1">
              {customer.email || "—"}
            </p>
            <p className="text-sm text-default-500 mt-0.5">
              {customer.phone || "—"}
            </p>
            <div className="flex flex-wrap gap-1.5 mt-2">
              <VerificationBadge
                verified={customer.verification.phone_verified}
                label="Phone"
              />
              <VerificationBadge
                verified={customer.verification.email_verified}
                label="Email"
              />
            </div>
            <p className="text-xs text-primary mt-2">
              {expanded ? "Hide details" : "View full profile"}
            </p>
          </div>
        </div>
      </button>

      {expanded ? (
        <div className="px-6 pb-6 pt-0 border-t border-default-200 text-start space-y-4">
          <div className="mt-4">
            <h5 className="text-xs uppercase tracking-wide text-default-500 mb-2">
              About
            </h5>
            <p className="text-sm text-default-600 whitespace-pre-wrap break-words">
              {richTextToPlainText(customer.description) ||
                "No description provided."}
            </p>
          </div>

          <dl className="grid gap-2 text-sm">
            <div className="flex gap-2">
              <dt className="text-default-500 shrink-0">First name</dt>
              <dd className="text-default-800">{displayValue(customer.first_name)}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="text-default-500 shrink-0">Last name</dt>
              <dd className="text-default-800">{displayValue(customer.last_name)}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="text-default-500 shrink-0">Email</dt>
              <dd className="text-default-800 break-all">
                <span>{displayValue(customer.email)}</span>
                <span className="block mt-1">
                  <VerificationBadge
                    verified={customer.verification.email_verified}
                    label="Email"
                  />
                </span>
              </dd>
            </div>
            <div className="flex gap-2">
              <dt className="text-default-500 shrink-0">Phone</dt>
              <dd className="text-default-800">
                <span>{displayValue(customer.phone)}</span>
                <span className="block mt-1">
                  <VerificationBadge
                    verified={customer.verification.phone_verified}
                    label="Phone"
                  />
                </span>
              </dd>
            </div>
            <div className="flex gap-2">
              <dt className="text-default-500 shrink-0">ZIP</dt>
              <dd className="text-default-800">{getCustomerLocation(customer)}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="text-default-500 shrink-0">Role</dt>
              <dd className="text-default-800 capitalize">{customer.role}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="text-default-500 shrink-0">Joined</dt>
              <dd className="text-default-800">
                {customer.created_at
                  ? formatCustomerSince(customer.created_at)
                  : "—"}
              </dd>
            </div>
            <div className="flex gap-2">
              <dt className="text-default-500 shrink-0">Updated</dt>
              <dd className="text-default-800">
                {customer.updated_at
                  ? formatCustomerSince(customer.updated_at)
                  : "—"}
              </dd>
            </div>
          </dl>

          <Link
            href={`/admin/customers/${customer.id}/edit`}
            className="inline-flex text-sm font-medium text-primary hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            Edit customer
          </Link>
        </div>
      ) : (
        <div className="px-6 pb-4 -mt-2">
          <Link
            href={`/admin/customers/${customer.id}/edit`}
            className="inline-flex text-sm font-medium text-primary hover:underline"
          >
            Edit customer
          </Link>
        </div>
      )}
    </div>
  );
}
