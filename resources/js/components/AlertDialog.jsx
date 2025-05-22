"use client"

import { useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, AlertCircle, AlertTriangle, Info, CheckCircle } from "lucide-react"

export function AlertDialog({ isOpen, message, onClose, type = "info" }) {
  useEffect(() => {
    if (isOpen) {
      // Auto close after 5 seconds
      const timer = setTimeout(() => {
        onClose()
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [isOpen, onClose])

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose()
    }

    window.addEventListener("keydown", handleEscape)
    return () => window.removeEventListener("keydown", handleEscape)
  }, [onClose])

  // Determine alert type from prop or message content
  const messageContent = message?.toLowerCase() || ""
  const alertType = type || "info"

  // Alert configuration based on type
  const alertConfig = {
    success: {
      icon: CheckCircle,
      title: "Sukses",
      color: "emerald",
      bgColor: "bg-gray-100",
      iconColor: "text-emerald-600",
      borderColor: "border-gray-200",
      buttonColor: "bg-emerald-600 hover:bg-emerald-700",
      headerBg: "bg-gray-200",
      textColor: "text-gray-700",
    },
    warning: {
      icon: AlertTriangle,
      title: "Peringatan",
      color: "amber",
      bgColor: "bg-gray-100",
      iconColor: "text-amber-600",
      borderColor: "border-gray-200",
      buttonColor: "bg-amber-600 hover:bg-amber-700",
      headerBg: "bg-gray-200",
      textColor: "text-gray-700",
    },
    info: {
      icon: Info,
      title: "Informasi",
      color: "blue",
      bgColor: "bg-gray-100",
      iconColor: "text-blue-600",
      borderColor: "border-gray-200",
      buttonColor: "bg-blue-600 hover:bg-blue-700",
      headerBg: "bg-gray-200",
      textColor: "text-gray-700",
    },
    error: {
      icon: AlertCircle,
      title: "Error",
      color: "rose",
      bgColor: "bg-gray-100",
      iconColor: "text-rose-600",
      borderColor: "border-gray-200",
      buttonColor: "bg-rose-600 hover:bg-rose-700",
      headerBg: "bg-gray-200",
      textColor: "text-gray-700",
    },
  }

  const {
    icon: AlertIcon,
    title,
    bgColor,
    iconColor,
    borderColor,
    buttonColor,
    headerBg,
    textColor,
  } = alertConfig[alertType] || alertConfig.info

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{
              type: "spring",
              damping: 25,
              stiffness: 300,
            }}
            className="w-full max-w-md relative z-10"
          >
            <div className={`bg-white rounded-lg shadow-xl overflow-hidden border ${borderColor}`}>
              {/* Header */}
              <div className={`p-4 flex items-center justify-between border-b ${borderColor} ${headerBg}`}>
                <div className="flex items-center">
                  <AlertIcon className={`w-5 h-5 ${iconColor}`} />
                  <h3 className="ml-2 text-lg font-medium text-gray-800">{title}</h3>
                </div>
                <button
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-700 focus:outline-none rounded-full p-1 hover:bg-gray-200 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Content */}
              <div className={`p-5 ${bgColor}`}>
                <p className={`${textColor}`}>{message}</p>
                <div className="w-full h-1 bg-gray-300 rounded-full overflow-hidden mt-4">
                  <motion.div
                    initial={{ width: "100%" }}
                    animate={{ width: "0%" }}
                    transition={{ duration: 5, ease: "linear" }}
                    className={`h-full ${iconColor.replace("text", "bg")}`}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Auto-close in 5 seconds</p>
              </div>

              {/* Footer */}
              <div className="px-5 py-3 bg-gray-100 flex justify-end">
                <button
                  onClick={onClose}
                  className={`px-4 py-2 ${buttonColor} text-white rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${alertConfig[alertType].color}-500`}
                >
                  Tutup
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
