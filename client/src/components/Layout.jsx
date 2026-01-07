import Navbar from './Navbar';
import Footer from './Footer';
import BottomNav from './BottomNav';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Layout = ({ children }) => {
    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Navbar />
            <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 md:pb-8">
                {children}
            </main>
            <Footer />
            <BottomNav />
            <ToastContainer position="bottom-right" />
        </div>
    );
};

export default Layout;
