"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence, useAnimation } from "framer-motion"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { X, Clock, CheckCircle, XCircle, Volume2, VolumeX, Pause, Play, Trophy, Eye, ArrowRight } from "lucide-react"
import DashboardLayout from "../../Layouts/DashboardLayout"
import { Link, router } from "@inertiajs/react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

// Simplified quiz data
const quizData = [
  {
    id: 1,
    question: "Bagaimana pelafalan karakter berikut?",
    character: "あ",
    options: [
      { id: "A", text: "a", isCorrect: true },
      { id: "B", text: "i", isCorrect: false },
      { id: "C", text: "u", isCorrect: false },
      { id: "D", text: "e", isCorrect: false },
    ],
  },
  {
    id: 2,
    question: "Bagaimana pelafalan karakter berikut?",
    character: "か",
    options: [
      { id: "A", text: "sa", isCorrect: false },
      { id: "B", text: "ka", isCorrect: true },
      { id: "C", text: "ta", isCorrect: false },
      { id: "D", text: "na", isCorrect: false },
    ],
  },
  {
    id: 3,
    question: "Bagaimana pelafalan karakter berikut?",
    character: "さ",
    options: [
      { id: "A", text: "ka", isCorrect: false },
      { id: "B", text: "ta", isCorrect: false },
      { id: "C", text: "sa", isCorrect: true },
      { id: "D", text: "na", isCorrect: false },
    ],
  },
  {
    id: 4,
    question: "Bagaimana pelafalan karakter berikut?",
    character: "た",
    options: [
      { id: "A", text: "ta", isCorrect: true },
      { id: "B", text: "ka", isCorrect: false },
      { id: "C", text: "sa", isCorrect: false },
      { id: "D", text: "na", isCorrect: false },
    ],
  },
  {
    id: 5,
    question: "Bagaimana pelafalan karakter berikut?",
    character: "な",
    options: [
      { id: "A", text: "ma", isCorrect: false },
      { id: "B", text: "ha", isCorrect: false },
      { id: "C", text: "na", isCorrect: true },
      { id: "D", text: "ra", isCorrect: false },
    ],
  },
  {
    id: 6,
    question: "Bagaimana pelafalan karakter berikut?",
    character: "は",
    options: [
      { id: "A", text: "ha", isCorrect: true },
      { id: "B", text: "ma", isCorrect: false },
      { id: "C", text: "ya", isCorrect: false },
      { id: "D", text: "ra", isCorrect: false },
    ],
  },
  {
    id: 7,
    question: "Bagaimana pelafalan karakter berikut?",
    character: "ま",
    options: [
      { id: "A", text: "ya", isCorrect: false },
      { id: "B", text: "ma", isCorrect: true },
      { id: "C", text: "ra", isCorrect: false },
      { id: "D", text: "wa", isCorrect: false },
    ],
  },
  {
    id: 8,
    question: "Bagaimana pelafalan karakter berikut?",
    character: "や",
    options: [
      { id: "A", text: "ra", isCorrect: false },
      { id: "B", text: "wa", isCorrect: false },
      { id: "C", text: "ya", isCorrect: true },
      { id: "D", text: "ma", isCorrect: false },
    ],
  },
  {
    id: 9,
    question: "Bagaimana pelafalan karakter berikut?",
    character: "ら",
    options: [
      { id: "A", text: "ra", isCorrect: true },
      { id: "B", text: "wa", isCorrect: false },
      { id: "C", text: "ya", isCorrect: false },
      { id: "D", text: "na", isCorrect: false },
    ],
  },
  {
    id: 10,
    question: "Bagaimana pelafalan karakter berikut?",
    character: "わ",
    options: [
      { id: "A", text: "ya", isCorrect: false },
      { id: "B", text: "ra", isCorrect: false },
      { id: "C", text: "wa", isCorrect: true },
      { id: "D", text: "wo", isCorrect: false },
    ],
  },
]

// Floating particles component
const FloatingParticles = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {Array.from({ length: 15 }, (_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-indigo-300 rounded-full opacity-20"
          initial={{
            x: Math.random() * (typeof window !== "undefined" ? window.innerWidth : 1000),
            y: Math.random() * (typeof window !== "undefined" ? window.innerHeight : 1000),
          }}
          animate={{
            x: Math.random() * (typeof window !== "undefined" ? window.innerWidth : 1000),
            y: Math.random() * (typeof window !== "undefined" ? window.innerHeight : 1000),
          }}
          transition={{
            duration: Math.random() * 20 + 15,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />
      ))}
    </div>
  )
}

// Quiz completion component
const QuizCompletion = ({ isTimeUp, correctAnswers, totalQuestions, onViewReview }) => {
  return (
    <div className="flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-lg w-full"
      >
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/20">
          <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
            {isTimeUp ? (
              <>
                <Clock className="w-20 h-20 text-orange-500 mx-auto mb-6" />
                <h1 className="text-3xl font-bold text-gray-800 mb-4">Waktu Habis!</h1>
                <p className="text-gray-600 mb-6">
                  Waktu kuis telah berakhir. Jangan khawatir, kamu sudah berusaha dengan baik!
                </p>
              </>
            ) : (
              <>
                <Trophy className="w-20 h-20 text-yellow-500 mx-auto mb-6" />
                <h1 className="text-3xl font-bold text-gray-800 mb-4">Kuis Selesai!</h1>
                <p className="text-gray-600 mb-6">Selamat! Kamu telah menyelesaikan semua soal dalam kuis ini.</p>
              </>
            )}

            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 mb-8 border border-indigo-100">
              <div className="text-4xl font-bold text-indigo-600 mb-2">{totalQuestions}</div>
              <p className="text-gray-600 font-medium">Soal Dikerjakan</p>
              <div className="text-lg font-semibold text-purple-600 mt-2">Selesai 100%</div>
            </div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href={route("review-quis")}>
              <Button
                size="lg"
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-4 rounded-xl shadow-lg"
              >
                <Eye className="w-5 h-5 mr-2" />
                Lihat Review Jawaban
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}

export default function QuizHurufPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [answers, setAnswers] = useState([])
  const [timeLeft, setTimeLeft] = useState(120) // 2 minutes
  const [isAnswered, setIsAnswered] = useState(false)
  const [showFeedback, setShowFeedback] = useState(false)
  const [isQuizComplete, setIsQuizComplete] = useState(false)
  const [isTimeUp, setIsTimeUp] = useState(false)
  const [exitDialogOpen, setExitDialogOpen] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [showCompletion, setShowCompletion] = useState(false)

  const controls = useAnimation()
  const characterRef = useRef(null)

  // Timer countdown
  useEffect(() => {
    if (timeLeft > 0 && !isQuizComplete && !isPaused && !showCompletion) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && !showCompletion) {
      setIsTimeUp(true)
      handleQuizComplete()
    }
  }, [timeLeft, isQuizComplete, isPaused, showCompletion])

  // Character animation on question change
  useEffect(() => {
    controls.start({
      scale: [0.8, 1.1, 1],
      rotate: [0, 3, -3, 0],
      transition: { duration: 0.5, ease: "easeOut" },
    })
  }, [currentQuestion, controls])

  // Progress bar color
  const getProgressColor = () => {
    const percentage = (timeLeft / 120) * 100
    if (percentage > 60) return "from-green-400 to-green-600"
    if (percentage > 30) return "from-orange-400 to-orange-600"
    return "from-red-400 to-red-600"
  }

  // Format time display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  // Handle answer selection
  const handleAnswerSelect = (optionId) => {
    if (isAnswered) return

    const selectedOption = quizData[currentQuestion].options.find((opt) => opt.id === optionId)
    setSelectedAnswer(optionId)
    setIsAnswered(true)
    setShowFeedback(true)

    // Save answer
    const newAnswer = {
      questionId: quizData[currentQuestion].id,
      selectedOption: optionId,
      isCorrect: selectedOption.isCorrect,
      question: quizData[currentQuestion].question,
      character: quizData[currentQuestion].character,
      correctAnswer: quizData[currentQuestion].options.find((opt) => opt.isCorrect).text,
      selectedText: selectedOption.text,
    }

    setAnswers((prev) => [...prev, newAnswer])

    // Character shake animation for wrong answer
    if (!selectedOption.isCorrect) {
      controls.start({
        x: [-8, 8, -8, 8, 0],
        transition: { duration: 0.4 },
      })
    }

    // Auto advance after feedback
    setTimeout(() => {
      if (currentQuestion < quizData.length - 1) {
        setCurrentQuestion((prev) => prev + 1)
        setSelectedAnswer(null)
        setIsAnswered(false)
        setShowFeedback(false)
      } else {
        handleQuizComplete()
      }
    }, 1500)
  }

  // Complete quiz
  const handleQuizComplete = () => {
    setIsQuizComplete(true)
    setShowCompletion(true)
  }

  // View review
  const handleViewReview = () => {
    console.log("Navigating to review page with answers:", answers)
    // Here you would navigate to review page
  }

  // Toggle pause
  const togglePause = () => {
    setIsPaused(!isPaused)
  }

  // Exit quiz
  const handleExitQuiz = () => {
    setExitDialogOpen(false)
    console.log("Exiting quiz...")
  }

  // Show completion screen
  if (showCompletion) {
    const correctAnswers = answers.filter((answer) => answer.isCorrect).length
    return (
        <DashboardLayout>
      <QuizCompletion
        isTimeUp={isTimeUp}
        correctAnswers={correctAnswers}
        totalQuestions={quizData.length}
        onViewReview={handleViewReview}
      />
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="text-foreground">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex items-center space-x-2 text-sm bg-gradient-to-r from-background to-muted/50 dark:from-slate-950 dark:to-slate-900/50 p-3 rounded-lg shadow-sm border border-border/50 dark:border-slate-800/50 mb-[50px] w-fit"
          >
            <div className="flex flex-wrap items-center space-x-2">
              <Link href={route("dashboard")}>
                <span className="text-muted-foreground dark:text-slate-400 hover:text-violet-800 dark:hover:text-violet-300 transition-all duration-300">
                  Dashboard
                </span>
              </Link>
              <span className="text-primary dark:text-violet-400">/</span>
              <Link href={route("huruf")}>
                <span className="text-violet-400 dark:text-violet-600">Huruf Jepang</span>
              </Link>
              <span className="text-primary dark:text-violet-400">/</span>
              <span className="text-violet-400 dark:text-violet-600">Kuis</span>
            </div>
            <motion.div
              className="h-1 w-1 rounded-full bg-primary/50 dark:bg-violet-500/50"
              animate={{ scale: [1, 1.5, 1] }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
              }}
            />
          </motion.div>

          <div className="mb-8">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                  Panduan Kuis
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 dark:text-gray-400">
                  <div className="space-y-4">
                    <p>
                      Selamat datang di Kuis Hiragana! Berikut adalah beberapa panduan untuk mengikuti kuis:
                    </p>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Kuis terdiri dari 10 soal pilihan ganda</li>
                      <li>Waktu pengerjaan adalah 2 menit</li>
                      <li>Setiap jawaban benar akan mendapatkan poin</li>
                      <li>Jawaban salah tidak akan mengurangi poin</li>
                      <li>Kamu dapat melihat hasil kuis setelah selesai</li>
                    </ul>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          <div className="bg-transparent dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950 relative overflow-hidden rounded-md">
            <FloatingParticles />

            {/* Header */}
            <div className="bg-transparent dark:bg-slate-900/80 backdrop-blur-sm ">
              <div className="max-w-6xl mx-auto px-4 py-4 pb-5">
                <div className="flex flex-col md:flex-row items-center justify-between">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                      Kuis Hiragana – Beginner
                    </h1>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Soal {currentQuestion + 1} dari {quizData.length}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                  

                    {/* Pause Button */}
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={togglePause} 
                      className="text-gray-600 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-slate-800/50"
                    >
                      {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                    </Button>

                    {/* Exit Button */}
                    <Dialog open={exitDialogOpen} onOpenChange={setExitDialogOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="text-red-600 dark:text-red-400 border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/20">
                          <X className="w-4 h-4 mr-2" />
                          Keluar
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md bg-background dark:bg-slate-900 border-border dark:border-slate-800">
                        <DialogHeader>
                          <DialogTitle className="flex items-center gap-2 text-foreground dark:text-white">
                            <X className="w-5 h-5 text-red-500" />
                            Keluar dari Kuis?
                          </DialogTitle>
                          <DialogDescription className="text-muted-foreground dark:text-slate-400">
                            Progress kamu akan hilang jika keluar sekarang. Yakin ingin keluar?
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="gap-2">
                          <Button variant="outline" onClick={() => setExitDialogOpen(false)}>
                            Batal
                          </Button>
                          <Button variant="destructive" onClick={handleExitQuiz}>
                            Ya, Keluar
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </div>
            </div>

            {/* Timer */}
            <div className="bg-white/30 dark:bg-slate-900/60 ">
              <div className="max-w-6xl mx-auto px-4 py-3 pb-[30px]">
                <div className="flex items-center gap-3">
                  <Clock className={`w-5 h-5 ${timeLeft < 30 ? "text-red-500" : "text-gray-500 dark:text-gray-400"}`} />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Waktu Tersisa</span>
                      <span className={`text-sm font-bold ${timeLeft < 30 ? "text-red-600" : "text-gray-800 dark:text-gray-200"}`}>
                        {formatTime(timeLeft)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                      <motion.div
                        className={`h-2 rounded-full bg-gradient-to-r ${getProgressColor()}`}
                        initial={{ width: "100%" }}
                        animate={{ width: `${(timeLeft / 120) * 100}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="max-w-6xl mx-auto px-4 py-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentQuestion}
                  initial={{ opacity: 0, x: 50, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -50, scale: 0.95 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  {/* Question Area */}
                  <div className="text-center mb-8">
                    <motion.div
                      initial={{ scale: 0.9, y: 20 }}
                      animate={{ scale: 1, y: 0 }}
                      transition={{ delay: 0.1, duration: 0.4 }}
                      className="relative"
                    >
                      <div className="bg-gradient-to-br from-white via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 backdrop-blur-sm rounded-md shadow-md p-8 mb-6 border border-white/30 dark:border-slate-700/30 relative overflow-hidden">
                        {/* Decorative elements */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
                        <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-indigo-200 to-purple-200 dark:from-indigo-800 dark:to-purple-800 rounded-full opacity-20 blur-2xl"></div>
                        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-br from-blue-200 to-indigo-200 dark:from-blue-800 dark:to-indigo-800 rounded-full opacity-20 blur-2xl"></div>

                        <div className="relative z-10">
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="mb-6"
                          >
                            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900 dark:to-purple-900 px-4 py-2 rounded-full border border-indigo-200 dark:border-indigo-800 mb-4">
                              <div className="w-2 h-2 bg-indigo-500 dark:bg-indigo-400 rounded-full animate-pulse"></div>
                              <span className="text-sm font-medium text-indigo-700 dark:text-indigo-300">Soal {currentQuestion + 1}</span>
                            </div>
                          </motion.div>

                          <motion.h2
                            className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-200 mb-6 leading-relaxed"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                          >
                            {quizData[currentQuestion].question}
                          </motion.h2>

                          <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
                            className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 dark:from-indigo-600 dark:to-purple-700 rounded-2xl shadow-xl text-white text-4xl font-bold relative"
                          >
                            {quizData[currentQuestion].character}
                            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl"></div>
                            <motion.div
                              className="absolute inset-0 rounded-2xl"
                              animate={{
                                boxShadow: [
                                  "0 0 0 0 rgba(99, 102, 241, 0.4)",
                                  "0 0 0 10px rgba(99, 102, 241, 0)",
                                  "0 0 0 0 rgba(99, 102, 241, 0)",
                                ],
                              }}
                              transition={{
                                duration: 2,
                                repeat: Number.POSITIVE_INFINITY,
                                ease: "easeInOut",
                              }}
                            />
                          </motion.div>
                        </div>
                      </div>
                    </motion.div>
                  </div>

                  {/* Answer Options */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {quizData[currentQuestion].options.map((option, index) => {
                      const isSelected = selectedAnswer === option.id
                      const isCorrect = option.isCorrect
                      const showResult = showFeedback && isSelected

                      return (
                        <motion.div
                          key={option.id}
                          initial={{ opacity: 0, y: 30, scale: 0.9 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          transition={{ delay: 0.2 + index * 0.1, duration: 0.4, type: "spring" }}
                          whileHover={!isAnswered ? { scale: 1.03, y: -4 } : {}}
                          whileTap={!isAnswered ? { scale: 0.97 } : {}}
                          className="relative group"
                        >
                          <div
                            className={`relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-300 ${
                              isAnswered ? "cursor-not-allowed" : ""
                            }`}
                            onClick={() => handleAnswerSelect(option.id)}
                          >
                            {/* Background gradient */}
                            <div
                              className={`absolute inset-0 transition-all duration-300 ${
                                showResult
                                  ? isCorrect
                                    ? "bg-gradient-to-br from-green-400 via-green-500 to-emerald-600 dark:from-green-500 dark:via-green-600 dark:to-emerald-700"
                                    : "bg-gradient-to-br from-red-400 via-red-500 to-rose-600 dark:from-red-500 dark:via-red-600 dark:to-rose-700"
                                  : isSelected
                                    ? "bg-gradient-to-br from-indigo-400 via-indigo-500 to-purple-600 dark:from-indigo-500 dark:via-indigo-600 dark:to-purple-700"
                                    : "bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-slate-800 dark:via-slate-700 dark:to-slate-600 group-hover:from-indigo-50 group-hover:via-blue-50 group-hover:to-indigo-100 dark:group-hover:from-indigo-900 dark:group-hover:via-blue-900 dark:group-hover:to-indigo-800"
                              }`}
                            />

                            {/* Glass effect overlay */}
                            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent dark:from-white/5" />

                            {/* Border */}
                            <div
                              className={`absolute inset-0 rounded-2xl border-2 transition-all duration-300 ${
                                showResult
                                  ? isCorrect
                                    ? "border-green-300 dark:border-green-500"
                                    : "border-red-300 dark:border-red-500"
                                  : isSelected
                                    ? "border-indigo-300 dark:border-indigo-500"
                                    : "border-gray-200 dark:border-slate-700 group-hover:border-indigo-200 dark:group-hover:border-indigo-500"
                              }`}
                            />

                            {/* Content */}
                            <div className="relative z-10 p-6 flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <motion.div
                                  className={`w-14 h-14 rounded-xl flex items-center justify-center font-bold text-xl shadow-lg transition-all duration-300 ${
                                    showResult
                                      ? isCorrect
                                        ? "bg-white dark:bg-slate-800 text-green-600 dark:text-green-400"
                                        : "bg-white dark:bg-slate-800 text-red-600 dark:text-red-400"
                                      : isSelected
                                        ? "bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400"
                                        : "bg-gradient-to-br from-indigo-500 to-purple-600 dark:from-indigo-600 dark:to-purple-700 text-white group-hover:from-indigo-600 group-hover:to-purple-700 dark:group-hover:from-indigo-700 dark:group-hover:to-purple-800"
                                  }`}
                                  whileHover={!isAnswered ? { scale: 1.1, rotate: 5 } : {}}
                                  whileTap={!isAnswered ? { scale: 0.9 } : {}}
                                >
                                  {option.id}
                                </motion.div>
                                <span
                                  className={`text-2xl font-bold transition-all duration-300 ${
                                    showResult || isSelected ? "text-white" : "text-gray-800 dark:text-gray-200 group-hover:text-indigo-700 dark:group-hover:text-indigo-300"
                                  }`}
                                >
                                  {option.text}
                                </span>
                              </div>

                              {showResult && (
                                <motion.div
                                  initial={{ scale: 0, rotate: -90 }}
                                  animate={{ scale: 1, rotate: 0 }}
                                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                                  className="bg-white dark:bg-slate-800 rounded-full p-2"
                                >
                                  {isCorrect ? (
                                    <CheckCircle className="w-6 h-6 text-green-500 dark:text-green-400" />
                                  ) : (
                                    <XCircle className="w-6 h-6 text-red-500 dark:text-red-400" />
                                  )}
                                </motion.div>
                              )}
                            </div>

                            {/* Hover shimmer effect */}
                            {!isAnswered && (
                              <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent dark:via-white/5"
                                initial={{ x: "-100%" }}
                                whileHover={{ x: "100%" }}
                                transition={{ duration: 0.6 }}
                              />
                            )}
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>

                  {/* Simple Feedback Message */}
                  <AnimatePresence>
                    {showFeedback && (
                      <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.9 }}
                        className="text-center mt-8"
                      >
                        <div
                          className={`inline-flex items-center gap-3 px-6 py-4 rounded-2xl text-lg font-semibold shadow-lg ${
                            quizData[currentQuestion].options.find((opt) => opt.id === selectedAnswer)?.isCorrect
                              ? "bg-gradient-to-r from-green-100 to-green-200 dark:from-green-900/50 dark:to-green-800/50 text-green-800 dark:text-green-300 border border-green-300 dark:border-green-700"
                              : "bg-gradient-to-r from-red-100 to-red-200 dark:from-red-900/50 dark:to-red-800/50 text-red-800 dark:text-red-300 border border-red-300 dark:border-red-700"
                          }`}
                        >
                          {quizData[currentQuestion].options.find((opt) => opt.id === selectedAnswer)?.isCorrect ? (
                            <>
                              <CheckCircle className="w-6 h-6" />
                              Benar!
                            </>
                          ) : (
                            <>
                              <XCircle className="w-6 h-6" />
                              Salah
                            </>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Progress Indicator */}
            <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-30">
              <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="bg-gradient-to-r from-white/90 to-white/80 dark:from-slate-900/90 dark:to-slate-800/80 backdrop-blur-md rounded-2xl shadow-2xl px-6 py-4 border border-white/30 dark:border-slate-700/30 relative overflow-hidden"
              >
                {/* Background decoration */}
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 dark:from-indigo-500/10 dark:to-purple-500/10"></div>

                <div className="relative z-10 flex items-center gap-4">
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Progress:</span>
                  <div className="flex items-center gap-2">
                    {Array.from({ length: quizData.length }, (_, index) => (
                      <motion.div
                        key={index}
                        className={`relative transition-all duration-300 ${
                          index < currentQuestion ? "w-4 h-4" : index === currentQuestion ? "w-5 h-5" : "w-3 h-3"
                        }`}
                        whileHover={{ scale: 1.3 }}
                      >
                        <div
                          className={`w-full h-full rounded-full transition-all duration-300 ${
                            index < currentQuestion
                              ? "bg-gradient-to-br from-green-400 to-emerald-500 dark:from-green-500 dark:to-emerald-600 shadow-lg shadow-green-200 dark:shadow-green-900/50"
                              : index === currentQuestion
                                ? "bg-gradient-to-br from-indigo-500 to-purple-600 dark:from-indigo-600 dark:to-purple-700 shadow-lg shadow-indigo-200 dark:shadow-indigo-900/50"
                                : "bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600"
                          }`}
                        />
                        {index === currentQuestion && (
                          <motion.div
                            className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 dark:from-indigo-500 dark:to-purple-600"
                            animate={{
                              scale: [1, 1.2, 1],
                              opacity: [0.5, 0.8, 0.5],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Number.POSITIVE_INFINITY,
                              ease: "easeInOut",
                            }}
                          />
                        )}
                      </motion.div>
                    ))}
                  </div>
                  <div className="bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/50 dark:to-purple-900/50 px-3 py-1 rounded-full">
                    <span className="text-sm font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
                      {currentQuestion + 1}/{quizData.length}
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
