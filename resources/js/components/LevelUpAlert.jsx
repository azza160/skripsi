"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Zap, Star, Sparkles, Trophy, ArrowUp } from "lucide-react"
import confetti from "canvas-confetti"

export default function LevelUpAlert({ onClose, level, unlockedFeatures }) {
  const [isVisible, setIsVisible] = useState(true)
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    if (isVisible) {
      // Trigger confetti after a short delay
      const timer = setTimeout(() => {
        setShowConfetti(true)
        triggerConfetti()
      }, 500)

      return () => clearTimeout(timer)
    }
  }, [isVisible])

  const triggerConfetti = () => {
    const duration = 5000
    const end = Date.now() + duration

    const colors = ["#8b5cf6", "#d946ef", "#ec4899", "#f59e0b", "#10b981"]
    ;(function frame() {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 75,
        origin: { x: 0 },
        colors: colors,
      })
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 75,
        origin: { x: 1 },
        colors: colors,
      })

      if (Date.now() < end) {
        requestAnimationFrame(frame)
      }
    })()
  }

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(() => {
      if (onClose) onClose()
    }, 500)
  }

  // Animation for floating elements
  const floatingAnimation = {
    initial: { y: 0 },
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 3,
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "reverse",
        ease: "easeInOut",
      },
    },
  }

  // Animation for rotating elements
  const rotatingAnimation = {
    initial: { rotate: 0 },
    animate: {
      rotate: 360,
      transition: {
        duration: 20,
        repeat: Number.POSITIVE_INFINITY,
        ease: "linear",
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
                <motion.div
                  {...rotatingAnimation}
                  className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-violet-300/20 to-transparent dark:from-violet-600/10 rounded-full -mr-20 -mt-20 pointer-events-none"
                />
                <motion.div
                  {...rotatingAnimation}
                  transition={{ duration: 25 }}
                  className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-pink-300/20 to-transparent dark:from-pink-600/10 rounded-full -ml-20 -mb-20 pointer-events-none"
                />

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
                  <span className="text-3xl text-violet-400/20 dark:text-violet-400/10">レ</span>
                </motion.div>

                <motion.div
                  {...floatingAnimation}
                  transition={{ delay: 0.7 }}
                  className="absolute bottom-24 left-16 pointer-events-none"
                >
                  <span className="text-3xl text-pink-400/20 dark:text-pink-400/10">ベ</span>
                </motion.div>

                <motion.div
                  {...floatingAnimation}
                  transition={{ delay: 1.2 }}
                  className="absolute top-28 left-24 pointer-events-none"
                >
                  <span className="text-3xl text-amber-400/20 dark:text-amber-400/10">ル</span>
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
                        animate={{
                          scale: 1,
                          rotate: [0, 10]
                        }}
                        transition={{ 
                          delay: 0.2, 
                          duration: 1,
                          rotate: {
                            duration: 0.8,
                            ease: "easeInOut",
                            repeat: Infinity,
                            repeatType: "reverse"
                          }
                        }}
                        className="mb-4 bg-gradient-to-br from-violet-500 to-purple-600 p-4 rounded-xl shadow-lg relative overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.3),transparent_60%)]"></div>
                        <Trophy className="h-10 w-10 text-white relative z-10" />
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                      >
                        <h2 className="text-xl font-medium text-violet-800 dark:text-violet-300 mb-1">
                          レベルアップ！
                        </h2>
                        <h1 className="text-3xl font-bold mb-2 text-slate-900 dark:text-white">Level Naik!</h1>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="mb-4"
                      >
                        <p className="text-slate-600 dark:text-slate-300">
                          Selamat! Anda telah mencapai level 6. Teruslah belajar untuk membuka fitur dan konten baru!
                        </p>
                      </motion.div>

                      {/* Level Badge */}
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.7 }}
                        className="mb-6"
                      >
                        <div className="relative">
                          <div className="w-24 h-24 rounded-full bg-gradient-to-r from-violet-500 to-purple-600 flex items-center justify-center shadow-lg">
                            <div className="w-20 h-20 rounded-full bg-white dark:bg-slate-900 flex items-center justify-center">
                              <div className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 text-transparent bg-clip-text">
                                {level}
                              </div>
                            </div>
                            <motion.div
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ delay: 1, duration: 0.5 }}
                              className="absolute -top-2 -right-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full p-1.5 shadow-md"
                            >
                              <ArrowUp className="h-4 w-4 text-white" />
                            </motion.div>
                          </div>
                        </div>
                      </motion.div>

                      {/* Unlocked Features */}
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                        className="bg-gradient-to-r from-violet-100 to-purple-100 dark:from-violet-900/30 dark:to-purple-900/30 p-4 rounded-xl border border-violet-200 dark:border-violet-800/30 mb-4 w-full"
                      >
                        <h3 className="font-medium text-violet-800 dark:text-violet-300 mb-2 flex items-center gap-1">
                          <Zap className="h-4 w-4" />
                          Fitur Baru Terbuka
                        </h3>
                        <ul className="text-sm text-slate-700 dark:text-slate-300 space-y-2">
                          {unlockedFeatures && unlockedFeatures.map((feature, index) => (
                            <li key={index} className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-violet-500"></div>
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.9 }}
                        className="flex flex-col sm:flex-row gap-3 w-full"
                      >
                        <button
                          onClick={handleClose}
                          className="flex-1 py-2.5 px-4 rounded-lg bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-medium transition-colors flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                        >
                          <Sparkles className="h-4 w-4" />
                          Lanjutkan Belajar
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
