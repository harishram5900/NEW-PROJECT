import React from "react";

/**
 * ErrorBoundary — prevents any child render error from turning the page into a blank screen.
 * Falls back to a compact dark card with a Reload button.
 */
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // eslint-disable-next-line no-console
    console.error("[Phasor ErrorBoundary]", error, info);
  }

  reset = () => this.setState({ hasError: false, error: null });

  render() {
    if (!this.state.hasError) return this.props.children;
    const msg = this.state.error?.message || "Unexpected error";
    return (
      <div
        data-testid="error-boundary"
        className="min-h-screen bg-phasor-bg text-white flex items-center justify-center p-6"
      >
        <div className="max-w-md w-full glass rounded-2xl p-8 text-left">
          <div className="text-[10px] font-mono tracking-widest uppercase text-red-400">
            System interrupted
          </div>
          <h2 className="mt-3 font-display text-2xl font-semibold">
            Something didn't render.
          </h2>
          <p className="mt-2 text-sm text-phasor-mute leading-relaxed">
            The page hit an unexpected error while loading. Your data is safe. Try refreshing — if it
            persists, drop us a note.
          </p>
          <pre className="mt-4 text-[11px] font-mono text-red-300 bg-black/50 rounded-md p-3 overflow-auto max-h-32">
            {String(msg)}
          </pre>
          <div className="mt-5 flex items-center gap-2">
            <button
              onClick={() => window.location.reload()}
              className="btn-primary rounded-full px-4 py-2 text-sm"
            >
              Reload page
            </button>
            <button
              onClick={this.reset}
              className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/70 hover:text-white transition-colors"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }
}
