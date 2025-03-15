import { redirect } from 'next/navigation';

export default async function Home() {
  // Always redirect to dashboard, no authentication check
  redirect('/dashboard');
}
