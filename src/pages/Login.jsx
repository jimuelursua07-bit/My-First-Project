import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";

import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";

import {
  auth,
  googleProvider,
  db,
} from "../firebase";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const nav = useNavigate();

  const after = async (u) => {
    const ref = doc(db, "users", u.uid);
    const snap = await getDoc(ref);

    let role = "user";

    if (snap.exists()) {
      role = snap.data().role || "user";
    } else {
      await setDoc(ref, {
        uid: u.uid,
        name: u.displayName || "Library User",
        email: u.email || "",
        role: "user",
        createdAt: serverTimestamp(),
      });
    }

    nav(role === "admin" ? "/admin" : "/dashboard");
  };

  const submit = async (e) => {
    e.preventDefault();

    setBusy(true);
    setError("");

    try {
      const c = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      await after(c.user);
    } catch (err) {
      setError(
        err.message
          .replace("Firebase: ", "")
          .replace(/\s*\([^)]*\)\.?/, "")
          .replace(/\.$/, "") || "Login failed."
      );
    } finally {
      setBusy(false);
    }
  };

  const google = async () => {
    setBusy(true);
    setError("");

    try {
      const c = await signInWithPopup(auth, googleProvider);

      await after(c.user);
    } catch (err) {
      setError(err.message || "Google sign-in failed.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="container">
      <div className="auth-box">
        <div className="card page-card p-4 p-md-5">
          <h2 className="fw-bold">Welcome back</h2>

          <p className="text-secondary">
            Sign in to your library account.
          </p>

          {error && (
            <div className="alert alert-danger">
              {error}
            </div>
          )}

          <form onSubmit={submit}>
            <label className="form-label">
              Email
            </label>

            <input
              className="form-control mb-3"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label className="form-label">
              Password
            </label>

            <input
              className="form-control mb-3"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button
              className="btn btn-success w-100"
              disabled={busy}
            >
              {busy ? "Signing in..." : "Login"}
            </button>
          </form>

          <div className="text-center my-3 text-secondary">
            or
          </div>

          <button
            className="btn btn-outline-dark w-100"
            onClick={google}
            disabled={busy}
          >
            Continue with Google
          </button>

          <p className="text-center mt-4 mb-0">
            No account?{" "}
            <Link to="/signup">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
