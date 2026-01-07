import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { FaMapMarkerAlt, FaCalendarAlt, FaUser, FaCheckCircle, FaArrowLeft, FaEdit, FaTrash, FaHandHoldingHeart } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { getImageUrl } from '../utils/imageUtils';
import { motion } from 'framer-motion';

const ItemDetails = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [matches, setMatches] = useState([]);

    useEffect(() => {
        fetchItem();
        if (user) {
            fetchMatches();
        }
    }, [id, user]);

    const fetchItem = async () => {
        try {
            const { data } = await api.get(`/items/${id}`);
            setItem(data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
            toast.error('Failed to fetch item details');
        }
    };

    const fetchMatches = async () => {
        try {
            const { data } = await api.get(`/items/${id}/matches`);
            setMatches(data);
        } catch (error) {
            console.error('Error fetching matches:', error);
        }
    };

    const handleClaim = () => {
        navigate(`/items/${id}/claim`);
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this item? This action cannot be undone.')) {
            try {
                await api.delete(`/items/${id}`);
                toast.success('Item deleted successfully');
                navigate('/dashboard');
            } catch (error) {
                toast.error('Failed to delete item');
            }
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
    );

    if (!item) return (
        <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-slate-100">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Item not found</h2>
            <button onClick={() => navigate(-1)} className="text-primary font-bold hover:underline">Go Back</button>
        </div>
    );

    const isOwner = user && (item.user?._id === user._id || item.user === user._id);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-5xl mx-auto"
        >
            {/* Header Actions */}
            <div className="flex justify-between items-center mb-6 px-2">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center text-slate-500 hover:text-primary font-bold transition-colors group"
                >
                    <div className="p-2 bg-white rounded-xl shadow-sm border border-slate-100 mr-3 group-hover:bg-primary group-hover:text-white transition-all">
                        <FaArrowLeft />
                    </div>
                    Back
                </button>

                {isOwner && (
                    <div className="flex space-x-3">
                        <button
                            onClick={() => navigate(`/edit-item/${id}`)}
                            className="flex items-center bg-white text-blue-600 px-5 py-2.5 rounded-xl font-bold hover:bg-blue-50 transition-all border border-blue-100 shadow-sm"
                        >
                            <FaEdit className="mr-2" /> Edit
                        </button>
                        <button
                            onClick={handleDelete}
                            className="flex items-center bg-white text-red-600 px-5 py-2.5 rounded-xl font-bold hover:bg-red-50 transition-all border border-red-100 shadow-sm"
                        >
                            <FaTrash className="mr-2" /> Delete
                        </button>
                    </div>
                )}
            </div>

            <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 overflow-hidden border border-slate-100">
                <div className="md:flex">
                    {/* Image Section */}
                    <div className="md:w-1/2 relative bg-slate-50 min-h-[400px]">
                        {item.images && item.images.length > 0 ? (
                            <img
                                src={getImageUrl(item.images[0])}
                                alt={item.title}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-slate-300">
                                <FaInbox className="text-6xl mb-4 opacity-20" />
                                <span className="font-bold uppercase tracking-widest text-xs">No Image Available</span>
                            </div>
                        )}

                        <div className="absolute top-6 left-6 flex flex-col gap-3">
                            <span className={`px-4 py-1.5 rounded-full text-xs font-black tracking-widest uppercase text-white shadow-lg ${item.type === 'LOST' ? 'bg-red-500' : 'bg-green-500'}`}>
                                {item.type}
                            </span>
                            {item.isSuspicious && (
                                <span className="px-4 py-1.5 rounded-full text-xs font-black tracking-widest uppercase text-white bg-orange-500 animate-pulse shadow-lg">
                                    SUSPICIOUS
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-6 md:p-12 md:w-1/2 flex flex-col">
                        <div className="flex justify-between items-start mb-4">
                            <span className="px-3 py-1 bg-primary/10 text-primary rounded-lg text-[10px] font-black uppercase tracking-widest">
                                {item.category}
                            </span>
                            <span className={`text-[10px] font-black uppercase tracking-widest ${item.status === 'RESOLVED' ? 'text-green-500' : 'text-orange-500'}`}>
                                • {item.status}
                            </span>
                        </div>

                        <h1 className="text-2xl md:text-4xl font-black text-slate-900 mb-6 leading-tight">{item.title}</h1>

                        <div className="bg-slate-50 rounded-2xl md:rounded-3xl p-5 md:p-6 mb-8">
                            <p className="text-sm md:text-base text-slate-600 leading-relaxed italic">"{item.description}"</p>
                        </div>

                        <div className="grid grid-cols-1 gap-4 mb-8">
                            <div className="flex items-center p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                                <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-primary mr-4">
                                    <FaMapMarkerAlt />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Location</p>
                                    <p className="text-sm font-bold text-slate-800">{item.location}</p>
                                </div>
                            </div>
                            <div className="flex items-center p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                                <div className="w-10 h-10 bg-pink-50 rounded-xl flex items-center justify-center text-secondary mr-4">
                                    <FaCalendarAlt />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Date Reported</p>
                                    <p className="text-sm font-bold text-slate-800">{new Date(item.date).toLocaleDateString(undefined, { dateStyle: 'long' })}</p>
                                </div>
                            </div>
                            <div className="flex items-center p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                                <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-500 mr-4">
                                    <FaUser />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Posted By</p>
                                    <p className="text-sm font-bold text-slate-800">{item.user?.name || 'Community Member'}</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-auto">
                            {user ? (
                                !isOwner ? (
                                    item.type === 'FOUND' && item.status !== 'RESOLVED' ? (
                                        <button
                                            onClick={handleClaim}
                                            className="w-full bg-primary text-white py-5 rounded-2xl font-black text-lg hover:bg-primary-dark transition-all shadow-xl shadow-primary/30 flex items-center justify-center group"
                                        >
                                            <FaHandHoldingHeart className="mr-3 group-hover:scale-110 transition-transform" /> Claim This Item
                                        </button>
                                    ) : (
                                        <div className="bg-slate-50 p-6 rounded-2xl text-center border border-dashed border-slate-200">
                                            <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">
                                                {item.status === 'RESOLVED' ? 'Item Already Returned' : 'No Actions Available'}
                                            </p>
                                        </div>
                                    )
                                ) : (
                                    <div className="bg-primary/5 p-6 rounded-2xl text-center border border-primary/10">
                                        <p className="text-primary font-black text-sm uppercase tracking-widest">
                                            You are the reporter of this item
                                        </p>
                                    </div>
                                )
                            ) : (
                                <Link
                                    to="/login"
                                    className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-lg text-center block hover:bg-slate-800 transition-all shadow-xl"
                                >
                                    Login to Claim
                                </Link>
                            )}
                        </div>
                    </div>
                </div>

                {/* Suggested Matches Section */}
                {matches.length > 0 && (
                    <div className="p-6 md:p-12 bg-slate-50 border-t border-slate-100">
                        <div className="flex items-center mb-6 md:mb-8">
                            <div className="w-1 h-6 md:w-1.5 md:h-8 bg-primary rounded-full mr-3 md:mr-4"></div>
                            <h2 className="text-xl md:text-2xl font-black text-slate-900">Potential Matches</h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {matches.map(match => (
                                <Link
                                    key={match._id}
                                    to={`/items/${match._id}`}
                                    className="group bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl hover:border-primary/10 transition-all duration-300 flex items-center"
                                >
                                    <div className="w-16 h-16 bg-slate-50 rounded-2xl overflow-hidden mr-4 flex-shrink-0">
                                        {match.images && match.images.length > 0 ? (
                                            <img src={getImageUrl(match.images[0])} className="w-full h-full object-cover" alt="" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-slate-200"><FaInbox /></div>
                                        )}
                                    </div>
                                    <div className="flex-grow">
                                        <div className="font-black text-slate-800 group-hover:text-primary transition-colors">{match.title}</div>
                                        <div className="text-xs text-slate-400 font-bold uppercase tracking-tighter flex items-center mt-1">
                                            <FaMapMarkerAlt className="mr-1 text-[10px]" /> {match.location}
                                        </div>
                                    </div>
                                    <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-primary group-hover:text-white transition-all">
                                        <FaArrowLeft className="rotate-180" />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default ItemDetails;
