"use client";

import { Component, ErrorInfo, ReactNode } from "react";
import { motion } from "framer-motion";
import { RefreshCw, AlertTriangle, Bug } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class GameErrorBoundary extends Component<Props, State> {
  public state: State;
  public static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  public constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ error, errorInfo });
    console.error("Game Error Boundary caught an error:", error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "400px",
            padding: 32,
            textAlign: "center",
            background: "#111827",
            borderRadius: 16,
            border: "1px solid #374151",
          }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            style={{ marginBottom: 16 }}
          >
            <AlertTriangle size={64} style={{ color: "#EF4444" }} />
          </motion.div>
          <h2
            style={{
              fontSize: 24,
              fontWeight: 700,
              color: "#F9FAFB",
              marginBottom: 8,
            }}
          >
            Something went wrong
          </h2>
          <p style={{ color: "#9CA3AF", marginBottom: 24, maxWidth: 400 }}>
            The game encountered an unexpected error. Don't worry, your game
            state is saved on the server.
          </p>
          {this.state.error && (
            <details
              style={{
                textAlign: "left",
                marginBottom: 24,
                maxWidth: 500,
                width: "100%",
              }}
            >
              <summary
                style={{
                  cursor: "pointer",
                  color: "#9CA3AF",
                  fontSize: 14,
                  marginBottom: 8,
                }}
              >
                <Bug
                  size={16}
                  style={{
                    display: "inline-block",
                    marginRight: 8,
                    verticalAlign: "middle",
                  }}
                />
                Error Details (click to expand)
              </summary>
              <pre
                style={{
                  background: "#0C0A09",
                  padding: 16,
                  borderRadius: 8,
                  overflow: "auto",
                  fontSize: 12,
                  color: "#EF4444",
                  maxHeight: 200,
                }}
              >
                {this.state.error.message}
                {this.state.error.stack && `\n\n${this.state.error.stack}`}
              </pre>
            </details>
          )}
          <motion.button
            onClick={this.handleReset}
            whileTap={{ scale: 0.95 }}
            style={{
              padding: "14px 32px",
              borderRadius: 12,
              background: "linear-gradient(135deg, #3B82F6, #1D4ED8)",
              border: "none",
              color: "#fff",
              fontWeight: 700,
              fontSize: 16,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <RefreshCw size={18} /> Reload Game
          </motion.button>
        </div>
      );
    }

    return this.props.children;
  }
}
