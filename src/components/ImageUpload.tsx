"use client";
import { useState, useRef } from "react";
import { UploadCloud, FileImage } from "lucide-react";

interface ImageUploadProps {
  onUploadSuccess: (url: string) => void;
  currentImage?: string;
  className?: string;
}

export function ImageUpload({ onUploadSuccess, currentImage, className = "" }: ImageUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [speed, setSpeed] = useState("");
  const [eta, setEta] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (selectedFile: File) => {
    if (!selectedFile.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }
    setError("");
    setFile(selectedFile);
    uploadFile(selectedFile);
  };

  const uploadFile = (fileToUpload: File) => {
    setUploading(true);
    setProgress(0);
    setSpeed("0 B/s");
    setEta("Calculating...");

    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append("file", fileToUpload);

    let prevLoaded = 0;
    let prevTime = Date.now();

    xhr.upload.addEventListener("progress", (event) => {
      if (event.lengthComputable) {
        const percentComplete = Math.round((event.loaded / event.total) * 100);
        setProgress(percentComplete);

        const currentTime = Date.now();
        const timeDiff = (currentTime - prevTime) / 1000; // in seconds
        
        // Update speed and ETA every 250ms
        if (timeDiff > 0.25) { 
          const bytesLoaded = event.loaded - prevLoaded;
          const currentSpeed = bytesLoaded / timeDiff; // bytes per second
          
          if (currentSpeed > 1024 * 1024) {
            setSpeed((currentSpeed / (1024 * 1024)).toFixed(1) + " MB/s");
          } else {
            setSpeed((currentSpeed / 1024).toFixed(1) + " KB/s");
          }

          const bytesRemaining = event.total - event.loaded;
          if (currentSpeed > 0) {
            const etaSeconds = Math.round(bytesRemaining / currentSpeed);
            if (etaSeconds > 60) {
              setEta(Math.floor(etaSeconds / 60) + "m " + (etaSeconds % 60) + "s left");
            } else {
              setEta(etaSeconds + "s left");
            }
          }

          prevLoaded = event.loaded;
          prevTime = currentTime;
        }
      }
    });

    xhr.addEventListener("load", () => {
      if (xhr.status === 200) {
        try {
          const response = JSON.parse(xhr.responseText);
          if (response.url) {
            setProgress(100);
            setEta("Complete");
            onUploadSuccess(response.url);
          } else {
            setError("Upload failed: No URL returned");
          }
        } catch (e) {
          setError("Upload failed: Invalid response");
        }
      } else {
        setError("Upload failed: " + xhr.statusText);
      }
      setUploading(false);
    });

    xhr.addEventListener("error", () => {
      setError("Network error occurred");
      setUploading(false);
    });

    xhr.open("POST", "/api/upload", true);
    xhr.send(formData);
  };

  return (
    <div className={`relative ${className}`}>
      {!uploading && (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all duration-200 ${
            dragActive 
              ? "border-[#aaff00] bg-[#aaff00]/5" 
              : "border-white/10 hover:border-white/20 bg-white/[0.02]"
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={handleChange}
            className="hidden"
          />
          
          {currentImage ? (
            <div className="flex flex-col items-center gap-4 w-full">
              <div className="w-full h-32 rounded-xl overflow-hidden border border-white/10 relative group">
                <img src={currentImage} alt="Current" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-white text-xs font-semibold bg-black/60 px-3 py-1.5 rounded-lg">Replace Image</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 py-4">
              <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-2">
                <UploadCloud size={20} className="text-[#aaff00]" />
              </div>
              <p className="font-sans text-[13.5px] font-semibold text-white">Click or drag image to upload</p>
              <p className="font-sans text-[11.5px] text-[#666]">SVG, PNG, JPG or GIF</p>
            </div>
          )}
          
          {error && <p className="mt-4 text-red-400 text-[11.5px] font-sans bg-red-400/10 px-3 py-1.5 rounded-md">{error}</p>}
        </div>
      )}

      {uploading && (
        <div className="border border-[#aaff00]/20 bg-[#1a1a1a] rounded-2xl p-5 shadow-[0_4px_30px_rgba(170,255,0,0.05)]">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-11 h-11 rounded-xl bg-[#aaff00]/10 flex items-center justify-center shrink-0 border border-[#aaff00]/20">
              <FileImage size={20} className="text-[#aaff00]" />
            </div>
            <div className="flex-1 min-w-0 pt-0.5">
              <p className="font-sans text-[13px] font-semibold text-white truncate mb-1.5">{file?.name}</p>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="inline-flex w-2 h-2 rounded-full bg-[#aaff00] animate-pulse"></span>
                  <p className="font-mono text-[10px] text-[#aaff00] tracking-wider uppercase">Uploading</p>
                </div>
                <p className="font-mono text-[11.5px] text-white font-bold">{progress}%</p>
              </div>
            </div>
          </div>
          
          <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden mb-3">
            <div 
              className="h-full bg-gradient-to-r from-[#88cc00] to-[#aaff00] transition-all duration-300 ease-out relative"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
            </div>
          </div>
          
          <div className="flex justify-between items-center pt-2 border-t border-white/5">
            <div className="flex flex-col">
              <span className="font-mono text-[9px] text-[#555] uppercase tracking-wider mb-0.5">Speed</span>
              <span className="font-mono text-[11px] text-[#ccc]">{speed}</span>
            </div>
            <div className="flex flex-col text-right">
              <span className="font-mono text-[9px] text-[#555] uppercase tracking-wider mb-0.5">Time Left</span>
              <span className="font-mono text-[11px] text-[#ccc]">{eta}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
