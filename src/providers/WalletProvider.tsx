import {
  createContext,
  useState,
  useEffect,
  PropsWithChildren,
  useContext,
  Dispatch,
  SetStateAction,
} from "react";

export function useWallet() {
  const walletContext = useContext(WalletContext);

  if (!walletContext) {
    throw new Error("Navbar must be used within a WalletProvider");
  }

  return walletContext;
}

export const WalletContext = createContext<
  | {
      address: string | null;
      isConnecting: boolean;
      isModalOpen: boolean;
      setIsModalOpen: Dispatch<SetStateAction<boolean>>;
      connectWallet: () => Promise<void>;
      disconnectWallet: () => void;
    }
  | undefined
>(undefined);

type WalletConnectionErrorType =
  | "metamask_not_installed"
  | "connection_rejected"
  | "no_accounts"
  | "unknown";

export class WalletConnectionError extends Error {
  type: WalletConnectionErrorType;

  constructor(payload: { type: WalletConnectionErrorType; message: string }) {
    super(payload.message);
    this.type = payload.type;
    this.name = "WalletConnectionError";
  }
}

export const WalletProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  const [address, setAddress] = useState<string | null>(null);

  const connectWallet = async () => {
    if (!window.ethereum) {
      throw new WalletConnectionError({
        type: "metamask_not_installed",
        message:
          "MetaMask is not installed. Please install MetaMask to continue.",
      });
    }

    let error: WalletConnectionError | null = null;

    try {
      setIsConnecting(true);

      const accounts = await window.ethereum.request<string[]>({
        method: "eth_requestAccounts",
      });

      if (accounts?.[0]) {
        setAddress(accounts[0]);
      } else {
        error = new WalletConnectionError({
          type: "no_accounts",
          message: "No accounts found. Please connect your wallet.",
        });
      }
    } catch (e: any) {
      if (e.code === 4001) {
        error = new WalletConnectionError({
          type: "connection_rejected",
          message: "Connection request was rejected. Please try again.",
        });
      } else {
        error = new WalletConnectionError({
          type: "unknown",
          message:
            "An error occurred while connecting to MetaMask. Please try again.",
        });
      }
    } finally {
      setIsConnecting(false);
    }

    if (error) throw error;
  };

  const disconnectWallet = async () => {
    if (!window.ethereum) return;

    await window.ethereum.request({
      method: "wallet_revokePermissions",
      params: [{ eth_accounts: {} }],
    });

    setAddress(null);
  };

  useEffect(() => {
    (async () => {
      if (!window.ethereum) return;

      const accounts = await window.ethereum.request<string[]>({
        method: "eth_accounts",
      });

      if (!accounts?.[0]) return;

      setAddress(accounts[0]);
    })();

    const handleAccountsChanged = (accounts: string[]) => {
      const [account] = accounts;

      if (account) {
        setAddress(account);
      } else {
        disconnectWallet();
      }
    };

    const handleChainChanged = () => {
      window.location.reload();
    };

    window.ethereum
      // @ts-ignore - listener arguments set to (...args: unknown[]) and no way to specify it
      ?.addListener("accountsChanged", handleAccountsChanged)
      .addListener("chainChanged", handleChainChanged);

    return () => {
      window.ethereum
        // @ts-ignore - there is actually this method, but it's not typed
        ?.removeListener("accountsChanged", handleAccountsChanged)
        .removeListener("chainChanged", handleChainChanged);
    };
  }, []);

  return (
    <WalletContext.Provider
      value={{
        address,
        isConnecting,
        isModalOpen,
        setIsModalOpen,
        connectWallet,
        disconnectWallet,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};