import { Link } from "react-router-dom";

export default function UserDashboard({ user }) {
  return (
    <div className="container py-4">
      <div className="hero p-4 p-md-5 mb-4">
        <h1 className="fw-bold">
          Hello, {user.displayName || user.email}!
        </h1>

        <p className="lead mb-3">
          Find your next book and keep your rentals organized.
        </p>

        <Link
          to="/books"
          className="btn btn-light"
        >
          Browse Books
        </Link>
      </div>

      <div className="row g-4">
        <div className="col-md-6">
          <div className="card page-card shadow-sm p-4 h-100">
            <h4>
              📚 Explore the catalog
            </h4>

            <p className="text-secondary">
              See available titles and rent a copy in a few clicks.
            </p>

            <Link
              to="/books"
              className="btn btn-success"
            >
              View Books
            </Link>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card page-card shadow-sm p-4 h-100">
            <h4>
              📝 My rentals
            </h4>

            <p className="text-secondary">
              Check due dates and return books you already borrowed.
            </p>

            <Link
              to="/my-rentals"
              className="btn btn-outline-success"
            >
              View Rentals
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

