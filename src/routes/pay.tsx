import { createFileRoute } from '@tanstack/react-router';
import { PayScreen } from '@/screens/PayScreen';

export const Route = createFileRoute('/pay')({
  component: PayScreen,
  validateSearch: (search: Record<string, unknown>) => ({
    category: typeof search.category === 'string' ? search.category : undefined,
  }),
});
