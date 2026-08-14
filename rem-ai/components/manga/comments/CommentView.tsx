"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import { Edit2, CornerUpLeft, Trash2 } from "lucide-react";
import { Comment } from "@/types/comment";
import DOMPurify from "dompurify";

interface CommentViewProps {
  comment: Comment;
  formattedDate: string;
  onEdit: () => void;
  onReply: () => void;
  onDelete: () => void;
  onOpenImage: () => void;
}

export default function CommentView({
  comment,
  formattedDate,
  onEdit,
  onReply,
  onDelete,
  onOpenImage,
}: CommentViewProps) {
  const { user } = useUser();
  const isOwner = user?.id === comment.user_id;
  
  const [avatarError, setAvatarError] = useState(false);
  const [imageError, setImageError] = useState(false);

  const sanitizedContent =
    typeof window !== "undefined"
      ? DOMPurify.sanitize(comment.content)
      : comment.content;

  return (
    <div className="w-full bg-[#1e293b]/40 border border-white/[0.05] rounded-2xl p-5 transition-all hover:bg-[#1e293b]/60 flex flex-col gap-3 shadow-sm">
      {/* CABECERA */}
      <div className="flex justify-between items-start gap-4">
        <div className="flex items-center gap-3">
          <div className="relative w-9 h-9 rounded-full overflow-hidden ring-2 ring-white/5 flex-shrink-0">
            {!avatarError && comment.avatar_url ? (
              <Image
                src={comment.avatar_url}
                alt={comment.username}
                fill
                unoptimized
                className="object-cover"
                onError={() => setAvatarError(true)}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-[10px] text-neutral-400 bg-neutral-800">
                {comment.username.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <span className="text-sm font-semibold text-white tracking-wide">
            {comment.username}
          </span>
        </div>

        {isOwner && (
          <div className="flex items-center gap-4">
            <button
              onClick={onEdit}
              className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition-colors cursor-pointer"
            >
              <Edit2 size={14} />
              <span className="hidden sm:inline">Editar</span>
            </button>

            <button
              onClick={onDelete}
              className="flex items-center gap-1.5 text-xs text-red-400/70 hover:text-red-400 transition-colors cursor-pointer"
            >
              <Trash2 size={14} />
              <span className="hidden sm:inline">Eliminar</span>
            </button>
          </div>
        )}
      </div>

      {/* CUERPO */}
      <div className="flex flex-col ml-0 sm:ml-12 gap-3">
        <div
          className="text-[15px] text-neutral-200 leading-relaxed prose prose-invert"
          dangerouslySetInnerHTML={{ __html: sanitizedContent }}
        />

        {comment.image_url && !imageError && (
          <div 
            className="relative overflow-hidden rounded-xl border border-white/10 mt-1 max-w-[280px] aspect-[4/3] cursor-pointer group"
            onClick={onOpenImage}
          >
            <Image
              src={comment.image_url}
              alt="Adjunto"
              fill
              unoptimized
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              onError={() => setImageError(true)}
            />
          </div>
        )}
      </div>

      {/* FOOTER */}
      <div className="flex items-center gap-3 mt-2 ml-0 sm:ml-12">
        <span className="text-[11px] font-medium text-neutral-500">
          {formattedDate}
        </span>
        <span className="text-neutral-700">•</span>
        <button
          onClick={onReply}
          className="flex items-center gap-1.5 text-[12px] font-semibold text-blue-400/80 hover:text-blue-300 transition-colors cursor-pointer"
        >
          <CornerUpLeft size={13} />
          Responder
        </button>
      </div>
    </div>
  );
}