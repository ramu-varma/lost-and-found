import { useState, useEffect } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';
import { FaUserSlash, FaUserCheck, FaTrash, FaCheckCircle, FaTimesCircle, FaUsers, FaBoxOpen, FaShieldAlt, FaSearch } from 'react-icons/fa';
import { motion } from 'framer-motion';

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('users');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const usersRes = await api.get('/admin/users');
            setUsers(usersRes.data);
            const itemsRes = await api.get('/items?pageSize=100');
            setItems(itemsRes.data.items);
            setLoading(false);
        } catch (error) {
            console.error(error);
            toast.error('Failed to fetch admin data');
            setLoading(false);
        }
    };

    const toggleBlockUser = async (userId, currentStatus) => {
        try {
            await api.put(`/admin/users/${userId}/block`);
            setUsers(users.map(user =>
                user._id === userId ? { ...user, isBlocked: !currentStatus } : user
            ));
            toast.success(`User ${!currentStatus ? 'blocked' : 'unblocked'} successfully`);
        } catch (error) {
            toast.error('Failed to update user status');
        }
    };

    const deleteItem = async (itemId) => {
        if (!window.confirm('Are you sure you want to delete this item?')) return;
        try {
            await api.delete(`/admin/items/${itemId}`);
            setItems(items.filter(item => item._id !== itemId));
            toast.success('Item deleted successfully');
        } catch (error) {
            toast.error('Failed to delete item');
        }
    };

    const toggleSuspiciousItem = async (itemId, currentStatus) => {
        try {
            await api.put(`/admin/items/${itemId}/suspicious`);
            setItems(items.map(item =>
                item._id === itemId ? { ...item, isSuspicious: !currentStatus } : item
            ));
            toast.success(`Item marked as ${!currentStatus ? 'suspicious' : 'safe'}`);
        } catch (error) {
            toast.error('Failed to update item status');
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
    );

    const filteredUsers = users.filter(u =>
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredItems = items.filter(i =>
        i.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        i.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-7xl mx-auto px-4 md:px-0 pb-12"
        >
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6 px-2">
                <div>
                    <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-2 uppercase text-center md:text-left">Admin Panel</h1>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center md:text-left">Platform Management & Moderation</p>
                </div>

                <div className="relative group max-w-md w-full">
                    <div className="absolute inset-y-0 left-6 flex items-center text-slate-400 group-focus-within:text-primary transition-colors">
                        <FaSearch />
                    </div>
                    <input
                        type="text"
                        placeholder={`Search ${activeTab}...`}
                        className="w-full pl-14 pr-6 py-4 bg-white border border-slate-100 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 flex items-center">
                    <div className="w-16 h-16 bg-indigo-50 text-primary rounded-2xl flex items-center justify-center mr-6 text-2xl shadow-inner">
                        <FaUsers />
                    </div>
                    <div>
                        <div className="text-3xl font-black text-slate-900">{users.length}</div>
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Users</div>
                    </div>
                </div>
                <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 flex items-center">
                    <div className="w-16 h-16 bg-pink-50 text-secondary rounded-2xl flex items-center justify-center mr-6 text-2xl shadow-inner">
                        <FaBoxOpen />
                    </div>
                    <div>
                        <div className="text-3xl font-black text-slate-900">{items.length}</div>
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Reports</div>
                    </div>
                </div>
                <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 flex items-center">
                    <div className="w-16 h-16 bg-orange-50 text-orange-500 rounded-2xl flex items-center justify-center mr-6 text-2xl shadow-inner">
                        <FaShieldAlt />
                    </div>
                    <div>
                        <div className="text-3xl font-black text-slate-900">{items.filter(i => i.isSuspicious).length}</div>
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Flagged Items</div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex p-2 bg-slate-100 rounded-[2rem] mb-8 w-fit mx-auto md:mx-0">
                <button
                    className={`py-3 px-8 rounded-[1.5rem] font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'users' ? 'bg-white text-primary shadow-lg' : 'text-slate-500 hover:text-slate-700'}`}
                    onClick={() => setActiveTab('users')}
                >
                    Manage Users
                </button>
                <button
                    className={`py-3 px-8 rounded-[1.5rem] font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'items' ? 'bg-white text-primary shadow-lg' : 'text-slate-500 hover:text-slate-700'}`}
                    onClick={() => setActiveTab('items')}
                >
                    Manage Items
                </button>
            </div>

            {/* Content Table */}
            <div className="bg-white rounded-[3rem] shadow-2xl shadow-slate-200/50 overflow-hidden border border-slate-100">
                <div className="overflow-x-auto">
                    {activeTab === 'users' ? (
                        <table className="w-full">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-100">
                                    <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">User Information</th>
                                    <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Role</th>
                                    <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                    <th className="px-8 py-6 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {filteredUsers.map(user => (
                                    <tr key={user._id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center">
                                                <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 mr-4 font-black">
                                                    {user.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="font-black text-slate-900">{user.name}</div>
                                                    <div className="text-xs text-slate-500 font-medium">{user.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${user.role === 'ADMIN' ? 'bg-purple-50 text-purple-600 border-purple-100' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            {user.isBlocked ? (
                                                <span className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-red-50 text-red-600 border border-red-100">Blocked</span>
                                            ) : (
                                                <span className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-green-50 text-green-600 border border-green-100">Active</span>
                                            )}
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <button
                                                onClick={() => toggleBlockUser(user._id, user.isBlocked)}
                                                className={`p-4 rounded-2xl transition-all ${user.isBlocked ? 'bg-green-50 text-green-600 hover:bg-green-100' : 'bg-red-50 text-red-600 hover:bg-red-100'}`}
                                            >
                                                {user.isBlocked ? <FaUserCheck size={18} /> : <FaUserSlash size={18} />}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <table className="w-full">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-100">
                                    <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Item Details</th>
                                    <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Type</th>
                                    <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Posted By</th>
                                    <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                    <th className="px-8 py-6 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {filteredItems.map(item => (
                                    <tr key={item._id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center">
                                                <div className="w-12 h-12 bg-slate-100 rounded-2xl overflow-hidden mr-4">
                                                    {item.images?.[0] ? (
                                                        <img src={item.images[0]} alt="" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-slate-400"><FaBoxOpen /></div>
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="font-black text-slate-900">{item.title}</div>
                                                    <div className="text-xs text-slate-500 font-medium">{new Date(item.date).toLocaleDateString()}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${item.type === 'LOST' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-green-50 text-green-600 border-green-100'}`}>
                                                {item.type}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="font-bold text-slate-800">{item.user?.name || 'Unknown'}</div>
                                            <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest">User ID: {item.user?._id?.slice(-6) || 'N/A'}</div>
                                        </td>
                                        <td className="px-8 py-6">
                                            {item.isSuspicious ? (
                                                <span className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-orange-50 text-orange-600 border border-orange-100 flex items-center w-fit">
                                                    <FaShieldAlt className="mr-2" /> Flagged
                                                </span>
                                            ) : (
                                                <span className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-blue-50 text-blue-600 border border-blue-100 flex items-center w-fit">
                                                    <FaCheckCircle className="mr-2" /> Safe
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex justify-end space-x-2">
                                                <button
                                                    onClick={() => toggleSuspiciousItem(item._id, item.isSuspicious)}
                                                    className={`p-4 rounded-2xl transition-all ${item.isSuspicious ? 'bg-blue-50 text-blue-600 hover:bg-blue-100' : 'bg-orange-50 text-orange-600 hover:bg-orange-100'}`}
                                                    title={item.isSuspicious ? 'Mark as Safe' : 'Mark as Suspicious'}
                                                >
                                                    <FaCheckCircle size={18} />
                                                </button>
                                                <button
                                                    onClick={() => deleteItem(item._id)}
                                                    className="p-4 rounded-2xl bg-red-50 text-red-600 hover:bg-red-100 transition-all"
                                                    title="Delete Item"
                                                >
                                                    <FaTrash size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {((activeTab === 'users' && filteredUsers.length === 0) || (activeTab === 'items' && filteredItems.length === 0)) && (
                    <div className="p-20 text-center">
                        <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center text-slate-300 mx-auto mb-6">
                            <FaSearch size={32} />
                        </div>
                        <h3 className="text-xl font-black text-slate-800 mb-2">No results found</h3>
                        <p className="text-slate-500 font-medium">Try adjusting your search term.</p>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default AdminDashboard;
