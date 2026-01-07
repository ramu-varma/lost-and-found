import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-toastify';
import { FaCloudUploadAlt, FaArrowLeft, FaPlus, FaTrash, FaInfoCircle, FaSave } from 'react-icons/fa';
import { motion } from 'framer-motion';

const EditItem = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        type: 'LOST',
        title: '',
        description: '',
        category: 'Personal',
        location: '',
        date: '',
        verificationQuestions: [''],
        status: 'OPEN'
    });
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [existingImages, setExistingImages] = useState([]);

    useEffect(() => {
        fetchItem();
    }, [id]);

    const fetchItem = async () => {
        try {
            const { data } = await api.get(`/items/${id}`);
            const formattedDate = data.date ? new Date(data.date).toISOString().split('T')[0] : '';

            setFormData({
                type: data.type,
                title: data.title,
                description: data.description,
                category: data.category,
                location: data.location,
                date: formattedDate,
                verificationQuestions: data.verificationQuestions && data.verificationQuestions.length > 0 ? data.verificationQuestions : [''],
                status: data.status || 'OPEN'
            });
            setExistingImages(data.images || []);
            setLoading(false);
        } catch (error) {
            console.error(error);
            toast.error('Failed to load item details');
            navigate('/dashboard');
        }
    };

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
        setSubmitting(true);

        try {
            let imageUrls = [...existingImages];

            if (image) {
                const imageFormData = new FormData();
                imageFormData.append('image', image);
                try {
                    const uploadRes = await api.post('/upload', imageFormData, {
                        headers: { 'Content-Type': 'multipart/form-data' },
                    });
                    if (uploadRes.data && uploadRes.data.url) {
                        imageUrls = [uploadRes.data.url];
                    }
                } catch (uploadError) {
                    console.error('Upload failed:', uploadError);
                    toast.error('Image upload failed');
                }
            }

            const itemData = {
                ...formData,
                verificationQuestions: formData.verificationQuestions.filter(q => q.trim() !== ''),
                images: imageUrls,
            };

            await api.put(`/items/${id}`, itemData);
            toast.success('Item updated successfully!');
            navigate('/dashboard');
        } catch (error) {
            console.error(error);
            toast.error('Failed to update item.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
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
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">Edit Report</h1>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Update your post details</p>
                </div>
            </div>

            <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 overflow-hidden border border-slate-100">
                <div className="bg-slate-900 p-8 md:p-12 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent z-0"></div>
                    <div className="relative z-10 flex justify-between items-end">
                        <div>
                            <h2 className="text-3xl font-black text-white mb-2">Modify Details</h2>
                            <p className="text-slate-400 font-medium">Keep your report accurate and up to date.</p>
                        </div>
                        <div className="px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-[10px] font-black text-white uppercase tracking-widest border border-white/10">
                            {formData.type}
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-8">
                    {/* Status Selection */}
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 ml-1">Current Status</label>
                        <div className="grid grid-cols-3 gap-3 p-2 bg-slate-50 rounded-3xl">
                            {['OPEN', 'MATCHED', 'RESOLVED'].map(status => (
                                <button
                                    key={status}
                                    type="button"
                                    className={`py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${formData.status === status
                                            ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                            : 'text-slate-500 hover:bg-white'
                                        }`}
                                    onClick={() => setFormData({ ...formData, status })}
                                >
                                    {status}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Item Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    required
                                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:bg-white transition-all font-medium"
                                    value={formData.title}
                                    onChange={handleChange}
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Category</label>
                                <select
                                    name="category"
                                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:bg-white transition-all font-medium appearance-none"
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
                                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:bg-white transition-all font-medium"
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
                                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:bg-white transition-all font-medium"
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
                                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:bg-white transition-all font-medium resize-none"
                                    value={formData.description}
                                    onChange={handleChange}
                                ></textarea>
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Item Image</label>
                                <div className="relative group">
                                    <div className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-3xl transition-all ${preview || existingImages.length > 0 ? 'border-primary bg-primary/5' : 'border-slate-200 hover:border-primary hover:bg-slate-50'}`}>
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
                                            ) : existingImages.length > 0 ? (
                                                <div className="relative">
                                                    <img src={existingImages[0]} alt="Existing" className="mx-auto h-40 object-cover rounded-2xl shadow-lg" />
                                                    <div className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                        <label htmlFor="file-upload" className="cursor-pointer text-white font-black text-xs uppercase tracking-widest">Change Image</label>
                                                    </div>
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
                                                </>
                                            )}
                                            <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleImageChange} accept="image/*" />
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
                                            placeholder={`Question ${index + 1}`}
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
                        disabled={submitting}
                        className="w-full bg-primary text-white py-6 rounded-[2rem] font-black text-lg hover:bg-primary-dark transition-all shadow-2xl shadow-primary/30 disabled:opacity-50 flex items-center justify-center group"
                    >
                        {submitting ? (
                            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white"></div>
                        ) : (
                            <>Save Changes <FaSave className="ml-3 group-hover:scale-110 transition-transform" /></>
                        )}
                    </button>
                </form>
            </div>
        </motion.div>
    );
};

export default EditItem;
