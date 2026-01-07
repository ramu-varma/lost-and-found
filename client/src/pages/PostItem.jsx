import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-toastify';
import { FaCloudUploadAlt, FaArrowLeft, FaPlus, FaTrash, FaInfoCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';

const PostItem = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        type: 'LOST',
        title: '',
        description: '',
        category: 'Personal',
        location: '',
        date: '',
        verificationQuestions: [''],
    });
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleQuestionChange = (index, value) => {
        const newQuestions = [...formData.verificationQuestions];
        newQuestions[index] = value;
        setFormData({ ...formData, verificationQuestions: newQuestions });
    };

    const addQuestion = () => {
        setFormData({ ...formData, verificationQuestions: [...formData.verificationQuestions, ''] });
    };

    const removeQuestion = (index) => {
        const newQuestions = formData.verificationQuestions.filter((_, i) => i !== index);
        setFormData({ ...formData, verificationQuestions: newQuestions });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            let imageUrls = [];
            if (image) {
                const imageFormData = new FormData();
                imageFormData.append('image', image);
                try {
                    const uploadRes = await api.post('/upload', imageFormData, {
                        headers: { 'Content-Type': 'multipart/form-data' },
                    });
                    if (uploadRes.data && uploadRes.data.url) {
                        imageUrls.push(uploadRes.data.url);
                    }
                } catch (uploadError) {
                    console.error('Upload failed:', uploadError);
                    toast.error('Image upload failed. Posting without image.');
                }
            }

            const itemData = {
                ...formData,
                verificationQuestions: formData.verificationQuestions.filter(q => q.trim() !== ''),
                images: imageUrls,
            };

            await api.post('/items', itemData);
            toast.success('Item posted successfully!');
            navigate(formData.type === 'LOST' ? '/lost-items' : '/found-items');
        } catch (error) {
            console.error(error);
            toast.error('Failed to post item.');
        } finally {
            setLoading(false);
        }
    };

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
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">Report an Item</h1>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">System Version 2.2</p>
                </div>
            </div>

            <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 overflow-hidden border border-slate-100">
                <div className="bg-slate-900 p-8 md:p-12 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent z-0"></div>
                    <div className="relative z-10">
                        <h2 className="text-3xl font-black text-white mb-2">What happened?</h2>
                        <p className="text-slate-400 font-medium">Fill in the details below to help the community.</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-8">
                    {/* Type Selection */}
                    <div className="grid grid-cols-2 gap-4 p-2 bg-slate-50 rounded-3xl">
                        <button
                            type="button"
                            className={`flex items-center justify-center py-4 rounded-2xl font-black text-sm transition-all ${formData.type === 'LOST'
                                ? 'bg-red-500 text-white shadow-lg shadow-red-500/20'
                                : 'text-slate-500 hover:bg-white'
                                }`}
                            onClick={() => setFormData({ ...formData, type: 'LOST' })}
                        >
                            I Lost Something
                        </button>
                        <button
                            type="button"
                            className={`flex items-center justify-center py-4 rounded-2xl font-black text-sm transition-all ${formData.type === 'FOUND'
                                ? 'bg-green-500 text-white shadow-lg shadow-green-500/20'
                                : 'text-slate-500 hover:bg-white'
                                }`}
                            onClick={() => setFormData({ ...formData, type: 'FOUND' })}
                        >
                            I Found Something
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Item Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    required
                                    placeholder="e.g., Blue iPhone 13 Pro"
                                    className="w-full px-6 py-4 bg-white border-2 border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all font-black"
                                    value={formData.title}
                                    onChange={handleChange}
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Category</label>
                                <select
                                    name="category"
                                    className="w-full px-6 py-4 bg-white border-2 border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all font-black appearance-none"
                                    value={formData.category}
                                    onChange={handleChange}
                                >
                                    <option>Personal</option>
                                    <option>Electronics</option>
                                    <option>Documents</option>
                                    <option>Clothing</option>
                                    <option>Accessories</option>
                                    <option>Other</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Location</label>
                                <input
                                    type="text"
                                    name="location"
                                    required
                                    placeholder="e.g., Central Park, Library"
                                    className="w-full px-6 py-4 bg-white border-2 border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all font-black"
                                    value={formData.location}
                                    onChange={handleChange}
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Date</label>
                                <input
                                    type="date"
                                    name="date"
                                    required
                                    className="w-full px-6 py-4 bg-white border-2 border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all font-black"
                                    value={formData.date}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Description</label>
                                <textarea
                                    name="description"
                                    rows="5"
                                    required
                                    placeholder="Provide as many details as possible..."
                                    className="w-full px-6 py-4 bg-white border-2 border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all font-black resize-none"
                                    value={formData.description}
                                    onChange={handleChange}
                                ></textarea>
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Item Image</label>
                                <div className="relative group">
                                    <div className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-3xl transition-all ${preview ? 'border-primary bg-primary/5' : 'border-slate-200 hover:border-primary hover:bg-slate-50'}`}>
                                        <div className="space-y-2 text-center">
                                            {preview ? (
                                                <div className="relative">
                                                    <img src={preview} alt="Preview" className="mx-auto h-40 object-cover rounded-2xl shadow-lg" />
                                                    <button
                                                        type="button"
                                                        onClick={() => { setImage(null); setPreview(null); }}
                                                        className="absolute -top-2 -right-2 bg-red-500 text-white p-2 rounded-full shadow-lg hover:bg-red-600 transition-all"
                                                    >
                                                        <FaTrash size={12} />
                                                    </button>
                                                </div>
                                            ) : (
                                                <>
                                                    <FaCloudUploadAlt className="mx-auto h-12 w-12 text-slate-300 group-hover:text-primary transition-colors" />
                                                    <div className="flex text-sm text-slate-600 justify-center">
                                                        <label htmlFor="file-upload" className="relative cursor-pointer font-black text-primary hover:underline">
                                                            <span>Upload a file</span>
                                                            <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleImageChange} accept="image/*" />
                                                        </label>
                                                    </div>
                                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">PNG, JPG up to 10MB</p>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Verification Questions */}
                    {formData.type === 'FOUND' && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="bg-indigo-50/50 rounded-[2rem] p-8 border border-indigo-100"
                        >
                            <div className="flex items-center mb-6">
                                <div className="w-10 h-10 bg-indigo-500 text-white rounded-xl flex items-center justify-center mr-4 shadow-lg shadow-indigo-500/20">
                                    <FaInfoCircle />
                                </div>
                                <div>
                                    <h3 className="font-black text-slate-800">Verification Questions</h3>
                                    <p className="text-xs text-slate-500 font-medium">Ask questions only the true owner would know.</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {formData.verificationQuestions.map((q, index) => (
                                    <div key={index} className="flex gap-3">
                                        <input
                                            type="text"
                                            placeholder={`Question ${index + 1} (e.g., What is the wallpaper on the phone?)`}
                                            className="flex-grow px-6 py-4 bg-white border border-indigo-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-medium"
                                            value={q}
                                            onChange={(e) => handleQuestionChange(index, e.target.value)}
                                        />
                                        {formData.verificationQuestions.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeQuestion(index)}
                                                className="p-4 text-red-400 hover:text-red-500 transition-colors"
                                            >
                                                <FaTrash />
                                            </button>
                                        )}
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={addQuestion}
                                    className="flex items-center text-indigo-600 font-black text-xs uppercase tracking-widest hover:underline ml-1"
                                >
                                    <FaPlus className="mr-2" /> Add Another Question
                                </button>
                            </div>
                        </motion.div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary text-white py-6 rounded-[2rem] font-black text-lg hover:bg-primary-dark transition-all shadow-2xl shadow-primary/30 disabled:opacity-50 flex items-center justify-center group"
                    >
                        {loading ? (
                            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white"></div>
                        ) : (
                            <>Submit Report <FaArrowLeft className="ml-3 rotate-180 group-hover:translate-x-1 transition-transform" /></>
                        )}
                    </button>
                </form>
            </div>
        </motion.div>
    );
};

export default PostItem;
