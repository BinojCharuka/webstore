"use client";
import { useState, useEffect } from "react";
import { Trash2, Mail, MailOpen, Loader2 } from "lucide-react";

interface MessageData {
  _id: string;
  name: string;
  email: string;
  type: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export default function MessagesInbox() {
  const [messages, setMessages] = useState<MessageData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    try {
      const res = await fetch("/api/messages");
      const data = await res.json();
      if (Array.isArray(data)) {
        setMessages(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const toggleRead = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/messages/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ read: !currentStatus }),
      });

      if (res.ok) {
        setMessages(
          messages.map((m) => (m._id === id ? { ...m, read: !currentStatus } : m))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this message?")) return;
    try {
      const res = await fetch(`/api/messages/${id}`, { method: "DELETE" });
      if (res.ok) {
        setMessages(messages.filter((m) => m._id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-8 max-w-[1280px] w-full">
      <div className="mb-10">
        <h1 className="font-sans text-3xl font-extrabold text-white tracking-tight m-0">Inquiries Inbox</h1>
        <p className="font-sans text-[13.5px] text-[#555] mt-1">Review contact form submissions and project requests</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="animate-spin text-[#aaff00]" size={36} />
        </div>
      ) : messages.length === 0 ? (
        <div className="bg-[#161616] border border-white/5 rounded-3xl py-20 text-center">
          <p className="font-sans text-[#555] text-sm m-0">No inquiries received yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((m) => (
            <div
              key={m._id}
              className={`p-6 rounded-2xl border transition-all duration-200 ${
                m.read
                  ? "bg-[#161616] border-white/5"
                  : "bg-[#aaff00]/5 border-[#aaff00]/20 shadow-[0_4px_20px_rgba(170,255,0,0.02)]"
              }`}
            >
              <div className="flex justify-between items-start flex-wrap gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-sans text-[15px] font-bold text-white">{m.name}</span>
                    <span className="font-mono text-[10.5px] text-[#555] font-semibold">{m.email}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 font-mono text-[9px] text-[#888] uppercase tracking-wide">
                      {m.type}
                    </span>
                    <span className="font-sans text-[11px] text-[#444]">
                      Submitted {new Date(m.createdAt).toLocaleDateString()} at {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => toggleRead(m._id, m.read)}
                    title={m.read ? "Mark as Unread" : "Mark as Read"}
                    className={`p-2.5 rounded-xl border border-white/10 transition-all ${
                      m.read
                        ? "bg-transparent text-[#555] hover:text-[#aaa]"
                        : "bg-[#aaff00]/10 border-[#aaff00]/30 text-[#aaff00] hover:bg-[#aaff00]/20"
                    }`}
                  >
                    {m.read ? <Mail size={15} /> : <MailOpen size={15} />}
                  </button>
                  <button
                    onClick={() => handleDelete(m._id)}
                    title="Delete Message"
                    className="p-2.5 rounded-xl border border-white/10 hover:border-red-500/30 hover:bg-red-500/10 text-[#555] hover:text-red-400 transition-all"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>

              <div className="bg-[#111]/60 border border-white/[0.03] p-4 rounded-xl">
                <p className="font-sans text-[13px] text-[#aaa] leading-relaxed whitespace-pre-wrap m-0">
                  {m.message}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
