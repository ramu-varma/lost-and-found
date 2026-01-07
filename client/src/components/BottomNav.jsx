import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaSearch, FaInbox, FaPlusCircle, FaUserCircle } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const BottomNav = () => {
    const location = useLocation();
    const { user } = useAuth();

    const navItems = [
        { name: 'Home', path: '/', icon: <FaHome /> },
        { name: 'Lost', path: '/lost-items', icon: <FaSearch /> },
        { name: 'Post', path: '/post-item', icon: <FaPlusCircle />, isSpecial: true },
        { name: 'Found', path: '/found-items', icon: <FaInbox /> },
        { name: 'Dash', path: '/dashboard', icon: <FaUserCircle /> },
    ];

    if (!user) return null;

    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t-2 border-slate-200 z-[200] px-4 pb-safe-area-inset-bottom shadow-[0_-10px_30px_rgba(0,0,0,0.1)]">
            <div className="flex justify-between items-center h-16 max-w-md mx-auto">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.name}
                            to={item.path}
                            className={`flex flex-col items-center justify-center relative ${item.isSpecial ? 'w-12' : 'flex-1'
                                }`}
                        >
                            {item.isSpecial ? (
                                <div className="absolute -top-8 bg-primary text-white p-3 rounded-2xl shadow-lg shadow-primary/30 border-4 border-white">
                                    <span className="text-xl">{item.icon}</span>
                                </div>
                            ) : (
                                <>
                                    <span className={`text-xl transition-colors ${isActive ? 'text-black' : 'text-slate-500'}`}>
                                        {item.icon}
                                    </span>
                                    <span className={`text-[10px] font-black mt-1 uppercase tracking-tighter ${isActive ? 'text-black underline decoration-2 underline-offset-4' : 'text-slate-500'}`}>
                                        {item.name}
                                    </span>
                                    {isActive && (
                                        <motion.div
                                            layoutId="bottomNavActive"
                                            className="absolute -bottom-1 w-1 h-1 bg-primary rounded-full"
                                        />
                                    )}
                                </>
                            )}
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
};

export default BottomNav;
