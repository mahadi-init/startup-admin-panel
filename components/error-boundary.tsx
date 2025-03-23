"use client"

import { Component, type ErrorInfo, type ReactNode } from "react"
import { Button } from "@/components/ui/button"

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
            <h2 className="mb-2 text-2xl font-bold">Something went wrong</h2>
            <p className="mb-4 text-muted-foreground">We apologize for the inconvenience. Please try again later.</p>
            <Button
              onClick={() => {
                this.setState({ hasError: false })
                window.location.href = "/"
              }}
            >
              Go back to home
            </Button>
          </div>
        )
      )
    }

    return this.props.children
  }
}

