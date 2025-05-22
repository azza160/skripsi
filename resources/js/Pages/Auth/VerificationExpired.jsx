import { Link } from "@inertiajs/react";
import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";
import { route } from "ziggy-js";

export default function VerificationExpired({ message }) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-[hsl(220,14%,95%)] to-[hsl(252,94%,95%)] p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 relative"
      >
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-500 to-red-600 rounded-t-2xl" />

        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">Link Verifikasi Expired</h1>
          
          <p className="text-gray-600 mb-6">
            {message || "Link verifikasi Anda telah kadaluarsa. Silakan daftar ulang untuk mendapatkan link verifikasi baru."}
          </p>

          <Link
            href={route('register')}
            className="w-full py-3 bg-gradient-to-r from-[hsl(252,94%,56%)] to-[hsl(252,94%,46%)] text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
          >
            Daftar Ulang
          </Link>

          <p className="mt-4 text-sm text-gray-500">
            Sudah punya akun?{" "}
            <Link
              href={route('login')}
              className="text-[hsl(252,94%,56%)] font-medium hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
} 