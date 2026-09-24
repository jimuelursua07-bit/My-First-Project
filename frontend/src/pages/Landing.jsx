import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <main>
      <div className="container py-5">
        <section className="hero p-4 p-md-5 mb-5">
          <div className="row align-items-center">
            <div className="col-lg-7">
              <span className="badge bg-light text-success mb-3">
                LIBRARY RENTING SYSTEM
              </span>

              <h1 className="display-4 fw-bold">
                Borrow books easily. Keep your reading organized.
              </h1>

              <p className="lead mt-3">
                Browse available books, rent a copy, and track your due
                dates in one simple library application.
              </p>

              <div className="d-flex gap-2 mt-4">
                <Link
                  to="/login"
                  className="btn btn-light btn-lg"
                >
                  Get Startedteg
                </Link>

                <Link
                  to="/signup"
                  className="btn btn-outline-light btn-lg"
                >
                  Create Account
                </Link>
              </div>
            </div>

            <div className="col-lg-5 text-center mt-4 mt-lg-0">
              <div style={{ fontSize: 120 }}>
                📚
              </div>
            </div>
          </div>
        </section>

        <div className="row g-4">
          <div className="col-md-4">
            <div className="card page-card h-100 p-4">
              <h4>Browse Books</h4>

              <p className="text-secondary mb-0">
                Search the library catalog and see which titles
                have available copies.
              </p>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card page-card h-100 p-4">
              <h4>Rent a Book</h4>

              <p className="text-secondary mb-0">
                Choose a book and create a rental with a simple
                due date.
              </p>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card page-card h-100 p-4">
              <h4>Track Rentals</h4>

              <p className="text-secondary mb-0">
                View active and returned books from your personal
                rental history.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
