import { useState, useEffect } from 'react';
import api from '../services/api';
import ItemCard from '../components/ItemCard';
import { FaSearch, FaFilter, FaInbox } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const FoundItems = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [keyword, setKeyword] = useState('');

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async (search = '') => {
        setLoading(true);
        try {
            const { data } = await api.get(`/items?keyword=${search}`);
            const foundItems = data.items.filter(item => item.type === 'FOUND');
            setItems(foundItems);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchItems(keyword);
    };

    return (
        <div className="max-w-7xl mx-auto pb-12">
            {/* Header & Search Section */}
            <div className="bg-slate-900 rounded-[2.5rem] p-8 md:p-16 mb-12 relative overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-secondary/20 via-primary/10 to-transparent z-0"></div>
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse"></div>

                <div className="relative z-10 text-center max-w-3xl mx-auto">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight"
                    >
                        Found Something?
                    </motion.h1>
                    <p className="text-slate-400 text-lg mb-10 font-medium">
                        Report found items and help them get back to their rightful owners.
                    </p>

                    <form onSubmit={handleSearch} className="relative group max-w-2xl mx-auto">
                        <div className="absolute inset-y-0 left-6 flex items-center text-slate-400 group-focus-within:text-secondary transition-colors">
                            <FaSearch />
                        </div>
                        <input
                            type="text"
                            placeholder="Search by title, description or location..."
                            className="w-full pl-14 pr-32 py-5 bg-white border-2 border-slate-200 rounded-2xl text-black placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-secondary/20 transition-all font-black"
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                        />
                        <button
                            type="submit"
                            className="absolute right-3 top-3 bottom-3 bg-secondary text-white px-8 rounded-xl font-black text-sm hover:bg-secondary-dark transition-all shadow-lg shadow-secondary/20"
                        >
                            Search
                        </button>
                    </form>
                </div>
            </div>

            {/* Results Section */}
            <div className="px-2">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-black text-slate-800 flex items-center">
                        <span className="w-1.5 h-8 bg-secondary rounded-full mr-4"></span>
                        Recent Reports
                    </h2>
                    <div className="flex items-center text-slate-400 text-sm font-bold uppercase tracking-widest">
                        <FaFilter className="mr-2" /> {items.length} Items Found
                    </div>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="bg-slate-100 rounded-[2rem] h-80 animate-pulse"></div>
                        ))}
                    </div>
                ) : (
                    <AnimatePresence mode="wait">
                        {items.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="bg-white p-20 rounded-[3rem] text-center border border-dashed border-slate-200"
                            >
                                <FaInbox className="text-7xl text-slate-100 mx-auto mb-6" />
                                <h3 className="text-xl font-black text-slate-800 mb-2">No items found</h3>
                                <p className="text-slate-400 font-medium">Try adjusting your search terms or check back later.</p>
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
                            >
                                {items.map((item) => (
                                    <ItemCard key={item._id} item={item} />
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                )}
            </div>
        </div>
    );
};

export default FoundItems;
