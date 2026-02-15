import React from "react";

type State = { hasError: boolean; error?: Error };

export default class ErrorBoundary extends React.Component<React.PropsWithChildren<{}>, State> {
  constructor(props: {}) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: any) {
    // log to console for now
    console.error("ErrorBoundary caught:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6">
          <div className="bg-red-900/60 text-white p-6 rounded-lg max-w-xl">
            <h2 className="text-xl font-bold mb-2">Something went wrong</h2>
            <p className="text-sm mb-4">An error occurred while rendering this section. Check the console for details.</p>
            <pre className="text-xs whitespace-pre-wrap">{String(this.state.error)}</pre>
          </div>
        </div>
      );
    }

    return this.props.children as React.ReactElement;
  }
}
