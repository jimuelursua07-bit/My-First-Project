import { useEffect, useState } from 'react';

import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  createUserWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';

import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from 'firebase/firestore';

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from 'react-router-dom';

import Landing from './pages/Landing.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import Display from './components/Display.jsx';
import RiderDashboard from './pages/UserDashboard.jsx';

import { auth, googleProvider, db } from './firebase.js';


// ========================================
// PROTECTED ROUTE
// ========================================

function ProtectedRoute({
  user,
  role,
  allowedRoles,
  children,
}) {
  // Walang naka-login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // May login pero walang tamang role
  if (
    allowedRoles &&
    !allowedRoles.includes(role)
  ) {
    // Admin → Admin dashboard
    if (role === 'admin') {
      return (
        <Navigate
          to="/admin"
          replace
        />
      );
    }

    // Rider → Rider dashboard
    if (role === 'rider') {
      return (
        <Navigate
          to="/rider-dashboard"
          replace
        />
      );
    }

    // Invalid role
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  return children;
}


// ========================================
// LOGIN PAGE
// ========================================

function LoginPage({
  handleLogin,
  handleGoogleLogin,
}) {
  const navigate = useNavigate();

  return (
    <Login
      onLogin={handleLogin}
      onGoogleLogin={handleGoogleLogin}
      onSignup={() => navigate('/signup')}
    />
  );
}


// ========================================
// SIGNUP PAGE
// ========================================

function SignupPage({
  handleSignup,
}) {
  const navigate = useNavigate();

  return (
    <Signup
      onSignup={handleSignup}
      onBackToLogin={() => navigate('/login')}
    />
  );
}


// ========================================
// ADMIN PAGE
// ========================================

function AdminPage({
  user,
  handleLogout,
}) {
  return (
    <Display
      user={user}
      onLogout={handleLogout}
    />
  );
}


// ========================================
// RIDER PAGE
// ========================================

function RiderPage({
  handleLogout,
}) {
  return (
    <RiderDashboard
      onLogout={handleLogout}
    />
  );
}


// ========================================
// MAIN APP
// ========================================

export default function App() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  const [authError, setAuthError] = useState('');


  // ========================================
  // CHECK FIREBASE AUTH + FIRESTORE ROLE
  // ========================================

  useEffect(() => {
    const unsubscribe =
      onAuthStateChanged(
        auth,
        async (currentUser) => {

          // Walang naka-login
          if (!currentUser) {
            setUser(null);
            setRole(null);
            setLoading(false);
            return;
          }

          try {
            const userRef = doc(
              db,
              'users',
              currentUser.uid
            );

            let userSnap =
              await getDoc(userRef);


            // ========================================
            // GOOGLE LOGIN
            // ========================================

            const isGoogleUser =
              currentUser.providerData.some(
                (provider) =>
                  provider.providerId ===
                  'google.com'
              );


            // Gumawa ng Firestore user document
            // kapag first time Google login
            if (
              !userSnap.exists() &&
              isGoogleUser
            ) {
              await setDoc(
                userRef,
                {
                  uid: currentUser.uid,
                  name:
                    currentUser.displayName ||
                    '',
                  email:
                    currentUser.email ||
                    '',

                  // Default Google users
                  // ay rider
                  role: 'rider',

                  createdAt:
                    serverTimestamp(),
                }
              );

              userSnap =
                await getDoc(userRef);
            }


            // ========================================
            // GET ROLE FROM FIRESTORE
            // ========================================

            const userRole =
              userSnap.exists()
                ? userSnap.data().role
                : null;


            console.log(
              'Firestore User Role:',
              userRole
            );


            // ========================================
            // VALIDATE ROLE
            // ========================================

            if (
              userRole !== 'admin' &&
              userRole !== 'rider'
            ) {
              await signOut(auth);

              setUser(null);
              setRole(null);

              return;
            }


            // ========================================
            // SAVE USER + ROLE
            // ========================================

            setUser(currentUser);
            setRole(userRole);

          } catch (error) {
            console.error(
              'Unable to load user role:',
              error
            );

            await signOut(auth);

            setUser(null);
            setRole(null);

          } finally {
            setLoading(false);
          }
        }
      );

    return unsubscribe;
  }, []);


  // ========================================
  // LOGIN
  // ========================================

  async function handleLogin(
    email,
    password
  ) {
    setAuthError('');

    try {
      await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );
    } catch (error) {
      console.error(
        'Login error:',
        error
      );

      setAuthError(
        error.message
      );

      throw error;
    }
  }


  // ========================================
  // GOOGLE LOGIN
  // ========================================

  async function handleGoogleLogin() {
    setAuthError('');

    try {
      await signInWithPopup(
        auth,
        googleProvider
      );
    } catch (error) {
      console.error(
        'Google login error:',
        error
      );

      setAuthError(
        error.message
      );

      throw error;
    }
  }


  // ========================================
  // SIGNUP
  // ========================================

  async function handleSignup({
    name,
    email,
    password,
    role,
  }) {
    setAuthError('');

    try {
      const credential =
        await createUserWithEmailAndPassword(
          auth,
          email.trim(),
          password
        );


      // Firebase Auth profile
      await updateProfile(
        credential.user,
        {
          displayName:
            name.trim(),
        }
      );


      // Firestore user document
      await setDoc(
        doc(
          db,
          'users',
          credential.user.uid
        ),
        {
          uid:
            credential.user.uid,

          name:
            name.trim(),

          email:
            credential.user.email ||
            email.trim(),

          role,

          createdAt:
            serverTimestamp(),
        }
      );


      setUser(
        credential.user
      );

      setRole(role);

    } catch (error) {
      console.error(
        'Signup error:',
        error
      );

      setAuthError(
        error.message
      );

      throw error;
    }
  }


  // ========================================
  // LOGOUT
  // ========================================

  async function handleLogout() {
    try {
      await signOut(auth);
    } catch (error) {
      console.error(
        'Logout error:',
        error
      );
    }
  }


  // ========================================
  // LOADING SCREEN
  // ========================================

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">

        <div
          className="spinner-border text-primary"
          role="status"
        >
          <span className="visually-hidden">
            Loading...
          </span>
        </div>

      </div>
    );
  }


  // ========================================
  // ROUTES
  // ========================================

  return (
    <BrowserRouter>

      <Routes>

        {/* =====================================
            LANDING
        ===================================== */}

        <Route
          path="/"
          element={
            user ? (
              <Navigate
                to={
                  role === 'admin'
                    ? '/admin'
                    : '/rider-dashboard'
                }
                replace
              />
            ) : (
              <Landing />
            )
          }
        />


        {/* =====================================
            LOGIN
        ===================================== */}

        <Route
          path="/login"
          element={
            user ? (
              <Navigate
                to={
                  role === 'admin'
                    ? '/admin'
                    : '/rider-dashboard'
                }
                replace
              />
            ) : (
              <LoginPage
                handleLogin={
                  handleLogin
                }
                handleGoogleLogin={
                  handleGoogleLogin
                }
              />
            )
          }
        />


        {/* =====================================
            SIGNUP
        ===================================== */}

        <Route
          path="/signup"
          element={
            user ? (
              <Navigate
                to={
                  role === 'admin'
                    ? '/admin'
                    : '/rider-dashboard'
                }
                replace
              />
            ) : (
              <SignupPage
                handleSignup={
                  handleSignup
                }
              />
            )
          }
        />


        {/* =====================================
            RIDER DASHBOARD
        ===================================== */}

        <Route
          path="/rider-dashboard"
          element={
            <ProtectedRoute
              user={user}
              role={role}
              allowedRoles={[
                'rider',
              ]}
            >
              <RiderPage
                handleLogout={
                  handleLogout
                }
              />
            </ProtectedRoute>
          }
        />


        {/* =====================================
            ADMIN DASHBOARD
            Display.jsx
        ===================================== */}

        <Route
          path="/admin"
          element={
            <ProtectedRoute
              user={user}
              role={role}
              allowedRoles={[
                'admin',
              ]}
            >
              <AdminPage
                user={user}
                handleLogout={
                  handleLogout
                }
              />
            </ProtectedRoute>
          }
        />


        {/* =====================================
            UNKNOWN ROUTE
        ===================================== */}

        <Route
          path="*"
          element={
            <Navigate
              to="/"
              replace
            />
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

