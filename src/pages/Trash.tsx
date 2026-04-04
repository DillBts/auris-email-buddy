import { useState } from "react";
import { motion } from "framer-motion";
import { Trash2, RotateCcw, AlertTriangle } from "lucide-react";
import { mockTrashedEmails, type Email } from "@/lib/mockData";
import { PriorityBadge } from "@/components/PriorityBadge";
import { Button } from "@/components/ui/button";

const Trash = () => {
  const [trashedEmails, setTrashedEmails] = useState<Email[]>(mockTrashedEmails);

  const handleRestore = (id: string) => {
    setTrashedEmails((prev) => prev.filter((e) => e.id !== id));
  };

  const handleDeletePermanently = (id: string) => {
    setTrashedEmails((prev) => prev.filter((e) => e.id !== id));
  };

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 md:px-6 py-3 md:py-4 border-b border-border/50">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Trash2 className="w-5 h-5 text-destructive" />
            Trash
          </h1>
          {trashedEmails.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              className="text-destructive border-destructive/30 hover:bg-destructive/10"
              onClick={() => setTrashedEmails([])}
            >
              Empty Trash
            </Button>
          )}
        </div>
        <p className="text-sm text-muted-foreground mt-1">Items are permanently deleted after 30 days</p>
      </div>

      <div className="flex-1 overflow-y-auto">
        {trashedEmails.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <Trash2 className="w-12 h-12 mb-3 opacity-20" />
            <p className="text-sm font-medium">Trash is empty</p>
          </div>
        ) : (
          trashedEmails.map((email, i) => (
            <motion.div
              key={email.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-start gap-3 md:gap-4 px-4 md:px-6 py-3 md:py-4 border-b border-border/30 hover:bg-muted/30 transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-sm font-bold text-muted-foreground shrink-0">
                {email.from[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-foreground/60 truncate">{email.from}</span>
                  <span className="text-xs text-muted-foreground shrink-0">{email.time}</span>
                </div>
                <p className="text-sm text-foreground/50 truncate">{email.subject}</p>
                <div className="mt-1.5">
                  <PriorityBadge priority={email.priority} />
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => handleRestore(email.id)}
                  className="p-2 rounded-lg hover:bg-primary/10 text-primary transition-colors"
                  title="Restore"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeletePermanently(email.id)}
                  className="p-2 rounded-lg hover:bg-destructive/10 text-destructive transition-colors"
                  title="Delete permanently"
                >
                  <AlertTriangle className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default Trash;
