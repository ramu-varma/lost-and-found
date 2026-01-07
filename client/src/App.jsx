import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import LostItems from './pages/LostItems';
import FoundItems from './pages/FoundItems';
import ItemDetails from './pages/ItemDetails';
import PostItem from './pages/PostItem';
import Dashboard from './pages/Dashboard';
import EditItem from './pages/EditItem';
import AdminDashboard from './pages/AdminDashboard';
import ClaimItem from './pages/ClaimItem';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

function App() {
    return (
        <AuthProvider>
            <Router>
                <Layout>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/lost-items" element={<LostItems />} />
                        <Route path="/found-items" element={<FoundItems />} />
                        <Route path="/items/:id" element={<ItemDetails />} />

                        {/* Protected Routes */}
                        <Route element={<ProtectedRoute />}>
                            <Route path="/post-item" element={<PostItem />} />
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/admin" element={<AdminDashboard />} />
                            <Route path="/edit-item/:id" element={<EditItem />} />
                            <Route path="/items/:id/claim" element={<ClaimItem />} />
                            <Route path="/profile" element={<Profile />} />
                        </Route>

                        {/* 404 Route */}
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </Layout>
            </Router>
        </AuthProvider>
    );
}

export default App;
