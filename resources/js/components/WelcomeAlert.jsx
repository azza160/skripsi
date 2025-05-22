"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Sparkles, Award, Star, Bookmark, BookOpen, GraduationCap } from "lucide-react"

export default function WelcomeAlert({ username, onClose, jumlahHuruf, currentLevel, loginStreak }) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    // Auto close after 8 seconds
    const timer = setTimeout(() => {
      handleClose()
    }, 8000)

    return () => clearTimeout(timer)
  }, [])

  const handleClose = () => {
    setIsVisible(false)
    if (onClose) setTimeout(onClose, 500)
  }

  // Animation for floating elements
  const floatingAnimation = {
    initial: { y: 0 },
    animate: {
      y: [-5, 5],
      transition: {
        duration: 2,
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "reverse",
        ease: "easeInOut",
      },
    },
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={handleClose}
          />

          {/* Alert Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4 overflow-hidden"
          >
            <div className="w-full max-w-md max-h-[90vh] flex flex-col">
              <div className="relative overflow-hidden bg-gradient-to-br from-violet-50 to-pink-50 dark:from-violet-950 dark:to-pink-950 rounded-2xl shadow-2xl border border-violet-200/50 dark:border-violet-800/30 flex-1 flex flex-col">
                {/* Background decorative elements */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-violet-300/20 to-transparent dark:from-violet-600/10 rounded-full -mr-20 -mt-20" />
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-pink-300/20 to-transparent dark:from-pink-600/10 rounded-full -ml-20 -mb-20" />

                {/* Decorative elements */}
                <motion.div {...floatingAnimation} className="absolute top-6 right-12 pointer-events-none">
                  <Star className="h-6 w-6 text-amber-400 fill-amber-400/30" />
                </motion.div>

                <motion.div
                  {...floatingAnimation}
                  transition={{ delay: 0.5 }}
                  className="absolute bottom-12 left-8 pointer-events-none"
                >
                  <Star className="h-5 w-5 text-pink-400 fill-pink-400/30" />
                </motion.div>

                <motion.div
                  {...floatingAnimation}
                  transition={{ delay: 1 }}
                  className="absolute top-20 left-10 pointer-events-none"
                >
                  <Star className="h-4 w-4 text-violet-400 fill-violet-400/30" />
                </motion.div>

                {/* Japanese characters floating */}
                <motion.div
                  {...floatingAnimation}
                  transition={{ delay: 0.3 }}
                  className="absolute top-16 right-24 pointer-events-none"
                >
                  <span className="text-3xl text-violet-400/20 dark:text-violet-400/10">あ</span>
                </motion.div>

                <motion.div
                  {...floatingAnimation}
                  transition={{ delay: 0.7 }}
                  className="absolute bottom-24 left-16 pointer-events-none"
                >
                  <span className="text-3xl text-pink-400/20 dark:text-pink-400/10">ア</span>
                </motion.div>

                <motion.div
                  {...floatingAnimation}
                  transition={{ delay: 1.2 }}
                  className="absolute top-28 left-24 pointer-events-none"
                >
                  <span className="text-3xl text-amber-400/20 dark:text-amber-400/10">日</span>
                </motion.div>

                {/* Close button - fixed position */}
                <button
                  onClick={handleClose}
                  className="absolute top-3 right-3 p-1.5 rounded-full bg-white/80 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-700 transition-colors z-10"
                >
                  <X className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                </button>

                {/* Scrollable Content */}
                <div className="overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-violet-200 dark:scrollbar-thumb-violet-800 scrollbar-track-transparent">
                  <div className="p-6 pt-8">
                    <div className="flex flex-col items-center text-center">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, duration: 0.8, type: "spring" }}
                        className="mb-4 bg-gradient-to-br from-violet-500 to-purple-600 p-3 rounded-xl shadow-lg relative overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.2),transparent_60%)]"></div>
                        <Award className="h-8 w-8 text-white relative z-10" />
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                      >
                        <h2 className="text-xl font-medium text-violet-800 dark:text-violet-300 mb-1">
                          おかえりなさい！
                        </h2>
                        <h1 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white">
                          Selamat Datang Kembali, {username}!
                        </h1>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="mb-4"
                      >
                        <p className="text-slate-600 dark:text-slate-300">
                          Lanjutkan perjalanan belajar bahasa Jepang Anda. Kami telah menyiapkan materi baru untuk Anda
                          pelajari hari ini!
                        </p>
                      </motion.div>

                      {/* Stats badges */}
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        className="flex flex-wrap justify-center gap-2 mb-4"
                      >
                        <div className="flex items-center gap-1 bg-violet-100 dark:bg-violet-900/30 px-2 py-1 rounded-full">
                          <GraduationCap className="h-3.5 w-3.5 text-violet-500" />
                          <span className="text-xs font-medium text-violet-800 dark:text-violet-300">Level {currentLevel}</span>
                        </div>
                        <div className="flex items-center gap-1 bg-pink-100 dark:bg-pink-900/30 px-2 py-1 rounded-full">
                          <BookOpen className="h-3.5 w-3.5 text-pink-500" />
                          <span className="text-xs font-medium text-pink-800 dark:text-pink-300">{jumlahHuruf} Huruf</span>
                        </div>
                        <div className="flex items-center gap-1 bg-amber-100 dark:bg-amber-900/30 px-2 py-1 rounded-full">
                          <Bookmark className="h-3.5 w-3.5 text-amber-500" />
                          <span className="text-xs font-medium text-amber-800 dark:text-amber-300">{loginStreak} Hari Streak</span>
                        </div>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                        className="flex flex-col sm:flex-row gap-3 w-full"
                      >
                        <button
                          onClick={handleClose}
                          className="flex-1 py-2.5 px-4 rounded-lg bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-medium transition-colors flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                        >
                          <Sparkles className="h-4 w-4" />
                          Mulai Belajar Sekarang
                        </button>
                      </motion.div>
                    </div>
                  </div>
                </div>

                {/* Bottom decorative wave */}
                <div className="h-8 bg-gradient-to-r from-violet-500/80 via-purple-500/80 to-pink-500/80 mt-auto relative overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.2),transparent_70%)]"></div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
