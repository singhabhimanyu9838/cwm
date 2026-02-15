import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Code2, LogIn, UserPlus, LogOut, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext.jsx';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/playlists', label: 'Playlists' },
  { to: '/videos', label: 'Videos' },
  { to: '/potd', label: 'POTD' },
  { to: '/contact', label: 'Contact' },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
 const { isAuthenticated, isAdmin, logout, email } = useAuth();


  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center group-hover:animate-pulse-glow transition-all">
              <Code2 className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-lg text-foreground">
              codestorywithMIC<span className="text-primary">.dev</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === link.to
                    ? 'text-primary bg-primary/10'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-2">
            {isAuthenticated ? (
              <>
                {isAdmin && (
                  <Button asChild variant="ghost" size="sm" className="text-primary hover:text-primary">
                    <Link to="/admin"><Shield className="w-4 h-4 mr-1" /> Admin</Link>
                  </Button>
                )}
                <span className="text-xs text-muted-foreground truncate max-w-[120px]">{email}</span>
                <Button variant="ghost" size="sm" onClick={logout} className="text-muted-foreground hover:text-foreground">
                  <LogOut className="w-4 h-4 mr-1" /> Logout
                </Button>
              </>
            ) : (
              <>
                <Button asChild variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                  <Link to="/login"><LogIn className="w-4 h-4 mr-2" /> Login</Link>
                </Button>
                <Button asChild size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                  <Link to="/signup"><UserPlus className="w-4 h-4 mr-2" /> Sign Up</Link>
                </Button>
              </>
            )}
          </div>

          <button className="md:hidden text-foreground" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden pb-4 animate-fade-in">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-3 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === link.to
                    ? 'text-primary bg-primary/10'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex gap-2 mt-3 px-4">
              {isAuthenticated ? (
                <>
                  {isAdmin && (
                    <Button asChild variant="ghost" size="sm" className="text-primary flex-1" onClick={() => setIsOpen(false)}>
                      <Link to="/admin"><Shield className="w-4 h-4 mr-1" /> Admin</Link>
                    </Button>
                  )}
                  <Button variant="ghost" size="sm" onClick={() => { logout(); setIsOpen(false); }} className="text-muted-foreground flex-1">
                    <LogOut className="w-4 h-4 mr-1" /> Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button asChild variant="ghost" size="sm" className="text-muted-foreground flex-1" onClick={() => setIsOpen(false)}>
                    <Link to="/login"><LogIn className="w-4 h-4 mr-1" /> Login</Link>
                  </Button>
                  <Button asChild size="sm" className="bg-primary text-primary-foreground flex-1" onClick={() => setIsOpen(false)}>
                    <Link to="/signup"><UserPlus className="w-4 h-4 mr-1" /> Sign Up</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
