"use client"

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Image from "next/image";
import Link from "next/link";
import { 
  ChevronRight,
  BookOpen,
  Headphones,
  Video,
  Settings,
  MessageSquare,
  Home,
  LogOut,
  X,
  Trophy,
  ShoppingBag,
  Mic
} from 'lucide-react';
import { signOut } from 'next-auth/react';

interface NavItem {
  icon: React.ReactNode;
  label: string;
  path: string;
}

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const navItems: NavItem[] = [
    { icon: <Home size={20} />, label: 'Dashboard', path: '/dashboard' },
    { icon: <BookOpen size={20} />, label: 'Flashcards', path: '/flashcard' },
    { icon: <Headphones size={20} />, label: 'Podcast Library', path: '/podcast' },
    { icon: <Video size={20} />, label: 'Video Learning', path: '/videolearning' },
    { icon: <Mic size={20} />, label: 'Transcribe', path: '/transcribe' },
    { icon: <MessageSquare size={20} />, label: 'AI Chat', path: '/chat' },
    { icon: <Trophy size={20} />, label: 'Leaderboard', path: '/leaderboard' },
    { icon: <ShoppingBag size={20} />, label: 'Shop', path: '/shop' },
];

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
    const router = useRouter();
    const pathname = usePathname();

    const [isMobile, setIsMobile] = React.useState(false);
    const [logo, setLogo] = React.useState("/images/Phantom2.gif");
    const [logoPulse, setLogoPulse] = React.useState(false);
    
    React.useEffect(() => {
        const checkIsMobile = () => {
            setIsMobile(window.innerWidth < 1024);
        };

        checkIsMobile();
        window.addEventListener('resize', checkIsMobile);
        return () => window.removeEventListener('resize', checkIsMobile);
    }, []);

    // This function determines if a nav item is active.
    const isActivePath = (path: string) => {
        if (path === '/dashboard' && pathname === '/dashboard') return true;
        return path !== '/dashboard' && pathname.includes(path);
    };

    // Handle click outside to close the sidebar (existing code)
    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const sidebar = document.getElementById('sidebar');
            if (sidebar && !sidebar.contains(event.target as Node) && isOpen) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen, setIsOpen]);

    // Logo click handler to trigger pulse and switch the logo image
    const handleLogoClick = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        // Start pulse animation and change logo to Phantom.gif
        setLogoPulse(true);
        setLogo("/images/Phantom.gif");
        // After 2 seconds, navigate to /dashboard and reset animation states if needed.
        setTimeout(() => {
            router.push("/dashboard");
            setLogoPulse(false);
        }, 2000);
    };

    // For non-mobile, use an aside element.
    return (
        <>
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {!isMobile && (
                <aside
                    id="sidebar"
                    className={`
                        fixed lg:static inset-y-0 left-0 z-30
                        flex flex-col bg-[#DFD2BC]
                        transition-all duration-300 ease-in-out
                        ${isOpen ? 'w-64' : 'w-20'}
                        ${isOpen ? 'translate-x-0' : '-translate-x-[calc(100% - 5rem)] lg:translate-x-0'}
                        lg:flex lg:flex-col lg:h-full
                    `}
                    onClick={() => { if (!isOpen) setIsOpen(true); }}
                >
                    {/* Logo Section */}
                    <div className="flex items-center h-16 px-4 border-b border-gray-200 cursor-pointer" onClick={handleLogoClick}>
                        <Image
                            src={logo}
                            alt="ezPrep Logo"
                            width={24}
                            height={24}
                            className={logoPulse ? "animate-pulse" : ""}
                        />
                        {isOpen && <span className="ml-2 font-gloock">EzPrep.ai</span>}
                    </div>
                    <nav className="flex-1 p-2 space-y-1">
                        {navItems.map((item) => (
                            <button
                                key={item.path}
                                onClick={() => router.push(item.path)}
                                className={`
                                    flex items-center px-3 py-3 rounded-lg
                                    transition-all duration-200
                                    ${isActivePath(item.path)
                                        ? 'bg-[#e6c199] text-[#8b5e34]'
                                        : 'text-[#8b5e34] hover:bg-[#e6c199] hover:bg-opacity-50'
                                    }
                                    w-full
                                `}
                            >
                                <span className="flex-shrink-0">
                                    {item.icon}
                                </span>
                                {isOpen && (
                                    <span className="ml-3 font-medium whitespace-nowrap overflow-hidden">
                                        {item.label}
                                    </span>
                                )}
                            </button>
                        ))}
                    </nav>

                    <button
                        onClick={() => router.push('/settings')}
                        className="flex items-center px-3 py-3 mx-2 mt-2 rounded-lg text-[#8b5e34] hover:bg-[#e6c199] hover:bg-opacity-50 transition-all duration-200"
                    >
                        <Settings size={20} />
                        {isOpen && <span className="ml-3 font-medium">Settings</span>}
                    </button>

                    <button
                        onClick={async () => {
                            await signOut();
                            router.push('/login');
                        }}
                        className="flex items-center px-3 py-3 m-2 rounded-lg text-[#8b5e34] hover:bg-[#e6c199] hover:bg-opacity-50 transition-all duration-200"
                    >
                        <LogOut size={20} />
                        {isOpen && <span className="ml-3 font-medium">Logout</span>}
                    </button>

                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className={`absolute top-4 -right-3 flex w-6 h-6 rounded-full bg-[#DFD2BC] border border-[#e6c199] items-center justify-center text-[#8b5e34] hover:text-[#6d4a29] shadow-sm hover:shadow transition-all duration-200 lg:hidden`}
                    >
                        <ChevronRight size={14} className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                    </button>
                </aside>
            )}

            {isMobile && (
                <div className="fixed bottom-0 left-0 right-0 z-[100] bg-[#DFD2BC] p-2 flex overflow-x-auto border-t border-gray-200 shadow-md">
                    {navItems.map((item) => (
                        <button key={item.path} onClick={() => router.push(item.path)} className="flex flex-col items-center text-[#8b5e34] mx-2">
                            {item.icon}
                            <span className="text-xs">{item.label}</span>
                        </button>
                    ))}
                </div>
            )}
        </>
    );
};

export default Sidebar;
