"use client";

import { useUser } from "@clerk/nextjs";
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

  const sanitizedContent =
    typeof window !== "undefined"
      ? DOMPurify.sanitize(comment.content)
      : comment.content;

  return (
    <div className="w-full bg-[#1e293b]/40 border border-white/[0.05] rounded-2xl p-5 transition-all hover:bg-[#1e293b]/60 flex flex-col gap-3 shadow-sm">
      {/* CABECERA */}
      <div className="flex justify-between items-start gap-4">
        <div className="flex items-center gap-3">
          <img
            src={comment.avatar_url}
            className="w-9 h-9 rounded-full object-cover ring-2 ring-white/5"
            alt={comment.username}
          />
          <span className="text-sm font-semibold text-white tracking-wide">
            {comment.username}
          </span>
        </div>

        {isOwner && (
          <div className="flex items-center gap-4">
            {/* Botón Editar */}
            <button
              onClick={onEdit}
              className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition-colors"
            >
              <Edit2 size={14} />
              <span className="hidden sm:inline">Editar</span>
            </button>

            {/* Botón Eliminar */}
            <button
              onClick={onDelete}
              className="flex items-center gap-1.5 text-xs text-red-400/70 hover:text-red-400 transition-colors"
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

        {comment.image_url && (
          <div className="relative overflow-hidden rounded-xl border border-white/10 mt-1 max-w-[280px]">
            <img
              src={comment.image_url}
              onClick={onOpenImage}
              className="w-full object-cover cursor-pointer hover:scale-105 transition-transform duration-500"
              alt="Adjunto"
              loading="lazy"
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
          className="flex items-center gap-1.5 text-[12px] font-semibold text-blue-400/80 hover:text-blue-300 transition-colors"
        >
          <CornerUpLeft size={13} />
          Responder
        </button>
      </div>
    </div>
  );
}
