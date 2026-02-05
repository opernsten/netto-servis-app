import React from 'react';

class GlobalErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo });
    
    // Tady automaticky zjistíme, kde to spadlo
    console.group('💥 KRITICKÁ CHYBA KOMPONENTY');
    console.error('%cSoubor/Komponenta:', 'color: orange', errorInfo.componentStack);
    console.error('%cChyba:', 'color: red', error.message);
    console.groupEnd();
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-red-50 p-10">
          <div className="max-w-2xl bg-white p-8 rounded-xl shadow-xl border border-red-200">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Něco se pokazilo 😔</h1>
            <p className="mb-4 text-slate-600">Aplikace narazila na chybu. Podívej se do konzole (F12) pro přesný řádek kódu.</p>
            
            <div className="bg-slate-900 text-red-300 p-4 rounded font-mono text-xs overflow-auto max-h-60 mb-6">
                {this.state.error && this.state.error.toString()}
                <br/>
                {this.state.errorInfo && this.state.errorInfo.componentStack}
            </div>

            <button 
                onClick={() => window.location.reload()} 
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
            >
                Obnovit stránku
            </button>
          </div>
        </div>
      );
    }

    return this.props.children; 
  }
}

export default GlobalErrorBoundary;