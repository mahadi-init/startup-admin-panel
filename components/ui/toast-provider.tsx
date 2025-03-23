"use client"

import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { createContext, useContext, type ReactNode } from "react"

type ToastContextType = {
  showSuccess: (message: string) => void
  showError: (message: string) => void
  showInfo: (message: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast()

  const showSuccess = (message: string) => {
    toast({
      title: "Success",
      description: message,
      variant: "default",
    })
  }

  const showError = (message: string) => {
    toast({
      title: "Error",
      description: message,
      variant: "destructive",
    })
  }

  const showInfo = (message: string) => {
    toast({
      title: "Info",
      description: message,
    })
  }

  return (
    <ToastContext.Provider value={{ showSuccess, showError, showInfo }}>
      {children}
      <Toaster />
    </ToastContext.Provider>
  )
}

export function useToastMessage() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error("useToastMessage must be used within a ToastProvider")
  }
  return context
}

