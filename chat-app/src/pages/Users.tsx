import { useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import { Loader2, MessageSquare } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { auth } from "../firebase/config";
import { useUsersDirectory } from "../hooks/useUsers";
import Chat from "../components/UI/Chat";
import Sidebar from "../components/Layout/Sidebar";
import ChatHeader from "../components/UI/ChatHeader";

export default function Users() {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isMessagesLoading, setIsMessagesLoading] = useState(false);
  const navigate = useNavigate();
  const { userId } = useParams();

  const {
    users,
    loading,
    me,
    otherUsers,
    selectedUser,
    chatPreviewsByUserId,
    chatId,
    searchQuery,
    setSearchQuery,
    handleUserClick,
    isChatLoading,
    isProfileImageUploading,
    updateCurrentUserPhoto,
  } = useUsersDirectory();
  const hasChatRoute = Boolean(userId);
  const activeUser = hasChatRoute ? selectedUser : null;

  const handleProfileImageChange = async (file: File) => {
    if (!file.type.startsWith("image/")) return;
    if (file.size > 2 * 1024 * 1024) return;
    try {
      await updateCurrentUserPhoto(file);
    } catch {
      return;
    }
  };

  useEffect(() => {
    if (!userId) return;
    if (!users.length || selectedUser?.uid === userId) return;

    const routeUser = users.find((user) => user.uid === userId);
    if (routeUser) {
      void handleUserClick(routeUser);
    }
  }, [handleUserClick, selectedUser?.uid, userId, users]);

  const openChat = (user: typeof otherUsers[number]) => {
    navigate(`/chat/${user.uid}`);
  };

  const closeChat = () => {
    setIsMessagesLoading(false);
    navigate("/", { replace: true });
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="size-10 text-slate-900 animate-spin" />
      </div>
    );
  }

  return (
    <div className="relative flex h-dvh overflow-hidden bg-slate-100 font-sans text-slate-900">
      <Sidebar
        me={me}
        otherUsers={otherUsers}
        selectedUser={selectedUser}
        chatPreviewsByUserId={chatPreviewsByUserId}
        isChatOpen={hasChatRoute}
        searchQuery={searchQuery}
        onSearchChange={(e) => setSearchQuery(e.target.value)}
        onUserClick={openChat}
        onLogoutClick={() => setShowLogoutModal(true)}
        onProfileImageChange={handleProfileImageChange}
        isProfileImageUploading={isProfileImageUploading}
      />

      <main className={`${hasChatRoute ? "flex" : "hidden md:flex"} min-w-0 flex-1 flex-col overflow-hidden bg-white`}>
        {!hasChatRoute ? (
          <div className="flex flex-1 flex-col items-center justify-center bg-slate-50 p-6 text-center">
            <div className="mb-6 flex size-20 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm">
              <MessageSquare size={32} className="text-blue-900" />
            </div>
            <h2 className="mb-2 text-2xl font-black tracking-tight text-slate-950">
              Select a conversation
            </h2>
            <p className="max-w-[320px] text-sm leading-relaxed text-slate-500">
              Choose a contact from the list to start messaging.
            </p>
          </div>
        ) : activeUser ? (
          <>
            <ChatHeader user={activeUser} onBack={closeChat} />
            <div className="relative min-h-0 flex-1 overflow-hidden">
              {chatId && (
                <Chat
                  key={chatId}
                  chatId={chatId}
                  user={activeUser}
                  onLoadingChange={setIsMessagesLoading}
                />
              )}
              {(!chatId || isChatLoading || isMessagesLoading) && (
                <div className="absolute inset-0 flex items-center justify-center bg-white">
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 className="size-6 animate-spin text-slate-300" />
                    <span className="text-sm font-medium text-slate-400">Loading messages...</span>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center bg-white">
            <Loader2 className="size-6 animate-spin text-slate-300" />
          </div>
        )}
      </main>

      {showLogoutModal && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm animate-in fade-in zoom-in rounded-2xl bg-white p-6 shadow-xl ring-1 ring-black/5 duration-200">
            <h3 className="mb-2 text-xl font-bold text-slate-950">Logout</h3>
            <p className="mb-6 text-sm leading-relaxed text-slate-500">Are you sure you want to log out?</p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 rounded-xl border border-slate-200 px-4 py-2 font-semibold text-slate-600 transition-colors hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => signOut(auth)}
                className="flex-1 rounded-xl bg-rose-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-rose-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
