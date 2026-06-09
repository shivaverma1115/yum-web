"use client";

import { useCallback, useState } from "react";
import Cropper, { type Area } from "react-easy-crop";
import { Loader2, X } from "lucide-react";
import { toast } from "react-toastify";
import { getCroppedImageFile } from "@/lib/images/cropImage";

type ImageCropModalProps = {
  imageSrc: string;
  fileName: string;
  aspect?: number;
  cropShape?: "rect" | "round";
  onCancel: () => void;
  onComplete: (file: File) => void;
};

export default function ImageCropModal({
  imageSrc,
  fileName,
  aspect = 1,
  cropShape = "rect",
  onCancel,
  onComplete,
}: ImageCropModalProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const onCropComplete = useCallback((_: Area, pixels: Area) => {
    setCroppedAreaPixels(pixels);
  }, []);

  const handleSave = async () => {
    if (!croppedAreaPixels) return;

    setIsSaving(true);
    try {
      const extension = fileName.split(".").pop()?.toLowerCase();
      const mimeType =
        extension === "png"
          ? "image/png"
          : extension === "webp"
            ? "image/webp"
            : "image/jpeg";
      const croppedFile = await getCroppedImageFile(
        imageSrc,
        croppedAreaPixels,
        fileName,
        mimeType,
      );
      setIsSaving(false);
      onComplete(croppedFile);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to crop image.",
      );
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-lg overflow-hidden rounded-xl bg-white shadow-xl dark:bg-default-50">
        <div className="flex items-center justify-between border-b border-default-200 px-4 py-3">
          <h3 className="text-base font-medium text-default-900">Crop image</h3>
          <button
            type="button"
            onClick={onCancel}
            disabled={isSaving}
            className="rounded-lg p-1 text-default-500 hover:bg-default-100 disabled:opacity-60"
            aria-label="Close crop dialog"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="relative h-72 bg-default-900">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            cropShape={cropShape}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>

        <div className="space-y-3 border-t border-default-200 px-4 py-4">
          <label className="block text-sm text-default-600">
            Zoom
            <input
              type="range"
              min={1}
              max={3}
              step={0.1}
              value={zoom}
              onChange={(event) => setZoom(Number(event.target.value))}
              className="mt-1 w-full"
            />
          </label>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onCancel}
              disabled={isSaving}
              className="rounded-lg bg-default-100 px-4 py-2 text-sm font-medium text-default-700 hover:bg-default-200 disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => void handleSave()}
              disabled={isSaving || !croppedAreaPixels}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-500 disabled:opacity-60"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Apply crop"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
