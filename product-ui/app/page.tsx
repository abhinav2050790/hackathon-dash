"use client";

import { useState, useRef } from "react";

export default function IndustrialAIDashboard() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");
  
  const [chatQuestion, setChatQuestion] = useState("");
  const [chatAnswer, setChatAnswer] = useState("");
  const [chatLoading, setChatLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true); setError(""); setChatAnswer("");
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/backend/process-document", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) throw new Error("Upload failed");
      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAskQuestion = async () => {
    if (!chatQuestion || !result) return;
    setChatLoading(true);
    try {
      const response = await fetch("/api/backend/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          document_text: result.extracted_text_preview,
          question: chatQuestion
        }),
      });
      const data = await response.json();
      setChatAnswer(data.answer);
    } catch (err) {
      setChatAnswer("Error connecting to backend");
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-mono">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Industrial AI Backend</h1>
          <p className="text-gray-500 mt-2">Document Processing & Chat</p>
        </header>

        {error && <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded">{error}</div>}

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Upload Document</h2>
          <div className="space-y-4">
            <input
              type="file"
              accept=".pdf,.txt"
              onChange={handleFileChange}
              className="w-full border border-gray-300 rounded p-2"
            />
            <button
              onClick={handleUpload}
              disabled={!file || loading}
              className="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-50"
            >
              {loading ? "Processing..." : "Ingest File"}
            </button>
          </div>
        </div>

        {result && (
          <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
            <h2 className="text-xl font-semibold">Extracted Product</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="text-gray-500">Name:</span> <span className="font-medium ml-2">{result.product.product_name}</span></div>
              <div><span className="text-gray-500">SKU:</span> <span className="font-medium ml-2">{result.product.sku}</span></div>
              <div><span className="text-gray-500">Manufacturer:</span> <span className="font-medium ml-2">{result.product.manufacturer}</span></div>
              <div><span className="text-gray-500">Category:</span> <span className="font-medium ml-2">{result.product.category}</span></div>
              <div><span className="text-gray-500">Voltage:</span> <span className="font-medium ml-2">{result.product.operating_voltage}</span></div>
              <div><span className="text-gray-500">Current:</span> <span className="font-medium ml-2">{result.product.current_rating}</span></div>
              <div><span className="text-gray-500">Material:</span> <span className="font-medium ml-2">{result.product.material}</span></div>
              <div><span className="text-gray-500">Dimensions:</span> <span className="font-medium ml-2">{result.product.dimensions}</span></div>
            </div>
            <details className="text-sm text-gray-600">
              <summary className="cursor-pointer font-medium">Show Full JSON</summary>
              <pre className="mt-2 p-4 bg-gray-100 rounded overflow-auto max-h-64">{JSON.stringify(result.product, null, 2)}</pre>
            </details>
          </div>
        )}

        {result && (
          <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
            <h2 className="text-xl font-semibold">Chat with Document</h2>
            <div className="flex gap-2">
              <input
                value={chatQuestion}
                onChange={(e) => setChatQuestion(e.target.value)}
                placeholder="Ask about the document..."
                className="flex-1 border border-gray-300 rounded px-4 py-2"
              />
              <button
                onClick={handleAskQuestion}
                disabled={chatLoading || !chatQuestion}
                className="bg-green-600 text-white px-6 py-2 rounded disabled:opacity-50"
              >
                {chatLoading ? "..." : "Send"}
              </button>
            </div>
            {chatAnswer && (
              <div className="bg-gray-50 p-4 rounded text-sm whitespace-pre-wrap">
                {chatAnswer}
              </div>
            )}
          </div>
        )}

        <div className="text-center text-sm text-gray-500">
          Backend: <code>{process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000"}</code>
        </div>
      </div>
    </div>
  );
}