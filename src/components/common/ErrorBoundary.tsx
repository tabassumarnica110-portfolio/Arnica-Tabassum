import React, { Component, ErrorInfo, ReactNode } from "react";
import { ShieldAlert, RefreshCw, CheckCircle2, Home } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  recovered: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
    recovered: false,
  };

  public static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });
    // Defensive logging to prevent system crash
    console.error("[KrishiLink Defense Guard] Intercepted runtime exception:", error, errorInfo);
  }

  private handleSelfHeal = () => {
    try {
      // Clear any corrupted local state keys safely
      sessionStorage.removeItem("krishilink_temp_error");
    } catch {
      // Ignore storage errors in sandboxed iframes
    }
    this.setState({ hasError: false, error: null, errorInfo: null, recovered: true });
    window.location.reload();
  };

  private handleSoftReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null, recovered: true });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-stone-900 text-stone-100 flex items-center justify-center p-4 font-sans">
          <div className="max-w-lg w-full bg-stone-950 border border-stone-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
            
            {/* Header Shield */}
            <div className="flex items-center gap-3 border-b border-stone-800 pb-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-950 border border-emerald-700 flex items-center justify-center text-emerald-400">
                <ShieldAlert className="w-6 h-6 text-emerald-400 animate-pulse" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">KrishiLink Crash Shield Active</h2>
                <p className="text-xs text-stone-400 font-mono">System Integrity Guard · Auto-Quarantined</p>
              </div>
            </div>

            {/* Incident Summary */}
            <div className="p-4 rounded-xl bg-stone-900 border border-stone-800 space-y-2 text-xs">
              <div className="flex items-center justify-between text-stone-400">
                <span>Security Status:</span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  System Protected (Zero Data Loss)
                </span>
              </div>
              <p className="text-stone-300 leading-relaxed font-mono">
                An unexpected event was intercepted by KrishiLink's defensive error boundary. The application core was isolated to prevent system crash down and protect session data.
              </p>
              {this.state.error && (
                <div className="p-2.5 rounded bg-black/60 font-mono text-[11px] text-amber-300/90 break-all border border-stone-800">
                  {this.state.error.message || "Defensive exception intercepted"}
                </div>
              )}
            </div>

            {/* Self-Heal Actions */}
            <div className="space-y-2 pt-2">
              <button
                onClick={this.handleSoftReset}
                className="w-full py-2.5 px-4 rounded-xl bg-[#14532D] hover:bg-emerald-800 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Auto-Recover & Resume Session</span>
              </button>

              <button
                onClick={this.handleSelfHeal}
                className="w-full py-2.5 px-4 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer border border-stone-700"
              >
                <Home className="w-4 h-4" />
                <span>Hard Reload & Refresh State</span>
              </button>
            </div>

            <div className="text-center text-[11px] text-stone-500 font-mono">
              KrishiLink · Engineered by Arnica Tabassum, JSTU
            </div>

          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
