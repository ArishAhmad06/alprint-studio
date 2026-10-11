import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/AppLayout';
import HomePage from './pages/HomePage';
import CategoryPage from './pages/CategoryPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CustomizePage from './pages/CustomizePage';
import AccountPage from './pages/AccountPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/category/:slug" element={<CategoryPage />} />
          <Route path="/product/:slug" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/customize" element={<CustomizePage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

function NotFound() {
  return (
    <main className="max-w-[1440px] mx-auto px-4 lg:px-8 py-24 text-center">
      <h1 className="font-serif text-4xl text-ink mb-4">404</h1>
      <p className="text-muted mb-8">This page doesn't exist.</p>
      <a href="/" className="text-vermilion hover:text-vermilion-dark text-sm font-medium">← Back to home</a>
    </main>
  );
}
