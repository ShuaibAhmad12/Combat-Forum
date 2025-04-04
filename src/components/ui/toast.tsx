"use client"
import { X } from "lucide-react"

export interface ToastProps {
  title: string
  description?: string
  variant?: "default" | "destructive"
  onClose?: () => void
}

export function Toast({ title, description, variant = "default", onClose }: ToastProps) {
  return (
    <div
      className={`fixed bottom-4 right-4 z-50 flex w-full max-w-md items-center justify-between rounded-lg border p-4 shadow-lg ${
        variant === "destructive" ? "border-red-200 bg-red-50 text-red-900" : "border-gray-200 bg-white"
      }`}
      role="alert"
    >
      <div className="flex flex-col">
        <h3 className="font-medium">{title}</h3>
        {description && <div className="text-sm text-gray-500">{description}</div>}
      </div>
      <button
        type="button"
        className="inline-flex h-8 w-8 items-center justify-center rounded-md text-gray-500 hover:bg-gray-100"
        onClick={onClose}
      >
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </button>
    </div>
  )
}

export function Toaster() {
  // This would be implemented with a context provider in a real app
  return null
}

