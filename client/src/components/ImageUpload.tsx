import { useEffect, useRef, useState } from "react";

// Cloudinary configuration
const CLOUD_NAME = "dtvdvwzn2";
const UPLOAD_PRESET = "travel_web";

interface ImageUploadProps {
  onUpload: (urls: string[]) => void;
  multiple?: boolean;
  existingImages?: string[];
  maxFiles?: number;
}

declare global {
  interface Window {
    cloudinary: any;
  }
}

export default function ImageUpload({
  onUpload,
  multiple = false,
  existingImages = [],
  maxFiles = 5,
}: ImageUploadProps) {
  const [images, setImages] = useState<string[]>(existingImages);
  const [uploading, setUploading] = useState(false);
  const widgetRef = useRef<any>(null);

  useEffect(() => {
    // Load Cloudinary script
    const script = document.createElement("script");
    script.src = "https://widget.cloudinary.com/v2.0/global/all.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const openWidget = () => {
    if (!window.cloudinary) {
      alert("Cloudinary chưa sẵn sàng. Vui lòng thử lại.");
      return;
    }

    widgetRef.current = window.cloudinary.createUploadWidget(
      {
        cloudName: CLOUD_NAME,
        uploadPreset: UPLOAD_PRESET,
        multiple: multiple,
        maxFiles: maxFiles,
        sources: ["local", "url", "camera"],
        resourceType: "image",
        clientAllowedFormats: ["jpg", "jpeg", "png", "webp", "gif"],
        maxFileSize: 5000000, // 5MB
        cropping: false,
        showSkipCropButton: true,
        styles: {
          palette: {
            window: "#FFFFFF",
            windowBorder: "#90A0B3",
            tabIcon: "#0078FF",
            menuIcons: "#5A616A",
            textDark: "#000000",
            textLight: "#FFFFFF",
            link: "#0078FF",
            action: "#FF620C",
            inactiveTabIcon: "#0E2F5A",
            error: "#F44235",
            inProgress: "#0078FF",
            complete: "#20B832",
            sourceBg: "#E4EBF1",
          },
        },
      },
      (error: any, result: any) => {
        if (error) {
          console.error("Upload error:", error);
          return;
        }
        if (result.event === "success") {
          const newUrl = result.info.secure_url;
          setImages((prev) => {
            const updated = [...prev, newUrl];
            onUpload(updated);
            return updated;
          });
        }
      }
    );

    widgetRef.current.open();
  };

  const removeImage = (index: number) => {
    setImages((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      onUpload(updated);
      return updated;
    });
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {images.map((url, index) => (
          <div key={index} className="relative group">
            <img
              src={url}
              alt={`Upload ${index + 1}`}
              className="w-20 h-20 object-cover rounded border"
            />
            <button
              type="button"
              onClick={() => removeImage(index)}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      {(multiple || images.length === 0) && images.length < maxFiles && (
        <button
          type="button"
          onClick={openWidget}
          disabled={uploading}
          className="px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-500 transition flex items-center gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          {uploading ? "Đang tải..." : "Tải ảnh lên"}
        </button>
      )}

      {images.length > 0 && (
        <p className="text-xs text-gray-500">
          {images.length}/{maxFiles} ảnh
        </p>
      )}
    </div>
  );
}
