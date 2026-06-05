import { Outlet, Link, useLocation, useNavigate } from 'react-router';
import { Home, Users, Calendar, Moon, Sun, LogOut, Menu, X } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { Button } from '../ui/button';
import { useState } from 'react';
import { toast } from 'sonner';

export function RootLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Clientes', href: '/clients', icon: Users },
    { name: 'Agenda', href: '/schedule', icon: Calendar },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    toast.success('Logout realizado com sucesso!');
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex md:flex-col md:w-64 bg-sidebar border-r border-sidebar-border">
        <div className="p-6 border-b border-sidebar-border">
          <h1 className="text-xl font-bold text-sidebar-foreground">Personal Fit Service</h1>
          <p className="text-sm text-sidebar-foreground/70 mt-1">Personal Trainer</p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive(item.href)
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 space-y-2 border-t border-sidebar-border">
          <Button
            variant="ghost"
            className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent"
            onClick={toggleTheme}
          >
            {theme === 'light' ? (
              <>
                <Moon className="w-5 h-5 mr-3" />
                Modo Escuro
              </>
            ) : (
              <>
                <Sun className="w-5 h-5 mr-3" />
                Modo Claro
              </>
            )}
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent"
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5 mr-3" />
            Sair
          </Button>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden bg-sidebar border-b border-sidebar-border p-4 flex items-center justify-between">
        <h1 className="font-bold text-sidebar-foreground">Personal Fit Service</h1>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="text-sidebar-foreground"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </Button>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-sidebar border-b border-sidebar-border">
          <nav className="p-4 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive(item.href)
                      ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                      : 'text-sidebar-foreground hover:bg-sidebar-accent'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
            <Button
              variant="ghost"
              className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent mt-4"
              onClick={toggleTheme}
            >
              {theme === 'light' ? (
                <>
                  <Moon className="w-5 h-5 mr-3" />
                  Modo Escuro
                </>
              ) : (
                <>
                  <Sun className="w-5 h-5 mr-3" />
                  Modo Claro
                </>
              )}
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent"
              onClick={handleLogout}
            >
              <LogOut className="w-5 h-5 mr-3" />
              Sair
            </Button>
          </nav>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}