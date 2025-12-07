"use client";

import { useState, useEffect, JSX } from "react";
import { AiOutlineCheckCircle, AiOutlineClose } from "react-icons/ai";

interface NotificationProps {
  message: string | JSX.Element; // can be multi-line or rich content
  show: boolean;
  onClose?: () => void;
  duration?: number; // auto-hide duration in ms
}

export default function Notification({
  message,
  show,
  onClose,
  duration = 3000,
}: NotificationProps) {
  const [visible, setVisible] = useState(show);

  useEffect(() => {
    setVisible(show);
    if (show) {
      const timer = setTimeout(() => {
        setVisible(false);
        onClose && onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [show, onClose, duration]);

  return (
    <>
      {visible && (
        <div className="fixed top-6 right-6 z-50 flex items-start space-x-3 bg-white/95 backdrop-blur-sm shadow-md border border-gray-200 rounded-lg px-4 py-3 w-[300px] max-w-full animate-notification">
          {/* Success Icon */}
          <AiOutlineCheckCircle className="text-green-500 w-5 h-5 mt-1 shrink-0" />

          {/* Message */}
          <div className="flex-1 text-sm text-gray-800">{message}</div>

          {/* Close Button */}
          <button
            onClick={() => {
              setVisible(false);
              onClose && onClose();
            }}
            className="text-gray-400 hover:text-gray-600 ml-2 shrink-0"
            aria-label="Close notification"
          >
            <AiOutlineClose className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Animation using Tailwind + custom keyframes */}
      <style jsx>{`
        @keyframes notification-in {
          0% {
            transform: translateY(-10px);
            opacity: 0;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-notification {
          animation: notification-in 0.25s ease-out forwards;
        }
      `}</style>
    </>
  );
}
