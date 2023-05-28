import React from 'react'

class ErrorBoundary extends React.Component {
  constructor(props: any) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: any) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true }
  }

  render() {
    if (this?.state?.hasError) {
      return this?.props?.fallback
    }

    return this?.props?.children
  }
}

export default ErrorBoundary as any
