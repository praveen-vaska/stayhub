"use client";

import React, { useState } from "react";
import { Property } from "@/types";
import { useAuth } from "@/lib/auth/context";
import { X, Send, Calendar, MessageSquare, Phone, User, Mail, CheckCircle2, MessageCircle } from "lucide-react";
import confetti from "canvas-confetti";

interface EnquiryModalProps {
  property: Property | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function EnquiryModal({ property, isOpen, onClose }: EnquiryModalProps) {
  const { user } = useAuth();
  const [userName, setUserName] = useState(user?.name || "Praveen Sharma");
  const [userEmail, setUserEmail] = useState(user?.email || "user@stayhub.com");
  const [userPhone, setUserPhone] = useState(user?.phone || "+91 98765 43210");
  const [message, setMessage] = useState("Hi, I am interested in visiting this accommodation. Please share room availability details.");
  const [visitDate, setVisitDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen || !property) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          propertyId: property.id,
          userName,
          userEmail,
          userPhone,
          message,
          preferredVisitDate: visitDate,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to send enquiry");
      }

      setIsSubmitted(true);
      confetti({
        particleCount: 70,
        spread: 55,
        origin: { y: 0.6 },
      });
    } catch (err: any) {
      setError(err.message || "Failed to submit enquiry. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactName = property.contact?.name || `${property.title} Host`;
  const contactWhatsapp = property.contact?.whatsapp || property.contact?.phone || "+91 90590 30142";

  const whatsappMessage = encodeURIComponent(
    `Hi ${contactName}, I found "${property.title}" on StayHub and would like to enquire about room availability.`
  );
  const whatsappUrl = `https://wa.me/${contactWhatsapp.replace(/[^0-9]/g, "")}?text=${whatsappMessage}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#142D4E]/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-card max-w-lg w-full overflow-hidden border border-[#E7EDF3] transform transition-all">
        {/* Header */}
        <div className="flex items-center justify-between p-6 bg-[#142D4E] text-white">
          <div>
            <span className="text-xs font-bold text-[#159A91] uppercase tracking-wider">
              Direct Host Connect
            </span>
            <h3 className="text-base font-bold truncate max-w-xs sm:max-w-md text-white mt-0.5">
              {property.title}
            </h3>
            <p className="text-xs text-slate-300">
              {property.locality}, {property.city}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSubmitted ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-[#E8F5F4] text-[#159A91] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-xl font-bold text-[#142D4E]">Enquiry Dispatched!</h4>
            <p className="text-xs sm:text-sm text-[#667A91] leading-relaxed max-w-sm mx-auto">
              Your message has been sent to <strong>{contactName}</strong>. The owner will respond to you shortly via phone/WhatsApp.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#159A91] text-white text-xs font-bold shadow-sm hover:bg-[#118079] transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                Chat on WhatsApp Now
              </a>
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl bg-[#F7F8FA] border border-[#E7EDF3] text-[#142D4E] text-xs font-bold hover:bg-[#E7EDF3] transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#142D4E] mb-1">Your Full Name</label>
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#F7F8FA] border border-[#E7EDF3] focus-within:border-[#159A91]">
                  <User className="w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full bg-transparent text-xs sm:text-sm text-[#142D4E] focus:outline-none"
                    placeholder="John Doe"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#142D4E] mb-1">Mobile Number</label>
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#F7F8FA] border border-[#E7EDF3] focus-within:border-[#159A91]">
                  <Phone className="w-4 h-4 text-slate-400" />
                  <input
                    type="tel"
                    required
                    value={userPhone}
                    onChange={(e) => setUserPhone(e.target.value)}
                    className="w-full bg-transparent text-xs sm:text-sm text-[#142D4E] focus:outline-none"
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#142D4E] mb-1">Email Address</label>
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#F7F8FA] border border-[#E7EDF3] focus-within:border-[#159A91]">
                <Mail className="w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  className="w-full bg-transparent text-xs sm:text-sm text-[#142D4E] focus:outline-none"
                  placeholder="john@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#142D4E] mb-1">
                Preferred Visit Date (Optional)
              </label>
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#F7F8FA] border border-[#E7EDF3] focus-within:border-[#159A91]">
                <Calendar className="w-4 h-4 text-slate-400" />
                <input
                  type="date"
                  value={visitDate}
                  onChange={(e) => setVisitDate(e.target.value)}
                  className="w-full bg-transparent text-xs sm:text-sm text-[#142D4E] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#142D4E] mb-1">Message for Owner</label>
              <div className="flex items-start gap-2 px-3 py-2 rounded-xl bg-[#F7F8FA] border border-[#E7EDF3] focus-within:border-[#159A91]">
                <MessageSquare className="w-4 h-4 text-slate-400 mt-0.5" />
                <textarea
                  rows={3}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-transparent text-xs sm:text-sm text-[#142D4E] focus:outline-none resize-none"
                  placeholder="Ask about sharing types, food timing, rules, deposits..."
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between gap-3">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-[#159A91] text-[#159A91] text-xs font-bold hover:bg-[#E8F5F4] transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp
              </a>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#142D4E] text-white text-xs font-bold hover:bg-[#159A91] disabled:opacity-50 transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                {isSubmitting ? "Sending..." : "Send Free Enquiry"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
