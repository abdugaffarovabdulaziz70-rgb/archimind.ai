import { Component, type ReactNode, type ErrorInfo } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '../ui';

interface Props { children: ReactNode; }
interface State { hasError: boolean; error?: Error; }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center px-4 bg-white dark:bg-ink-950">
          <div className="text-center max-w-md">
            <div className="w-20 h-20 rounded-2xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center mx-auto mb-6">
              <AlertTriangle size={40} className="text-red-500" />
            </div>
            <h1 className="text-2xl font-bold mb-3 text-ink-900 dark:text-white">Something went wrong</h1>
            <p className="text-ink-500 dark:text-ink-400 mb-6">
              {this.state.error?.message || 'An unexpected error occurred. Please try again.'}
            </p>
            <Button onClick={() => window.location.reload()} icon={<RefreshCw size={18} />}>
              Reload Page
            </Button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
