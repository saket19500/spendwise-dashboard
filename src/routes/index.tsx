import { createFileRoute } from '@tanstack/react-router';
import { HomeScreen } from '@/screens/HomeScreen';

export const Route = createFileRoute('/')({
  component: HomeScreen,
  head: () => ({ meta: [{ title: 'SpendWise — UPI Spend Tracker' }] }),
});
