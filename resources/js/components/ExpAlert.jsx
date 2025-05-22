"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Award, Star, Sparkles, Plus } from "lucide-react"
import confetti from "canvas-confetti"

export default function ExpAlert({ onClose, currentExp, expGained, nextLevelExp }) {
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
    const duration = 3000
    const end = Date.now() + duration

    const colors = ["#8b5cf6", "#d946ef", "#ec4899"]
    ;(function frame() {
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors,
      })
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
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
            className="fixed inset-0 flex items-center justify-center z-[500] p-4 overflow-hidden"
          >
            <div className="w-full max-w-md max-h-[90vh] flex flex-col">
              <div className="relative overflow-hidden bg-gradient-to-br from-violet-50 to-pink-50 dark:from-violet-950 dark:to-pink-950 rounded-2xl shadow-2xl border border-violet-200/50 dark:border-violet-800/30 flex-1 flex flex-col">
                {/* Background decorative elements */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-violet-300/20 to-transparent dark:from-violet-600/10 rounded-full -mr-20 -mt-20 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-pink-300/20 to-transparent dark:from-pink-600/10 rounded-full -ml-20 -mb-20 pointer-events-none" />

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

                {/* Close button - fixed position */}
                <button
                  onClick={handleClose}
                  className="absolute top-3 right-3 p-1.5 rounded-full bg-white/80 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-700 transition-colors z-[500]"
                >
                  <X className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                </button>

                {/* Scrollable Content */}
                <div className="overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-amber-200 dark:scrollbar-thumb-amber-800 scrollbar-track-transparent">
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
                          duration: 0.8,
                          rotate: {
                            duration: 0.8,
                            ease: "easeInOut",
                            repeat: Infinity,
                            repeatType: "reverse"
                          }
                        }}
                        className="mb-4 bg-gradient-to-br from-amber-500 to-orange-600 p-3 rounded-xl shadow-lg relative overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.2),transparent_60%)]"></div>
                        <Award className="h-8 w-8 text-white relative z-[500]" />
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                      >
                        <h2 className="text-xl font-medium text-amber-600 dark:text-amber-400 mb-1">おめでとう！</h2>
                        <h1 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white">
                          Anda Mendapatkan EXP!
                        </h1>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="mb-4"
                      >
                        <p className="text-slate-600 dark:text-slate-300">
                          Selamat! Anda telah menyelesaikan latihan Hiragana dan mendapatkan poin pengalaman.
                        </p>
                      </motion.div>

                      {/* EXP Counter */}
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.7 }}
                        className="bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 p-4 rounded-xl border border-amber-200 dark:border-amber-800/30 mb-4 w-full"
                      >
                        <div className="flex items-center justify-center gap-2">
                          <Sparkles className="h-5 w-5 text-amber-500" />
                          <span className="text-lg font-bold text-amber-700 dark:text-amber-300">+{expGained} EXP</span>
                          <Plus className="h-4 w-4 text-green-500" />
                        </div>

                        <div className="mt-2 relative pt-1">
                          <div className="flex mb-1 items-center justify-between">
                            <div>
                              <span className="text-xs font-semibold inline-block text-amber-600 dark:text-amber-400">
                                Level Progress
                              </span>
                            </div>
                            <div>
                              <span className="text-xs font-semibold inline-block text-amber-600 dark:text-amber-400">
                                {currentExp}/{nextLevelExp} XP
                              </span>
                            </div>
                          </div>
                          <div className="overflow-hidden h-2 text-xs flex rounded-full bg-amber-200 dark:bg-amber-900/50">
                            <motion.div
                              initial={{ width: `${(currentExp - expGained) / nextLevelExp * 100}%` }}
                              animate={{ width: `${currentExp / nextLevelExp * 100}%` }}
                              transition={{ delay: 0.8, duration: 1, ease: "easeOut" }}
                              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-amber-500 to-orange-500"
                            ></motion.div>
                          </div>
                        </div>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.9 }}
                        className="flex flex-col sm:flex-row gap-3 w-full"
                      >
                        <button
                          onClick={handleClose}
                          className="flex-1 py-2.5 px-4 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-medium transition-colors flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                        >
                          <Sparkles className="h-4 w-4" />
                          Lanjutkan Belajar
                        </button>
                      </motion.div>
                    </div>
                  </div>
                </div>

                {/* Bottom decorative wave */}
                <div className="h-8 bg-gradient-to-r from-amber-500/80 via-orange-500/80 to-amber-500/80 mt-auto relative overflow-hidden">
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
