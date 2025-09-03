"use client";

import { useState, useEffect } from "react";

const VisualizationPage = () => {
  const [data, setData] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [debug, setDebug] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  const addDebug = (message: string) => {
    setDebug(prev => [...prev, `${new Date().toISOString()}: ${message}`]);
  };

  useEffect(() => {
    setMounted(true);
    addDebug('Component mounted');
    
    // Get data from URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const dataParam = urlParams.get('data');
    
    addDebug(`URL Parameters: ${dataParam ? 'data present' : 'no data'}`);
    console.log('URL Parameters:', { dataParam: dataParam ? 'present' : 'missing' });
    
    if (dataParam) {
      try {
        const decodedData = decodeURIComponent(dataParam);
        addDebug(`Data decoded successfully, length: ${decodedData.length}`);
        console.log('Decoded data length:', decodedData.length);
        setData(decodedData);
      } catch (err) {
        addDebug(`Error decoding data: ${err}`);
        console.error('Error decoding data:', err);
      }
    } else {
      addDebug('No data parameter found');
    }
    
    setLoading(false);
    addDebug('Loading state set to false');
  }, []);

  // Don't render until mounted
  if (!mounted) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading visualization...</p>
          <div className="mt-4 text-sm text-gray-500">
            <p>Debug Info:</p>
            {debug.map((msg, i) => (
              <p key={i} className="text-xs">{msg}</p>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Data Visualization
        </h1>
        
        {data ? (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Visualization Data</h2>
            <div className="bg-gray-100 p-4 rounded border">
              <pre className="text-sm overflow-auto max-h-96">
                {data}
              </pre>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Data length: {data.length} characters
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <p className="text-gray-500">No visualization data provided.</p>
            <p className="text-sm text-gray-400 mt-2">
              Current URL: {window.location.href}
            </p>
          </div>
        )}
        
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Debug Information</h3>
          <div className="bg-gray-100 p-4 rounded border">
            {debug.map((msg, i) => (
              <p key={i} className="text-sm font-mono">{msg}</p>
            ))}
          </div>
        </div>
        
        <div className="mt-6 text-center">
          <button 
            onClick={() => window.location.href = '/'}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create New Visualization
          </button>
        </div>
      </div>
    </div>
  );
};

export default VisualizationPage;
