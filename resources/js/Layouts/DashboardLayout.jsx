"use client"

import { useState, useEffect, useRef, createContext, useContext } from "react"
import {
  Bell,
  MessageSquare,
  Settings,
  Sun,
  Moon,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Menu,
  X,
  LogOut,
  User,
  Award,
  ChevronUp,
  Home,
  Sparkles,
  Type,
  BookOpenText,
  FlipVertical,
  PencilLine,
  ListChecks,
  Trophy,
} from "lucide-react"

// Add this import at the top with the other imports
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/contexts/theme-context"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useIsMobile } from "@/hooks/use-mobile"
import { SidebarLink } from "@/components/sidebar-link"
import LevelBar from "../components/LevelBar"
import { usePage,router} from "@inertiajs/react"


// Add this after the imports section
const responsiveStyles = `
  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }

  @keyframes float {
    0% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-10px) rotate(2deg); }
    100% { transform: translateY(0px) rotate(0deg); }
  }

  @keyframes pulse {
    0% { opacity: 0.3; }
    50% { opacity: 0.7; }
    100% { opacity: 0.3; }
  }
  
  @media screen and (min-height: 600px) {
    .sidebar-responsive-text { font-size: 0.875rem; }
    .sidebar-responsive-icon { width: 1.25rem; height: 1.25rem; }
    .sidebar-element { padding: 0.5rem; }
  }
  
  @media screen and (min-height: 800px) {
    .sidebar-responsive-text { font-size: 0.9375rem; }
    .sidebar-responsive-icon { width: 1.375rem; height: 1.375rem; }
    .sidebar-element { padding: 0.625rem; }
  }
  
  @media screen and (min-height: 1000px) {
    .sidebar-responsive-text { font-size: 1rem; }
    .sidebar-responsive-icon { width: 1.5rem; height: 1.5rem; }
    .sidebar-element { padding: 0.75rem; }
  }
`

// Japanese characters for visual interest
const japaneseChars = [
  "あ",
  "い",
  "う",
  "え",
  "お",
  "か",
  "き",
  "く",
  "け",
  "こ",
  "ア",
  "イ",
  "ウ",
  "エ",
  "オ",
  "カ",
  "キ",
  "ク",
  "ケ",
  "コ",
]

// 1. Buat Context
const LayoutContext = createContext()

// 2. Buat Provider Component
export function LayoutProvider({ children, value }) {
  return <LayoutContext.Provider value={value}>{children}</LayoutContext.Provider>
}

// 3. Buat hook untuk akses di children
export const useLayout = () => {
  const context = useContext(LayoutContext)
  if (context === undefined) {
    throw new Error("useLayout must be used within a LayoutProvider")
  }
  return context
}

export default function Dashboard({ children }) {
  const [mounted, setMounted] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    // Initialize from localStorage if available, otherwise default to false
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sidebarOpen')
      return saved !== null ? JSON.parse(saved) : false
    }
    return false
  })
  const { theme, toggleTheme } = useTheme()
  const [showBanner, setShowBanner] = useState(true)
 
  const {currentLevel,currentExp,maxExp,user} = usePage().props
  
  const isMobile = useIsMobile()
  const sidebarRef = useRef(null)
  const [showMobileMenu, setShowMobileMenu] = useState(false)

  // This is to prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  // Close sidebar on mobile by default
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false)
      setShowMobileMenu(false)
    }
  }, [isMobile])

  const toggleSidebar = () => {
    if (isMobile) {
      setShowMobileMenu(!showMobileMenu)
    } else {
      const newState = !sidebarOpen
      setSidebarOpen(newState)
      // Save to localStorage
      localStorage.setItem('sidebarOpen', JSON.stringify(newState))
    }
  }

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) { // desktop breakpoint
        const saved = localStorage.getItem('sidebarOpen')
        setSidebarOpen(saved !== null ? JSON.parse(saved) : false)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Generate random positions for floating characters
  const getRandomPosition = (index) => {
    const positions = [
      { top: "10%", left: "5%", delay: 0.5 },
      { top: "15%", right: "10%", delay: 0.7 },
      { top: "30%", left: "15%", delay: 0.3 },
      { top: "25%", right: "20%", delay: 0.9 },
      { top: "60%", left: "8%", delay: 0.6 },
      { top: "70%", right: "12%", delay: 0.4 },
      { top: "85%", left: "20%", delay: 0.8 },
      { top: "80%", right: "5%", delay: 0.2 },
    ]
    return positions[index % positions.length]
  }

  useEffect(() => {
    // Add the responsive styles
    const styleElement = document.createElement('style');
    styleElement.innerHTML = responsiveStyles;
    document.head.appendChild(styleElement);
    
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

    const handleLogout = () => {
      router.post(route('logout'), {
        onSuccess: () => {
          window.location.href = '/login';
        }
      });
    };

  return (
    <LayoutProvider value={{ sidebarOpen, isMobile }}>
      <div className="relative flex min-h-screen bg-gradient-to-br from-background to-background/80 dark:from-slate-950 dark:to-indigo-950 overflow-hidden">

                 <div className="fixed bottom-[80px] right-5 z-20 flex h-[48px] w-[48px] items-center justify-center rounded-full bg-primary dark:bg-violet-600 text-white shadow-lg">
                    {theme === "dark" ? (
                      <Sun className="h-5 w-5 cursor-pointer" onClick={toggleTheme} />
                    ) : (
                      <Moon className="h-5 w-5 cursor-pointer" onClick={toggleTheme} />
                    )}
                  </div>

        {/* Desktop Sidebar */}
        {!isMobile && (
          <div
            ref={sidebarRef}
            className={cn(
              "fixed top-0 left-0 h-screen flex flex-col border-r border-border dark:border-slate-800 bg-background dark:bg-slate-950 transition-all duration-300 ease-in-out z-20",
              sidebarOpen ? "w-80" : "w-20",
            )}
          >
            {/* Toggle Button */}
            <button
              onClick={toggleSidebar}
              className="absolute -right-4 top-20 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-primary dark:bg-violet-600 text-white shadow-md hover:bg-primary/90 dark:hover:bg-violet-700 transition-all"
              aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
            >
              {sidebarOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
            </button>

            {/* Sidebar Header */}
            <div className="px-4 py-6">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary dark:bg-violet-600 text-white">
                  <span className="font-bold text-lg">NV</span>
                </div>
                {sidebarOpen && (
                  <div className="overflow-hidden">
                    <h2 className="text-lg font-bold text-foreground dark:text-white">NihonggoVocabulary</h2>
                    <p className="text-xs text-muted-foreground dark:text-slate-400">Vocabulary Dashboard</p>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar Content */}
            <div className="custom-scrollbar flex-1 overflow-y-auto px-3 py-4">
              {sidebarOpen && (
                <h3 className="mb-3 px-4 text-xs font-semibold uppercase text-muted-foreground dark:text-slate-500">
                  Pembelajaran
                </h3>
              )}
              <nav className="space-y-1">
                <SidebarLink icon={<LayoutDashboard className="h-5 w-5" />} label="Dashboard" isActive={route().current('dashboard')} isOpen={sidebarOpen} href={route('dashboard')}/>
                <SidebarLink icon={<Type className="h-5 w-5" />} label="Huruf Jepang" isActive={['huruf', 'kategori-huruf-hiragana', 'huruf-hiragana','huruf-hiragana-detail'].some(name => route().current(name))}
                isOpen={sidebarOpen} href={route('huruf')} />
                <SidebarLink icon={<BookOpenText className="h-5 w-5" />} label="Kosakata" isActive={['list-kosakata', 'detail-kosakata', 'kosakata-flashcard'].some(name => route().current(name))} isOpen={sidebarOpen} href={route('list-kosakata')} />
                <SidebarLink icon={<FlipVertical className="h-5 w-5" />} label="Flashcard" isActive={['flashcard'].some(name => route().current(name))} isOpen={sidebarOpen} href={route('flashcard')} />
              
              
              </nav>

              {sidebarOpen && (
                <h3 className="mb-3 mt-6 px-4 text-xs font-semibold uppercase text-muted-foreground dark:text-slate-500">
                  Uji Kemampuan
                </h3>
              )}
              {!sidebarOpen && <div className="my-6 border-t border-border dark:border-slate-800"></div>}
              <nav className="space-y-1">
                <SidebarLink icon={<PencilLine className="h-5 w-5" />} label="Kuis Huruf" isOpen={sidebarOpen} isActive={['pilih-huruf-quis','pilih-list-huruf-quis','pilih-level-quis'].some(name => route().current(name))} href={route('pilih-huruf-quis')} />
                <SidebarLink icon={<ListChecks className="h-5 w-5" />} label="Kuis Kosakata" isOpen={sidebarOpen} />
                <SidebarLink icon={<Trophy className="h-5 w-5" />} label="Leaderboard" isOpen={sidebarOpen} />
                <SidebarLink
                  icon={<Award className="h-5 w-5" />}
                  label="Achievements"
                  locked={true}
                  isOpen={sidebarOpen}
                />

                
              </nav>
            </div>
            <div className="mt-auto p-4 border-t border-border dark:border-slate-800 sidebar-element">
  <div className={cn(
    "bg-gradient-to-br from-primary/10 to-violet-500/10 dark:from-violet-600/10 dark:to-indigo-500/10 rounded-lg p-3 shadow-inner transition-all duration-300",
    !sidebarOpen ? "flex items-center justify-center" : ""
  )}>
    {sidebarOpen ? (
      <div className="flex items-center gap-3">
        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-br from-primary to-violet-500 dark:from-violet-600 dark:to-indigo-500 flex items-center justify-center text-white">
          <Sparkles className="h-5 w-5" />
        </div>
        <div className="overflow-hidden">
          <h4 className="text-sm font-medium text-foreground dark:text-white">Premium Features</h4>
          <p className="text-xs text-muted-foreground dark:text-slate-400">Unlock advanced learning tools</p>
          <Button size="sm" variant="link" className="text-xs text-primary dark:text-violet-400 p-0 h-auto mt-1">
            Upgrade Now
          </Button>
        </div>
      </div>
    ) : (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-br from-primary to-violet-500 dark:from-violet-600 dark:to-indigo-500 flex items-center justify-center text-white cursor-pointer hover:scale-110 transition-transform">
              <Sparkles className="h-5 w-5" />
            </div>
          </TooltipTrigger>
          <TooltipContent side="right" className="bg-gradient-to-br from-background to-muted border border-primary/20 dark:border-violet-500/20 p-3">
            <div className="space-y-1">
              <h4 className="text-sm font-medium">Premium Features</h4>
              <p className="text-xs text-muted-foreground">Unlock advanced learning tools</p>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )}
  </div>
</div>
          </div>
        )}

        {/* Mobile Sidebar Overlay */}
        <AnimatePresence>
          {isMobile && showMobileMenu && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[120] bg-black"
                onClick={() => setShowMobileMenu(false)}
              />
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="fixed top-0 left-0 z-[150] h-full w-[85%] bg-background dark:bg-slate-950 shadow-xl overflow-hidden"
              >
                <div className="flex h-16 items-center justify-between border-b border-border dark:border-slate-800 px-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary dark:bg-violet-600 text-white">
                      <span className="font-bold">AS</span>
                    </div>
                    <h2 className="text-lg font-bold text-foreground dark:text-white">NihonggoVocabulary</h2>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowMobileMenu(false)}
                    className="text-muted-foreground dark:text-slate-400"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                <div className="custom-scrollbar h-[calc(100vh-4rem)] overflow-y-auto px-3 py-4">
                  <h3 className="mb-3 px-4 text-xs font-semibold uppercase text-muted-foreground dark:text-slate-500">
                    PEMBELAJARAN
                  </h3>
                  <nav className="space-y-1">
                  <SidebarLink icon={<LayoutDashboard className="h-5 w-5" />} label="Dashboard" isActive={route().current('dashboard')} isOpen={true} href={route('dashboard')}/>
                <SidebarLink icon={<Type className="h-5 w-5" />} label="Huruf Jepang" isActive={['huruf', 'kategori-huruf-hiragana', 'huruf-hiragana','huruf-hiragana-detail'].some(name => route().current(name))}
                isOpen={true} href={route('huruf')} />
                <SidebarLink icon={<BookOpenText className="h-5 w-5" />} label="Kosakata" isActive={['list-kosakata', 'detail-kosakata', 'kosakata-flashcard'].some(name => route().current(name))} isOpen={true} href={route('list-kosakata')} />
                <SidebarLink icon={<FlipVertical className="h-5 w-5" />} label="Flashcard" isActive={false} isOpen={true} href={route('list-kosakata')} />
                  </nav>

                  {/* Level Bar for Mobile */}
                  <div className="px-4 py-3 mt-2 mb-4">
                    <h3 className="mb-2 text-xs font-semibold uppercase text-muted-foreground dark:text-slate-500">
                      Your Level
                    </h3>
                    <div className="w-full">
                    <LevelBar currentLevel={currentLevel}  currentExp={currentExp} maxExp={maxExp} />
                  </div>
                  </div>

                  <h3 className="mb-3 mt-6 px-4 text-xs font-semibold uppercase text-muted-foreground dark:text-slate-500">
                    Uji Kemampuan
                  </h3>
                  <nav className="space-y-1">
                  <SidebarLink icon={<PencilLine className="h-5 w-5" />} label="Kuis Huruf" isOpen={true} isActive={['pilih-huruf-quis','pilih-list-huruf-quis','pilih-level-quis','quis','review-quis'].some(name => route().current(name))} href={route('pilih-huruf-quis')} />
                <SidebarLink icon={<ListChecks className="h-5 w-5" />} label="Kuis Kosakata" isOpen={true} />
                <SidebarLink icon={<Trophy className="h-5 w-5" />} label="Leaderboard" isOpen={true} />
                <SidebarLink
                  icon={<Award className="h-5 w-5" />}
                  label="Achievements"
                  locked={true}
                  isOpen={true}
                />
                  
                  </nav>
                </div>
                <div className="mt-4 px-4 mb-4">
                  <div className="bg-gradient-to-br from-primary/10 to-violet-500/10 dark:from-violet-600/10 dark:to-indigo-500/10 rounded-lg p-3 shadow-inner">
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-br from-primary to-violet-500 dark:from-violet-600 dark:to-indigo-500 flex items-center justify-center text-white">
                        <Sparkles className="h-5 w-5" />
                      </div>
                      <div className="overflow-hidden">
                        <h4 className="text-sm font-medium text-foreground dark:text-white">Premium Features</h4>
                        <p className="text-xs text-muted-foreground dark:text-slate-400">Unlock advanced learning tools</p>
                        <Button size="sm" variant="link" className="text-xs text-primary dark:text-violet-400 p-0 h-auto mt-1">
                          Upgrade Now
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
            
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <div
          className={cn(
            "flex flex-1 flex-col overflow-hidden pt-[70px]",
            !isMobile && (sidebarOpen ? "ml-80" : "ml-20"),
            "transition-all duration-300",
          )}
        >
          <header className={cn(
            "fixed z-[30] top-0 flex h-16 items-center justify-between border-b border-border dark:border-slate-800 bg-background dark:bg-slate-950 px-4 md:px-6",
            isMobile ? "left-0 right-0" : sidebarOpen ? "left-80 right-0" : "left-20 right-0",
            "transition-all duration-300"
          )}>
            <div className="flex w-full justify-between items-center gap-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              {/* Left Section */}
              <div className="flex items-center gap-4">
                {isMobile && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleSidebar}
                    className="text-muted-foreground dark:text-slate-400"
                  >
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={showMobileMenu ? "close" : "menu"}
                        initial={{ opacity: 0, rotate: showMobileMenu ? -90 : 90 }}
                        animate={{ opacity: 1, rotate: 0 }}
                        exit={{ opacity: 0, rotate: showMobileMenu ? 90 : -90 }}
                        transition={{ duration: 0.2 }}
                      >
                        {showMobileMenu ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                      </motion.div>
                    </AnimatePresence>
                  </Button>
                )}

                {/* Level Bar - Only show on desktop */}
                {!isMobile && (
                  <div className="w-[300px]">
                   <LevelBar currentLevel={currentLevel}  currentExp={currentExp} maxExp={maxExp} />
                  </div>
                )}
              </div>

              {/* Right Section */}
              <div className="flex items-center gap-3">
                {/* Theme Toggle */}
                <div className="fixed bottom-[80px] right-5 z-20 flex h-[48px] w-[48px] items-center justify-center rounded-full bg-primary dark:bg-violet-600 text-white shadow-lg">
                  {theme === "dark" ? (
                    <Sun className="h-5 w-5 cursor-pointer" onClick={toggleTheme} />
                  ) : (
                    <Moon className="h-5 w-5 cursor-pointer" onClick={toggleTheme} />
                  )}
                </div>

                {/* Notification */}
                <Button variant="ghost" size="icon" className="relative text-muted-foreground dark:text-slate-400">
                  <Bell className="h-5 w-5" />
                  <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary dark:bg-violet-500"></span>
                </Button>

                {/* Messages */}
                <Button variant="ghost" size="icon" className="relative text-muted-foreground dark:text-slate-400">
                  <MessageSquare className="h-5 w-5" />
                  <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary dark:bg-violet-500"></span>
                </Button>

                {/* Profile Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0 transition-all hover:ring-2 hover:ring-primary/50 dark:hover:ring-violet-500/50">
                      <Avatar className="border-2 border-primary/20 dark:border-violet-500/20 transition-all hover:border-primary dark:hover:border-violet-500">
                        <AvatarImage src={user.foto} />
                        <AvatarFallback>{user.nama_pengguna.charAt(0)}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 p-0 overflow-hidden z-[110]" forceMount>
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="bg-primary/10 dark:bg-violet-500/10 p-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-12 w-12 border-2 border-primary dark:border-violet-500">
                            <AvatarImage src={user.foto} />
                            <AvatarFallback>{user.nama_pengguna.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-foreground dark:text-white">{user.nama_pengguna}</p>
                            <p className="text-xs text-muted-foreground dark:text-slate-400">{user.email}</p>
                          </div>
                        </div>
                      </div>
                      <DropdownMenuSeparator className="m-0" />
                      <div className="p-1">
                        <DropdownMenuItem className="flex items-center gap-2 rounded-md p-2 cursor-pointer hover:bg-primary/10 dark:hover:bg-violet-500/10">
                          <User className="h-4 w-4 text-primary dark:text-violet-400" />
                          <span>Profile</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="flex items-center gap-2 rounded-md p-2 cursor-pointer hover:bg-primary/10 dark:hover:bg-violet-500/10">
                          <Settings className="h-4 w-4 text-primary dark:text-violet-400" />
                          <span>Settings</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <button onClick={handleLogout} className="w-full hover:bg-red-100 dark:hover:bg-red-900/20">
                        <DropdownMenuItem className="flex items-center gap-2 rounded-md p-2 cursor-pointer hover:bg-red-100 dark:hover:bg-red-900/20">
                          <LogOut className="h-4 w-4 text-red-500" />
                        
                            <span className="text-red-500">Log out</span>
                        
                        </DropdownMenuItem>
                        </button>
                      </div>
                    </motion.div>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </header>
         
      
        
          <main className="flex-1 overflow-auto  px-1 xsm:px-4 md:p-6 pt-[40px] lg:pt-[45px]">
                {/* Floating Japanese characters - only show on larger screens */}
        {!isMobile &&
  japaneseChars.slice(0, 8).map((char, index) => (
    <motion.div
      key={index}
      className="absolute text-primary/10 dark:text-violet-500/10 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold pointer-events-none select-none"
      style={{
        ...getRandomPosition(index),
        textShadow: '0 0 15px rgba(139, 92, 246, 0.2)'
      }}
      animate={{
        y: [-5, 5],
        rotate: [0, index % 2 === 0 ? 5 : -5],
        opacity: [0.3, 0.7],
        scale: [1, 1.05]
      }}
      transition={{
        duration: 4 + index % 3,
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "reverse",
        ease: "easeInOut",
        delay: getRandomPosition(index).delay,
      }}
    >
      {char}
    </motion.div>
  ))}

            {children}
            <footer className="mt-auto pt-8 pb-[40px]">
  <div className="border-t border-border dark:border-slate-800 pt-6 pb-4 bg-gradient-to-b from-transparent to-muted/20 dark:to-slate-900/30">
    <div className="container mx-auto px-4">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary to-violet-500 dark:from-violet-600 dark:to-indigo-500 flex items-center justify-center text-white font-bold text-sm shadow-md">NV</div>
          <div>
            <h3 className="font-medium text-foreground dark:text-white">NihonggoVocabulary</h3>
            <p className="text-xs text-muted-foreground dark:text-slate-400">© 2025 NihonggoVocabulary. All rights reserved.</p>
          </div>
        </div>
        
        <div className="flex flex-wrap justify-center gap-6">
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-foreground dark:text-white">Resources</h4>
            <div className="flex flex-col gap-1">
              <motion.a 
                href="#" 
                className="text-xs text-muted-foreground dark:text-slate-400 hover:text-primary dark:hover:text-violet-400 transition-colors"
                whileHover={{ x: 2 }}
              >
                Documentation
              </motion.a>
              <motion.a 
                href="#" 
                className="text-xs text-muted-foreground dark:text-slate-400 hover:text-primary dark:hover:text-violet-400 transition-colors"
                whileHover={{ x: 2 }}
              >
                Tutorials
              </motion.a>
            </div>
          </div>
          
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-foreground dark:text-white">Company</h4>
            <div className="flex flex-col gap-1">
              <motion.a 
                href="#" 
                className="text-xs text-muted-foreground dark:text-slate-400 hover:text-primary dark:hover:text-violet-400 transition-colors"
                whileHover={{ x: 2 }}
              >
                About Us
              </motion.a>
              <motion.a 
                href="#" 
                className="text-xs text-muted-foreground dark:text-slate-400 hover:text-primary dark:hover:text-violet-400 transition-colors"
                whileHover={{ x: 2 }}
              >
                Contact
              </motion.a>
            </div>
          </div>
          
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-foreground dark:text-white">Legal</h4>
            <div className="flex flex-col gap-1">
              <motion.a 
                href="#" 
                className="text-xs text-muted-foreground dark:text-slate-400 hover:text-primary dark:hover:text-violet-400 transition-colors"
                whileHover={{ x: 2 }}
              >
                Terms
              </motion.a>
              <motion.a 
                href="#" 
                className="text-xs text-muted-foreground dark:text-slate-400 hover:text-primary dark:hover:text-violet-400 transition-colors"
                whileHover={{ x: 2 }}
              >
                Privacy
              </motion.a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</footer>
            </main>
            {/* Scroll to Top Button */}
      <ScrollToTopButton />
        </div>
      </div>
    </LayoutProvider>
  )
}

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener("scroll", toggleVisibility)
    return () => window.removeEventListener("scroll", toggleVisibility)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          onClick={scrollToTop}
          className="fixed bottom-[140px] right-5 z-20 p-3 bg-primary text-primary-foreground rounded-full shadow-lg"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.9 }}
        >
          <ChevronUp size={24} />
        </motion.button>
      )}
    </AnimatePresence>
  )
}
