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

  return (
    <div className="flex h-screen">
      <div className={`flex flex-col border-r border-border/50 ${selectedEmail ? "w-[400px]" : "flex-1"}`}>
        <div className="px-5 py-4 border-b border-border/50">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-priority-medium fill-priority-medium" />
            <h1 className="text-lg font-bold text-foreground">Starred</h1>
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-primary/15 text-primary">
              {starred.length}
            </span>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {starred.map((email, i) => (
            <EmailRow key={email.id} email={email} selected={email.id === selectedId} onSelect={setSelectedId} index={i} />
          ))}
        </div>
      </div>
      {selectedEmail && <EmailDetail email={selectedEmail} onBack={() => setSelectedId(null)} onTrash={handleTrash} />}
    </div>
  );
};

export default Starred;
