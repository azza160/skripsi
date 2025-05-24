"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import DashboardLayout from "../../Layouts/DashboardLayout"
import { CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  ChevronRight,
  ChevronLeft,
  Star,
  Cherry,
  CherryIcon as Sakura,
  Users,
  Trophy,
  Target,
  BookOpen,
  GraduationCap,
  ArrowRight,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Link,usePage, router } from "@inertiajs/react"
import { Loading } from "../../components/Loading"

// Content Loading Component
const ContentLoading = () => {
    return (
        <div className="flex items-center justify-center min-h-[300px]">
            <div className="relative w-16 h-16">
                <motion.div
                    className="absolute inset-0 border-4 border-[hsl(252,94%,56%)] rounded-full"
                    animate={{
                        rotate: 360,
                    }}
                    transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                />
                <motion.div
                    className="absolute inset-2 border-4 border-[hsl(252,94%,70%)] rounded-full"
                    animate={{
                        rotate: -360,
                    }}
                    transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                />
            </div>
            <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="ml-4 text-gray-600 font-medium"
            >
                Memuat konten...
            </motion.p>
        </div>
    );
};





export default function QuizStartPage() {
  const [isPageLoading, setIsPageLoading] = useState(true)
  const [isButtonLoading, setIsButtonLoading] = useState(false)
  const [selectedMode, setSelectedMode] = useState(null)

  // Simulate initial page load
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoading(false)
    }, 800)
    return () => clearTimeout(timer)
  }, [])

  const {jumlahHiragana, jumlahKatakana} = usePage().props;
// Dummy data
const quizModes = [
  {
    id: "hiragana",
    name: "Hiragana",
    description:
      "Pelajari huruf dasar Jepang yang digunakan untuk kata-kata asli Jepang. Mulai dari yang paling dasar dan tingkatkan kemampuanmu!",
    progress: jumlahHiragana,
    total: 113,
    color: "from-pink-500 to-purple-600",
    icon: Cherry,
    examples: ["あ", "い", "う", "え", "お"],
  },
  {
    id: "katakana",
    name: "Katakana",
    description:
      "Kuasai huruf yang digunakan untuk kata serapan dan nama asing. Penting untuk membaca menu, nama tempat, dan teknologi!",
    progress: jumlahKatakana,
    total: 113,
    color: "from-blue-500 to-cyan-600",
    icon: Sakura,
    examples: ["ア", "イ", "ウ", "エ", "オ"],
  },
]

const handleStartQuiz = (jenis) => {
  router.get(route('pilih-level-quis', jenis));
};


  return (
    <DashboardLayout>
      <AnimatePresence>
        {isButtonLoading && <Loading />}
        
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
                <span className="text-primary dark:text-violet-400">
                  /
                </span>
                <Link href={route("pilih-huruf-quis")}>
                  <span className="text-violet-400 dark:text-violet-600">
                    Quiz Huruf
                  </span>
                </Link>

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

            <AnimatePresence mode="wait">
              {isPageLoading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ContentLoading />
                </motion.div>
              ) : (
                <motion.div
                  key="content"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="mb-12 text-center relative"
                  >
                    <div className="py-8 px-4 relative z-0 bg-gradient-to-r from-violet-500/20 via-purple-500/10 to-pink-500/10 dark:from-violet-800/30 dark:via-purple-800/20 dark:to-pink-800/20 rounded-lg">
                      <div className="inline-block mb-4 bg-violet-500/20 p-2 rounded-full">
                        <GraduationCap className="h-8 w-8 text-slate-900 dark:text-slate-200" />
                      </div>
                      <h1 className="text-4xl md:text-5xl font-bold mb-3 text-slate-900 dark:text-slate-200 capitalize">
                        Pilih Mode Quiz Huruf
                      </h1>
                      <p className="text-slate-500 dark:text-slate-400 text-lg max-w-2xl mx-auto">
                        Pilih jenis huruf Jepang yang ingin kamu latih, mulai dari
                        <span className="relative inline-block mx-1 px-2 bg-primary/10 dark:bg-primary/30 text-primary dark:text-violet-300 rounded-md">
                          Hiragana
                        </span>
                        hingga
                        <span className="relative inline-block mx-1 px-2 bg-primary/10 dark:bg-primary/30 text-primary dark:text-violet-300 rounded-md">
                          Katakana
                        </span>
                        , dan mulai tantang dirimu sekarang!
                        <br />
                        <span className="text-sm inline-block mt-2 bg-primary/5 px-3 py-1 rounded-full">
                          Ayo pilih mode quiz yang ingin kamu coba!
                        </span>
                      </p>
                    </div>
                  </motion.div>

                  {/* Quiz Mode Cards */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
                    {quizModes.map((mode, index) => (
                      <motion.div
                        key={mode.id}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="group"
                      >
                        <div
                          className={cn(
                            "relative overflow-hidden rounded-2xl bg-gradient-to-br transition-all duration-300",
                            mode.color,
                            "hover:scale-[1.02] hover:shadow-xl",
                          )}
                        >
                          <CardContent className="p-8 h-full">
                            <div className="flex flex-col h-full">
                              <div className="flex items-center gap-3 mb-4">
                                <mode.icon className="w-8 h-8 text-white" />
                                <h2 className="text-3xl font-bold text-white">{mode.name}</h2>
                              </div>

                              <p className="text-white/90 text-lg mb-6">{mode.description}</p>

                              {/* Example characters */}
                              <div className="flex justify-center gap-3 my-6">
                                {mode.examples.map((char, i) => (
                                  <div
                                    key={i}
                                    className="w-12 h-12 md:w-16 md:h-16 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center"
                                  >
                                    <span className="text-2xl md:text-3xl font-bold text-white">{char}</span>
                                  </div>
                                ))}
                              </div>

                              {/* Progress */}
                              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-6">
                                <div className="flex justify-between text-white mb-2">
                                  <span>Progress Belajar</span>
                                  <span className="font-medium">
                                    {mode.progress}/{mode.total} huruf
                                  </span>
                                </div>
                                <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-white transition-all duration-1000"
                                    style={{ width: `${(mode.progress / mode.total) * 100}%` }}
                                  />
                                </div>
                              </div>

                              {/* Start Button */}
                              <Button
                                className="w-full bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-sm"
                                onClick={() => handleStartQuiz(mode.id)}
                              >
                                Mulai Quiz
                                <ArrowRight size={20} className="ml-2" />
                              </Button>
                            </div>
                          </CardContent>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Motivational Footer */}
                  <motion.div
                    className="text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    <div className="bg-gradient-to-r from-primary/10 via-chart-2/10 to-chart-1/10 rounded-xl p-6 border">
                      <p className="text-lg font-medium text-foreground">
                        ✨ Semakin sering berlatih, semakin dekat dengan fluent! ✨
                      </p>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </AnimatePresence>
    </DashboardLayout>
  )
}
