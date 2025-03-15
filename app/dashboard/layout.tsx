import DashboardLayoutWrapper from '../../components/DashboardLayoutWrapper';

export default async function Layout({ children }: { children: React.ReactNode }) {
  // No authentication check, allow all access
  return <DashboardLayoutWrapper>{children}</DashboardLayoutWrapper>;
} 