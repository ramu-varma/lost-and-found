import { useAuth } from '../context/AuthContext';
import { FaUserCircle, FaEnvelope, FaShieldAlt, FaCalendarAlt, FaStar, FaEdit } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Profile = () => {
    const { user } = useAuth();

    if (!user) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
    );

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto px-4 md:px-0 pb-12"
        >
            {/* Profile Header Card */}
            <div className="bg-white rounded-[3rem] shadow-2xl shadow-slate-200/50 overflow-hidden border border-slate-100 mb-8">
                <div className="bg-slate-900 h-48 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/40 to-transparent z-0"></div>
                    <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/20 rounded-full blur-3xl"></div>
                </div>

                <div className="px-8 md:px-12 pb-12 relative">
                    <div className="flex flex-col md:flex-row items-center md:items-end -mt-20 md:-mt-16 mb-8 gap-6">
                        <div className="relative group">
                            <div className="w-40 h-40 bg-white rounded-[2.5rem] p-2 shadow-2xl relative z-10">
                                <div className="w-full h-full bg-slate-100 rounded-[2rem] flex items-center justify-center text-slate-300 overflow-hidden">
                                    <FaUserCircle className="w-full h-full" />
                                </div>
                            </div>
                            <button className="absolute bottom-2 right-2 bg-primary text-white p-3 rounded-2xl shadow-lg hover:scale-110 transition-all z-20 border-4 border-white">
                                <FaEdit size={14} />
                            </button>
                        </div>

                        <div className="text-center md:text-left flex-grow">
                            <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-2 uppercase">{user.name}</h1>
                            <div className="flex flex-wrap justify-center md:justify-start gap-3">
                                <span className="px-4 py-1.5 bg-primary/10 text-primary rounded-full text-[10px] font-black uppercase tracking-widest border border-primary/10">
                                    {user.role}
                                </span>
                                <span className="px-4 py-1.5 bg-green-50 text-green-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-green-100 flex items-center">
                                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                                    Verified Account
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 group hover:bg-white hover:shadow-xl transition-all duration-500">
                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-primary shadow-sm mb-4 group-hover:scale-110 transition-transform">
                                <FaEnvelope />
                            </div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Email Address</p>
                            <p className="font-bold text-slate-800 truncate">{user.email}</p>
                        </div>

                        <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 group hover:bg-white hover:shadow-xl transition-all duration-500">
                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-secondary shadow-sm mb-4 group-hover:scale-110 transition-transform">
                                <FaCalendarAlt />
                            </div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Member Since</p>
                            <p className="font-bold text-slate-800">January 2024</p>
                        </div>

                        <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 group hover:bg-white hover:shadow-xl transition-all duration-500">
                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-green-500 shadow-sm mb-4 group-hover:scale-110 transition-transform">
                                <FaShieldAlt />
                            </div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Account Status</p>
                            <p className="font-bold text-slate-800">
                                {user.isBlocked ? <span className="text-red-500">Blocked</span> : <span className="text-green-500">Active</span>}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Reputation Section */}
            <div className="bg-white rounded-[3rem] p-8 md:p-12 shadow-2xl shadow-slate-200/50 border border-slate-100">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center">
                        <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center mr-4 shadow-inner">
                            <FaStar />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-slate-900">Community Reputation</h3>
                            <p className="text-xs text-slate-500 font-medium">Based on your successful returns and reports.</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-3xl font-black text-slate-900">750</div>
                        <div className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Points</div>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        <span>Level 4: Trusted Finder</span>
                        <span>Next Level: 1000 pts</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-4 p-1 shadow-inner">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: '75%' }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            className="bg-gradient-to-r from-amber-400 to-amber-600 h-full rounded-full shadow-lg"
                        ></motion.div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 pt-4">
                        <div className="text-center">
                            <div className="text-lg font-black text-slate-800">12</div>
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Items Found</div>
                        </div>
                        <div className="text-center border-x border-slate-100">
                            <div className="text-lg font-black text-slate-800">8</div>
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Items Returned</div>
                        </div>
                        <div className="text-center">
                            <div className="text-lg font-black text-slate-800">100%</div>
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Success Rate</div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default Profile;
