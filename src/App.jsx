import React from "react";
import UploadForm from "./components/UploadForm";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full bg-white p-6 rounded-2xl shadow-lg">
        {/* <h1 className="text-2xl font-bold mb-4 text-center">
          Job Application Assistant
        </h1> */}
        <UploadForm />
      </div>
    </div>
  );
}

