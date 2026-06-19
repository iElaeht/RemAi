'use client';

import { useState } from 'react';
import { X, Loader2, Check } from 'lucide-react';
import { Comment } from '@/types/comment';
import { updateCommentAction } from '@/app/actions/Comments';
import Image from 'next/image';

interface EditBoxProps {
  comment: Comment;
  onCancel: () => void;
  onSuccess: () => void;
  onConfirmCancel: (action: () => void) => void;
}

export default function EditBox({ comment, onCancel, onSuccess, onConfirmCancel }: EditBoxProps) {
  const [isSaving, setIsSaving] = useState(false);
  
  // Limpiamos el contenido: eliminamos la etiqueta, entidades &nbsp; y espacios extra
  const cleanContent = (content: string) => {
    return content
      .replace(/<b>@.*?<\/b>/g, "") // Elimina la etiqueta del usuario
      .replace(/&nbsp;/g, " ")       // Convierte &nbsp; a espacio normal
      .trim();                      // Elimina espacios al inicio/final
  };

  const initialMessage = cleanContent(comment.content);
  const [message, setMessage] = useState(initialMessage);

  const handleCancel = () => {
    if (message !== initialMessage) onConfirmCancel(onCancel);
    else onCancel();
  };

  const handleSave = async () => {
    if (!message.trim()) return;
    
    setIsSaving(true);
    try {
      // Reconstruimos: Siempre usamos la etiqueta limpia en negrita
      const fullContent = `<b>@${comment.username}</b> ${message.trim()}`;
      const result = await updateCommentAction({
        commentId: comment.id,
        content: fullContent,
        mangaId: comment.manga_id
      });
      
      if (result.success) onSuccess();
      else alert(result.error || "Error al actualizar");
    } catch (error) {
      console.error("Error al guardar:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full bg-[#0a0f1d] border border-white/[0.08] rounded-xl p-3 shadow-2xl flex flex-col relative transition-all animate-in fade-in duration-300">
      <div className="flex justify-between items-start mb-3 gap-2">
        <div className="flex items-center gap-2 flex-grow overflow-hidden">
          <Image 
            src={comment.avatar_url || "/default-avatar.png"} 
            alt={comment.username} 
            width={32} height={32} 
            className="rounded-full border border-white/[0.1] flex-shrink-0"
          />
          <span className="text-sm font-bold text-white truncate">{comment.username}</span>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <button onClick={handleCancel} className="p-2 text-neutral-400 hover:text-red-400 transition-colors">
            <X size={18} />
          </button>
          <button 
            onClick={handleSave} 
            disabled={isSaving}
            className="flex items-center justify-center w-9 h-9 rounded-full bg-blue-600 hover:bg-blue-500 disabled:opacity-30 transition-all text-white"
          >
            {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} />}
          </button>
        </div>
      </div>

      <div className="flex items-center bg-white/5 rounded-lg p-3 border border-white/5 focus-within:border-blue-500/50 transition-colors">
        <span className="text-sm font-bold text-white whitespace-nowrap mr-2 select-none">
          @{comment.username}
        </span>
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full bg-transparent outline-none text-sm text-neutral-200 placeholder:text-neutral-600"
          placeholder="Escribe tu mensaje..."
          autoFocus
        />
      </div>
    </div>
  );
}