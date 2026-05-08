import type { FC } from "react";
import { useRef, useEffect, memo } from "react";
import { ImagePlus, SendHorizonal, X, Loader2 } from "lucide-react";
import { auth } from "../../firebase/config";
import { useChatMessages } from "../../hooks/useChat";
import type { User } from "../../types";
import UserAvatar from "./UserAvatar";
import Loading from "./Loading";

interface ChatProps {
  chatId: string;
  user?: User;
  title?: string;
  isGroup?: boolean;
  usersById?: Record<string, User>;
  readOnlyMessage?: string;
  onLoadingChange?: (loading: boolean) => void;
}

const Chat: FC<ChatProps> = ({ chatId, user, title, isGroup = false, usersById = {}, readOnlyMessage = "", onLoadingChange}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const {
    messages,
    loading,
    text,
    setText,
    sendMessage,
    handleImageUpload,
    isUploading,
    bottomRef,
    imagePreview,
    clearImageSelection,
    error,
  } = useChatMessages(chatId);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }, [chatId]);

  useEffect(() => {
    onLoadingChange?.(loading);
  }, [loading, onLoadingChange]);

  const submitCurrentMessage = async () => {
    if (readOnlyMessage) return;
    if ((!text.trim() && !imagePreview) || isUploading) return;

    await sendMessage();
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitCurrentMessage();
  };

  const formatDateLabel = (date: Date) => {
    const today = new Date().toDateString();
    const yesterdayDate = new Date();
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    const yesterday = yesterdayDate.toDateString();
    const target = date.toDateString();
    if (target === today) return "Today";
    if (target === yesterday) return "Yesterday";
    return date.toLocaleDateString([], {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== new Date().getFullYear() ? "numeric" : undefined
    });
  };

  const getMessageDate = (createdAt: unknown) => {
    if (createdAt instanceof Date) return createdAt;
    if (
      createdAt &&
      typeof createdAt === "object" &&
      "toDate" in createdAt &&
      typeof createdAt.toDate === "function"
    ) {
      return createdAt.toDate() as Date;
    }
    return new Date();
  };

  const conversationTitle = title || user?.name || user?.email || "this chat";
  const getSenderName = (senderId: string) => {
    const sender = usersById[senderId];
    return sender?.name || sender?.email || "Group member";
  };
  const getSenderUser = (senderId: string): User => {
    return usersById[senderId] ?? {
      uid: senderId,
      name: getSenderName(senderId),
      email: "",
    };
  };
  const getSystemText = (msg: typeof messages[number]) => {
    if (!msg.actorId || msg.actorId !== auth.currentUser?.uid) {
      return msg.text;
    }

    const actorName = msg.actorName || getSenderName(msg.actorId);
    return msg.text.startsWith(`${actorName} `)
      ? `You ${msg.text.slice(actorName.length + 1)}`
      : msg.text;
  };

  return (
    <div className="flex h-full min-w-0 flex-col bg-[#f8fafc]">
      <div className="flex-1 overflow-y-auto px-4 py-6 custom-scrollbar sm:px-8">
        {!loading && !messages.length ? (
          <div className="flex h-full flex-col items-center justify-center space-y-4">
            <div className="flex size-20 items-center justify-center rounded-3xl bg-white shadow-sm ring-1 ring-slate-200/50">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-900">
                <SendHorizonal size={24} />
              </div>
            </div>
            <div className="space-y-1 text-center">
              <h3 className="text-sm font-semibold text-slate-900">Secure Conversation</h3>
              <p className="max-w-[240px] text-xs leading-relaxed text-slate-500">
                Messages with <span className="text-blue-900 font-bold">{conversationTitle}</span> are encrypted.
              </p>
            </div>
          </div>
        ) : null}

        {!loading && (
          <div className="mx-auto max-w-full space-y-6">
            {messages.map((msg, i) => {
              const currentMsgDate = getMessageDate(msg.createdAt);
              const prevMsgDate = i > 0 ? getMessageDate(messages[i - 1].createdAt) : null;
              const isNewDay = !prevMsgDate || currentMsgDate.toDateString() !== prevMsgDate.toDateString();
              const isMe = msg.senderId === auth.currentUser?.uid;
              const isSystem = msg.type === "system";
              const time = currentMsgDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
              const sender = getSenderUser(msg.senderId);

              return (
                <div key={msg.id || i} className="space-y-6">
                  {isNewDay && (
                    <div className="flex items-center justify-center gap-6 ">
                      <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent via-slate-200 to-slate-200" />

                      <div className="group flex items-center gap-2 rounded-xl border border-slate-100 bg-white/80 px-6 py-1.5 backdrop-blur-sm shadow-sm transition-all hover:shadow-md">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                          {formatDateLabel(currentMsgDate)}
                        </span>
                      </div>

                      <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-slate-200 to-slate-200" />
                    </div>
                  )}

                  {isSystem ? (
                    <div className="flex justify-center animate-in fade-in slide-in-from-bottom-1 duration-300">
                      <div className="max-w-[85%] rounded-full border border-slate-200 bg-white px-4 py-1.5 text-center text-[11px] font-semibold text-slate-500 shadow-sm">
                        {getSystemText(msg)}
                      </div>
                    </div>
                  ) : (
                  <div className={`flex ${isMe ? "justify-end" : "justify-start"} group animate-in fade-in slide-in-from-bottom-1 duration-300`}>
                    <div className={`flex max-w-[90%] items-end gap-2 sm:max-w-[75%] ${isMe ? "flex-row-reverse" : "flex-row"}`}>
                        {isGroup && (
                          <UserAvatar
                            user={sender}
                            size="sm"
                            className="mb-5 size-8 rounded-xl"
                          />
                        )}
                        <div className={`relative flex min-w-0 flex-col ${isMe ? "items-end" : "items-start"}`}>
                          {isGroup && (
                            <span className={`mb-1 px-1 text-[10px] font-bold text-slate-500 ${isMe ? "text-right" : "text-left"}`}>
                              {isMe ? "You" : getSenderName(msg.senderId)}
                            </span>
                          )}
                      <div className={`relative overflow-hidden transition-all duration-200 ${isMe
                        ? "rounded-2xl rounded-tr-sm bg-gradient-to-br from-cyan-900/90 to-blue-900/90 text-white shadow-md shadow-slate-200/50"
                        : "rounded-2xl rounded-tl-sm bg-slate-100 text-slate-800 ring-1 ring-slate-200 shadow-sm"
                        }`}>
                        {msg.imageUrl && (
                          <div className="relative">
                            <img
                              src={msg.imageUrl}
                              alt=""
                              className="max-h-80 w-full object-contain bg-slate-50/50"
                              loading="lazy"
                            />
                          </div>
                        )}
                        {msg.text && (
                          <div className="px-4 py-2.5">
                            <p className="whitespace-pre-wrap break-words text-[14.5px] leading-relaxed">
                              {msg.text}
                            </p>
                          </div>
                        )}
                      </div>
                      <span className="mt-1 px-1 text-[11px] font-bold uppercase tracking-widest text-slate-400">{time}</span>
                    </div>
                  </div>
                    </div>
                  )}
                </div>
              );
            })}
            <div ref={bottomRef} className="h-2" />
          </div>
        )}
      </div>

      <div className="border-t border-slate-100 bg-white/95 p-4 backdrop-blur-md">
        <form onSubmit={handleFormSubmit} className="mx-auto max-w-full">
          {imagePreview && (
            <div className="mb-4 flex animate-in slide-in-from-bottom-4 fade-in duration-300">
              <div className="relative size-24 overflow-hidden rounded-2xl border-4 border-white shadow-xl ring-1 ring-slate-200">
                <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={clearImageSelection}
                  className="absolute right-1.5 top-1.5 flex size-6 items-center justify-center rounded-full bg-slate-900/90 text-white transition-transform hover:scale-110"
                >
                  <X size={14} />
                </button>
                {isUploading && (
                  <Loading 
                    className="absolute inset-0 bg-white/70 backdrop-blur-[1px]" 
                    iconClassName="size-6 text-blue-900" 
                  />
                )}
              </div>
            </div>
          )}

          {readOnlyMessage ? (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-center text-sm font-semibold text-slate-500">
              {readOnlyMessage}
            </div>
          ) : (
          <div className="flex items-end gap-3">
            <div className="flex flex-1 items-end gap-2 rounded-[24px] border border-slate-200 bg-slate-50/50 p-1.5 pr-4 transition-all focus-within:border-slate-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-slate-200/20">
              <label className="flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full text-blue-950 transition-colors hover:bg-slate-100 hover:text-slate-900">
                <ImagePlus size={20} />
                <input
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={handleImageUpload}
                  disabled={isUploading}
                />
              </label>
              <textarea
                ref={textareaRef}
                rows={1}
                className="w-full bg-transparent py-2.5 text-[14.5px] text-slate-800 placeholder-slate-400 outline-none resize-none max-h-32"
                placeholder="Write a message..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    void submitCurrentMessage();
                  }
                }}
                onInput={(e) => {
                  const t = e.target as HTMLTextAreaElement;
                  t.style.height = "auto";
                  t.style.height = `${t.scrollHeight}px`;
                }}
              />
            </div>
            <button
              type="submit"
              disabled={(!text.trim() && !imagePreview) || isUploading}
              className={`flex h-[48px] w-[48px] shrink-0 items-center justify-center rounded-full transition-all duration-300 ${(text.trim() || imagePreview) && !isUploading
                ? "bg-gradient-to-br from-cyan-900 to-blue-900 text-white shadow-lg hover:bg-slate-800 active:scale-95"
                : "bg-slate-100 text-slate-300"
                }`}
            >
              {isUploading ? <Loader2 size={20} className="animate-spin" /> : <SendHorizonal size={20} />}
            </button>
          </div>
          )}
          {error && <p className="mt-3 px-2 text-xs font-semibold text-rose-500 animate-pulse">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default memo(Chat);
