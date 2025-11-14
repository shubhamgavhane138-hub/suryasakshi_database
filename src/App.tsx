import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import SilageSales from './pages/SilageSales';
import MaizePurchase from './pages/MaizePurchase';
import OtherExpenses from './pages/OtherExpenses';
import SoybeanPurchase from './pages/SoybeanPurchase';
import SoybeanSales from './pages/SoybeanSales';
import Purchases from './pages/Purchases';
import { DataProvider } from './context/DataContext';
import { DateProvider } from './context/DateContext';
import { AuthProvider } from './context/AuthContext';
import LoginPage from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
    return (
        <AuthProvider>
            <DataProvider>
                <DateProvider>
                    <Routes>
                        <Route path="/login" element={<LoginPage />} />
                        <Route element={<ProtectedRoute />}>
                            <Route path="/" element={<Layout />}>
                                <Route index element={<Dashboard />} />
                                <Route path="silage-sales" element={<SilageSales />} />
                                <Route path="maize-purchase" element={<MaizePurchase />} />
                                <Route path="other-expenses" element={<OtherExpenses />} />
                                <Route path="soybean-purchase" element={<SoybeanPurchase />} />
                                <Route path="soybean-sales" element={<SoybeanSales />} />
                                <Route path="purchases" element={<Purchases />} />
                            </Route>
                        </Route>
                    </Routes>
                </DateProvider>
            </DataProvider>
        </AuthProvider>
    );
}

export default App;
