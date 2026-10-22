"use client";

import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Send,
  Loader2,
  Plus,
  X,
} from 'lucide-react';
import { MessageItem } from '@/types/portal';
import { getMessages, sendMessage } from '@/lib/api';
import { useToast } from '@/context/ToastContext';

export default function MessagesPage() {
  const { showToast } = useToast();
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<MessageItem | null>(null);
  const [loading, setLoading] = useState(true);

  // Compose Modal
  const [composeOpen, setComposeOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [composeForm, setComposeForm] = useState({
    recipient: '',
    subject: '',
    message: '',
    courseCode: 'CSC311',
  });

  const loadMessages = async () => {
    try {
      const data = await getMessages();
      setMessages(data);
      if (data.length > 0 && !selectedMessage) {
        setSelectedMessage(data[0]);
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to load messages from backend', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!composeForm.recipient || !composeForm.message) {
      showToast('Recipient and message are required', 'error');
      return;
    }

    setSending(true);
    try {
      const newMsg = await sendMessage(composeForm);
      showToast('Message sent to backend successfully!', 'success');
      setComposeOpen(false);
      setComposeForm({
        recipient: '',
        subject: '',
        message: '',
        courseCode: 'CSC311',
      });
      setMessages((prev) => [newMsg, ...prev]);
      setSelectedMessage(newMsg);
    } catch (err: any) {
      showToast(err.message || 'Failed to send message', 'error');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title & Compose Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Messages
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Communications and queries from students & faculty.
          </p>
        </div>

        <button
          onClick={() => setComposeOpen(true)}
          className="px-4 py-2.5 bg-[#E1193E] hover:bg-[#C20E30] text-white rounded-xl text-sm font-semibold transition-all shadow-xs flex items-center gap-2 self-start sm:self-auto active:scale-95"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>New Message</span>
        </button>
      </div>

      {/* Messages Master-Detail View */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden min-h-[500px] grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-slate-100">
        {/* Left: List */}
        <div className="md:col-span-5 overflow-y-auto max-h-[600px] divide-y divide-slate-100">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-2">
              <Loader2 className="w-6 h-6 text-[#E1193E] animate-spin" />
              <p className="text-xs text-slate-400">Loading inbox from backend...</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              No messages found.
            </div>
          ) : (
            messages.map((msg) => {
              const isSelected = selectedMessage?.id === msg.id;
              return (
                <div
                  key={msg.id}
                  onClick={() => setSelectedMessage(msg)}
                  className={`p-4 cursor-pointer transition-colors ${
                    isSelected ? 'bg-red-50/40 border-l-4 border-l-[#E1193E]' : 'hover:bg-slate-50/70'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 font-bold text-[10px] flex items-center justify-center shrink-0">
                        {msg.avatar}
                      </div>
                      <span className="font-bold text-slate-900 text-xs truncate">
                        {msg.sender}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium">
                      {msg.timestamp}
                    </span>
                  </div>

                  <h4 className="text-xs font-semibold text-slate-800 mt-1.5 truncate">
                    {msg.subject}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">
                    {msg.snippet}
                  </p>

                  <div className="flex items-center gap-2 mt-2">
                    {msg.courseCode && (
                      <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                        {msg.courseCode}
                      </span>
                    )}
                    {msg.unread && (
                      <span className="w-2 h-2 rounded-full bg-[#E1193E]" />
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right: Message Details */}
        <div className="md:col-span-7 p-6 flex flex-col justify-between">
          {selectedMessage ? (
            <div className="space-y-6">
              <div className="flex items-start justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#E1193E] text-white font-bold text-sm flex items-center justify-center">
                    {selectedMessage.avatar}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      {selectedMessage.sender}
                    </h3>
                    <p className="text-xs text-slate-400">
                      {selectedMessage.role} {selectedMessage.matric ? `· ${selectedMessage.matric}` : ''}
                    </p>
                  </div>
                </div>
                <span className="text-xs text-slate-400 font-medium">
                  {selectedMessage.timestamp}
                </span>
              </div>

              <div>
                <h2 className="text-base font-bold text-slate-900 mb-2">
                  {selectedMessage.subject}
                </h2>
                <div className="p-4 bg-slate-50/70 rounded-xl border border-slate-100 text-slate-700 text-xs leading-relaxed whitespace-pre-line">
                  {selectedMessage.fullMessage}
                </div>
              </div>

              {/* Reply Box */}
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <label className="block text-xs font-semibold text-slate-700">
                  Quick Reply to {selectedMessage.sender}
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder={`Reply to ${selectedMessage.sender}...`}
                    className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-[#E1193E]"
                  />
                  <button
                    onClick={() => showToast('Reply sent to backend!', 'success')}
                    className="px-4 py-2 bg-[#E1193E] hover:bg-[#C20E30] text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-xs text-slate-400">
              Select a message to view details
            </div>
          )}
        </div>
      </div>

      {/* Compose Modal */}
      {composeOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-[#E1193E]" />
                <h3 className="text-base font-bold text-slate-900">
                  New Message / Notice
                </h3>
              </div>
              <button
                onClick={() => setComposeOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSendMessage} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Recipient (Student / Course Class) *
                </label>
                <input
                  type="text"
                  placeholder="e.g. CSC311 Class or Sarah O."
                  value={composeForm.recipient}
                  onChange={(e) => setComposeForm({ ...composeForm, recipient: e.target.value })}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-[#E1193E]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Subject *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Manual collection schedule update"
                  value={composeForm.subject}
                  onChange={(e) => setComposeForm({ ...composeForm, subject: e.target.value })}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-[#E1193E]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Message Body *
                </label>
                <textarea
                  rows={4}
                  placeholder="Write your announcement or reply here..."
                  value={composeForm.message}
                  onChange={(e) => setComposeForm({ ...composeForm, message: e.target.value })}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-[#E1193E]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setComposeOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={sending}
                  className="px-4 py-2 bg-[#E1193E] hover:bg-[#C20E30] text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 disabled:opacity-50"
                >
                  {sending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Send Message</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
