import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import ItemCard from '../components/ItemCard';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { FaTrash, FaEdit, FaCheckCircle, FaTimesCircle, FaClock, FaInbox, FaHistory, FaUserCircle, FaBell } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const Dashboard = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [myItems, setMyItems] = useState([]);
    const [myClaims, setMyClaims] = useState([]);
    const [incomingClaims, setIncomingClaims] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('items');

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const itemsRes = await api.get('/items');
            const userItems = itemsRes.data.items.filter(item => item.user?._id === user._id || item.user === user._id);
            setMyItems(userItems);

            const claimsRes = await api.get('/claims/my');
            setMyClaims(claimsRes.data);

            const foundItems = userItems.filter(item => item.type === 'FOUND');
            let allIncomingClaims = [];
            for (const item of foundItems) {
                try {
                    const itemClaimsRes = await api.get(`/claims/item/${item._id}`);
                    allIncomingClaims = [...allIncomingClaims, ...itemClaimsRes.data];
                } catch (err) { }
            }
            setIncomingClaims(allIncomingClaims);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    const handleDeleteItem = async (itemId) => {
        if (!window.confirm('Are you sure you want to delete this item?')) return;
        try {
            await api.delete(`/items/${itemId}`);
            setMyItems(myItems.filter(item => item._id !== itemId));
            toast.success('Item deleted successfully');
        } catch (error) {
            toast.error('Failed to delete item');
        }
    };

    const handleClaimStatus = async (claimId, status) => {
        try {
            await api.put(`/claims/${claimId}`, { status });
            setIncomingClaims(incomingClaims.map(c => c._id === claimId ? { ...c, status } : c));
            toast.success(`Claim ${status.toLowerCase()} successfully`);
        } catch (error) {
            toast.error('Failed to update claim status');
        }
    };

    const tabs = [
        { id: 'items', label: 'My Posts', icon: <FaInbox /> },
        { id: 'claims', label: 'Sent Claims', icon: <FaHistory /> },
        { id: 'incoming', label: 'Incoming', icon: <FaBell />, count: incomingClaims.filter(c => c.status === 'PENDING').length },
    ];

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto px-4 md:px-0 pb-12">
            {/* Header */}
            <div className="bg-white rounded-[2.5rem] p-6 md:p-12 shadow-2xl shadow-slate-200/50 border border-slate-100 mb-10 flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
                <div className="flex items-center space-x-6">
                    <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center text-primary text-3xl shadow-inner">
                        <FaUserCircle />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Welcome back, {user.name.split(' ')[0]}!</h1>
                        <p className="text-slate-500 font-medium">Manage your reports and claims from one place.</p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <div className="bg-slate-50 px-6 py-3 rounded-2xl text-center border border-slate-100">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Reputation</p>
                        <p className="text-xl font-black text-primary">{user.reputationScore || 0}</p>
                    </div>
                    <div className="bg-slate-50 px-6 py-3 rounded-2xl text-center border border-slate-100">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Posts</p>
                        <p className="text-xl font-black text-slate-900">{myItems.length}</p>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex space-x-2 mb-10 bg-white p-2 rounded-3xl shadow-sm border border-slate-100 overflow-x-auto no-scrollbar max-w-full">
                <div className="flex space-x-2 min-w-max">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center space-x-3 px-6 py-3 rounded-2xl font-black text-sm transition-all whitespace-nowrap ${activeTab === tab.id
                                ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                : 'text-slate-500 hover:bg-slate-50'
                                }`}
                        >
                            <span>{tab.icon}</span>
                            <span>{tab.label}</span>
                            {tab.count > 0 && (
                                <span className={`ml-2 px-2 py-0.5 rounded-full text-[10px] ${activeTab === tab.id ? 'bg-white text-primary' : 'bg-primary text-white'}`}>
                                    {tab.count}
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                >
                    {activeTab === 'items' && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {myItems.length === 0 ? (
                                <div className="col-span-full bg-white p-20 rounded-[2.5rem] text-center border border-dashed border-slate-200">
                                    <FaInbox className="text-6xl text-slate-100 mx-auto mb-6" />
                                    <p className="text-slate-400 font-bold uppercase tracking-widest">You haven't posted anything yet.</p>
                                    <button onClick={() => navigate('/post-item')} className="mt-6 text-primary font-black hover:underline">Post your first item</button>
                                </div>
                            ) : (
                                myItems.map(item => (
                                    <div key={item._id} className="relative group">
                                        <ItemCard item={item} />
                                        <div className="absolute top-3 right-3 flex space-x-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-300 z-20">
                                            <button
                                                onClick={() => navigate(`/edit-item/${item._id}`)}
                                                className="bg-white/90 backdrop-blur-sm text-blue-600 p-3 rounded-xl shadow-xl hover:bg-blue-600 hover:text-white transition-all border border-blue-100"
                                                title="Edit Item"
                                            >
                                                <FaEdit size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteItem(item._id)}
                                                className="bg-white/90 backdrop-blur-sm text-red-600 p-3 rounded-xl shadow-xl hover:bg-red-600 hover:text-white transition-all border border-red-100"
                                                title="Delete Item"
                                            >
                                                <FaTrash size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    {activeTab === 'claims' && (
                        <div className="space-y-6">
                            {myClaims.length === 0 ? (
                                <div className="bg-white p-20 rounded-[2.5rem] text-center border border-dashed border-slate-200">
                                    <FaHistory className="text-6xl text-slate-100 mx-auto mb-6" />
                                    <p className="text-slate-400 font-bold uppercase tracking-widest">No claims sent yet.</p>
                                </div>
                            ) : (
                                myClaims.map(claim => (
                                    <div key={claim._id} className="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6 hover:shadow-xl transition-all duration-300">
                                        <div className="flex items-center space-x-6">
                                            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 text-2xl">
                                                <FaInbox />
                                            </div>
                                            <div>
                                                <h3 className="font-black text-xl text-slate-800">{claim.item?.title || 'Unknown Item'}</h3>
                                                <p className="text-sm text-slate-400 font-bold uppercase tracking-tighter mt-1 flex items-center">
                                                    <FaClock className="mr-2" /> Sent on {new Date(claim.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-4">
                                            <span className={`px-6 py-2 rounded-full text-xs font-black tracking-widest uppercase shadow-sm ${claim.status === 'APPROVED' ? 'bg-green-500 text-white' :
                                                claim.status === 'REJECTED' ? 'bg-red-500 text-white' :
                                                    'bg-orange-500 text-white'
                                                }`}>
                                                {claim.status}
                                            </span>
                                            <button onClick={() => navigate(`/items/${claim.item?._id}`)} className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-primary hover:text-white transition-all">
                                                <FaSearch size={14} />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    {activeTab === 'incoming' && (
                        <div className="space-y-6">
                            {incomingClaims.length === 0 ? (
                                <div className="bg-white p-20 rounded-[2.5rem] text-center border border-dashed border-slate-200">
                                    <FaBell className="text-6xl text-slate-100 mx-auto mb-6" />
                                    <p className="text-slate-400 font-bold uppercase tracking-widest">No incoming claims yet.</p>
                                </div>
                            ) : (
                                incomingClaims.map(claim => (
                                    <div key={claim._id} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300">
                                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                                            <div className="flex items-center space-x-6">
                                                <div className="w-16 h-16 bg-primary/5 rounded-2xl flex items-center justify-center text-primary text-2xl">
                                                    <FaUserCircle />
                                                </div>
                                                <div>
                                                    <h3 className="font-black text-xl text-slate-800">Claim for: {claim.item?.title}</h3>
                                                    <p className="text-sm text-slate-500 font-medium">From <span className="text-slate-900 font-bold">{claim.claimer?.name}</span> • {claim.claimer?.email}</p>
                                                </div>
                                            </div>
                                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase ${claim.status === 'APPROVED' ? 'bg-green-100 text-green-600' :
                                                claim.status === 'REJECTED' ? 'bg-red-100 text-red-600' :
                                                    'bg-orange-100 text-orange-600'
                                                }`}>
                                                {claim.status}
                                            </span>
                                        </div>

                                        <div className="bg-slate-50 rounded-3xl p-6 mb-8 border border-slate-100">
                                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Verification Answers</h4>
                                            <div className="space-y-4">
                                                {claim.answers.map((ans, idx) => (
                                                    <div key={idx} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                                                        <p className="text-xs font-bold text-slate-400 mb-1 uppercase tracking-tighter">Answer {idx + 1}</p>
                                                        <p className="text-slate-700 font-medium">{typeof ans === 'object' ? ans.answer : ans}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {claim.status === 'PENDING' && (
                                            <div className="flex flex-col sm:flex-row gap-4">
                                                <button
                                                    onClick={() => handleClaimStatus(claim._id, 'APPROVED')}
                                                    className="flex-1 bg-green-500 text-white py-4 rounded-2xl font-black text-sm hover:bg-green-600 transition-all shadow-lg shadow-green-500/20 flex items-center justify-center"
                                                >
                                                    <FaCheckCircle className="mr-2" /> Approve Claim
                                                </button>
                                                <button
                                                    onClick={() => handleClaimStatus(claim._id, 'REJECTED')}
                                                    className="flex-1 bg-white text-red-500 py-4 rounded-2xl font-black text-sm hover:bg-red-50 transition-all border border-red-100 flex items-center justify-center"
                                                >
                                                    <FaTimesCircle className="mr-2" /> Reject Claim
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default Dashboard;
