import { createFileRoute } from '@tanstack/react-router';
import { InsightsScreen } from '@/screens/InsightsScreen';

export const Route = createFileRoute('/insights')({ component: InsightsScreen });
