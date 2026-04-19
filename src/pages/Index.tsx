import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter, Headphones, Loader2 } from "lucide-react";
import { useInbox, useTrashEmail } from "@/lib/api/hooks";
import type { Priority } from "@/lib/api/types";
import { Loader2 } from "lucide-react";
import { EmailRow } from "@/components/EmailRow";
import { EmailDetail } from "@/components/EmailDetail";

const Index = () => {
  const [emails, setEmails] = useState<Email[]>(mockEmails);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<string>("all");

  const selectedEmail = emails.find((e) => e.id === selectedId);

  const filteredEmails = emails
    .filter((e) => !e.trashed)
    .filter((e) => {
      if (filter === "very-important") return e.priority === "very-important";
      if (filter === "important") return e.priority === "important";
      if (filter === "not-important") return e.priority === "not-important";
      if (filter === "unread") return !e.read;
      return true;
    })
    .filter(
      (e) =>
        search === "" ||
        e.subject.toLowerCase().includes(search.toLowerCase()) ||
        e.from.toLowerCase().includes(search.toLowerCase())
    );

  const handleTrash = (id: string) => {
    setEmails((prev) => prev.map((e) => (e.id === id ? { ...e, trashed: true } : e)));
    setSelectedId(null);
  };

  const filterOptions = [
    { value: "all", label: "All" },
    { value: "very-important", label: "🔴 Very Important" },
    { value: "important", label: "🟡 Important" },
    { value: "not-important", label: "🟢 Not Important" },
    { value: "unread", label: "Unread" },
  ];

  // On mobile, show detail full-screen when selected
  if (selectedEmail) {
    return (
      <div className="flex h-full">
        {/* Hide list on mobile when detail is open */}
        <div className="hidden md:flex flex-col w-[400px] border-r border-border/50">
          <div className="px-5 py-4 border-b border-border/50">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-foreground">Inbox</h1>
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-primary/15 text-primary">
                  {filteredEmails.filter((e) => !e.read).length} new
                </span>
              </div>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {filteredEmails.map((email, i) => (
              <EmailRow
                key={email.id}
                email={email}
                selected={email.id === selectedId}
                onSelect={setSelectedId}
                index={i}
              />
            ))}
          </div>
        </div>
        <EmailDetail email={selectedEmail} onBack={() => setSelectedId(null)} onTrash={handleTrash} />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Top bar */}
      <div className="px-4 md:px-5 py-3 md:py-4 border-b border-border/50">
        <div className="flex items-center justify-between mb-3 md:mb-4">
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-foreground">Inbox</h1>
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-primary/15 text-primary">
              {filteredEmails.filter((e) => !e.read).length} new
            </span>
          </div>
          <button className="p-2 rounded-lg hover:bg-muted transition-colors text-primary" title="Listen to all">
            <Headphones className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search emails..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-muted/50 rounded-lg text-sm text-foreground placeholder:text-muted-foreground border border-border/50 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 -mx-1 px-1">
          <Filter className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
          {filterOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setFilter(opt.value)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
                filter === opt.value
                  ? "bg-primary text-primary-foreground shadow-soft"
                  : "bg-muted/50 text-muted-foreground hover:bg-muted"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Email list */}
      <div className="flex-1 overflow-y-auto">
        {filteredEmails.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <Search className="w-10 h-10 mb-3 opacity-30" />
            <p className="text-sm">No emails found</p>
          </div>
        ) : (
          filteredEmails.map((email, i) => (
            <EmailRow
              key={email.id}
              email={email}
              selected={email.id === selectedId}
              onSelect={setSelectedId}
              index={i}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Index;
