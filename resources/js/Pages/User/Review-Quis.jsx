"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { CheckCircle, XCircle, Trophy, Star, Home, Target, Clock, Zap, Award, Eye, Brain, Calendar } from "lucide-react"
import { Link } from "@inertiajs/react"
import DashboardLayout from "../../Layouts/DashboardLayout"

// Simplified quiz results data
const quizResults = {
  totalQuestions: 10,
  correctAnswers: 8,
  timeSpent: 75,
  percentage: 80,
  totalScore: 950,
  answers: [
    {
      id: 1,
      question: "Bagaimana pelafalan karakter berikut: あ",
      character: "あ",
      userAnswer: "a",
      correctAnswer: "a",
      isCorrect: true,
      options: ["a", "i", "u", "e"],
      expGained: 100,
    },
    {
      id: 2,
      question: "Bagaimana pelafalan karakter berikut: か",
      character: "か",
      userAnswer: "ka",
      correctAnswer: "ka",
      isCorrect: true,
      options: ["sa", "ka", "ta", "na"],
      expGained: 100,
    },
    {
      id: 3,
      question: "Bagaimana pelafalan karakter berikut: さ",
      character: "さ",
      userAnswer: "ta",
      correctAnswer: "sa",
      isCorrect: false,
      options: ["ka", "ta", "sa", "na"],
      expGained: 25,
    },
    {
      id: 4,
      question: "Bagaimana pelafalan karakter berikut: た",
      character: "た",
      userAnswer: "ta",
      correctAnswer: "ta",
      isCorrect: true,
      options: ["ta", "ka", "sa", "na"],
      expGained: 100,
    },
    {
      id: 5,
      question: "Bagaimana pelafalan karakter berikut: な",
      character: "な",
      userAnswer: "ma",
      correctAnswer: "na",
      isCorrect: false,
      options: ["ma", "ha", "na", "ra"],
      expGained: 25,
    },
    {
      id: 6,
      question: "Bagaimana pelafalan karakter berikut: は",
      character: "は",
      userAnswer: "ha",
      correctAnswer: "ha",
      isCorrect: true,
      options: ["ha", "ma", "ya", "ra"],
      expGained: 100,
    },
    {
      id: 7,
      question: "Bagaimana pelafalan karakter berikut: ま",
      character: "ま",
      userAnswer: "ma",
      correctAnswer: "ma",
      isCorrect: true,
      options: ["ya", "ma", "ra", "wa"],
      expGained: 100,
    },
    {
      id: 8,
      question: "Bagaimana pelafalan karakter berikut: や",
      character: "や",
      userAnswer: "ya",
      correctAnswer: "ya",
      isCorrect: true,
      options: ["ra", "wa", "ya", "ma"],
      expGained: 100,
    },
    {
      id: 9,
      question: "Bagaimana pelafalan karakter berikut: ら",
      character: "ら",
      userAnswer: "ra",
      correctAnswer: "ra",
      isCorrect: true,
      options: ["ra", "wa", "ya", "na"],
      expGained: 100,
    },
    {
      id: 10,
      question: "Bagaimana pelafalan karakter berikut: わ",
      character: "わ",
      userAnswer: "ra",
      correctAnswer: "wa",
      isCorrect: false,
      options: ["ya", "ra", "wa", "wo"],
      expGained: 25,
    },
  ],
}

// Achievement particles
const AchievementParticles = ({ show }) => {
  if (!show) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {Array.from({ length: 25 }, (_, i) => (
        <motion.div
          key={i}
          className="absolute"
          initial={{
            x: typeof window !== "undefined" ? window.innerWidth / 2 : 500,
            y: typeof window !== "undefined" ? window.innerHeight / 2 : 500,
            scale: 0,
            rotate: 0,
          }}
          animate={{
            x: Math.random() * (typeof window !== "undefined" ? window.innerWidth : 1000),
            y: Math.random() * (typeof window !== "undefined" ? window.innerHeight : 1000),
            scale: [0, 1, 0],
            rotate: 360,
          }}
          transition={{
            duration: 2.5,
            delay: Math.random() * 1,
            ease: "easeOut",
          }}
        >
          {i % 2 === 0 ? <Star className="w-4 h-4 text-yellow-400" /> : <Trophy className="w-4 h-4 text-yellow-500" />}
        </motion.div>
      ))}
    </div>
  )
}

export default function QuizReviewPage() {
  const [displayScore, setDisplayScore] = useState(0)
  const [showConfetti, setShowConfetti] = useState(false)
  const [expandedItems, setExpandedItems] = useState([])
  const [currentView, setCurrentView] = useState("overview") // overview, detailed

  // Animated score counter
  useEffect(() => {
    const timer = setTimeout(() => {
      if (displayScore < quizResults.correctAnswers) {
        setDisplayScore((prev) => prev + 1)
      }
    }, 150)

    return () => clearTimeout(timer)
  }, [displayScore])

  // Trigger celebration for high scores
  useEffect(() => {
    if (displayScore === quizResults.correctAnswers && quizResults.percentage >= 80) {
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 3000)
    }
  }, [displayScore])

  // Format time
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.round(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  // Get performance data
  const getPerformanceMessage = () => {
    if (quizResults.percentage >= 90)
      return {
        text: "Sempurna! 🎉",
        color: "text-green-600",
        bg: "bg-gradient-to-r from-green-50 to-emerald-50",
        icon: Trophy,
      }
    if (quizResults.percentage >= 80)
      return {
        text: "Luar Biasa! 👏",
        color: "text-blue-600",
        bg: "bg-gradient-to-r from-blue-50 to-indigo-50",
        icon: Star,
      }
    if (quizResults.percentage >= 70)
      return {
        text: "Bagus! 👍",
        color: "text-orange-600",
        bg: "bg-gradient-to-r from-orange-50 to-yellow-50",
        icon: Target,
      }
    return {
      text: "Terus Berlatih! 💪",
      color: "text-red-600",
      bg: "bg-gradient-to-r from-red-50 to-pink-50",
      icon: Award,
    }
  }

  const performance = getPerformanceMessage()
  const PerformanceIcon = performance.icon

  // Handle back to quiz
  const handleBackToQuiz = () => {
    console.log("Navigating back to quiz menu...")
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
              <span className="text-violet-400 dark:text-violet-600">Review Kuis</span>
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

          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <div className="bg-card/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 mb-6 border border-border/50">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 150 }}
                className="mb-6"
              >
                <PerformanceIcon className="w-20 h-20 text-primary mx-auto" />
              </motion.div>

              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent mb-4">
                Hasil Kuis Kamu 🎉
              </h1>

              {/* Main Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-8">
                {/* Score */}
                <div className="text-center">
                  <motion.div
                    className="text-5xl md:text-6xl font-bold text-primary mb-2"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5, type: "spring" }}
                  >
                    <motion.span
                      key={displayScore}
                      initial={{ scale: 1.3, color: "hsl(var(--primary))" }}
                      animate={{ scale: 1, color: "hsl(var(--primary))" }}
                      transition={{ duration: 0.3 }}
                    >
                      {displayScore}
                    </motion.span>
                    <span className="text-muted-foreground text-3xl">/{quizResults.totalQuestions}</span>
                  </motion.div>
                  <p className="text-sm text-muted-foreground font-medium">Jawaban Benar</p>
                </div>

                {/* Percentage */}
                <div className="text-center">
                  <div className="text-4xl md:text-5xl font-bold text-primary mb-2">{quizResults.percentage}%</div>
                  <p className="text-sm text-muted-foreground font-medium">Akurasi</p>
                </div>

                {/* Time */}
                <div className="text-center col-span-2 md:col-span-1">
                  <div className="text-3xl md:text-4xl font-bold text-primary mb-2 flex items-center justify-center gap-2">
                    <Clock className="w-8 h-8" />
                    {formatTime(quizResults.timeSpent)}
                  </div>
                  <p className="text-sm text-muted-foreground font-medium">Total Waktu</p>
                </div>
              </div>

              {/* Performance Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 }}
                className={`inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-card ${performance.color} font-bold text-lg shadow-lg border border-border/50`}
              >
                <PerformanceIcon className="w-6 h-6" />
                {performance.text}
              </motion.div>
            </div>
          </motion.div>

          {/* Navigation Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex justify-center mb-8"
          >
            <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-2 shadow-lg border border-border/50">
              {[
                { id: "overview", label: "Ringkasan", icon: Eye },
                { id: "detailed", label: "Detail Soal", icon: Brain },
              ].map((tab) => (
                <Button
                  key={tab.id}
                  variant={currentView === tab.id ? "default" : "ghost"}
                  onClick={() => setCurrentView(tab.id)}
                  className={`mx-1 ${currentView === tab.id ? "bg-primary text-primary-foreground shadow-lg" : "text-muted-foreground"}`}
                >
                  <tab.icon className="w-4 h-4 mr-2" />
                  {tab.label}
                </Button>
              ))}
            </div>
          </motion.div>

          {/* Content based on current view */}
          <AnimatePresence mode="wait">
            {currentView === "overview" && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.4 }}
                className="space-y-6"
              >
                {/* Quick Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    whileHover={{ scale: 1.02, y: -2 }}
                  >
                    <Card className="relative overflow-hidden bg-card border-border/50 shadow-xl">
                      <div className="absolute inset-0 bg-primary/5"></div>
                      <div className="absolute top-0 left-0 w-full h-1 bg-primary"></div>
                      <CardContent className="p-6 text-center relative z-10">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.4, type: "spring" }}
                          className="bg-primary w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg"
                        >
                          <CheckCircle className="w-8 h-8 text-primary-foreground" />
                        </motion.div>
                        <div className="text-4xl font-bold text-primary mb-2">
                          {quizResults.answers.filter((a) => a.isCorrect).length}
                        </div>
                        <p className="text-sm text-muted-foreground font-semibold mb-3">Jawaban Benar</p>
                        <div className="bg-primary/10 rounded-xl p-2">
                          <Badge variant="outline" className="text-xs border-primary text-primary bg-card/50">
                            +{quizResults.answers.filter((a) => a.isCorrect).reduce((sum, a) => sum + a.expGained, 0)} EXP
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    whileHover={{ scale: 1.02, y: -2 }}
                  >
                    <Card className="relative overflow-hidden bg-card border-border/50 shadow-xl">
                      <div className="absolute inset-0 bg-primary/5"></div>
                      <div className="absolute top-0 left-0 w-full h-1 bg-primary"></div>
                      <CardContent className="p-6 text-center relative z-10">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.5, type: "spring" }}
                          className="bg-primary w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg"
                        >
                          <XCircle className="w-8 h-8 text-primary-foreground" />
                        </motion.div>
                        <div className="text-4xl font-bold text-primary mb-2">
                          {quizResults.answers.filter((a) => !a.isCorrect).length}
                        </div>
                        <p className="text-sm text-muted-foreground font-semibold mb-3">Jawaban Salah</p>
                        <div className="bg-primary/10 rounded-xl p-2">
                          <Badge variant="outline" className="text-xs border-primary text-primary bg-card/50">
                            +{quizResults.answers.filter((a) => !a.isCorrect).reduce((sum, a) => sum + a.expGained, 0)}{" "}
                            EXP
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    whileHover={{ scale: 1.02, y: -2 }}
                  >
                    <Card className="relative overflow-hidden bg-card border-border/50 shadow-xl">
                      <div className="absolute inset-0 bg-primary/5"></div>
                      <div className="absolute top-0 left-0 w-full h-1 bg-primary"></div>
                      <CardContent className="p-6 text-center relative z-10">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.6, type: "spring" }}
                          className="bg-primary w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg"
                        >
                          <Zap className="w-8 h-8 text-primary-foreground" />
                        </motion.div>
                        <div className="text-4xl font-bold text-primary mb-2">
                          {quizResults.answers.reduce((sum, a) => sum + a.expGained, 0)}
                        </div>
                        <p className="text-sm text-muted-foreground font-semibold mb-3">Total EXP</p>
                        <div className="bg-primary/10 rounded-xl p-2">
                          <Badge variant="outline" className="text-xs border-primary text-primary bg-card/50">
                            Experience Points
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>
              </motion.div>
            )}

            {currentView === "detailed" && (
              <motion.div
                key="detailed"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.4 }}
              >
                <Card className="bg-card backdrop-blur-sm shadow-2xl border-border/50 relative overflow-hidden">
                  <div className="absolute inset-0 bg-primary/5"></div>
                  <div className="absolute top-0 left-0 w-full h-1 bg-primary"></div>
                  <CardHeader className="relative z-10">
                    <CardTitle className="text-2xl font-bold text-foreground flex items-center gap-3">
                      <div className="bg-primary p-2 rounded-xl shadow-lg">
                        <Brain className="w-7 h-7 text-primary-foreground" />
                      </div>
                      Review Detail Jawaban
                    </CardTitle>
                    <p className="text-muted-foreground">Analisis mendalam untuk setiap soal yang telah dijawab</p>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    <Accordion type="multiple" value={expandedItems} onValueChange={setExpandedItems}>
                      {quizResults.answers.map((answer, index) => (
                        <AccordionItem key={answer.id} value={`item-${answer.id}`} className="border-b border-gray-200">
                          <AccordionTrigger className="hover:no-underline py-6">
                            <div className="flex items-center justify-between w-full pr-4">
                              <div className="flex items-center gap-4">
                                <div
                                  className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold shadow-lg ${
                                    answer.isCorrect
                                      ? "bg-gradient-to-br from-green-400 to-green-600 text-white"
                                      : "bg-gradient-to-br from-red-400 to-red-600 text-white"
                                  }`}
                                >
                                  {index + 1}
                                </div>
                                <div className="text-left">
                                  <div className="font-bold text-gray-800 text-lg mb-1">
                                    Karakter: <span className="text-3xl text-indigo-600 ml-2">{answer.character}</span>
                                  </div>
                                  <div className="text-sm text-gray-600 mb-2">{answer.question}</div>
                                  <div className="flex items-center gap-2">
                                    <Badge className="text-xs bg-yellow-100 text-yellow-700">
                                      <Zap className="w-3 h-3 mr-1" />+{answer.expGained} EXP
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                {answer.isCorrect ? (
                                  <Badge className="bg-green-100 text-green-700 border-green-300">
                                    <CheckCircle className="w-4 h-4 mr-1" />
                                    Benar
                                  </Badge>
                                ) : (
                                  <Badge className="bg-red-100 text-red-700 border-red-300">
                                    <XCircle className="w-4 h-4 mr-1" />
                                    Salah
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3 }}
                              className="pt-4 pl-16 pb-6"
                            >
                              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                  <div>
                                    <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                      <Eye className="w-4 h-4" />
                                      Jawaban Kamu:
                                    </h4>
                                    <div
                                      className={`p-4 rounded-xl border-2 ${
                                        answer.isCorrect
                                          ? "border-green-300 bg-gradient-to-r from-green-50 to-green-100 text-green-800"
                                          : "border-red-300 bg-gradient-to-r from-red-50 to-red-100 text-red-800"
                                      }`}
                                    >
                                      <div className="flex items-center justify-between">
                                        <span className="font-bold text-xl">{answer.userAnswer}</span>
                                        {answer.isCorrect ? (
                                          <CheckCircle className="w-6 h-6" />
                                        ) : (
                                          <XCircle className="w-6 h-6" />
                                        )}
                                      </div>
                                      <div className="flex items-center gap-2 mt-2">
                                        <Zap className="w-4 h-4" />
                                        <span className="text-sm font-medium">+{answer.expGained} EXP diperoleh</span>
                                      </div>
                                    </div>
                                  </div>

                                  {!answer.isCorrect && (
                                    <div>
                                      <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                        <CheckCircle className="w-4 h-4 text-green-600" />
                                        Jawaban Benar:
                                      </h4>
                                      <div className="p-4 rounded-xl border-2 border-green-300 bg-gradient-to-r from-green-50 to-green-100 text-green-800">
                                        <div className="flex items-center justify-between">
                                          <span className="font-bold text-xl">{answer.correctAnswer}</span>
                                          <CheckCircle className="w-6 h-6" />
                                        </div>
                                        <p className="text-sm mt-2 opacity-80">
                                          Jawaban yang tepat untuk karakter {answer.character}
                                        </p>
                                      </div>
                                    </div>
                                  )}
                                </div>

                                <div className="space-y-4">
                                  <div>
                                    <h4 className="font-semibold text-gray-700 mb-3">Semua Pilihan:</h4>
                                    <div className="grid grid-cols-2 gap-2">
                                      {answer.options.map((option, optIndex) => (
                                        <div
                                          key={optIndex}
                                          className={`p-3 rounded-lg border text-center font-medium ${
                                            option === answer.correctAnswer
                                              ? "border-green-400 bg-green-50 text-green-700"
                                              : option === answer.userAnswer && !answer.isCorrect
                                                ? "border-red-400 bg-red-50 text-red-700"
                                                : "border-gray-300 bg-gray-50 text-gray-600"
                                          }`}
                                        >
                                          {option}
                                          {option === answer.correctAnswer && (
                                            <CheckCircle className="w-4 h-4 inline ml-2" />
                                          )}
                                          {option === answer.userAnswer && !answer.isCorrect && (
                                            <XCircle className="w-4 h-4 inline ml-2" />
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action Button */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="flex justify-center mt-12"
          >
            <Button
              onClick={handleBackToQuiz}
              size="lg"
              className="flex items-center gap-2 hover:scale-105 transition-all duration-300 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg px-8 py-4 text-lg"
            >
              <Home className="w-5 h-5" />
              Kembali ke Menu Utama
            </Button>
          </motion.div>

          {/* Motivational Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="text-center mt-8"
          >
            <Card className="bg-card border-border/50 shadow-xl">
              <CardContent className="p-8">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <Star className="w-6 h-6 text-primary" />
                  <h3 className="text-xl font-bold text-foreground">
                    {quizResults.percentage >= 80
                      ? "Kerja bagus! Kamu sudah menguasai dasar-dasar hiragana!"
                      : "Jangan menyerah! Setiap latihan membawamu lebih dekat ke tujuan!"}
                  </h3>
                  <Star className="w-6 h-6 text-primary" />
                </div>
                <p className="text-muted-foreground mb-4">
                  Konsistensi adalah kunci untuk menguasai bahasa Jepang. Terus berlatih dan kamu akan melihat kemajuan
                  yang luar biasa!
                </p>
                <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>Target harian: 15 menit</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Target className="w-4 h-4" />
                    <span>Terus berlatih untuk hasil yang lebih baik</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  )
}
