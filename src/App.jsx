import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { SignedIn, SignedOut, useUser } from '@clerk/clerk-react';
import { useEffect, useRef } from 'react';
import ToastProvider, { useToast } from './components/ToastProvider';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import DressingRoom from './pages/DressingRoom';
import LandingPage from './pages/LandingPage';
import ProductDetail from './pages/ProductDetail';
import GarmentUpload from './pages/GarmentUpload';

// ── Auth event listener — fires toasts on sign-in / sign-out ─────────────────
function AuthWatcher() {
  const { isSignedIn, user } = useUser();
  const toast = useToast();
  const prevSignedIn = useRef(null);

  useEffect(() => {
    // Skip the very first render (page load) to avoid a toast on every refresh
    if (prevSignedIn.current === null) {
      prevSignedIn.current = isSignedIn;
      return;
    }

    if (isSignedIn && !prevSignedIn.current) {
      // Just signed in
      const name = user?.firstName
        ? `Welcome back, ${user.firstName}!`
        : 'Welcome back!';
      toast.success(name, 4000);
    } else if (!isSignedIn && prevSignedIn.current) {
      // Just signed out
      toast.info("You've been signed out. See you soon!", 4000);
    }

    prevSignedIn.current = isSignedIn;
  }, [isSignedIn]);   // eslint-disable-line react-hooks/exhaustive-deps

  return null;
}

export default function App() {
  return (
    <ToastProvider>
      <Router>
        <AuthWatcher />
        <Routes>
          {/* Public */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={
            <SignedOut><Login /></SignedOut>
          } />

          {/* Protected: Dashboard */}
          <Route path="/dashboard" element={
            <>
              <SignedIn><Dashboard /></SignedIn>
              <SignedOut><Navigate to="/login" /></SignedOut>
            </>
          } />

          {/* Protected: Product Detail */}
          <Route path="/product/:shirtId" element={
            <>
              <SignedIn><ProductDetail /></SignedIn>
              <SignedOut><Navigate to="/login" /></SignedOut>
            </>
          } />

          {/* Protected: Live Fitting Room */}
          <Route path="/try-on/:shirtId" element={
            <>
              <SignedIn><DressingRoom /></SignedIn>
              <SignedOut><Navigate to="/login" /></SignedOut>
            </>
          } />

          {/* Protected: Upload custom garment */}
          <Route path="/upload" element={
            <>
              <SignedIn><GarmentUpload /></SignedIn>
              <SignedOut><Navigate to="/login" /></SignedOut>
            </>
          } />
        </Routes>
      </Router>
    </ToastProvider>
  );
}