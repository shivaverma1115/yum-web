"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from "react";
import dynamic from "next/dynamic";
import { Camera, ImageIcon, UploadCloud, X } from "lucide-react";
import { toast } from "react-toastify";

const ImageCropModal = dynamic(() => import("@/components/common/image/ImageCropModal"), {
  ssr: false,
});
import {
  ALLOWED_PRODUCT_IMAGE_TYPES,
  MAX_PRODUCT_IMAGE_SIZE_BYTES,
} from "@/lib/constants";
import { validateImageFile } from "@/lib/images/validation";

export type ImageUploadValue = {
  files: File[];
  existingUrls: string[];
};

type UploadImageItem = {
  id: string;
  source: "existing" | "new";
  preview: string;
  file?: File;
  url?: string;
};

type PendingCrop = {
  src: string;
  fileName: string;
};

export type ImageUploadFieldProps = {
  variant?: "gallery" | "avatar";
  multiple?: boolean;
  aspect?: number;
  cropShape?: "rect" | "round";
  initialExistingUrls?: string[];
  maxFiles?: number;
  maxSizeBytes?: number;
  acceptedTypes?: readonly string[];
  disabled?: boolean;
  required?: boolean;
  error?: string;
  label?: ReactNode;
  description?: ReactNode;
  onChange?: (value: ImageUploadValue) => void;
};

function uniqueUrls(urls: string[]): string[] {
  return Array.from(new Set(urls.filter(Boolean)));
}

function buildValue(items: UploadImageItem[]): ImageUploadValue {
  return {
    files: items
      .filter((item): item is UploadImageItem & { file: File } => Boolean(item.file))
      .map((item) => item.file),
    existingUrls: items
      .filter((item) => item.source === "existing" && item.url)
      .map((item) => item.url as string),
  };
}

function revokeBlobPreview(preview: string) {
  if (preview.startsWith("blob:")) {
    URL.revokeObjectURL(preview);
  }
}

function urlsToKey(urls: string[]): string {
  return uniqueUrls(urls).join("\0");
}

function urlsToExistingItems(urls: string[]): UploadImageItem[] {
  return uniqueUrls(urls).map((url) => ({
    id: `existing-${url}`,
    source: "existing" as const,
    preview: url,
    url,
  }));
}

function revokeCropQueue(queue: PendingCrop[]) {
  queue.forEach((entry) => {
    if (entry.src.startsWith("blob:")) {
      URL.revokeObjectURL(entry.src);
    }
  });
}

const EMPTY_INITIAL_URLS: string[] = [];

export default function ImageUploadField({
  variant = "gallery",
  multiple = true,
  aspect = 1,
  cropShape = "rect",
  initialExistingUrls = EMPTY_INITIAL_URLS,
  maxFiles = 10,
  maxSizeBytes = MAX_PRODUCT_IMAGE_SIZE_BYTES,
  acceptedTypes = ALLOWED_PRODUCT_IMAGE_TYPES,
  disabled = false,
  required = false,
  error,
  label,
  description,
  onChange,
}: ImageUploadFieldProps) {
  const inputId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const onChangeRef = useRef(onChange);
  const itemsRef = useRef<UploadImageItem[]>([]);
  const syncedInitialUrlsKeyRef = useRef<string | null>(null);
  const [items, setItems] = useState<UploadImageItem[]>([]);
  const [cropQueue, setCropQueue] = useState<PendingCrop[]>([]);

  const isAvatar = variant === "avatar";
  const allowMultiple = multiple && !isAvatar;
  const accept = acceptedTypes.join(",");
  const initialUrlsKey = urlsToKey(initialExistingUrls);
  const activeCrop = cropQueue[0] ?? null;

  onChangeRef.current = onChange;
  itemsRef.current = items;

  const applyItems = useCallback(
    (updater: (current: UploadImageItem[]) => UploadImageItem[]) => {
      setItems(updater);
    },
    [],
  );

  useEffect(() => {
    onChangeRef.current?.(buildValue(items));
  }, [items]);

  useEffect(() => {
    if (syncedInitialUrlsKeyRef.current === initialUrlsKey) {
      return;
    }

    syncedInitialUrlsKeyRef.current = initialUrlsKey;
    setItems(urlsToExistingItems(initialExistingUrls));
  }, [initialExistingUrls, initialUrlsKey]);

  useEffect(() => {
    return () => {
      itemsRef.current.forEach((item) => revokeBlobPreview(item.preview));
    };
  }, []);

  const openFilePicker = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  const handleFileSelection = (fileList: FileList | null) => {
    if (!fileList?.length || disabled) return;

    const selectedFiles = Array.from(fileList);
    const slotsLeft = maxFiles - items.length;

    if (slotsLeft <= 0) {
      toast.error(`You can upload up to ${maxFiles} images.`);
      return;
    }

    const filesToProcess = allowMultiple
      ? selectedFiles.slice(0, slotsLeft)
      : [selectedFiles[0]];

    const pending: PendingCrop[] = [];

    for (const file of filesToProcess) {
      const validation = validateImageFile(file, {
        maxSizeBytes,
        allowedTypes: acceptedTypes,
      });

      if (!validation.valid) {
        toast.error(validation.message);
        continue;
      }

      pending.push({
        src: URL.createObjectURL(file),
        fileName: file.name,
      });
    }

    if (!pending.length) return;

    if (isAvatar && items.length) {
      items.forEach((item) => revokeBlobPreview(item.preview));
      applyItems(() => []);
    }

    setCropQueue((current) => {
      revokeCropQueue(current);
      return pending;
    });
  };

  const handleCropComplete = (file: File) => {
    const preview = URL.createObjectURL(file);
    const nextItem: UploadImageItem = {
      id: `new-${crypto.randomUUID()}`,
      source: "new",
      preview,
      file,
    };

    applyItems((itemsCurrent) =>
      isAvatar ? [nextItem] : [...itemsCurrent, nextItem],
    );

    setCropQueue((current) => {
      const [active, ...rest] = current;
      if (active?.src.startsWith("blob:")) {
        URL.revokeObjectURL(active.src);
      }
      return rest;
    });
  };

  const handleCropCancel = () => {
    setCropQueue((current) => {
      revokeCropQueue(current);
      return [];
    });
  };

  const removeItem = (id: string) => {
    applyItems((current) => {
      const target = current.find((item) => item.id === id);
      if (target) {
        revokeBlobPreview(target.preview);
      }
      return current.filter((item) => item.id !== id);
    });
  };

  const coverPreview = items[0]?.preview;
  const galleryItems = isAvatar ? items : items;

  return (
    <div>
      <input
        ref={fileInputRef}
        id={inputId}
        type="file"
        accept={accept}
        multiple={allowMultiple}
        disabled={disabled}
        className="hidden"
        onChange={(event) => {
          handleFileSelection(event.target.files);
          event.target.value = "";
        }}
      />

      {isAvatar ? (
        <div className="relative mx-auto h-60 w-60">
          <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full border border-dashed border-default-300 bg-default-50/50">
            {coverPreview ? (
              <img
                src={coverPreview}
                alt="Avatar preview"
                className="h-full w-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <ImageIcon className="h-10 w-10 text-primary" />
            )}
          </div>

          {items[0] ? (
            <button
              type="button"
              onClick={() => removeItem(items[0].id)}
              disabled={disabled}
              className="absolute end-2 top-2 rounded-full bg-white/90 p-1.5 text-default-700 shadow hover:bg-white disabled:opacity-60"
              aria-label="Remove avatar"
            >
              <X className="h-4 w-4" />
            </button>
          ) : null}

          <button
            type="button"
            onClick={openFilePicker}
            disabled={disabled}
            className="absolute bottom-2 end-4 flex h-11 w-11 items-center justify-center rounded-full border-2 border-default-50 bg-primary disabled:opacity-60"
            aria-label="Upload avatar"
          >
            <Camera className="size-5 text-white" />
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="mb-4 flex h-52 items-center justify-center overflow-hidden rounded-lg border border-dashed border-default-300 bg-default-50/50">
            {coverPreview ? (
              <img
                src={coverPreview}
                alt="Cover preview"
                className="h-full w-full object-cover"
              />
            ) : (
              <ImageIcon className="h-10 w-10 text-primary" />
            )}
          </div>

          {label ? (
            <h5 className="mb-2 flex items-center gap-2 text-base font-medium text-primary">
              <UploadCloud className="h-5 w-5 shrink-0" aria-hidden />
              {label}
              {required ? <span className="text-required">*</span> : null}
            </h5>
          ) : null}

          {description}

          <button
            type="button"
            onClick={openFilePicker}
            disabled={disabled || items.length >= maxFiles}
            className="rounded-md bg-primary px-4 py-2 text-sm text-white hover:bg-primary-500 disabled:opacity-60"
          >
            Choose images
          </button>

          {galleryItems.length ? (
            <div className="grid grid-cols-3 gap-2">
              {galleryItems.map((item, index) => (
                <div key={item.id} className="group relative">
                  <img
                    src={item.preview}
                    alt={`Uploaded image ${index + 1}`}
                    className="h-24 w-full rounded-md border border-default-200 object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    disabled={disabled}
                    className="absolute end-1 top-1 rounded-full bg-white/90 p-1 text-default-700 shadow hover:bg-white disabled:opacity-60"
                    aria-label={`Remove image ${index + 1}`}
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                  {index === 0 ? (
                    <span className="absolute bottom-1 start-1 rounded bg-black/60 px-1.5 py-0.5 text-[10px] text-white">
                      Cover
                    </span>
                  ) : null}
                </div>
              ))}
            </div>
          ) : null}
        </div>
      )}

      {error ? <span className="mt-2 block text-sm text-red-500">{error}</span> : null}

      {activeCrop ? (
        <ImageCropModal
          key={activeCrop.src}
          imageSrc={activeCrop.src}
          fileName={activeCrop.fileName}
          aspect={aspect}
          cropShape={isAvatar ? "round" : cropShape}
          onCancel={handleCropCancel}
          onComplete={handleCropComplete}
        />
      ) : null}
    </div>
  );
}
