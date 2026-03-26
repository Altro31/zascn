"use client";

import { cn } from "@/lib/utils";
import { Upload, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useController, UseControllerProps } from "react-hook-form";

interface RHFMultiImageUploadProps extends UseControllerProps {
  label?: string;
  className?: string;
  defaultImages?: string[]; // 👈 nuevas imágenes preexistentes
}

type UploadValue = (File | string)[];

export function RHFMultiImageUpload({
  label,
  className,
  defaultImages = [],
  ...props
}: RHFMultiImageUploadProps) {
  const { field, fieldState } = useController(props);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previews, setPreviews] = useState<string[]>([]);

  // Sincroniza las imágenes: nuevas y por defecto
  useEffect(() => {
    const value = field.value as UploadValue;

    if (!value || value.length === 0) {
      setPreviews(defaultImages);
      field.onChange(defaultImages);
      return;
    }

    const previewUrls = value.map((item) =>
      typeof item === "string" ? item : URL.createObjectURL(item)
    );

    setPreviews(previewUrls);

    return () => {
      previewUrls.forEach((url) => {
        URL.revokeObjectURL(url);
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(field.value), JSON.stringify(defaultImages)]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    const validImages = files.filter((file) => file.type.startsWith("image/"));

    if (validImages.length > 0) {
      const current = (field.value as UploadValue) || [];
      field.onChange([...current, ...validImages]);
    }
  };

  const handleRemove = (index: number) => {
    const current = [...((field.value as UploadValue) || [])];
    current.splice(index, 1);
    field.onChange(current);
  };

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {label && <label className="font-medium text-sm">{label}</label>}

      <div
        className="cursor-pointer border-2 border-dashed border-gray-300 rounded-md p-4 text-center hover:bg-gray-50"
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload className="mx-auto text-gray-400 mb-2 size-5" />
        <p className="text-sm text-gray-500 font-medium">
          Haz clic o arrastra imágenes para subir
        </p>
      </div>

      <input
        type="file"
        multiple
        accept="image/*"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileChange}
      />

      {previews.length > 0 && (
        <div className="flex gap-4 overflow-x-auto py-2">
          {previews.map((src, index) => (
            <div
              key={index}
              className="relative w-24 h-24 shrink-0 rounded-md overflow-hidden border"
            >
              <Image
                src={src}
                alt={`Preview ${index}`}
                fill
                className="object-cover"
              />
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="absolute top-1 right-1 bg-white p-1 rounded-full shadow hover:bg-gray-100"
              >
                <X className="text-gray-600 size-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {fieldState.error && (
        <p className="text-xs text-red-500">{fieldState.error.message}</p>
      )}
    </div>
  );
}
