"use client"

import { useState, useEffect } from "react"
import { Link, router } from "@inertiajs/react";
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { AlertDialog } from "../../components/AlertDialog"
import { Loading } from "../../components/Loading"
import { GoogleIcon } from "../../components/google-icon"
import { Eye, EyeOff, Mail, Lock, ChevronRight, ChevronLeft, BookOpen, Star } from 'lucide-react'
import { FloatingInput } from "../../components/FloatingInput"
import { ImageSlider } from "../../components/ImageSlider"
import { route } from "ziggy-js";

export default function LoginPage({ flash }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showAlert, setShowAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState("")
  const [showRightPanel, setShowRightPanel] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (flash.message) {
      setAlertMessage(flash.message)
      setShowAlert(true)
    }
  }, [flash])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await router.post(route('login'), {
        email,
        password,
      }, {
        onSuccess: () => {
          // Redirect akan ditangani oleh Laravel
        },
        onError: (errors) => {
          if (errors.message) {
            setAlertMessage(errors.message)
          } else {
            setAlertMessage("Terjadi kesalahan saat login. Silakan coba lagi.")
          }
          setShowAlert(true)
        },
        onFinish: () => {
          setIsLoading(false)
        }
      })
    } catch (error) {
      setAlertMessage("Terjadi kesalahan saat login. Silakan coba lagi.")
      setShowAlert(true)
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = () => {
    setIsLoading(true)
    window.location.href = route('google.login')
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-[hsl(220,14%,95%)] to-[hsl(252,94%,95%)] p-4">
      {isLoading && <Loading />}
      
      <div className="absolute top-0 left-0 w-full h-64 bg-[hsl(252,94%,56%)] rounded-b-[30%] opacity-10" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`w-full ${showRightPanel ? "max-w-6xl" : "max-w-xl"} grid ${showRightPanel ? "md:grid-cols-2" : "grid-cols-1"} bg-white rounded-2xl overflow-hidden shadow-2xl relative z-10`}
        style={{
          transition: "max-width 0.5s ease-in-out",
        }}
      >
        {/* Left side - Form */}
        <div className="p-6 md:p-8 flex flex-col relative">
          <div className="absolute top-0 left-0 w-32 h-32 bg-[hsl(252,94%,56%)] opacity-10 rounded-br-full" />

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mb-6 relative z-10"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-gradient-to-r from-[hsl(252,94%,56%)] to-[hsl(252,94%,46%)] p-2 rounded-lg">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[hsl(252,94%,56%)] to-[hsl(252,94%,40%)]">
                おかえりなさい!
              </h1>
            </div>

            <h2 className="text-2xl font-semibold mb-2 flex items-center gap-2">
              Welcome Back!
              <div className="flex">
                {[1, 2, 3].map((i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
            </h2>

            <p className="text-[hsl(215.4,16.3%,40%)] pr-4">
              Selamat datang kembali di aplikasi pembelajaran bahasa Jepang kami. Masuk untuk melanjutkan perjalanan
              belajar Anda dan tingkatkan kemampuan berbahasa Jepang Anda hari ini.
            </p>
          </motion.div>

          <form onSubmit={handleSubmit} className="space-y-5 flex-1 relative z-10">
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <FloatingInput
                id="email"
                type="email"
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={<Mail className="z-[5] w-5 h-5 text-[hsl(252,94%,56%)]" />}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="relative"
            >
              <FloatingInput
                id="password"
                type={showPassword ? "text" : "password"}
                label="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon={<Lock className="z-[5] w-5 h-5 text-[hsl(252,94%,56%)]" />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[hsl(252,94%,56%)] transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                }
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="space-y-4"
            >
              <Button
                type="submit"
                className="w-full py-5 bg-gradient-to-r from-[hsl(252,94%,56%)] to-[hsl(252,94%,46%)] hover:from-[hsl(252,94%,50%)] hover:to-[hsl(252,94%,40%)] text-white font-medium rounded-lg shadow-lg shadow-[hsl(252,94%,70%)]/20 transition-all duration-300 hover:shadow-xl hover:shadow-[hsl(252,94%,70%)]/30 hover:-translate-y-1"
              >
                Masuk
              </Button>

              <button
                type="button"
                onClick={() => setShowRightPanel(!showRightPanel)}
                className="w-full flex items-center justify-center gap-2 group text-sm text-[hsl(215.4,16.3%,40%)] hover:text-[hsl(252,94%,56%)] transition-colors py-1"
              >
                {showRightPanel ? (
                  <>
                    <span>Sembunyikan Gambar</span>
                    <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                  </>
                ) : (
                  <>
                    <span>Tampilkan Gambar</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </motion.div>
          </form>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="mt-5 relative flex items-center"
          >
            <div className="flex-grow h-px bg-gradient-to-r from-transparent via-[hsl(214.3,20%,80%)] to-transparent"></div>
            <span className="mx-4 text-[hsl(215.4,16.3%,40%)] bg-white px-2">Atau</span>
            <div className="flex-grow h-px bg-gradient-to-r from-transparent via-[hsl(214.3,20%,80%)] to-transparent"></div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          >
            <Button
              variant="outline"
              className="mt-4 w-full py-5 flex items-center justify-center gap-3 border border-[hsl(214.3,20%,90%)] rounded-lg hover:bg-[hsl(214.3,20%,98%)] transition-all duration-300 hover:border-[hsl(252,94%,56%)]"
              onClick={handleGoogleLogin}
            >
              <GoogleIcon />
              <span>Masuk dengan Google</span>
            </Button>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="mt-5 text-center text-[hsl(215.4,16.3%,40%)]"
          >
            Belum punya akun?{" "}
            <Link href={route('register')} className="text-[hsl(252,94%,56%)] font-medium hover:underline relative group">
              Daftar Sekarang
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[hsl(252,94%,56%)] transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </motion.p>

          <div className="absolute bottom-0 right-0 w-32 h-32 bg-[hsl(252,94%,56%)] opacity-10 rounded-tl-full" />
        </div>

        {/* Right side - Image Slider */}
        <AnimatePresence>
          {showRightPanel && (
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.5 }}
              className="hidden md:block relative overflow-hidden"
            >
              <ImageSlider />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <AlertDialog isOpen={showAlert} message={alertMessage} onClose={() => setShowAlert(false)} />
    </div>
  )
}
