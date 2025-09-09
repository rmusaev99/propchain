import { X, Wallet, ExternalLink, AlertCircle, Loader2 } from "lucide-react";
import { useWallet, WalletConnectionError } from "../providers/WalletProvider";
import { useState } from "react";

export const WalletModal: React.FC = () => {
  const { address, isConnecting, isModalOpen, setIsModalOpen, connectWallet } =
    useWallet();

  const [error, setError] = useState<WalletConnectionError | null>(null);

  const handleMetaMaskConnect = async () => {
    try {
      await connectWallet();

      setIsModalOpen(false);
    } catch (error: any) {
      if (error instanceof WalletConnectionError) {
        setError(error);
      } else {
        setError(
          new WalletConnectionError({ type: "unknown", message: error }),
        );
      }
    }
  };

  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-md w-full mx-4 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Connect Wallet
          </h2>
          <button
            onClick={() => setIsModalOpen(false)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {address ? (
          <div className="text-center">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Wallet className="w-8 h-8 text-emerald-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Wallet Connected
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Your wallet is successfully connected
            </p>
            <div className="bg-gray-50 rounded-lg p-3 mb-4">
              <p className="text-sm font-mono text-gray-700">{address}</p>
            </div>
            <button
              onClick={() => setIsModalOpen(false)}
              className="w-full bg-emerald-600 text-white py-2 px-4 rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Continue
            </button>
          </div>
        ) : (
          <div>
            <p className="text-gray-600 mb-6 text-center">
              Choose a wallet to connect to the PropChain platform
            </p>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 flex items-start space-x-2">
                <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-red-700">{error.message}</p>
                  {error.type === "metamask_not_installed" && (
                    <a
                      href="https://metamask.io/download/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-red-600 hover:text-red-800 underline flex items-center mt-1"
                    >
                      Install MetaMask <ExternalLink className="w-3 h-3 ml-1" />
                    </a>
                  )}
                </div>
              </div>
            )}

            <button
              onClick={handleMetaMaskConnect}
              disabled={isConnecting}
              className="w-full bg-white border border-gray-300 rounded-lg p-4 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-between"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Wallet className="w-6 h-6 text-orange-600" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-900">MetaMask</p>
                  <p className="text-sm text-gray-500">
                    Connect using browser wallet
                  </p>
                </div>
              </div>
              {isConnecting ? (
                <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
              ) : (
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              )}
            </button>

            <p className="text-xs text-gray-500 mt-4 text-center">
              By connecting a wallet, you agree to our terms of service and
              privacy policy.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};