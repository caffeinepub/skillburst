import { Link, useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { BookOpen, Trophy, User, Shield, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { login, clear, identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAuthenticated = !!identity;

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
      navigate({ to: '/' });
    } else {
      try {
        await login();
      } catch (error: any) {
        console.error('Login error:', error);
        if (error.message === 'User is already authenticated') {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-glow-sm group-hover:shadow-glow-md transition-all">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gradient">SkillBurst</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {isAuthenticated && (
              <>
                <Link
                  to="/lessons"
                  className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors flex items-center gap-2"
                >
                  <BookOpen className="w-4 h-4" />
                  Lessons
                </Link>
                <Link
                  to="/certifications"
                  className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors flex items-center gap-2"
                >
                  <Trophy className="w-4 h-4" />
                  Certifications
                </Link>
                <Link
                  to="/profile"
                  className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors flex items-center gap-2"
                >
                  <User className="w-4 h-4" />
                  Profile
                </Link>
              </>
            )}
            <Link
              to="/verify"
              className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors flex items-center gap-2"
            >
              <Shield className="w-4 h-4" />
              Verify
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <button
              onClick={handleAuth}
              className="hidden md:block px-6 py-2 rounded-full font-medium transition-all shadow-sm hover:shadow-md"
              style={{
                background: isAuthenticated ? 'oklch(var(--muted))' : 'linear-gradient(135deg, oklch(var(--primary)) 0%, oklch(var(--accent)) 100%)',
                color: isAuthenticated ? 'oklch(var(--foreground))' : 'white',
              }}
            >
              {isAuthenticated ? 'Logout' : 'Login'}
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border/40 bg-background/95 backdrop-blur">
            <nav className="container py-4 flex flex-col space-y-3">
              {isAuthenticated && (
                <>
                  <Link
                    to="/lessons"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors flex items-center gap-2 py-2"
                  >
                    <BookOpen className="w-4 h-4" />
                    Lessons
                  </Link>
                  <Link
                    to="/certifications"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors flex items-center gap-2 py-2"
                  >
                    <Trophy className="w-4 h-4" />
                    Certifications
                  </Link>
                  <Link
                    to="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors flex items-center gap-2 py-2"
                  >
                    <User className="w-4 h-4" />
                    Profile
                  </Link>
                </>
              )}
              <Link
                to="/verify"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors flex items-center gap-2 py-2"
              >
                <Shield className="w-4 h-4" />
                Verify Certificate
              </Link>
              <button
                onClick={handleAuth}
                className="mt-2 px-6 py-2 rounded-full font-medium transition-all shadow-sm text-left"
                style={{
                  background: isAuthenticated ? 'oklch(var(--muted))' : 'linear-gradient(135deg, oklch(var(--primary)) 0%, oklch(var(--accent)) 100%)',
                  color: isAuthenticated ? 'oklch(var(--foreground))' : 'white',
                }}
              >
                {isAuthenticated ? 'Logout' : 'Login'}
              </button>
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-card/50 backdrop-blur">
        <div className="container py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>© {new Date().getFullYear()} SkillBurst</span>
            </div>
            <div className="text-sm text-muted-foreground">
              Built with ❤️ using{' '}
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline font-medium"
              >
                caffeine.ai
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
