import { Component } from 'react';
import { Link } from 'react-router-dom';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="pt-32 pb-16 container-max px-4 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 rounded-full bg-error-100 dark:bg-error-500/20 flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-error-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M5.07 19h13.86c1.54 0 2.5-1.67 1.73-3L13.73 4a2 2 0 00-3.46 0L3.34 16c-.77 1.33.19 3 1.73 3z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-stone-900 dark:text-white mb-3">
              Something went wrong
            </h1>
            <p className="text-stone-600 dark:text-stone-400 mb-6">
              An unexpected error occurred while loading this page. Please try again.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button onClick={this.handleReset} className="btn-primary">
                Try Again
              </button>
              <Link to="/" className="btn-secondary">
                Go Home
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
