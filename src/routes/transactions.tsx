import { createFileRoute } from '@tanstack/react-router';
import { AllTransactionsScreen } from '@/screens/AllTransactionsScreen';

export const Route = createFileRoute('/transactions')({ component: AllTransactionsScreen });
