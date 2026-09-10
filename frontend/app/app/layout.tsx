import AuthGuard from '../../src/components/shared/AuthGuard';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <AuthGuard>{children}</AuthGuard>;
}
