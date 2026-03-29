import type { Priority } from "@/lib/mockData";

const config: Record<Priority, { label: string; className: string }> = {
  "very-important": { label: "Very Important", className: "priority-high" },
  important: { label: "Important", className: "priority-medium" },
  "not-important": { label: "Not Important", className: "priority-low" },
};

export function PriorityBadge({ priority }: { priority: Priority }) {
  const { label, className } = config[priority];
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${className}`}
    >
      {label}
    </span>
  );
}
