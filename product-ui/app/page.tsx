"use client";

import { useState, useEffect, useRef } from "react";

// --- NOTHING OS DOT-MATRIX DYNAMIC CANVAS ---
function NothingCanvasBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    let mouse = { x: -1000, y: -1000 };
    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    window.addEventListener("mousemove", handleMouseMove);

    const spacing = 35;

    const render = () => {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, width, height);

      for (let x = spacing; x < width; x += spacing) {
        for (let y = spacing; y < height; y += spacing) {
          const dx = mouse.x - x;
          const dy = mouse.y - y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          let radius = 1.5;
          let alpha = 0.18;

          if (dist < 180) {
            const factor = 1 - dist / 180;
            radius += factor * 4;
            alpha += factor * 0.8;
            
            if (dist < 50) {
              ctx.fillStyle = `rgba(255, 31, 61, ${alpha})`;
            } else {
              ctx.fillStyle = `rgba(0, 0, 0, ${alpha + 0.15})`;
            }
          } else {
            ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
          }

          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />;
}

export default function NothingOSDashboard() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");
  
  const [chatQuestion, setChatQuestion] = useState("");
  const [chatAnswer, setChatAnswer] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  
  const [visualPrompt, setVisualPrompt] = useState("");
  const [visualVideo, setVisualVideo] = useState("");
  const [visualLoading, setVisualLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true); setError(""); setChatAnswer(""); setVisualPrompt(""); setVisualVideo("");
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/backend/process-document", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) throw new Error("Hardware telemetry link failed.");
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
      setChatAnswer("Neural link timeout.");
    } finally {
      setChatLoading(false);
    }
  };

 const handleGenerateVisual = async () => {
    setVisualPrompt("Video generation disabled on free tier (512MB limit). Deploy to HF Spaces for GPU.");
    setVisualLoading(false);
  };
  
  return (
    <div className="min-h-screen bg-white text-black p-6 md:p-12 font-mono uppercase tracking-wider relative overflow-hidden selection:bg-[#ff1f3d] selection:text-white">
      
      <style dangerouslySetInnerHTML={{ __html: `
        html, body {
          background-color: #ffffff !important;
          color: #000000 !important;
        }
      `}} />

      <NothingCanvasBackground />

      <div className="max-w-[1600px] mx-auto relative z-10 space-y-8">
        
        <header className="border-2 border-black bg-white p-6 md:p-8 rounded-[2rem] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="flex items-center gap-5">
            <div className="w-5 h-5 rounded-full bg-[#ff1f3d] animate-ping" />
            <div>
              <div className="text-[10px] tracking-[0.3em] text-zinc-500 font-bold mb-1">
                NOTHING OS // HARDWARE AUDIT V3.6
              </div>
              <h1 className="text-3xl font-black tracking-tighter text-black flex items-center gap-2">
                NEXUS<span className="text-[#ff1f3d]">.SPEC</span>
              </h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
            <div className="bg-zinc-100 border-2 border-black px-4 py-3 rounded-2xl flex items-center gap-3 text-xs flex-1 lg:flex-none">
              <span className="text-zinc-500 font-bold">SOURCE:</span>
              <input 
                type="file" accept=".pdf" onChange={handleFileChange} 
                className="text-xs text-black file:mr-3 file:py-1.5 file:px-4 file:rounded-xl file:border-2 file:border-black file:text-[10px] file:font-black file:bg-black file:text-white hover:file:bg-[#ff1f3d] cursor-pointer transition-all"
              />
            </div>
            <button 
              onClick={handleUpload} disabled={!file || loading}
              className="px-8 py-3.5 bg-black hover:bg-[#ff1f3d] text-white font-black text-xs rounded-2xl border-2 border-black transition-all uppercase tracking-widest disabled:opacity-40 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-none"
            >
              {loading ? "PARSING MATRIX..." : "INGEST FILE"}
            </button>
          </div>
        </header>

        {error && <div className="bg-red-50 border-2 border-[#ff1f3d] p-4 rounded-2xl text-[#ff1f3d] text-xs font-bold tracking-widest">{error}</div>}

        {result && (
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
            
            <div className="xl:col-span-7 space-y-6">
              <div className="border-2 border-black bg-white p-8 rounded-[2.5rem] relative overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <div className="absolute top-0 right-0 w-36 h-36 bg-[#ff1f3d]/10 rounded-full blur-3xl pointer-events-none" />

                <div className="flex justify-between items-start mb-6">
                  <div>
                    <span className="text-[10px] tracking-widest text-white bg-black font-black px-3 py-1.5 rounded-xl uppercase inline-block mb-3 border-2 border-black">
                      CLASS: {result.product.category}
                    </span>
                    <h2 className="text-3xl font-black text-black tracking-tight">{result.product.product_name}</h2>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] text-zinc-400 tracking-widest block mb-1 font-bold">PART IDENTIFIER</span>
                    <span className="text-xs font-black text-[#ff1f3d] bg-zinc-100 px-3 py-2 rounded-xl border-2 border-black">{result.product.sku}</span>
                  </div>
                </div>

                <p className="text-xs text-zinc-700 leading-relaxed bg-zinc-50 p-5 rounded-2xl border-2 border-black mb-6 font-sans">
                  {result.product.product_summary}
                </p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="bg-zinc-50 border-2 border-black p-4 rounded-2xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                    <span className="text-[9px] text-zinc-400 block mb-1 font-bold">VOLTAGE</span>
                    <span className="text-xs font-black text-black">{result.product.operating_voltage}</span>
                  </div>
                  <div className="bg-zinc-50 border-2 border-black p-4 rounded-2xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                    <span className="text-[9px] text-zinc-400 block mb-1 font-bold">CURRENT</span>
                    <span className="text-xs font-black text-black">{result.product.current_rating}</span>
                  </div>
                  <div className="bg-zinc-50 border-2 border-black p-4 rounded-2xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                    <span className="text-[9px] text-zinc-400 block mb-1 font-bold">WEIGHT</span>
                    <span className="text-xs font-black text-black">{result.product.weight}</span>
                  </div>
                  <div className="bg-zinc-50 border-2 border-black p-4 rounded-2xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                    <span className="text-[9px] text-zinc-400 block mb-1 font-bold">MTBF</span>
                    <span className="text-xs font-black text-black">{result.product.mtbf}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4 text-xs">
                  <div className="bg-zinc-50 border-2 border-black p-4 rounded-2xl flex justify-between items-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                    <span className="text-zinc-500 text-[10px] font-bold">MATERIAL:</span>
                    <span className="text-black font-black">{result.product.material}</span>
                  </div>
                  <div className="bg-zinc-50 border-2 border-black p-4 rounded-2xl flex justify-between items-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                    <span className="text-zinc-500 text-[10px] font-bold">DIMENSIONS:</span>
                    <span className="text-black font-black">{result.product.dimensions}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border-2 border-black bg-white p-6 rounded-[2rem] flex flex-col justify-between shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                  <span className="text-[9px] text-zinc-500 uppercase tracking-widest font-bold">Lifecycle Status</span>
                  <span className="text-xs font-black text-emerald-600 mt-3">{result.product.lifecycle_status}</span>
                </div>
                <div className="border-2 border-black bg-white p-6 rounded-[2rem] flex flex-col justify-between shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                  <span className="text-[9px] text-zinc-500 uppercase tracking-widest font-bold">RoHS Compliance</span>
                  <span className="text-xs font-black text-emerald-600 mt-3">{result.product.rohs_compliant}</span>
                </div>
                <div className="border-2 border-black bg-white p-6 rounded-[2rem] flex flex-col justify-between shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                  <span className="text-[9px] text-zinc-500 uppercase tracking-widest font-bold">Confidence Index</span>
                  <span className="text-xs font-black text-black mt-3">{(result.product.confidence_score * 100).toFixed(0)}% ACCURACY</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border-2 border-black bg-white p-6 rounded-[2rem] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                  <span className="text-[9px] text-zinc-400 uppercase tracking-widest block mb-4 font-bold">Classification Taxonomy</span>
                  <div className="space-y-3 text-xs">
                    <div className="flex justify-between border-b border-zinc-200 pb-2"><span className="text-zinc-500">HS Code:</span> <span className="text-black font-black">{result.product.hs_code}</span></div>
                    <div className="flex justify-between border-b border-zinc-200 pb-2"><span className="text-zinc-500">UNSPSC Code:</span> <span className="text-black font-black">{result.product.inferred_industry_code}</span></div>
                    <div className="flex justify-between"><span className="text-zinc-500">Origin:</span> <span className="text-black font-bold">{result.product.country_of_origin}</span></div>
                  </div>
                </div>

                <div className="border-2 border-black bg-white p-6 rounded-[2rem] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                  <span className="text-[9px] text-zinc-400 uppercase tracking-widest block mb-4 font-bold">Certified Approvals</span>
                  <div className="flex flex-wrap gap-2">
                    {result.product.compliance_standards?.map((std: string, idx: number) => (
                      <span key={idx} className="bg-zinc-100 border-2 border-black text-black text-[10px] font-black px-3 py-2 rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                        {std}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="xl:col-span-5 space-y-6 flex flex-col">
              
              {/* CAD Blueprint Video Generator & Player */}
              <div className="border-2 border-black bg-white p-8 rounded-[2.5rem] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">
                <div className="flex justify-between items-center mb-5">
                  <h3 className="text-xs font-black text-black uppercase tracking-wider flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#ff1f3d] border border-black" /> 3D CAD Blueprint Video Vector
                  </h3>
                  <button 
                    onClick={handleGenerateVisual} disabled={visualLoading}
                    className="text-[10px] bg-black hover:bg-[#ff1f3d] text-white px-5 py-2.5 rounded-xl font-black transition-all uppercase tracking-wider disabled:opacity-30 border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
                  >
                    {visualLoading ? "RENDERING VIDEO..." : "RENDER TWIN"}
                  </button>
                </div>

                {visualPrompt && (
                  <div className="bg-zinc-50 border-2 border-black p-4 rounded-2xl text-[11px] text-zinc-800 mb-4 leading-relaxed">
                    <span className="text-[#ff1f3d] font-black block mb-1">// STATUS:</span>
                    {visualPrompt}
                  </div>
                )}
              </div>

              {/* Neural RAG Chat */}
              <div className="border-2 border-black bg-white p-8 rounded-[2.5rem] flex-1 flex flex-col justify-between shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <div>
                  <h3 className="text-xs font-black text-black uppercase tracking-wider mb-5 flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-black border border-black" /> Neural Query Interface
                  </h3>
                  
                  <div className="flex gap-3 mb-5">
                    <input 
                      value={chatQuestion} onChange={(e) => setChatQuestion(e.target.value)}
                      className="flex-1 bg-zinc-50 border-2 border-black rounded-2xl px-4 py-3 text-xs text-black focus:outline-none focus:border-[#ff1f3d] transition-all font-mono shadow-[inset_2px_2px_0px_0px_rgba(0,0,0,0.05)]"
                      placeholder="Query tolerances, parameters..."
                    />
                    <button 
                      onClick={handleAskQuestion} disabled={chatLoading || !chatQuestion}
                      className="bg-black hover:bg-[#ff1f3d] text-white px-6 py-3 rounded-2xl font-black text-xs transition-all uppercase disabled:opacity-30 border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
                    >
                      {chatLoading ? "..." : "SEND"}
                    </button>
                  </div>

                  {chatAnswer && (
                    <div className="bg-zinc-50 border-2 border-black p-5 rounded-2xl text-xs text-zinc-800 whitespace-pre-wrap max-h-64 overflow-y-auto leading-relaxed shadow-[inset_2px_2px_0px_0px_rgba(0,0,0,0.05)]">
                      <span className="text-[#ff1f3d] font-black block mb-2">// RESPONSE:</span>
                      {chatAnswer}
                    </div>
                  )}
                </div>

                <div className="mt-8 pt-4 border-t-2 border-dashed border-zinc-300 text-[9px] text-zinc-400 text-center tracking-widest uppercase font-bold">
                  NOTHING HARDWARE SPEC • GEMINI 3.6 FLASH CORE
                </div>
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}