import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { FaEnvelope, FaLock, FaUser, FaArrowRight } from 'react-icons/fa';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }
        setLoading(true);
        try {
            await register(name, email, password);
            toast.success('Registered successfully');
            navigate('/');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-120px)] flex items-center justify-center px-4 py-12">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white p-6 sm:p-10 md:p-14 rounded-[3rem] shadow-2xl shadow-slate-200/50 w-full max-w-lg border border-slate-100 relative overflow-hidden"
            >
                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-secondary via-primary to-secondary"></div>

                <div className="text-center mb-10">
                    <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-secondary text-2xl shadow-inner">
                        <FaUser />
                    </div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Create Account</h2>
                    <p className="text-slate-400 font-medium">Join our community to start reporting items</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Full Name</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-6 flex items-center text-slate-400 group-focus-within:text-secondary transition-colors">
                                <FaUser />
                            </div>
                            <input
                                type="text"
                                required
                                placeholder="John Doe"
                                className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:bg-white transition-all font-medium"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Email Address</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-6 flex items-center text-slate-400 group-focus-within:text-secondary transition-colors">
                                <FaEnvelope />
                            </div>
                            <input
                                type="email"
                                required
                                placeholder="name@example.com"
                                className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:bg-white transition-all font-medium"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Password</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-6 flex items-center text-slate-400 group-focus-within:text-secondary transition-colors">
                                <FaLock />
                            </div>
                            <input
                                type="password"
                                required
                                placeholder="••••••••"
                                className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:bg-white transition-all font-medium"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Confirm Password</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-6 flex items-center text-slate-400 group-focus-within:text-secondary transition-colors">
                                <FaLock />
                            </div>
                            <input
                                type="password"
                                required
                                placeholder="••••••••"
                                className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:bg-white transition-all font-medium"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-secondary text-white py-5 rounded-2xl font-black text-lg hover:bg-secondary-dark transition-all shadow-xl shadow-secondary/30 flex items-center justify-center group disabled:opacity-50"
                    >
                        {loading ? (
                            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white"></div>
                        ) : (
                            <>Create Account <FaArrowRight className="ml-3 group-hover:translate-x-1 transition-transform" /></>
                        )}
                    </button>
                </form>

                <div className="mt-10 text-center">
                    <p className="text-slate-500 font-medium">
                        Already have an account?{' '}
                        <Link to="/login" className="font-black text-secondary hover:underline">
                            Sign In
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default Register;
