import { Component, type ReactNode } from "react";
import { RefreshCw, AlertTriangle } from "lucide-react";

interface Props {
  children: ReactNode;
  fallbackMessage?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error Boundary that wraps the profile grid.
 * Catches rendering errors from malformed data so the whole page never goes blank.
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          className="flex flex-col items-center justify-center py-20 text-center gap-4"
        >
          <div
            className="w-14 h-14 rounded-xl flex items-center justify-center"
            style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}
          >
            <AlertTriangle className="w-6 h-6 text-red-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-1">
              {this.props.fallbackMessage ?? "Couldn't load some creators"}
            </h3>
            <p className="text-xs text-[var(--text-muted)] max-w-xs mx-auto">
              Some profile data may be malformed. Other creators loaded successfully.
            </p>
          </div>
          <button
            onClick={this.handleRetry}
            className="btn-ghost press-active"
            style={{ fontSize: "12px", padding: "6px 14px" }}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Try Again</span>
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
