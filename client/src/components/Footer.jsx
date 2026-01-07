import { FaGithub, FaTwitter, FaLinkedin, FaHeart } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-white border-t border-slate-100 mt-20 pb-12 pt-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    <div className="col-span-1 md:col-span-2">
                        <Link to="/" className="text-2xl font-black text-slate-900 mb-6 block">
                            Find<span className="text-primary">It</span>
                        </Link>
                        <p className="text-slate-500 font-medium max-w-sm leading-relaxed mb-8">
                            The world's most trusted community-driven lost and found platform. Helping people reunite with their belongings since 2024.
                        </p>
                        <div className="flex space-x-4">
                            {[FaGithub, FaTwitter, FaLinkedin].map((Icon, i) => (
                                <a key={i} href="#" className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 hover:bg-primary hover:text-white transition-all">
                                    <Icon size={18} />
                                </a>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Platform</h3>
                        <ul className="space-y-4">
                            {['Lost Items', 'Found Items', 'Post an Item', 'Dashboard'].map((item) => (
                                <li key={item}>
                                    <Link to={item === 'Lost Items' ? '/lost-items' : item === 'Found Items' ? '/found-items' : item === 'Post an Item' ? '/post-item' : '/dashboard'} className="text-sm font-bold text-slate-600 hover:text-primary transition-colors">{item}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Company</h3>
                        <ul className="space-y-4">
                            {['About Us', 'Privacy Policy', 'Terms of Service', 'Contact'].map((item) => (
                                <li key={item}>
                                    <a href="#" className="text-sm font-bold text-slate-600 hover:text-primary transition-colors">{item}</a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">
                        &copy; {new Date().getFullYear()} FindIt. All rights reserved.
                    </p>
                    <div className="flex items-center text-xs font-black text-slate-400 uppercase tracking-widest">
                        Made with <FaHeart className="mx-2 text-red-500" /> by the FindIt Team
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
