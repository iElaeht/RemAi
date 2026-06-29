"use client";

import { useState, useMemo, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { ChevronDown, ChevronUp, ArrowDownWideNarrow } from "lucide-react";
import { Comment } from "@/types/comment";
import CommentItem from "./CommentItem";
import CommentBox from "./CommentBox";
import { supabasePublic, getSupabaseClient } from "@/lib/supabase";

interface CommentsProps {
  initialComments: Comment[];
  mangaId: string;
}

type CommentNode = Comment & { replies: CommentNode[] };

type ConfirmAction = {
  type: "delete" | "discard_edit";
  id: string;
  onConfirm: () => void;
};

export default function Comments({ initialComments, mangaId }: CommentsProps) {
  const { isSignedIn, getToken } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [confirmAction, setConfirmAction] = useState<ConfirmAction | null>(null);
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");

  useEffect(() => {
    const channel = supabasePublic
      .channel("realtime:comments")
      .on("postgres_changes", { event: "*", schema: "public", table: "comments" }, (payload) => {
        if (payload.eventType === "INSERT") setComments((prev) => [...prev, payload.new as Comment]);
        else if (payload.eventType === "DELETE") setComments((prev) => prev.filter((c) => c.id !== payload.old.id));
        else if (payload.eventType === "UPDATE") setComments((prev) => prev.map((c) => (c.id === payload.new.id ? { ...c, ...payload.new } : c)));
      })
      .subscribe();
    return () => { supabasePublic.removeChannel(channel); };
  }, []);

  const performDelete = async (id: string) => {
    const token = await getToken({ template: "supabase" });
    const client = getSupabaseClient(token!);
    await client.from("comments").delete().eq("id", id);
  };

  const commentTree = useMemo(() => {
    const map: Record<string, CommentNode> = {};
    const tree: CommentNode[] = [];
    const sortedComments = [...comments].sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
    });
    sortedComments.forEach((c) => (map[c.id] = { ...c, replies: [] }));
    Object.values(map).forEach((c) => {
      if (c.parent_id && map[c.parent_id]) map[c.parent_id].replies.push(c);
      else tree.push(c);
    });
    return tree;
  }, [comments, sortOrder]);

  return (
    <div className="w-full flex flex-col gap-6 mt-12 bg-[#0f172a] p-5 md:p-10 rounded-3xl border border-white/10 shadow-2xl">
      <div className="flex justify-between items-center border-b border-white/5 pb-4">
        <h2 className="text-xl md:text-2xl font-extrabold text-white tracking-tight flex items-center gap-3">
          Comentarios 
          <span className="text-neutral-600 font-light hidden md:inline">|</span>
          <span className="text-pink-500">{comments.length}</span>
        </h2>
        <button
          onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}
          className="flex items-center gap-2 text-xs md:text-sm text-neutral-400 hover:text-white transition-colors"
        >
          <ArrowDownWideNarrow size={16} />
          {sortOrder === "desc" ? "Más recientes" : "Más antiguos"}
        </button>
      </div>

      {isSignedIn ? (
        <CommentBox mangaId={mangaId} />
      ) : (
        <div 
          onClick={() => setShowAuthModal(true)}
          className="bg-white/5 border border-dashed border-white/10 p-4 rounded-xl text-center cursor-pointer hover:bg-white/10 transition-all"
        >
          <p className="text-neutral-400 text-sm">
            <span className="text-blue-400 font-semibold underline">Inicia sesión</span> para dejar un comentario
          </p>
        </div>
      )}

      <div className="flex flex-col gap-4 mt-6">
        {commentTree.map((c) => (
          <CommentRoot key={c.id} comment={c} onDeleteClick={(id) => setConfirmAction({ type: "delete", id, onConfirm: () => performDelete(id) })} setConfirmAction={setConfirmAction} />
        ))}
      </div>

      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm" onClick={() => setShowAuthModal(false)}>
           <div className="bg-[#101625] border border-white/10 p-8 rounded-3xl max-w-sm w-full text-center shadow-2xl" onClick={e => e.stopPropagation()}>
              <h3 className="text-xl font-bold text-white mb-4">¿Quieres participar?</h3>
              <p className="text-neutral-400 mb-6">Inicia sesión para poder comentar y compartir tu opinión.</p>
              <button onClick={() => window.location.href = '/sign-in'} className="w-full py-3 bg-pink-600 rounded-xl font-bold hover:bg-pink-500 transition-all">Iniciar Sesión</button>
           </div>
        </div>
      )}

      {/* Modal de confirmación (delete/discard) */}
      {confirmAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="bg-[#101625] border border-white/10 p-6 rounded-2xl max-w-sm w-full shadow-2xl">
            <h3 className="text-lg font-bold text-white">{confirmAction.type === "delete" ? "¿Seguro de eliminar?" : "¿Descartar cambios?"}</h3>
            <div className="flex gap-3 justify-end mt-6">
              <button onClick={() => setConfirmAction(null)} className="text-neutral-400 hover:text-white px-4 py-2">Cancelar</button>
              <button onClick={() => { confirmAction.onConfirm(); setConfirmAction(null); }} className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-500">Confirmar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CommentRoot({
  comment,
  onDeleteClick,
  setConfirmAction,
}: {
  comment: CommentNode;
  onDeleteClick: (id: string) => void;
  setConfirmAction: React.Dispatch<React.SetStateAction<ConfirmAction | null>>;
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="relative mb-4">
      <CommentItem
        comment={comment}
        onDelete={() => onDeleteClick(comment.id)}
        onConfirmCancel={(action) =>
          setConfirmAction({
            type: "discard_edit",
            id: comment.id,
            onConfirm: action,
          })
        }
      />

      {comment.replies.length > 0 && (
        <div className="mt-2 pl-6 sm:pl-10 relative">
          <div className="absolute left-0 top-0 bottom-4 w-px bg-gradient-to-b from-white/10 via-white/10 to-transparent" />

          {isExpanded && (
            <div className="flex flex-col gap-4 mb-4">
              {comment.replies.map((reply) => (
                <CommentChild
                  key={reply.id}
                  comment={reply}
                  onDeleteClick={onDeleteClick}
                  setConfirmAction={setConfirmAction}
                />
              ))}
            </div>
          )}

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1.5 text-xs font-semibold text-blue-400/90 hover:text-blue-300 transition-all duration-200 py-1.5 px-3 rounded-lg hover:bg-blue-500/10 active:scale-95"
          >
            {isExpanded ? (
              <>
                Ocultar respuestas <ChevronUp size={14} />
              </>
            ) : (
              <>
                Mostrar {comment.replies.length} respuestas{" "}
                <ChevronDown size={14} />
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}

function CommentChild({
  comment,
  onDeleteClick,
  setConfirmAction,
}: {
  comment: CommentNode;
  onDeleteClick: (id: string) => void;
  setConfirmAction: React.Dispatch<React.SetStateAction<ConfirmAction | null>>;
}) {
  return (
    <div className="relative border-l border-white/[0.05] pl-4 sm:pl-6 ml-2 sm:ml-4">
      <CommentItem
        comment={comment}
        onDelete={() => onDeleteClick(comment.id)}
        onConfirmCancel={(action) =>
          setConfirmAction({
            type: "discard_edit",
            id: comment.id,
            onConfirm: action,
          })
        }
      />
      {comment.replies.length > 0 && (
        <div className="flex flex-col gap-4 mt-4">
          {comment.replies.map((reply) => (
            <CommentChild
              key={reply.id}
              comment={reply}
              onDeleteClick={onDeleteClick}
              setConfirmAction={setConfirmAction}
            />
          ))}
        </div>
      )}
    </div>
  );
}
