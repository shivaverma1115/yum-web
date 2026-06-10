type VerificationBadgeProps = {
  verified: boolean;
  label: string;
};

export default function VerificationBadge({
  verified,
  label,
}: VerificationBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
        verified
          ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300"
          : "bg-default-100 text-default-500 dark:bg-default-800"
      }`}
    >
      {label}: {verified ? "Verified" : "Not verified"}
    </span>
  );
}
