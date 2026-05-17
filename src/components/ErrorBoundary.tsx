import { Component, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  override componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error details to console
    // eslint-disable-next-line no-console
    console.error('ErrorBoundary caught an error:', error);
    // eslint-disable-next-line no-console
    console.error('Error info:', errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  override render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[100dvh] bg-warm-white flex items-center justify-center px-4">
          <div className="max-w-md w-full text-center">
            {/* Error Icon */}
            <div className="w-20 h-20 rounded-full bg-error/10 flex items-center justify-center mx-auto mb-6">
              <AlertTriangle size={40} className="text-error" />
            </div>

            {/* Message */}
            <h1
              className="text-h1 text-charcoal font-bold mb-3"
              style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
            >
              Something Went Wrong
            </h1>
            <p className="text-body text-warm-gray leading-relaxed mb-2">
              We apologize for the inconvenience. An unexpected error has occurred.
            </p>
            {this.state.error && (
              <p className="text-caption text-error/80 bg-error/5 rounded-lg px-4 py-2 mb-8 break-all">
                {this.state.error.message}
              </p>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={this.handleReload}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gold text-deep-brown rounded-xl text-button-small font-semibold hover:bg-gold-dark hover:scale-[1.03] active:scale-[0.98] transition-all duration-200 shadow-[0_4px_14px_rgba(212,175,55,0.3)] min-h-[48px]"
              >
                <RotateCcw size={18} />
                Reload Page
              </button>
              <Link
                to="/"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-transparent border-2 border-gold text-gold rounded-xl text-button-small font-semibold hover:bg-gold/10 active:bg-gold/20 transition-all duration-200 min-h-[48px]"
              >
                <Home size={18} />
                Go Home
              </Link>
            </div>

            {/* Decorative element */}
            <div className="mt-12 pt-6 border-t border-sand">
              <p className="text-caption text-warm-gray/60">
                If this problem persists, please contact our support team at{' '}
                <a href="mailto:support@khmercareer.com" className="text-gold hover:text-gold-dark transition-colors">
                  support@khmercareer.com
                </a>
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
