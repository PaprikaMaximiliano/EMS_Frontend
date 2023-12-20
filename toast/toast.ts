import { toast } from "sonner";

const styles = {
  success: {
    backgroundColor: "#4CAF50",
    color: "#fff",
  },
  warning: {
    backgroundColor: "#FF9800",
    color: "#fff",
  },
  error: {
    backgroundColor: "#F44336",
    color: "#fff",
  },
};

type Type = "success" | "warning" | "error";

export default function customToast(type: Type, message: string) {
  toast(message, {
    style: styles[type],
  });
}
