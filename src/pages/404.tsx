import React from "react";
import { AlertCircle, Home, ArrowLeft } from "lucide-react";

const ErrorScreen = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="text-center space-y-6 max-w-md">
        <div className="flex justify-center">
          <AlertCircle size={64} className="text-red-500" />
        </div>
        <div>
          <h1 className="text-2xl font-bold mb-2">Page Not Found</h1>
          <p className="text-gray-600">
            Sorry, the page you are looking for might be moved or does not
            exist.
          </p>
        </div>
        <div className="flex gap-4 justify-center">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
          >
            <ArrowLeft size={20} />
            Go Back
          </button>
          <button
            type="button"
            onClick={() => (window.location.href = "/")}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Home size={20} />
            Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorScreen;
