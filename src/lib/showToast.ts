import { toast } from "sonner";

// Toast utility function
export const showToast = (message: string, type: "success" | "error") => {
  // Dismiss all existing toasts first
  toast.dismiss();

  toast[type](message, {
    duration: 3000,
    position: "bottom-right",
    style: {
      background: "#f3f4f6", // light gray background
      color: "#1f2937", // dark gray text
      border: "1px solid #e5e7eb", // subtle border
    },
    icon: type === "success" ? "✅" : "❌",
    className: "toast-slide-in",
  });
};
