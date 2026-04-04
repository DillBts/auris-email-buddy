import { useState } from "react";
import { Star } from "lucide-react";
import { mockEmails } from "@/lib/mockData";
import { EmailRow } from "@/components/EmailRow";
import { EmailDetail } from "@/components/EmailDetail";

const Starred = () => {
  const [emails, setEmails] = useState(mockEmails);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const starred = emails.filter((e) => e.starred && !e.trashed);
  const selectedEmail = emails.find((e) => e.id === selectedId);

  const handleTrash = (id: string) => {
    setEmails((prev) => prev.map((e) => (e.id === id ? { ...e, trashed: true } : e)));
    setSelectedId(null);
  };

  if (selectedEmail) {
    return (
      <div className="flex h-full">
        <div className="hidden md:flex flex-col w-[400px] border-r border-border/50">
          <div className="px-5 py-4 border-b border-border/50">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-priority-medium fill-priority-medium" />
              <h1 className="text-lg font-bold text-foreground">Starred</h1>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {starred.map((email, i) => (
              <EmailRow key={email.id} email={email} selected={email.id === selectedId} onSelect={setSelectedId} index={i} />
            ))}
          </div>
        </div>
        <EmailDetail email={selectedEmail} onBack={() => setSelectedId(null)} onTrash={handleTrash} />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 md:px-5 py-3 md:py-4 border-b border-border/50">
        <div className="flex items-center gap-2">
          <Star className="w-5 h-5 text-priority-medium fill-priority-medium" />
          <h1 className="text-lg font-bold text-foreground">Starred</h1>
          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-primary/15 text-primary">
            {starred.length}
          </span>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {starred.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <Star className="w-10 h-10 mb-3 opacity-30" />
            <p className="text-sm">No starred emails</p>
          </div>
        ) : (
          starred.map((email, i) => (
            <EmailRow key={email.id} email={email} selected={email.id === selectedId} onSelect={setSelectedId} index={i} />
          ))
        )}
      </div>
    </div>
  );
};

export default Starred;
