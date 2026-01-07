import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaSearch, FaBell, FaUserCircle, FaPlus, FaBars, FaTimes, FaHome, FaInbox, FaHistory, FaSignOutAlt, FaShieldAlt } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { io } from 'socket.io-client';
import { toast } from 'react-toastify';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);

    useEffect(() => {
        if (user) {
            const isProd = import.meta.env.PROD;
            const socketUrl = isProd ? window.location.origin : `http://${window.location.hostname}:5000`;
            const socket = io(socketUrl);
            socket.emit('join', user._id);

            socket.on('notification', (notification) => {
                setNotifications(prev => [notification, ...prev]);
                toast.info(notification.message);
            });

            return () => {
                socket.off('notification');
                socket.disconnect();
            };
        }
    }, [user]);

    // Close mobile menu on route change
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navLinks = [
        { name: 'Home', path: '/', icon: <FaHome /> },
        { name: 'Lost Items', path: '/lost-items', icon: <FaSearch /> },
        { name: 'Found Items', path: '/found-items', icon: <FaInbox /> },
    ];

    return (
        <nav className="bg-white shadow-md sticky top-0 z-[100] border-b-2 border-slate-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20">
                    <div className="flex items-center">
                        <Link to="/" className="flex-shrink-0 flex items-center group">
                            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center mr-3 group-hover:rotate-12 transition-transform shadow-lg shadow-primary/20">
                                <span className="text-white font-black text-xl">L</span>
                            </div>
                            <span className="text-xl font-black text-slate-800 tracking-tight">Lost<span className="text-primary">&</span>Found</span>
                        </Link>

                        {/* Desktop Links */}
                        <div className="hidden md:ml-10 md:flex md:space-x-8">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    className={`relative px-1 pt-1 text-sm font-bold transition-colors ${location.pathname === link.path ? 'text-primary' : 'text-slate-500 hover:text-primary'
                                        }`}
                                >
                                    {link.name}
                                    {location.pathname === link.path && (
                                        <motion.div
                                            layoutId="navUnderline"
                                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
                                        />
                                    )}
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center space-x-2 md:space-x-4">
                        {user ? (
                            <>
                                <Link to="/post-item" className="hidden sm:flex bg-primary text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-primary-dark transition-all shadow-lg shadow-primary/20 items-center group">
                                    <FaPlus className="mr-2 group-hover:rotate-90 transition-transform" /> Post Item
                                </Link>

                                {/* Notifications */}
                                <div className="relative">
                                    <button
                                        onClick={() => setShowNotifications(!showNotifications)}
                                        className="p-2.5 text-slate-500 hover:text-primary hover:bg-primary/5 rounded-xl transition-colors relative"
                                    >
                                        <FaBell className="h-5 w-5" />
                                        {notifications.length > 0 && (
                                            <span className="absolute top-2.5 right-2.5 block h-2 w-2 rounded-full ring-2 ring-white bg-red-500"></span>
                                        )}
                                    </button>
                                    <AnimatePresence>
                                        {showNotifications && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                className="origin-top-right absolute right-0 mt-3 w-80 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.2)] py-2 bg-white ring-1 ring-black/5 focus:outline-none z-50 border border-slate-200"
                                            >
                                                <div className="px-4 py-3 border-b border-slate-50 flex justify-between items-center">
                                                    <span className="font-black text-black text-sm uppercase tracking-wider">Notifications</span>
                                                    {notifications.length > 0 && <span className="text-[10px] bg-black text-white px-2 py-0.5 rounded-full font-bold">{notifications.length} New</span>}
                                                </div>
                                                {notifications.length === 0 ? (
                                                    <div className="px-4 py-8 text-sm text-slate-400 text-center">
                                                        <FaBell className="mx-auto h-8 w-8 mb-2 opacity-20" />
                                                        No new notifications
                                                    </div>
                                                ) : (
                                                    <div className="max-h-80 overflow-y-auto">
                                                        {notifications.map((notif, idx) => (
                                                            <div key={idx} className="px-4 py-4 border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer">
                                                                <p className="text-sm text-black font-black leading-snug">{notif.message}</p>
                                                                <p className="text-[10px] text-slate-500 mt-2 font-black uppercase tracking-tighter">{new Date().toLocaleTimeString()}</p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* User Menu Desktop */}
                                <div className="relative hidden md:block">
                                    <button
                                        onClick={() => setIsOpen(!isOpen)}
                                        className="flex items-center space-x-2 p-1.5 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100"
                                    >
                                        <div className="w-9 h-9 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500">
                                            <FaUserCircle className="h-6 w-6" />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-xs font-black text-slate-800 leading-none">{user.name.split(' ')[0]}</p>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Rep: {user.reputationScore || 0}</p>
                                        </div>
                                    </button>
                                    <AnimatePresence>
                                        {isOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                                className="origin-top-right absolute right-0 mt-3 w-56 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.2)] py-2 bg-white ring-1 ring-black/5 focus:outline-none z-50 border border-slate-200"
                                            >
                                                <div className="px-4 py-3 border-b border-slate-200 bg-slate-50">
                                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Signed in as</p>
                                                    <p className="text-sm font-black text-black truncate">{user.email}</p>
                                                </div>
                                                <div className="p-1">
                                                    <Link to="/profile" className="flex items-center px-4 py-3 text-sm font-black text-black hover:bg-slate-100 rounded-xl transition-all" onClick={() => setIsOpen(false)}>
                                                        Your Profile
                                                    </Link>
                                                    <Link to="/dashboard" className="flex items-center px-4 py-3 text-sm font-black text-black hover:bg-slate-100 rounded-xl transition-all" onClick={() => setIsOpen(false)}>
                                                        Dashboard
                                                    </Link>
                                                    {user.role === 'ADMIN' && (
                                                        <Link to="/admin" className="flex items-center px-4 py-3 text-sm font-black text-indigo-700 hover:bg-indigo-50 rounded-xl transition-all" onClick={() => setIsOpen(false)}>
                                                            Admin Panel
                                                        </Link>
                                                    )}
                                                </div>
                                                <div className="p-1 border-t border-slate-50 mt-1">
                                                    <button onClick={handleLogout} className="flex w-full items-center px-3 py-2.5 text-sm font-bold text-red-500 hover:bg-red-50 rounded-xl transition-all">
                                                        Sign out
                                                    </button>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </>
                        ) : (
                            <div className="hidden md:flex items-center space-x-3">
                                <Link to="/login" className="text-slate-600 hover:text-primary font-bold text-sm px-4 py-2 transition-colors">Log in</Link>
                                <Link to="/register" className="bg-primary text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-primary-dark transition-all shadow-lg shadow-primary/20">Sign up</Link>
                            </div>
                        )}

                        {/* Mobile Menu Button - Only show for Guest or as a minimal profile trigger */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="md:hidden p-2.5 text-slate-600 hover:text-primary hover:bg-primary/5 rounded-xl transition-colors"
                        >
                            {isMobileMenuOpen ? (
                                <FaTimes className="h-6 w-6 text-black" />
                            ) : (
                                user ? (
                                    <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center text-white shadow-lg">
                                        <FaUserCircle className="h-6 w-6" />
                                    </div>
                                ) : <FaBars className="h-7 w-7 text-black" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Drawer */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="fixed inset-0 bg-black/70 z-[60] md:hidden"
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 30, stiffness: 200 }}
                            className="fixed right-0 top-0 bottom-0 w-80 bg-white z-[70] shadow-[0_0_150px_rgba(0,0,0,0.5)] md:hidden flex flex-col border-l border-slate-200"
                        >
                            <div className="p-6 border-b border-slate-200 bg-white">
                                <div className="flex justify-between items-center mb-6">
                                    <span className="text-xl font-black text-black tracking-tight uppercase">Tools & Menu</span>
                                    <button onClick={() => setIsMobileMenuOpen(false)} className="p-3 text-black bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors">
                                        <FaTimes className="h-5 w-5" />
                                    </button>
                                </div>
                                {user && (
                                    <div className="flex items-center space-x-4 p-4 bg-slate-100/50 rounded-2xl border border-slate-200">
                                        <div className="w-12 h-12 bg-black text-white rounded-xl flex items-center justify-center text-xl shadow-lg">
                                            <FaUserCircle />
                                        </div>
                                        <div>
                                            <p className="font-black text-black leading-none text-base">{user.name}</p>
                                            <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest mt-1.5">Reputation: {user.reputationScore || 0}</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="flex-grow overflow-y-auto p-6 space-y-8 bg-white">
                                <div className="space-y-3">
                                    <p className="text-[11px] font-black text-black/40 uppercase tracking-[0.3em] mb-4 ml-2">Main Navigation</p>
                                    {navLinks.map((link) => (
                                        <Link
                                            key={link.name}
                                            to={link.path}
                                            className={`flex items-center space-x-4 p-5 rounded-2xl transition-all border ${location.pathname === link.path
                                                ? 'bg-black text-white shadow-[0_10px_20px_rgba(0,0,0,0.3)] border-black'
                                                : 'text-black font-black bg-white hover:bg-slate-50 border-slate-100'
                                                }`}
                                        >
                                            <span className="text-2xl">{link.icon}</span>
                                            <span className="text-lg">{link.name}</span>
                                        </Link>
                                    ))}
                                </div>

                                {user && (
                                    <div className="space-y-3">
                                        <p className="text-[11px] font-black text-black/40 uppercase tracking-[0.3em] mb-4 ml-2">Personal Management</p>
                                        <Link to="/dashboard" className={`flex items-center space-x-4 p-5 rounded-2xl font-black transition-all border ${location.pathname === '/dashboard' ? 'bg-black text-white shadow-[0_10px_20px_rgba(0,0,0,0.3)] border-black' : 'text-black bg-white hover:bg-slate-50 border-slate-100'}`}>
                                            <FaHistory className="text-xl" />
                                            <span className="text-lg text-inherit">Dashboard</span>
                                        </Link>
                                        <Link to="/profile" className={`flex items-center space-x-4 p-5 rounded-2xl font-black transition-all border ${location.pathname === '/profile' ? 'bg-black text-white shadow-[0_10px_20px_rgba(0,0,0,0.3)] border-black' : 'text-black bg-white hover:bg-slate-50 border-slate-100'}`}>
                                            <FaUserCircle className="text-xl" />
                                            <span className="text-lg text-inherit">My Profile</span>
                                        </Link>
                                        {user.role === 'ADMIN' && (
                                            <Link to="/admin" className={`flex items-center space-x-4 p-5 rounded-2xl font-black transition-all border ${location.pathname === '/admin' ? 'bg-indigo-600 text-white shadow-[0_10px_20px_rgba(79,70,229,0.3)] border-indigo-700' : 'text-indigo-600 bg-white hover:bg-indigo-50 border-indigo-100'}`}>
                                                <FaShieldAlt className="text-xl" />
                                                <span className="text-lg text-inherit">Administrator</span>
                                            </Link>
                                        )}
                                    </div>
                                )}

                                {user && (
                                    <div className="space-y-3">
                                        <p className="text-[11px] font-black text-black/40 uppercase tracking-[0.3em] mb-4 ml-2">Quick Actions</p>
                                        <Link to="/post-item" className="flex items-center space-x-4 p-6 rounded-[2rem] font-black bg-emerald-600 text-white shadow-[0_15px_30px_rgba(5,150,105,0.4)] hover:bg-emerald-700 transition-all text-center justify-center border-b-4 border-emerald-800">
                                            <FaPlus className="text-xl" />
                                            <span className="text-xl">Report NEW Item</span>
                                        </Link>
                                    </div>
                                )}
                            </div>

                            <div className="p-8 border-t border-slate-200 bg-slate-50">
                                {user ? (
                                    <button onClick={handleLogout} className="flex w-full items-center justify-center space-x-3 p-5 text-red-600 font-black text-sm uppercase tracking-widest bg-white hover:bg-red-50 rounded-2xl transition-all border-2 border-red-100 shadow-sm leading-none">
                                        <FaSignOutAlt />
                                        <span>Logout Now</span>
                                    </button>
                                ) : (
                                    <div className="grid grid-cols-2 gap-4">
                                        <Link to="/login" className="flex items-center justify-center p-5 text-black font-black bg-white hover:bg-slate-50 rounded-2xl transition-all border border-slate-200 shadow-sm">Log In</Link>
                                        <Link to="/register" className="flex items-center justify-center p-5 bg-black text-white font-black rounded-2xl transition-all shadow-xl">Sign Up</Link>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
