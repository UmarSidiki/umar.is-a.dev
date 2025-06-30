import React from "react";

interface MessageNotificationProps {
  message: {
    type: 'success' | 'error';
    text: string;
  };
  onDismiss: () => void;
}

export const MessageNotification: React.FC<MessageNotificationProps> = ({ message, onDismiss }) => {
  return (
    <div
      className={`relative z-10 mb-6 p-4 rounded-xl border transition-all duration-200 ${
        message.type === "success"
          ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800"
          : "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800"
      }`}
    >
      <div className="flex items-center justify-between">
        <span>{message.text}</span>
        <button
          onClick={onDismiss}
          className="text-current opacity-50 hover:opacity-100 transition-opacity"
        >
          ×
        </button>
      </div>
    </div>
  );
};
