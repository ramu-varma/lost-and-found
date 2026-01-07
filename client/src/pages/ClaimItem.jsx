import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-toastify';
import { FaArrowLeft, FaHandHoldingHeart, FaInfoCircle, FaCheckCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';

const ClaimItem = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [item, setItem] = useState(null);
    const [answers, setAnswers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchItem();
    }, [id]);

    const fetchItem = async () => {
        try {
            const { data } = await api.get(`/items/${id}`);
            if (data.verificationQuestions) {
                const validQuestions = data.verificationQuestions.filter(q => q && q.trim() !== '');
                setItem({ ...data, verificationQuestions: validQuestions });
                setAnswers(new Array(validQuestions.length).fill(''));
            } else {
                setItem(data);
                setAnswers(['']);
            }
            setLoading(false);
        } catch (error) {
            console.error(error);
            toast.error('Failed to load item details');
            setLoading(false);
        }
    };

    const handleAnswerChange = (index, value) => {
        const newAnswers = [...answers];
        newAnswers[index] = value;
        setAnswers(newAnswers);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            let formattedAnswers = [];

            if (item.verificationQuestions && item.verificationQuestions.length > 0) {
                formattedAnswers = item.verificationQuestions.map((q, index) => ({
                    question: q || `Question ${index + 1}`,
                    answer: answers[index] || ''
                }));
            } else {
                formattedAnswers = [{
                    question: 'Item Description',
                    answer: answers[0] || ''
                }];
            }

            await api.post('/claims', {
                itemId: id,
                answers: formattedAnswers
            });
            toast.success('Claim submitted successfully! The finder will review it.');
            navigate('/dashboard');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to submit claim');
        } finally {
            setSubmitting(false);
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

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto pb-12"
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-8 px-2">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center text-slate-500 hover:text-primary font-bold transition-colors group"
                >
                    <div className="p-2 bg-white rounded-xl shadow-sm border border-slate-100 mr-3 group-hover:bg-primary group-hover:text-white transition-all">
                        <FaArrowLeft />
                    </div>
                    Back
                </button>
                <div className="text-right">
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">Claim Item</h1>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Ownership Verification</p>
                </div>
            </div>

            <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 overflow-hidden border border-slate-100">
                <div className="bg-slate-900 p-8 md:p-12 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent z-0"></div>
                    <div className="relative z-10">
                        <h2 className="text-3xl font-black text-white mb-2">{item.title}</h2>
                        <p className="text-slate-400 font-medium">Answer the questions below to prove this item belongs to you.</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-8">
                    <div className="bg-indigo-50/50 rounded-[2rem] p-8 border border-indigo-100">
                        <div className="flex items-center mb-8">
                            <div className="w-10 h-10 bg-indigo-500 text-white rounded-xl flex items-center justify-center mr-4 shadow-lg shadow-indigo-500/20">
                                <FaInfoCircle />
                            </div>
                            <div>
                                <h3 className="font-black text-slate-800">Verification Process</h3>
                                <p className="text-xs text-slate-500 font-medium">Your answers will be sent to the finder for review.</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            {item.verificationQuestions && item.verificationQuestions.length > 0 ? (
                                item.verificationQuestions.map((question, index) => (
                                    <div key={index}>
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">
                                            {question || `Question ${index + 1}`}
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full px-6 py-4 bg-white border border-indigo-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-medium"
                                            value={answers[index]}
                                            onChange={(e) => handleAnswerChange(index, e.target.value)}
                                            placeholder="Your answer..."
                                        />
                                    </div>
                                ))
                            ) : (
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">
                                        Describe the item in detail
                                    </label>
                                    <textarea
                                        required
                                        rows="5"
                                        className="w-full px-6 py-4 bg-white border border-indigo-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-medium resize-none"
                                        value={answers[0] || ''}
                                        onChange={(e) => handleAnswerChange(0, e.target.value)}
                                        placeholder="Color, unique marks, contents, specific features only the owner would know..."
                                    ></textarea>
                                </div>
                            )}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full bg-primary text-white py-6 rounded-[2rem] font-black text-lg hover:bg-primary-dark transition-all shadow-2xl shadow-primary/30 disabled:opacity-50 flex items-center justify-center group"
                    >
                        {submitting ? (
                            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white"></div>
                        ) : (
                            <>Submit Claim <FaCheckCircle className="ml-3 group-hover:scale-110 transition-transform" /></>
                        )}
                    </button>

                    <p className="text-center text-xs text-slate-400 font-medium px-4">
                        By submitting this claim, you agree that providing false information may lead to account suspension.
                    </p>
                </form>
            </div>
        </motion.div>
    );
};

export default ClaimItem;
