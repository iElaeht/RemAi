'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Paperclip, X, Loader2, Send } from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import { addCommentAction } from '@/app/actions/Comments';
import { uploadToCloudinary } from '@/lib/cloudinary';

interface ReplyBoxProps {
  parentId: string;
  parentUsername: string; // Este es el usuario al que se responde
  mangaId: string;
  onCancel: () => void;
  onSuccess: () => void;
}

export default function ReplyBox({ parentId, parentUsername, mangaId, onCancel, onSuccess }: ReplyBoxProps) {
  const { user } = useUser();
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Estados para control de errores de imágenes
  const [avatarError, setAvatarError] = useState(false);
  const [previewError, setPreviewError] = useState(false);
  const [modalImageError, setModalImageError] = useState(false);

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = `<b>@${parentUsername}</b>&nbsp;`;
      
      const range = document.createRange();
      const sel = window.getSelection();
      range.selectNodeContents(editorRef.current);
      range.collapse(false);
      sel?.removeAllRanges();
      sel?.addRange(range);
    }
  }, [parentUsername]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setPreviewError(false);
  };

  const handleSend = async () => {
    if (!user || isSubmitting) return;
    
    const content = editorRef.current?.innerHTML || '';
    if (!content.trim() && !selectedFile) return;

    setIsSubmitting(true);
    let finalImageUrl = null;

    try {
      if (selectedFile) finalImageUrl = await uploadToCloudinary(selectedFile);

      // CORRECCIÓN: Se envía parentUsername para llenar la columna reply_to_username
      const res = await addCommentAction({
        mangaId,
        content,
        username: user.username || user.firstName || 'Usuario',
        avatarUrl: user.imageUrl,
        imageUrl: finalImageUrl,
        parentId,
        replyToUsername: parentUsername 
      });
      
      if (res.success) onSuccess();
      else alert(res.error || "Error al publicar.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) return null;

  return (
    <div className="ml-12 my-2 animate-in fade-in zoom-in duration-200">
      <div className="bg-[#0a0f1d] border border-white/[0.08] rounded-xl p-3 shadow-2xl relative">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            <div className="relative w-8 h-8 rounded-full overflow-hidden border border-white/[0.1] flex-shrink-0">
              {!avatarError && user.imageUrl ? (
                <Image 
                  src={user.imageUrl} 
                  alt="Avatar" 
                  fill 
                  unoptimized
                  className="object-cover" 
                  onError={() => setAvatarError(true)}
                />
              ) : (
                <div className="flex items-center justify-center h-full text-[9px] text-neutral-400 bg-neutral-800">
                  U
                </div>
              )}
            </div>
            <span className="text-sm font-bold text-white tracking-wide">
              {user.username || user.firstName || 'Usuario'}
            </span>
          </div>

          <div className="flex gap-1">
            <button 
              onClick={() => fileInputRef.current?.click()} 
              className="p-2 text-neutral-400 hover:text-white transition-colors cursor-pointer"
              disabled={isSubmitting}
            >
              <Paperclip size={16} />
            </button>
            <button 
              onClick={onCancel} 
              className="p-2 text-neutral-400 hover:text-red-400 transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>
            <button 
              onClick={handleSend} 
              disabled={isSubmitting} 
              className="ml-2 flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 hover:bg-blue-500 disabled:opacity-30 transition-all text-white cursor-pointer"
            >
              {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
            </button>
          </div>
        </div>

        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />

        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          className="w-full bg-transparent outline-none text-sm text-neutral-200 min-h-[50px] break-words p-1"
        />

        {previewUrl && (
          <div 
            className="mt-2 relative w-16 h-16 rounded-lg overflow-hidden border border-white/[0.1] cursor-pointer bg-neutral-900" 
            onClick={() => {
              setPreviewImage(previewUrl);
              setModalImageError(false);
            }}
          >
            {!previewError ? (
              <Image 
                src={previewUrl} 
                alt="adjunto" 
                fill 
                unoptimized
                className="object-cover"
                onError={() => setPreviewError(true)}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-[9px] text-neutral-500 text-center p-1">
                Error
              </div>
            )}
            <button 
              onClick={(e) => { e.stopPropagation(); setSelectedFile(null); setPreviewUrl(null); setPreviewError(false); }} 
              className="absolute top-0 right-0 p-1 bg-black/50 text-white cursor-pointer hover:bg-red-500 transition-colors"
            >
              <X size={10}/>
            </button>
          </div>
        )}
      </div>

      {previewImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" 
          onClick={() => {
            setPreviewImage(null);
            setModalImageError(false);
          }}
        >
          <div 
            className="relative max-w-full max-h-[80vh] w-[400px] h-[500px] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {!modalImageError ? (
              <Image 
                src={previewImage} 
                alt="Preview" 
                fill
                unoptimized
                className="object-contain rounded-lg shadow-2xl"
                onError={() => setModalImageError(true)}
              />
            ) : (
              <div className="text-xs text-neutral-400 p-4 text-center">
                No se pudo cargar la imagen
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}