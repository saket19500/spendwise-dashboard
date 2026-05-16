import { createFileRoute } from '@tanstack/react-router';
import { CategoryDetailScreen } from '@/screens/CategoryDetailScreen';

export const Route = createFileRoute('/category/$id')({
  component: CategoryDetailScreen,
});
