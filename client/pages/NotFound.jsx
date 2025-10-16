import { Link } from "react-router-dom";
import "./NotFound.css";

export default function NotFound() {
  return (
    <div className="notfound-container min-h-screen bg-white flex items-center justify-center p-4">
      <div className="text-center">
        <div className="notfound-illustration">
          <h1 className="notfound-title text-4xl font-bold text-[#270659] mb-4">404</h1>
        </div>
        <p className="notfound-message text-[#53426C] mb-6">Page not found</p>
        <Link
          to="/"
          className="notfound-button inline-block px-6 py-3 bg-[#AD1E24] text-white rounded-full hover:bg-[#8B1820] transition-colors"
        >
          Back to Login
        </Link>
      </div>
    </div>
  );
}
