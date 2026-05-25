import { SearchX, Inbox, FileQuestion } from 'lucide-react';
import { ReactNode } from 'react';

interface EmptyStateProps {
  type?: 'search' | 'data' | 'error';
  title: string;
  description?: string;
  action?: ReactNode;
}

const icons = {
  search: SearchX,
  data: Inbox,
  error: FileQuestion,
};

export default function EmptyState({ type = 'data', title, description, action }: EmptyStateProps) {
  const Icon = icons[type];
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 rounded-2xl bg-cream flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-warm-gray" />
      </div>
      <h3 className="text-h4 font-display text-charcoal mb-2">{title}</h3>
      {description && <p className="text-body text-warm-gray max-w-md mb-6">{description}</p>}
      {action}
    </div>
  );
}
