"use client";

import { Loader2, Plus, Power, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";
import Input from "@/components/ui/Input";
import {
  createTableQrCodes,
  deleteTableQrCode,
  openTableQrDownload,
  updateTableQrActiveStatus,
} from "@/lib/table-qr/client";
import type { ITableQrCode } from "@/types/table-qr";

const errorClassName = "text-red-500 text-sm mt-1";

function TableQrCard({
  item,
  deletingId,
  togglingId,
  onDelete,
  onDownload,
  onToggleActive,
}: {
  item: ITableQrCode;
  deletingId: string | null;
  togglingId: string | null;
  onDelete: (id: string) => void;
  onDownload: (qrImageUrl: string) => void;
  onToggleActive: (id: string, isActive: boolean) => void;
}) {
  const isDeleting = deletingId === item.id;
  const isToggling = togglingId === item.id;

  return (
    <div
      className={`rounded-lg border p-4 ${item.is_active
          ? "border-default-200"
          : "border-default-200 bg-default-50 opacity-80"
        }`}
    >
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <img
            src={item.qr_image_url}
            alt={`QR code for ${item.table_number}`}
            className={`h-40 w-40 rounded-md border border-default-200 bg-white object-contain p-2 ${item.is_active ? "" : "grayscale"
              }`}
          />
          <span
            className={`absolute right-0 top-0 rounded-full px-2 py-0.5 text-xs font-medium ${item.is_active
                ? "bg-green-100 text-green-700"
                : "bg-default-200 text-default-600"
              }`}
          >
            {item.is_active ? "Active" : "Inactive"}
          </span>
        </div>
        <div className="w-full text-center">
          <h4 className="text-lg font-medium text-default-900">
            {item.table_number}
          </h4>
          <p className="mt-1 break-all text-xs text-default-500">{item.code}</p>
          {item.scan_url ? (
            <p className="mt-1 break-all text-xs text-default-400">
              {item.scan_url}
            </p>
          ) : null}
        </div>
        <div className="flex w-full gap-2">
          <button
            type="button"
            onClick={() => onDownload(item.qr_image_url)}
            className="inline-flex flex-1 items-center justify-center rounded-full border border-default-200 px-4 py-2 text-sm font-medium text-default-800 transition hover:bg-default-100"
          >
            Download
          </button>
          <button
            type="button"
            disabled={isToggling || isDeleting}
            onClick={() => onToggleActive(item.id, !item.is_active)}
            title={item.is_active ? "Deactivate QR code" : "Activate QR code"}
            className={`inline-flex items-center justify-center rounded-full border px-4 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-60 ${item.is_active
                ? "border-amber-200 text-amber-700 hover:bg-amber-50"
                : "border-green-200 text-green-700 hover:bg-green-50"
              }`}
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
            onClick={() => onDelete(item.id)}
            className="inline-flex items-center justify-center rounded-full border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isDeleting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function TableQrManager({
  initialTableQrCodes = [],
}: {
  initialTableQrCodes?: ITableQrCode[];
}) {
  const [tableQrCodes, setTableQrCodes] =
    useState<ITableQrCode[]>(initialTableQrCodes);
  const [generating, setGenerating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [tableNumber, setTableNumber] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const handleGenerate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);

    const confirmed = window.confirm(
      `Generate QR code for "${tableNumber.trim() || "this table"}"?`,
    );

    if (!confirmed) return;

    setGenerating(true);

    const result = await createTableQrCodes({
      mode: "single",
      table_number: tableNumber,
    });

    setGenerating(false);

    if (!result.success) {
      setFormError(result.message);
      toast.error(result.message);
      return;
    }

    toast.success(result.message ?? "Table QR code generated.");
    setTableQrCodes((current) => [
      ...result.data.tableQrCodes,
      ...current,
    ]);
    setTableNumber("");
  };

  const handleToggleActive = async (tableQrId: string, isActive: boolean) => {
    const item = tableQrCodes.find((qr) => qr.id === tableQrId);
    const tableLabel = item?.table_number ?? "this table";

    const confirmed = window.confirm(
      isActive
        ? `Activate QR code for ${tableLabel}? Customers will be able to scan it again.`
        : `Deactivate QR code for ${tableLabel}? Scanning will stop working until you activate it again.`,
    );

    if (!confirmed) return;

    setTogglingId(tableQrId);
    const result = await updateTableQrActiveStatus(tableQrId, isActive);
    setTogglingId(null);

    if (!result.success) {
      toast.error(result.message);
      return;
    }

    toast.success(result.message ?? "Table QR status updated.");
    setTableQrCodes((current) =>
      current.map((item) =>
        item.id === tableQrId ? result.data.tableQrCode : item,
      ),
    );
  };

  const handleDelete = async (tableQrId: string) => {
    const item = tableQrCodes.find((qr) => qr.id === tableQrId);
    const tableLabel = item?.table_number ?? "this table";

    const confirmed = window.confirm(
      `Delete QR code for ${tableLabel}? This will remove the image from storage and cannot be undone.`,
    );

    if (!confirmed) return;

    setDeletingId(tableQrId);
    const result = await deleteTableQrCode(tableQrId);
    setDeletingId(null);

    if (!result.success) {
      toast.error(result.message);
      return;
    }

    toast.success(result.message ?? "Table QR code deleted.");
    setTableQrCodes((current) =>
      current.filter((item) => item.id !== tableQrId),
    );
  };

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-default-200 p-6">
        <h4 className="text-xl font-medium text-default-900">Generate QR Code</h4>
        <p className="mt-1 text-sm text-default-600">
          QR images are saved to storage automatically. Download opens the
          storage image in a new tab.
        </p>

        <form onSubmit={handleGenerate} className="mt-6 space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-default-900">
              Table number
            </label>
            <Input
              value={tableNumber}
              onChange={(event) => setTableNumber(event.target.value)}
              placeholder="Table 5"
            />
          </div>

          {formError ? <p className={errorClassName}>{formError}</p> : null}

          <button
            type="submit"
            disabled={generating || tableNumber.trim() === ""}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {generating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
            Generate QR
          </button>
        </form>
      </div>

      <div className="rounded-lg border border-default-200 p-6">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h4 className="text-xl font-medium text-default-900">
              Generated QR Codes
            </h4>
            <p className="mt-1 text-sm text-default-600">
              All generated codes stay visible here until you delete them.
            </p>
          </div>
          <span className="rounded-full bg-default-100 px-3 py-1 text-sm text-default-700">
            {tableQrCodes.length} total
          </span>
        </div>

        {tableQrCodes.length === 0 ? (
          <div className="rounded-lg border border-dashed border-default-200 px-6 py-16 text-center text-default-600">
            No table QR codes yet. Generate your first one above.
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {tableQrCodes.map((item) => (
              <TableQrCard
                key={item.id}
                item={item}
                deletingId={deletingId}
                togglingId={togglingId}
                onDelete={handleDelete}
                onDownload={openTableQrDownload}
                onToggleActive={handleToggleActive}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
