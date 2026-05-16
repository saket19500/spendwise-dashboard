import { createFileRoute } from '@tanstack/react-router';
import { ScanBillScreen } from '@/screens/ScanBillScreen';

export const Route = createFileRoute('/bill')({
  component: ScanBillScreen,
});
