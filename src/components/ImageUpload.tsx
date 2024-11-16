import { useDropzone } from "react-dropzone";
import { Camera, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface ImageUploadProps {
  onImageCapture: (file: File) => Promise<void>;
  isAnalyzing: boolean;
}

export default function ImageUpload({
  onImageCapture,
  isAnalyzing,
}: ImageUploadProps) {
  const [error, setError] = useState<string | null>(null);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "image/jpeg": [".jpeg", ".jpg"],
      "image/png": [".png"],
    },
    maxFiles: 1,
    onDrop: async (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setError(null);
        try {
          await onImageCapture(acceptedFiles[0]);
          toast.success("Image successfully uploaded");
        } catch (err) {
          toast.error("Failed to process image");
        }
      }
    },
    onDropRejected: () => {
      setError("Please upload a valid image file (PNG, JPG, or JPEG)");
      toast.error("Invalid file type");
    },
  });

  return (
    <div
      {...getRootProps()}
      className={`flex-1 cursor-pointer ${
        isDragActive ? "bg-emerald-100" : "bg-emerald-500"
      } text-white p-3 rounded-lg flex items-center justify-center space-x-2 
      hover:bg-emerald-600 transition-colors relative`}
    >
      <input {...getInputProps()} />
      {isAnalyzing ? (
        <Loader2 className="h-6 w-6 animate-spin" />
      ) : (
        <Camera className="h-6 w-6" />
      )}
      <span>
        {isDragActive
          ? "Drop the image here"
          : isAnalyzing
          ? "Analyzing..."
          : "Scan Medicine"}
      </span>
      {error && (
        <div className="absolute bottom-0 left-0 right-0 bg-red-500 text-white p-2 text-sm text-center">
          {error}
        </div>
      )}
    </div>
  );
}
