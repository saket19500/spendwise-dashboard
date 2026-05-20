import { createFileRoute } from '@tanstack/react-router';
import { ScanPayScreen } from '@/screens/ScanPayScreen';

export const Route = createFileRoute('/scan-pay')({
  component: ScanPayScreen,
});
