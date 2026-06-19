'use client';

import { useState, useRef, useEffect } from 'react';
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
            <img src={user.imageUrl} className="w-8 h-8 rounded-full border border-white/[0.1]" alt="Avatar" />
            <span className="text-sm font-bold text-white tracking-wide">
              {user.username || user.firstName || 'Usuario'}
            </span>
          </div>

          <div className="flex gap-1">
            <button onClick={() => fileInputRef.current?.click()} className="p-2 text-neutral-400 hover:text-white transition-colors">
              <Paperclip size={16} />
            </button>
            <button onClick={onCancel} className="p-2 text-neutral-400 hover:text-red-400 transition-colors">
              <X size={16} />
            </button>
            <button onClick={handleSend} disabled={isSubmitting} className="ml-2 flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 hover:bg-blue-500 disabled:opacity-30 transition-all text-white">
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
            className="mt-2 relative w-16 h-16 rounded-lg overflow-hidden border border-white/[0.1] cursor-pointer" 
            onClick={() => setPreviewImage(previewUrl)}
          >
            <img src={previewUrl} alt="adjunto" className="w-full h-full object-cover" />
            <button 
              onClick={(e) => { e.stopPropagation(); setSelectedFile(null); setPreviewUrl(null); }} 
              className="absolute top-0 right-0 p-1 bg-black/50 text-white"
            >
              <X size={10}/>
            </button>
          </div>
        )}
      </div>

      {previewImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" onClick={() => setPreviewImage(null)}>
          <img src={previewImage} alt="Preview" className="max-w-full max-h-[80vh] rounded-lg shadow-2xl" />
        </div>
      )}
    </div>
  );
}