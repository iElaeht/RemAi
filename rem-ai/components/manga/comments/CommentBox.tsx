'use client';

import { useState, useRef } from 'react';
import { Paperclip, Send, X, Loader2 } from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import { addCommentAction } from '@/app/actions/Comments';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { deleteImageAction } from '@/app/actions/Cloudinary';

interface CommentBoxProps {
  mangaId: string;
  placeholder?: string;
  onCommentSent?: () => void;
}

export default function CommentBox({ mangaId, placeholder = "Escribe un comentario...", onCommentSent }: CommentBoxProps) {
  const { user, isLoaded } = useUser();
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isTextEmpty, setIsTextEmpty] = useState(true);
  const [isFocused, setIsFocused] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Estados para manejar el archivo localmente antes de enviar
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    setIsTextEmpty(e.currentTarget.innerText.trim().length === 0);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file)); // Vista previa local inmediata
  };

  const handleClear = async () => {
    // Si ya se había subido a Cloudinary, lo eliminamos
    if (uploadedImageUrl) {
      const publicId = uploadedImageUrl.split('/').slice(-2).join('/').split('.')[0];
      await deleteImageAction(publicId);
      setUploadedImageUrl(null);
    }
    
    if (editorRef.current) {
        editorRef.current.innerText = '';
    }
    setSelectedFile(null);
    setPreviewUrl(null);
    setIsTextEmpty(true);
    setIsFocused(false);
  };

  const handleSendClick = async () => {
    if (!user || isSubmitting) return;
    const content = editorRef.current?.innerText || '';
    if (!content.trim() && !selectedFile) return;

    setIsSubmitting(true);
    let finalImageUrl = null;

    try {
      // Subida real a Cloudinary en el momento del envío
      if (selectedFile) {
        finalImageUrl = await uploadToCloudinary(selectedFile);
      }

      const res = await addCommentAction({
        mangaId,
        content: content.trim(),
        username: user.username || user.firstName || 'Usuario',
        avatarUrl: user.imageUrl,
        imageUrl: finalImageUrl
      });
      
      if (res.success) {
        handleClear();
        if (onCommentSent) onCommentSent();
      } else {
        alert(res.error || "Hubo un problema.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isLoaded || !user) return null;

return (
  <div className="w-full">
    {/* Contenedor: Fondo mejorado con un tono más integrado y un borde sutil */}
    <div className="bg-[#101625] border border-white/[0.05] rounded-xl p-3 shadow-lg flex flex-col relative focus-within:border-white/[0.1] transition-all">
      
      {/* CABECERA: Avatar y Nombre (manteniendo posición original) */}
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <img src={user.imageUrl} className="w-8 h-8 rounded-full ring-1 ring-white/10" alt="Avatar" />
          <span className="text-sm font-semibold text-white tracking-wide">
            {user.username || user.firstName || 'Usuario'}
          </span>
        </div>

        {/* HERRAMIENTAS: Manteniendo posición y orden original */}
        <div className="flex gap-1">
          <button 
            onClick={() => fileInputRef.current?.click()} 
            className="p-2 text-neutral-400 hover:text-blue-400 transition-colors"
            disabled={isSubmitting}
          >
            {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Paperclip size={16} />}
          </button>
          <button onClick={handleClear} className="p-2 text-neutral-400 hover:text-red-400 transition-colors">
            <X size={16} />
          </button>
          <button 
            onClick={handleSendClick} 
            disabled={isSubmitting || (isTextEmpty && !selectedFile)} 
            className="ml-2 flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 hover:bg-blue-500 disabled:opacity-30 transition-all text-white"
          >
            {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
          </button>
        </div>
      </div>

      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />

      {/* ÁREA DE TEXTO: Ajuste de color de placeholder para mejor lectura */}
      <div className="relative">
        {isTextEmpty && !isFocused && (
          <div className="absolute top-0 left-0 text-neutral-500 text-sm pointer-events-none select-none">
            {placeholder}
          </div>
        )}

        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onInput={handleInput}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="w-full bg-transparent outline-none text-sm text-neutral-200 min-h-[50px] relative z-10 break-words leading-relaxed"
        />
      </div>

      {/* VISTA PREVIA: Borde y esquina más armoniosos */}
      {previewUrl && (
        <div className="mt-2 relative w-16 h-16 rounded-lg overflow-hidden border border-white/[0.08] cursor-pointer hover:opacity-90" onClick={() => setPreviewImage(previewUrl)}>
          <img src={previewUrl} alt="adjunto" className="w-full h-full object-cover" />
        </div>
      )}
    </div>

    {/* MODAL: Sin cambios en lógica */}
    {previewImage && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" onClick={() => setPreviewImage(null)}>
        <img src={previewImage} alt="Preview" className="max-w-full max-h-[80vh] rounded-lg shadow-2xl" />
      </div>
    )}
  </div>
);
}