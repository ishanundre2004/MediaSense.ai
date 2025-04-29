import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import AnalyzePage from './pages/AnalyzePage';
import HistoryPage from './pages/HistoryPage';
import ProductsPage from './pages/ProductsPage';
import DashboardPage from './pages/DashboardPage';
import AnalyzeComments from './pages/AnalyzeComments';

function App() {
  // This would normally be managed by your auth system
  const isAuthenticated = false;

  return (
    <Router>
      <Routes>
        <Route path="/" element={isAuthenticated ? (
          <Layout>
            <DashboardPage />
          </Layout>
        ) : (
          <LandingPage />
        )} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/dashboard" element={
          <Layout>
            <DashboardPage />
          </Layout>
        } />
        <Route path="/analyze" element={
          <Layout>
            <AnalyzePage />
          </Layout>
        } />
        <Route path="/comments" element={
          <Layout>
            <AnalyzeComments />
          </Layout>
        } />
        <Route path="/history" element={
          <Layout>
            <HistoryPage />
          </Layout>
        } />
        <Route path="/products" element={
          <Layout>
            <ProductsPage />
          </Layout>
        } />
        
      </Routes>
    </Router>
  );
}

export default App;