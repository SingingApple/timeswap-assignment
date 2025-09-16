import Link from "next/link";
import { ArrowRight, Coins, Zap, Activity, Shield } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-8">
            <Coins className="w-10 h-10 text-white" />
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Timeswap
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {" "}
              ERC20
            </span>
          </h1>

          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Advanced ERC-20 token management with transaction queuing, rapid
            transfers, and EIP-712 signing capabilities.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Activity className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Transaction Queue
            </h3>
            <p className="text-gray-600">
              Monitor, speed up, and cancel pending transactions with real-time
              status updates.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Rapid Transfers
            </h3>
            <p className="text-gray-600">
              Send multiple ETH transfers with consecutive nonces for efficient
              batch operations.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              EIP-712 Signing
            </h3>
            <p className="text-gray-600">
              Create, sign, and verify structured data with EIP-712 standard
              compliance.
            </p>
          </div>
        </div>

        <div className="text-center">
          <div className="bg-white rounded-3xl p-12 shadow-2xl max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-gray-600 mb-8">
              Connect your wallet and start managing ERC-20 tokens with advanced
              features.
            </p>

            <Link
              href="/add-token"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Get Started
              <ArrowRight className="w-5 h-5" />
            </Link>

            <div className="mt-6 text-sm text-gray-500">
              <p>Connect your wallet to access all features</p>
            </div>
          </div>
        </div>

        <div className="text-center mt-16 text-gray-500">
          <p>Built with Next.js, Wagmi, and Viem</p>
        </div>
      </div>
    </div>
  );
}
