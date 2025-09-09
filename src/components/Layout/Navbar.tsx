import { Link, useLocation } from "react-router-dom";
import { Home, Wallet } from "lucide-react";
import { displayAddressShort } from "../../utils/displayAddressShort";
import { useWallet } from "../../providers/WalletProvider";

export const Navbar: React.FC = () => {
  const { address, setIsModalOpen } = useWallet();

  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <nav className="bg-white/90 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2 group">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-emerald-500 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                  <Home className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-emerald-500 bg-clip-text text-transparent">
                  PropChain
                </span>
              </Link>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <Link
                to="/"
                className={`px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                  isActive("/")
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-600 hover:text-blue-600"
                }`}
              >
                Home
              </Link>
              <Link
                to="/listings"
                className={`px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                  isActive("/listings")
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-600 hover:text-blue-600"
                }`}
              >
                Listings
              </Link>
              <Link
                to="/favorites"
                className={`px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                  isActive("/favorites")
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-600 hover:text-blue-600"
                }`}
              >
                Favorites
              </Link>
              <Link
                to="/dashboard"
                className={`px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                  isActive("/dashboard")
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-600 hover:text-blue-600"
                }`}
              >
                Dashboard
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsModalOpen(true)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  address
                    ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                    : "bg-gradient-to-r from-blue-600 to-emerald-500 text-white hover:from-blue-700 hover:to-emerald-600 shadow-lg hover:shadow-xl transform hover:scale-105"
                }`}
              >
                <Wallet className="w-4 h-4" />
                <span className="hidden sm:block">
                  {address ? displayAddressShort(address) : "Connect Wallet"}
                </span>
              </button>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};