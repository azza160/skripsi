"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"

const slides = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1528164344705-47542687000d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    title: "日本語を学ぼう",
    subtitle: "Belajar Hiragana dan Katakana",
    description: "Mulai perjalanan bahasa Jepang Anda dengan mempelajari dasar-dasar Hiragana dan Katakana.",
    characters: ["あ", "い", "う", "え", "お"],
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1492571350019-22de08371fd3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    title: "語彙を増やす",
    subtitle: "Perbanyak Kosakata",
    description: "Tingkatkan kemampuan bahasa Jepang Anda dengan mempelajari kosakata baru setiap hari.",
    characters: ["漢", "字", "学", "習", "中"],
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1526481280693-3bfa7568e0f3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    title: "会話力を高める",
    subtitle: "Tingkatkan Kemampuan Percakapan",
    description: "Praktikkan percakapan bahasa Jepang dan tingkatkan kemampuan komunikasi Anda.",
    characters: ["話", "聞", "読", "書", "く"],
  },
]

export function ImageSlider() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1))
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1))
  }

  useEffect(() => {
    if (isAutoPlaying) {
      const interval = setInterval(() => {
        nextSlide()
      }, 5000)

      return () => clearInterval(interval)
    }
  }, [currentSlide, isAutoPlaying])

  return (
    <div className="relative h-full w-full">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#f8d0c9] to-[#ffb6c1]">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${slides[currentSlide].image})` }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-[hsl(252,94%,56%)]/50 to-transparent mix-blend-multiply" />
            </div>

            <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-white">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="text-center backdrop-blur-sm bg-white/10 p-8 rounded-2xl shadow-2xl border border-white/20 max-w-md"
              >
                <h3 className="text-3xl font-bold mb-2">{slides[currentSlide].title}</h3>
                <h4 className="text-xl font-semibold mb-4">{slides[currentSlide].subtitle}</h4>
                <p className="text-lg mb-6">{slides[currentSlide].description}</p>
                <div className="flex justify-center space-x-2">
                  {slides[currentSlide].characters.map((char, i) => (
                    <motion.div
                      key={char}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.4 + i * 0.1, duration: 0.5 }}
                      className="w-12 h-12 flex items-center justify-center bg-white/20 rounded-lg backdrop-blur-md border border-white/30 text-xl font-bold"
                    >
                      {char}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Slider controls */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center items-center gap-4 z-10">
        <button
          onClick={prevSlide}
          className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30 hover:bg-white/30 transition-colors"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                currentSlide === index ? "bg-white w-8" : "bg-white/50 hover:bg-white/70"
              }`}
              onMouseEnter={() => setIsAutoPlaying(false)}
              onMouseLeave={() => setIsAutoPlaying(true)}
            />
          ))}
        </div>

        <button
          onClick={nextSlide}
          className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30 hover:bg-white/30 transition-colors"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}
