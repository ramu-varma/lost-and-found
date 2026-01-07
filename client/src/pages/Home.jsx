import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaSearch, FaHandHoldingHeart, FaSearchLocation, FaShieldAlt, FaUsers, FaArrowRight } from 'react-icons/fa';

const Home = () => {
    return (
        <div className="space-y-16 md:space-y-32 pb-24">
            {/* Hero Section */}
            <section className="relative overflow-hidden rounded-[3rem] md:rounded-[4rem] bg-slate-900 text-white shadow-2xl min-h-[80vh] flex items-center">
                {/* Background Elements */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/40 via-secondary/20 to-transparent z-0"></div>
                <div className="absolute -top-48 -right-48 w-[40rem] h-[40rem] bg-primary/20 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute -bottom-48 -left-48 w-[40rem] h-[40rem] bg-secondary/20 rounded-full blur-[120px] animate-pulse delay-1000"></div>

                {/* Animated Grid Pattern */}
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

                <div className="relative z-10 px-8 py-20 md:py-32 text-center max-w-5xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center px-6 py-2 mb-10 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 text-[10px] md:text-xs font-black tracking-[0.2em] uppercase text-primary-light"
                    >
                        <span className="relative flex h-2 w-2 mr-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                        </span>
                        Trusted by 10k+ Users Worldwide
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="text-4xl md:text-8xl font-black mb-6 md:mb-8 leading-[1.1] tracking-tight"
                    >
                        Lost it? <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-light via-white to-secondary-light">
                            Find it here.
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                        className="text-base md:text-2xl mb-8 md:text-12 text-slate-400 max-w-3xl mx-auto leading-relaxed font-medium"
                    >
                        The world's most advanced community-driven platform for reporting lost items and returning found ones to their rightful owners.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                        className="flex flex-col sm:flex-row justify-center items-center gap-6"
                    >
                        <Link to="/lost-items" className="w-full sm:w-auto bg-primary text-white px-12 py-5 rounded-[2rem] font-black text-lg hover:bg-primary-dark transition-all shadow-2xl shadow-primary/40 flex items-center justify-center group">
                            <FaSearch className="mr-3 group-hover:scale-110 transition-transform" /> I Lost Something
                        </Link>
                        <Link to="/found-items" className="w-full sm:w-auto bg-white/5 backdrop-blur-xl border border-white/10 text-white px-12 py-5 rounded-[2rem] font-black text-lg hover:bg-white hover:text-slate-900 transition-all shadow-2xl flex items-center justify-center group">
                            <FaHandHoldingHeart className="mr-3 group-hover:scale-110 transition-transform" /> I Found Something
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {[
                        { label: 'Items Reported', value: '45k+' },
                        { label: 'Successfully Returned', value: '12k+' },
                        { label: 'Active Users', value: '85k+' },
                        { label: 'Cities Covered', value: '200+' },
                    ].map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="text-center"
                        >
                            <div className="text-3xl md:text-5xl font-black text-slate-900 mb-2">{stat.value}</div>
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Features Section */}
            <section className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-12 md:mb-20">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="text-primary font-black text-[10px] md:text-xs uppercase tracking-[0.3em] mb-4"
                    >
                        Why Choose Us
                    </motion.div>
                    <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6">Built for the Community</h2>
                    <div className="w-16 md:w-24 h-1.5 md:h-2 bg-primary mx-auto rounded-full"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {[
                        {
                            icon: <FaSearchLocation />,
                            title: "Smart Matching",
                            desc: "Our AI-powered system automatically matches lost items with found reports based on precise location and visual descriptions.",
                            color: "bg-indigo-50 text-primary",
                            border: "hover:border-primary/20"
                        },
                        {
                            icon: <FaShieldAlt />,
                            title: "Secure Verification",
                            desc: "Found something? Report it. Lost something? Claim it securely with our multi-step ownership verification process.",
                            color: "bg-pink-50 text-secondary",
                            border: "hover:border-secondary/20"
                        },
                        {
                            icon: <FaUsers />,
                            title: "Community Trust",
                            desc: "Built on a foundation of trust. We verify all claims to ensure that every item is returned to its rightful owner safely.",
                            color: "bg-green-50 text-green-600",
                            border: "hover:border-green-200"
                        }
                    ].map((feature, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.2 }}
                            whileHover={{ y: -15 }}
                            className={`bg-white p-8 md:p-12 rounded-[2.5rem] md:rounded-[3rem] shadow-sm border border-slate-100 text-center hover:shadow-2xl transition-all duration-500 ${feature.border}`}
                        >
                            <div className={`${feature.color} p-6 md:p-8 rounded-2xl md:rounded-[2rem] w-20 h-20 md:w-24 md:h-24 flex items-center justify-center mx-auto mb-8 md:mb-10 text-3xl md:text-4xl shadow-inner`}>
                                {feature.icon}
                            </div>
                            <h3 className="text-xl md:text-2xl font-black mb-4 md:mb-6 text-slate-900">{feature.title}</h3>
                            <p className="text-sm md:text-slate-500 leading-relaxed font-medium">{feature.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* CTA Section */}
            <section className="max-w-7xl mx-auto px-6">
                <div className="bg-primary rounded-[2.5rem] md:rounded-[3rem] p-10 md:p-24 text-center relative overflow-hidden shadow-2xl shadow-primary/30">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent z-0"></div>
                    <div className="relative z-10">
                        <h2 className="text-3xl md:text-6xl font-black text-white mb-6 md:mb-8">Ready to find your item?</h2>
                        <p className="text-primary-light text-base md:text-xl mb-10 md:mb-12 max-w-2xl mx-auto font-medium">
                            Join our community today and help us make the world a place where nothing stays lost for long.
                        </p>
                        <Link to="/register" className="inline-flex items-center bg-white text-primary px-10 py-4 md:px-12 md:py-5 rounded-2xl md:rounded-[2rem] font-black text-lg md:text-xl hover:scale-105 transition-all shadow-xl group">
                            Get Started Now <FaArrowRight className="ml-3 group-hover:translate-x-2 transition-transform" />
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
