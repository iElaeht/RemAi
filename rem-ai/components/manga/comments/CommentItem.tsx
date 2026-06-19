"use client";

import { useState, useMemo } from "react";
import { Comment } from "@/types/comment";
import CommentView from "./CommentView";
import EditBox from "./EditBox";
import ReplyBox from "./ReplyBox";
import ImageModal from "./ImageModal"; // Importación del nuevo componente

interface CommentItemProps {
  comment: Comment;
  isReply?: boolean;
  onDelete: () => void;
  onConfirmCancel: (action: () => void) => void;
}

export default function CommentItem({
  comment,
  isReply = false,
  onDelete,
  onConfirmCancel,
}: CommentItemProps) {
  const [mode, setMode] = useState<"view" | "edit" | "reply">("view");
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para controlar el modal

  // Procesamos la fecha a formato dd-mm-yyyy de manera eficiente
  const formattedDate = useMemo(() => {
    const date = new Date(comment.created_at);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }, [comment.created_at]);

  return (
    <div
      className={`w-full transition-all duration-300 ${isReply ? "ml-0" : ""}`}
    >
      {/* Vista principal */}
      {mode !== "edit" && (
        <CommentView
          comment={comment}
          formattedDate={formattedDate}
          onEdit={() => setMode("edit")}
          onReply={() =>
            setMode((prev) => (prev === "reply" ? "view" : "reply"))
          }
          onDelete={onDelete}
          onOpenImage={() => setIsModalOpen(true)}
        />
      )}

      {/* Edición */}
      {mode === "edit" && (
        <EditBox
          comment={comment}
          onCancel={() => setMode("view")}
          onSuccess={() => setMode("view")}
          onConfirmCancel={onConfirmCancel}
        />
      )}

      {/* Respuesta */}
      {mode === "reply" && (
        <ReplyBox
          parentId={comment.id}
          parentUsername={comment.username}
          mangaId={comment.manga_id}
          onCancel={() => setMode("view")}
          onSuccess={() => setMode("view")}
        />
      )}

      {/* Modal de Imagen (solo se renderiza si el comentario tiene imagen) */}
      {comment.image_url && (
        <ImageModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          imageUrl={comment.image_url}
        />
      )}
    </div>
  );
}