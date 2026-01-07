import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaHome, FaExclamationTriangle } from 'react-icons/fa';

const NotFound = () => {
    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="relative mb-8"
            >
                <div className="text-[12rem] font-black text-slate-100 leading-none select-none">
                    404
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-24 h-24 bg-primary/10 rounded-[2rem] flex items-center justify-center text-primary text-4xl animate-bounce">
                        <FaExclamationTriangle />
                    </div>
                </div>
            </motion.div>

            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
            >
                <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Lost in Space?</h1>
                <p className="text-slate-500 mb-10 max-w-md font-medium leading-relaxed">
                    The page you're looking for seems to have vanished into thin air. Don't worry, even the best finders lose their way sometimes.
                </p>

                <Link
                    to="/"
                    className="inline-flex items-center px-8 py-4 bg-primary text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 active:scale-95"
                >
                    <FaHome className="mr-2 text-lg" /> Back to Safety
                </Link>
            </motion.div>
        </div>
    );
};

export default NotFound;
