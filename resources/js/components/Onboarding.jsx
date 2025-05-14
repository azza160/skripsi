"use client"

import React from "react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Sparkles, BookOpen, PenTool, Languages, BookMarked, Rocket } from "lucide-react"

// Onboarding steps content with added icons
const steps = [
  {
    title: "Selamat Datang di Perjalanan Belajar Huruf Jepang!",
    description:
      "Sebelum memulai belajar bahasa Jepang, langkah pertama yang perlu kamu kuasai adalah huruf-huruf dasar Jepang. Di halaman ini, kamu akan diperkenalkan dengan dua huruf utama: Hiragana dan Katakana. Mari mulai!",
    icon: BookOpen,
  },
  {
    title: "Hiragana - Fondasi Bahasa Jepang",
    description:
      "Hiragana adalah huruf dasar yang digunakan untuk menulis kata-kata asli Jepang. Kamu akan sering menemui huruf ini dalam percakapan sehari-hari dan tulisan umum. Yuk, kita pelajari hiragana lebih dalam!",
    icon: PenTool,
  },
  {
    title: "Katakana - Huruf untuk Kata Serapan",
    description:
      "Katakana digunakan untuk menulis kata-kata serapan dari bahasa asing, seperti teknologi, nama tempat, atau makanan. Katakana sangat penting karena banyak kata modern yang menggunakan huruf ini.",
    icon: Languages,
  },
  {
    title: "Sekilas Tentang Kanji",
    description:
      "Kanji adalah huruf yang berasal dari Tiongkok dan memiliki makna tersendiri. Walaupun saat ini fokus kita akan lebih banyak ke Hiragana dan Katakana, sedikit demi sedikit kamu akan mulai mengenal Kanji juga.",
    icon: BookMarked,
  },
  {
    title: "Siap Memulai Pembelajaran?",
    description:
      "Sekarang kamu sudah siap untuk mulai belajar huruf Jepang dengan lebih mendalam. Mari kita mulai perjalanan belajar Hiragana dan Katakana bersama-sama!",
    icon: Rocket,
  },
]

const stepDetails = [
    {
      extraDescription:
        "Huruf dalam bahasa Jepang tidak menggunakan alfabet seperti dalam bahasa Indonesia atau Inggris. Ada tiga sistem utama yang digunakan: Hiragana, Katakana, dan Kanji. Untuk mempermudah, kamu akan mulai dari dua sistem dasar terlebih dahulu, yaitu Hiragana dan Katakana. Keduanya memiliki karakteristik masing-masing dan akan sangat sering kamu temui dalam pembelajaran ke depan."
    },
    {
      extraDescription:
        "Hiragana terdiri dari 46 karakter dasar yang masing-masing mewakili suku kata. Penguasaan hiragana akan membantumu membaca teks-teks sederhana, mengenali partikel dalam tata bahasa Jepang, dan memahami struktur kalimat. Hiragana juga sering digunakan untuk anak-anak dan pemula karena lebih mudah dipelajari dibandingkan Kanji."
    },
    {
      extraDescription:
        "Katakana juga terdiri dari 46 karakter dasar, namun bentuknya lebih kaku dan tajam dibandingkan Hiragana. Katakana digunakan untuk menuliskan kata-kata serapan dari bahasa asing, onomatope (kata bunyi), serta penekanan tertentu dalam tulisan, mirip seperti huruf kapital dalam bahasa Inggris."
    },
    {
      extraDescription:
        "Kanji jauh lebih kompleks dibandingkan Hiragana dan Katakana karena setiap simbol memiliki makna dan cara baca tersendiri. Ada ribuan Kanji dalam bahasa Jepang, tapi jangan khawatir—kanji akan mulai kamu pelajari secara bertahap di tahap-tahap selanjutnya. Untuk sekarang, fokuslah dulu pada dua huruf dasar."
    },
    {
      extraDescription:
        "Pembelajaran huruf adalah fondasi yang sangat penting dalam memahami bahasa Jepang. Dengan menguasai Hiragana dan Katakana, kamu akan lebih mudah membaca, menulis, dan menyerap kosakata baru. Mari lanjut ke materi utama dan mulai belajar dengan semangat!"
    }
  ];




export default function Onboarding({onComplete}) {
  const [currentStep, setCurrentStep] = useState(0)
  const [direction, setDirection] = useState(0)
  const [windowHeight, setWindowHeight] = useState(0)
  const [isMobile, setIsMobile] = useState(false)


  // Handle window resize for responsive adjustments
  useEffect(() => {
    const handleResize = () => {
      setWindowHeight(window.innerHeight)
      setIsMobile(window.innerWidth < 768)

    }

    // Set initial values
    handleResize()

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const totalSteps = steps.length
  const isFirstStep = currentStep === 0
  const isLastStep = currentStep === totalSteps - 1

  const handleNext = () => {
    if (!isLastStep) {
      setDirection(1)
      setCurrentStep((prev) => prev + 1)
    } else {
      handleComplete()
    }
  }

  const handlePrevious = () => {
    if (!isFirstStep) {
      setDirection(-1)
      setCurrentStep((prev) => prev - 1)
    }
  }

  const handleComplete = () => {
    if (typeof onComplete === 'function') {
      onComplete(); // Panggil fungsi ini dari parent
    }
  };

  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      x: direction > 0 ? -300 : 300,
      opacity: 0,
    }),
  }

  const transition = {
    type: "spring",
    stiffness: 300,
    damping: 30,
  }

  

  // Calculate content height based on window size
  const getContentHeight = () => {
    if (isMobile) {
      return "auto" // Auto height on mobile
    } else {
      // Dynamic height calculation for desktop
      const baseHeight = Math.min(windowHeight - 250, 500)
      return `${Math.max(baseHeight, 250)}px`
    }
  }

  return (
    <div className="flex  w-full items-center justify-center p-2 sm:p-4 relative overflow-hidden">
  
      <Card className="w-full max-w-[95%] sm:max-w-[90%] md:max-w-4xl lg:max-w-5xl overflow-hidden border border-border shadow-xl bg-card/95 backdrop-blur-sm bg-transparent">
        <CardHeader className="p-3 sm:p-4 md:p-6 pb-0">
          <div className="flex justify-center mb-2 sm:mb-4 md:mb-6">
            <div className="flex gap-1 sm:gap-2">
              {Array.from({ length: totalSteps }).map((_, index) => (
                <motion.div
                  key={index}
                  className={`h-1.5 sm:h-2 rounded-full transition-colors duration-300 ${
                    index === currentStep ? "bg-primary" : index < currentStep ? "bg-primary/70" : "bg-muted"
                  }`}
                  style={{
                    width: index === currentStep ? (isMobile ? "1.5rem" : "2.5rem") : isMobile ? "0.75rem" : "1.5rem",
                  }}
                  animate={{
                    width: index === currentStep ? (isMobile ? "1.5rem" : "2.5rem") : isMobile ? "0.75rem" : "1.5rem",
                    scale: index === currentStep ? 1.1 : 1,
                  }}
                  transition={{ duration: 0.3 }}
                />
              ))}
            </div>
          </div>
        </CardHeader>

        <CardContent
          className="p-3 sm:p-4 md:p-6 pt-2 sm:pt-3 md:pt-4"
          style={{ marginBottom: isMobile ? "0" : "-50px" }}
        >
          <div
            className="relative overflow-hidden"
            style={{
              height: getContentHeight(),
              minHeight: isMobile ? "auto" : "250px",
            }}
          >
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={currentStep}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={transition}
                className="w-full"
                style={{ position: isMobile ? "relative" : "absolute" }}
              >
                <div className="space-y-3 sm:space-y-4 md:space-y-6">
                  <div className="flex flex-col md:flex-row md:items-center gap-2 sm:gap-3 md:gap-4">
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.2, type: "spring", stiffness: 260, damping: 20 }}
                      className="flex h-12 w-12 md:h-16 md:w-16 rounded-full bg-primary/10 items-center justify-center shrink-0 mx-auto md:mx-0"
                    >
                      {/* Icon rendering */}
                      {steps[currentStep].icon &&
                        React.createElement(steps[currentStep].icon, {
                          className: "h-6 w-6 md:h-8 md:w-8 text-primary",
                        })}
                    </motion.div>
                    <div className="mt-2 md:mt-0">
                      <motion.h2
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2, ...transition }}
                        className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-foreground text-center md:text-left"
                      >
                        {steps[currentStep].title}
                      </motion.h2>
                    </div>
                  </div>

                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3, ...transition }}
                    className="bg-card/50 backdrop-blur-sm rounded-lg p-3 sm:p-4 md:p-6 border border-border/50 shadow-sm"
                  >
                    <p className="text-sm sm:text-base md:text-lg leading-relaxed text-muted-foreground text-justify">
                      {steps[currentStep].description}
                    </p>
                    {/* Tambahan deskripsi untuk layar lg ke atas */}
                    <div className="hidden lg:block mt-4">
                      <p className="text-sm sm:text-base md:text-lg leading-relaxed text-muted-foreground text-justify">
                        {stepDetails[currentStep].extraDescription}
                      </p>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.4, ...transition }}
                    className="flex justify-center mt-2 sm:mt-3 md:mt-4"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-lg sm:text-xl font-bold text-primary">{currentStep + 1}</span>
                      </div>
                      <span className="text-xs sm:text-sm text-muted-foreground">dari {totalSteps} langkah</span>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 md:gap-4 p-3 sm:p-4 md:p-6 pt-0 sm:justify-between">
          {!isFirstStep ? (
            <Button
              variant="outline"
              onClick={handlePrevious}
              className="w-full sm:w-auto gap-2 py-2 sm:py-3 md:py-5 text-sm sm:text-base"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Sebelumnya</span>
            </Button>
          ) : (
            <div className="hidden sm:block" />
          )}

          <Button
            onClick={handleNext}
            className="w-full sm:w-auto gap-2 py-2 sm:py-3 md:py-5 text-sm sm:text-base bg-primary hover:bg-primary/90 transition-all mt-2 sm:mt-0"
          >
            {isLastStep ? (
              <>
                <span>Mulai Belajar</span>
                <Sparkles className="h-4 w-4 animate-pulse" />
              </>
            ) : (
              <>
                <span>Selanjutnya</span>
                <ChevronRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
