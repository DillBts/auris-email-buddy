import { useState } from "react";
import { Search, Filter, Headphones, Loader2, Mail, Clock, AlertCircle } from "lucide-react";
import { EmailRow } from "@/components/EmailRow";
import { EmailDetail } from "@/components/EmailDetail";
import { useInbox, useTrashEmail, useStarEmail, useAuthStatus } from "@/lib/api/hooks";
import { useNavigate } from "react-router-dom";
import type { Priority } from "@/lib/api/types";

const Index = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<string>("all");
  const navigate = useNavigate();

  const { data: authStatus } = useAuthStatus();
  const gmailConnected = authStatus?.gmailConnected ?? false;

  const priority = (["very-important", "important", "not-important"].includes(filter)
    ? filter : undefined) as Priority | undefined;
  const unread = filter === "unread" ? true : undefined;

  const { data, isLoading, isError } = useInbox(
    { priority, unread },
    // Only fetch if Gmail is connected
  );
  const trashMutation = useTrashEmail();
  const starMutation = useStarEmail();

  const emails = (gmailConnected ? data?.emails : []) ?? [];

  const filteredEmails = emails.filter(
    (e) =>
      search === "" ||
      e.subject.toLowerCase().includes(search.toLowerCase()) ||
      e.from.toLowerCase().includes(search.toLowerCase())
  );

  const selectedEmail = filteredEmails.find((e) => e.id === selectedId);

  const handleTrash = async (id: string) => {
    await trashMutation.mutateAsync(id);
    setSelectedId(null);
  };

  const filterOptions = [
    { value: "all", label: "All" },
    { value: "very-important", label: "🔴 Urgent" },
    { value: "important", label: "🟠 Important" },
    { value: "not-important", label: "⚪ Low Priority" },
    { value: "unread", label: "Unread" },
  ];

  if (selectedEmail) {
    return (
      <div className="flex h-full">
        <div className="hidden md:flex flex-col w-[400px] border-r border-border/50">
          <div className="px-5 py-4 border-b border-border/50">
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-foreground">Inbox</h1>
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-primary/15 text-primary">
                {filteredEmails.filter((e) => !e.read).length} new
              </span>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {filteredEmails.map((email, i) => (
              <EmailRow key={email.id} email={email} selected={email.id === selectedId} onSelect={setSelectedId} onListen={(id) => navigate(`/listen?emailId=${id}`)} index={i} />
            ))}
          </div>
        </div>
        <EmailDetail
          email={selectedEmail}
          onBack={() => setSelectedId(null)}
          onTrash={handleTrash}
          onListen={(id, mode) => navigate(`/listen?emailId=${id}&mode=${mode}`)}
          onStar={(id, starred) => starMutation.mutate({ id, starred })}
          starPending={starMutation.isPending}
          trashPending={trashMutation.isPending}
        />
      </div>
    );
  }

  const unreadCount = emails.filter((e) => !e.read).length;
  const urgentCount = emails.filter((e) => e.priority === "very-important").length;
  const listenMins = Math.round(emails.length * 1.5);

  return (
    <div className="flex flex-col h-full">
      {gmailConnected && !isLoading && (
        <div className="px-4 md:px-5 pt-4 pb-0">
          <div
            className="rounded-2xl p-4 md:p-5 mb-4 flex flex-col gap-3 border border-border/60"
            style={{ backgroundColor: "#F0F4FF" }}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-widest text-foreground/40">Your inbox</span>
              <button
                onClick={() => navigate("/listen")}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-opacity"
              >
                <Headphones className="w-3.5 h-3.5" />
                Start Listening
              </button>
            </div>
            <div className="flex items-center gap-4 md:gap-6">
              <div>
                <p className="text-2xl font-bold text-foreground">{unreadCount}</p>
                <p className="text-[10px] uppercase tracking-wider text-foreground/40 font-medium mt-0.5">New</p>
              </div>
              <div className="w-px h-8 bg-foreground/10" />
              <div className="flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-red-500 shrink-0" />
                <div>
                  <p className="text-2xl font-bold text-foreground">{urgentCount}</p>
                  <p className="text-[10px] uppercase tracking-wider text-foreground/40 font-medium mt-0.5">Urgent</p>
                </div>
              </div>
              <div className="w-px h-8 bg-foreground/10" />
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-primary shrink-0" />
                <div>
                  <p className="text-2xl font-bold text-foreground">{listenMins}m</p>
                  <p className="text-[10px] uppercase tracking-wider text-foreground/40 font-medium mt-0.5">To listen</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="px-4 md:px-5 py-3 md:py-4 border-b border-border/50">
        <div className="flex items-center justify-between mb-3 md:mb-4">
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-foreground">Inbox</h1>
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-primary/15 text-primary">
              {filteredEmails.filter((e) => !e.read).length} new
            </span>
          </div>
        </div>

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

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 -mx-1 px-1">
          <Filter className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
          {filterOptions.map((opt) => (
            <button key={opt.value} onClick={() => setFilter(opt.value)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
                filter === opt.value ? "bg-primary text-primary-foreground shadow-soft" : "bg-muted/50 text-muted-foreground hover:bg-muted"
              }`}>
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {!gmailConnected ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-4">
            <Mail className="w-12 h-12 opacity-20" />
            <p className="text-sm font-medium">Connect Gmail to see your emails</p>
            <button onClick={() => navigate("/settings")}
              className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
              Go to Settings
            </button>
          </div>
        ) : isLoading ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        ) : filteredEmails.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <Search className="w-10 h-10 mb-3 opacity-30" />
            <p className="text-sm">No emails found</p>
          </div>
        ) : (
          filteredEmails.map((email, i) => (
            <EmailRow key={email.id} email={email} selected={email.id === selectedId} onSelect={setSelectedId} onListen={(id) => navigate(`/listen?emailId=${id}`)} index={i} />
          ))
        )}
      </div>
    </div>
  );
};

export default Index;