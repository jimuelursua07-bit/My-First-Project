import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";

import {
  doc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";

import {
  auth,
  db,
} from "../firebase";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();

    setBusy(true);
    setError("");

    try {
      const c = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      await updateProfile(c.user, {
        displayName: name,
      });

      await setDoc(doc(db, "users", c.user.uid), {
        uid: c.user.uid,
        name,
        email,
        role: "user",
        createdAt: serverTimestamp(),
      });

      nav("/dashboard");
    } catch (err) {
      setError(
        err.message
          .replace("Firebase: ", "")
          .replace(/\s*\([^)]*\)\.?/, "")
          .replace(/\.$/, "") || "Registration failed."
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="container">
      <div className="auth-box">
        <div className="card page-card p-4 p-md-5">
          <h2 className="fw-bold">
            Create account
          </h2>

          <p className="text-secondary">
            Join the library and start renting books.
          </p>

          {error && (
            <div className="alert alert-danger">
              {error}
            </div>
          )}

          <form onSubmit={submit}>
            <label className="form-label">
              Full name
            </label>

            <input
              className="form-control mb-3"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

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
              minLength="6"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button
              className="btn btn-success w-100"
              disabled={busy}
            >
              {busy ? "Creating..." : "Create Account"}
            </button>
          </form>

          <p className="text-center mt-4 mb-0">
            Already registered?{" "}
            <Link to="/login">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

