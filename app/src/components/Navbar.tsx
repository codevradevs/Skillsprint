import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { BookOpen, User, LogOut, Menu, X, Crown, Flame, LayoutDashboard, ChevronDown } from 'lucide-react';

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-[#0a0a0a]/95 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              SkillSprint
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/courses" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">
              Courses
            </Link>
            <Link to="/categories" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">
              Categories
            </Link>
            {isAuthenticated && (
              <Link to="/dashboard" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">
                Dashboard
              </Link>
            )}
          </div>

          {/* Desktop Right Side */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#1a1a1a] border border-white/10 hover:border-purple-500/40 transition-all group">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shrink-0">
                      <span className="text-white text-sm font-bold">
                        {user?.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex flex-col items-start leading-tight">
                      <span className="text-white text-sm font-medium">{user?.name?.split(' ')[0]}</span>
                      {user?.subscriptionStatus === 'active' && (
                        <span className="text-yellow-400 text-xs flex items-center gap-1">
                          <Crown className="w-3 h-3" /> Premium
                        </span>
                      )}
                      {user?.subscriptionStatus !== 'active' && (
                        <span className="text-gray-500 text-xs">Free plan</span>
                      )}
                    </div>
                    <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors ml-1" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-60 bg-[#1a1a1a] border-white/10 mt-1" align="end">
                  <div className="px-3 py-3 border-b border-white/10">
                    <p className="text-white font-semibold">{user?.name}</p>
                    <p className="text-gray-400 text-xs mt-0.5">{user?.email}</p>
                    {user?.skillStreak && user.skillStreak.current > 0 && (
                      <div className="flex items-center gap-1 mt-2 text-orange-400 text-xs">
                        <Flame className="w-3 h-3" />
                        <span>{user.skillStreak.current} day streak 🔥</span>
                      </div>
                    )}
                  </div>
                  <div className="py-1">
                    <DropdownMenuItem onClick={() => navigate('/dashboard')} className="text-gray-300 hover:text-white cursor-pointer gap-3 py-2.5">
                      <LayoutDashboard className="w-4 h-4" />
                      My Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/courses')} className="text-gray-300 hover:text-white cursor-pointer gap-3 py-2.5">
                      <BookOpen className="w-4 h-4" />
                      Browse Courses
                    </DropdownMenuItem>
                  </div>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <div className="py-1">
                    <DropdownMenuItem onClick={handleLogout} className="text-red-400 hover:text-red-300 cursor-pointer gap-3 py-2.5">
                      <LogOut className="w-4 h-4" />
                      Logout
                    </DropdownMenuItem>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost" onClick={() => navigate('/login')} className="text-gray-300 hover:text-white">
                  Login
                </Button>
                <Button
                  onClick={() => navigate('/register')}
                  className="bg-gradient-to-r from-purple-500 to-blue-500 text-white"
                >
                  Get Started
                </Button>
              </div>
            )}
          </div>

          {/* Mobile: show avatar + hamburger */}
          <div className="md:hidden flex items-center gap-2">
            {isAuthenticated && (
              <Link to="/dashboard">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                  <span className="text-white text-sm font-bold">
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
              </Link>
            )}
            <button
              className="text-gray-300 p-1"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/10 space-y-1">
            {isAuthenticated && (
              <div className="flex items-center gap-3 px-2 py-3 mb-2 bg-[#1a1a1a] rounded-xl">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shrink-0">
                  <span className="text-white font-bold">{user?.name?.charAt(0).toUpperCase()}</span>
                </div>
                <div>
                  <p className="text-white font-medium text-sm">{user?.name}</p>
                  <p className="text-gray-400 text-xs">{user?.email}</p>
                </div>
              </div>
            )}
            <Link to="/courses" className="flex items-center gap-3 px-3 py-2.5 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors" onClick={() => setMobileMenuOpen(false)}>
              <BookOpen className="w-4 h-4" /> Courses
            </Link>
            <Link to="/categories" className="flex items-center gap-3 px-3 py-2.5 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors" onClick={() => setMobileMenuOpen(false)}>
              <LayoutDashboard className="w-4 h-4" /> Categories
            </Link>
            {isAuthenticated && (
              <Link to="/dashboard" className="flex items-center gap-3 px-3 py-2.5 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors" onClick={() => setMobileMenuOpen(false)}>
                <User className="w-4 h-4" /> Dashboard
              </Link>
            )}
            {isAuthenticated ? (
              <button
                onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                className="flex items-center gap-3 px-3 py-2.5 text-red-400 hover:bg-white/5 rounded-lg transition-colors w-full mt-2 border-t border-white/10 pt-4"
              >
                <LogOut className="w-4 h-4" /> Logout
              </button>
            ) : (
              <div className="flex flex-col gap-2 pt-4 border-t border-white/10">
                <Button variant="ghost" onClick={() => { navigate('/login'); setMobileMenuOpen(false); }} className="text-gray-300">
                  Login
                </Button>
                <Button onClick={() => { navigate('/register'); setMobileMenuOpen(false); }} className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
                  Get Started
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};
