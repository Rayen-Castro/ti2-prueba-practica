interface StatusMessageProps {
  type: "loading" | "error" | "success";
  message: string;
}

export function StatusMessage({ type, message }: StatusMessageProps) {
  return (
    <p role={type === "error" ? "alert" : "status"} className={`status-message status-message--${type}`}>
      {message}
    </p>
  );
}
