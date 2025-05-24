"use client"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import DashboardLayout from "../../Layouts/DashboardLayout"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogFooter, AlertDialogAction } from "@/components/ui/alert-dialog"
import { CheckIcon, ChevronRight, AlertCircle, BookOpen, Zap, Volume2, Info, Shuffle, GraduationCap } from "lucide-react"
import { cn } from "@/lib/utils"
import { Link, usePage } from "@inertiajs/react"
import { Loading } from "../../components/Loading"

// Dummy data - hanya huruf yang sudah dipelajari
const hiraganaLetters = [
  { id: "a", character: "あ", romaji: "a", example: "あめ (ame) - hujan", group: "a" },
  { id: "i", character: "い", romaji: "i", example: "いぬ (inu) - anjing", group: "a" },
  { id: "u", character: "う", romaji: "u", example: "うみ (umi) - laut", group: "a" },
  { id: "e", character: "え", romaji: "e", example: "えき (eki) - stasiun", group: "a" },
  { id: "o", character: "お", romaji: "o", example: "おと (oto) - suara", group: "a" },
  { id: "ka", character: "か", romaji: "ka", example: "かさ (kasa) - payung", group: "ka" },
  { id: "ki", character: "き", romaji: "ki", example: "きた (kita) - utara", group: "ka" },
  { id: "ku", character: "く", romaji: "ku", example: "くに (kuni) - negara", group: "ka" },
  { id: "ko", character: "こ", romaji: "ko", example: "こえ (koe) - suara", group: "ka" },
  { id: "sa", character: "さ", romaji: "sa", example: "さけ (sake) - sake", group: "sa" },
  { id: "shi", character: "し", romaji: "shi", example: "しま (shima) - pulau", group: "sa" },
  { id: "na", character: "な", romaji: "na", example: "なつ (natsu) - musim panas", group: "na" },
  { id: "ni", character: "に", romaji: "ni", example: "にく (niku) - daging", group: "na" },
  { id: "no", character: "の", romaji: "no", example: "のみもの (nomimono) - minuman", group: "na" },
  { id: "ha", character: "は", romaji: "ha", example: "はな (hana) - bunga", group: "ha" },
  { id: "hi", character: "ひ", romaji: "hi", example: "ひと (hito) - orang", group: "ha" },
  { id: "ma", character: "ま", romaji: "ma", example: "まち (machi) - kota", group: "ma" },
  { id: "mi", character: "み", romaji: "mi", example: "みず (mizu) - air", group: "ma" },
  { id: "ya", character: "や", romaji: "ya", example: "やま (yama) - gunung", group: "ya" },
  { id: "yu", character: "ゆ", romaji: "yu", example: "ゆき (yuki) - salju", group: "ya" },
]

const letterGroups = [
  { id: "all", name: "Semua Huruf", count: hiraganaLetters.length },
  { id: "a", name: "Group A", count: hiraganaLetters.filter((l) => l.group === "a").length },
  { id: "ka", name: "Group KA", count: hiraganaLetters.filter((l) => l.group === "ka").length },
  { id: "sa", name: "Group SA", count: hiraganaLetters.filter((l) => l.group === "sa").length },
  { id: "na", name: "Group NA", count: hiraganaLetters.filter((l) => l.group === "na").length },
  { id: "ha", name: "Group HA", count: hiraganaLetters.filter((l) => l.group === "ha").length },
  { id: "ma", name: "Group MA", count: hiraganaLetters.filter((l) => l.group === "ma").length },
  { id: "ya", name: "Group YA", count: hiraganaLetters.filter((l) => l.group === "ya").length },
]

// Letter Card Component
const LetterCard = ({ letter, isSelected, onClick }) => {
  const [showDialog, setShowDialog] = useState(false);

  const playAudio = (e) => {
    e.stopPropagation()
    if (!letter.audio) {
      setShowDialog(true);
      return;
    }
    const audio = new Audio(letter.audio);
    audio.play().catch((e) => console.error("Gagal memutar audio:", e));
  }

  return (
    <>
      <AlertDialog open={showDialog} onOpenChange={setShowDialog} className="z-[500] transition-all duration-300">
        <AlertDialogContent className="z-[500] transition-all duration-300">
          <AlertDialogHeader>
            <AlertDialogTitle>Audio belum tersedia</AlertDialogTitle>
          </AlertDialogHeader>
          <p className="text-sm text-muted-foreground">
            Maaf, audio untuk huruf ini belum tersedia. Silakan coba huruf lainnya.
          </p>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowDialog(false)}>
              Tutup
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <motion.div
        className={cn(
          "relative overflow-hidden rounded-xl transition-all duration-200 cursor-pointer border-2",
          "bg-gradient-to-br from-primary/90 to-chart-1/90 hover:from-primary hover:to-chart-1",
          isSelected ? "ring-2 ring-primary ring-offset-2 scale-105" : "hover:scale-105",
        )}
        onClick={onClick}
        whileTap={{ scale: 0.95 }}
      >
        <div className="p-4 h-full flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-white mb-1">{letter.character}</span>
          <span className="text-xs text-white/80">{letter.romaji}</span>

          <button
            className="absolute top-1 right-1 w-6 h-6 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
            onClick={playAudio}
          >
            <Volume2 className="w-3 h-3 text-white" />
          </button>

          <AnimatePresence>
            {isSelected && (
              <motion.div
                className="absolute bottom-1 right-1 w-6 h-6 rounded-full bg-white flex items-center justify-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
              >
                <CheckIcon className="w-4 h-4 text-primary" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </>
  )
}

// Filter Button Component
const FilterButton = ({ active, children, count, onClick }) => {
  return (
    <motion.button
      className={cn(
        "flex flex-col items-center gap-1 px-4 py-3 rounded-xl text-sm font-medium transition-all border",
        active ? "bg-primary text-white border-primary shadow-lg" : "bg-card hover:bg-secondary border-border",
      )}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
    >
      <span>{children}</span>
      <span className={cn("text-xs", active ? "text-white/80" : "text-muted-foreground")}>{count} huruf</span>
    </motion.button>
  )
}

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

export default function QuizLetterSelect() {
  const [isPageLoading, setIsPageLoading] = useState(true)
  const [selectedLetters, setSelectedLetters] = useState([])
  const [activeFilter, setActiveFilter] = useState("all")
  const [showTip, setShowTip] = useState(true)
  const { letters, letterGroups, jenis, level } = usePage().props
  const requiredLetters = level === 'beginner' ? 10 : level === 'intermediate' ? 15 : 20

  // Simulate initial page load
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoading(false)
    }, 800)
    return () => clearTimeout(timer)
  }, [])

  // Filter letters based on active filter
  const filteredLetters = letters.filter((letter) => {
    if (activeFilter === "all") return true
    return letter.group === activeFilter
  })

  const toggleLetterSelection = (letterId) => {
    setSelectedLetters((prev) => {
      if (prev.includes(letterId)) {
        return prev.filter((id) => id !== letterId)
      } else if (prev.length < requiredLetters) {
        return [...prev, letterId]
      }
      return prev
    })
  }

  

  const selectionProgress = (selectedLetters.length / requiredLetters) * 100

  const autoSelectLetters = () => {
    const availableLetters = filteredLetters.map((letter) => letter.id)
    const randomLetters = [...availableLetters].sort(() => Math.random() - 0.5)
    setSelectedLetters(randomLetters.slice(0, requiredLetters))
  }

  return (
    <DashboardLayout>
      <AnimatePresence>
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
                <Link href={route("huruf")}>
                  <span className="text-violet-400 dark:text-violet-600">
                    Huruf Jepang
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
                <span className="text-primary dark:text-violet-400">
                  /
                </span>
                <Link  href={route("pilih-level-quis",jenis)}>
                  <span className="text-violet-400 dark:text-violet-600">
                    Pilih Level
                  </span>
                </Link>
                <span className="text-primary dark:text-violet-400">
                  /
                </span>
                <Link href={route("pilih-list-huruf-quis", { jenis: jenis, level: level })}>
                  <span className="text-violet-400 dark:text-violet-600">
                    Pilih Huruf
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
                        Pilih Huruf untuk Kuis
                      </h1>
                      <p className="text-slate-500 dark:text-slate-400 text-lg max-w-2xl mx-auto">
                        Pilih tepat {requiredLetters} huruf yang ingin kamu ujikan
                        <br />
                        <span className="text-sm inline-block mt-2 bg-primary/5 px-3 py-1 rounded-full">
                          Pilih huruf yang ingin kamu latih!
                        </span>
                      </p>
                    </div>
                  </motion.div>

                  {/* Tip Alert */}
                  <AnimatePresence>
                    {showTip && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mb-8"
                      >
                        <Alert className="bg-blue-50/80 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
                          <div className="flex items-start gap-3">
                            <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                            <AlertDescription className="text-blue-700 dark:text-blue-300">
                              <p className="font-medium mb-1">Tips Memilih Huruf</p>
                              <ul className="text-sm list-disc pl-5 space-y-1">
                                <li>Pilih huruf dari berbagai group untuk variasi yang lebih baik</li>
                                <li>Klik ikon suara untuk mendengar pengucapan</li>
                                <li>Gunakan "Pilih Otomatis" untuk seleksi acak</li>
                              </ul>
                            </AlertDescription>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="absolute top-2 right-2 h-6 w-6 p-0"
                            onClick={() => setShowTip(false)}
                          >
                            ×
                          </Button>
                        </Alert>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Filters */}
                  <motion.div
                    className="mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold">Filter Berdasarkan Group</h3>
                      <Button variant="outline" size="sm" onClick={autoSelectLetters} className="gap-2">
                        <Shuffle className="w-4 h-4" />
                        Pilih Otomatis
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
                      {letterGroups.map((group) => (
                        <FilterButton
                          key={group.id}
                          active={activeFilter === group.id}
                          count={group.count}
                          onClick={() => setActiveFilter(group.id)}
                        >
                          {group.name}
                        </FilterButton>
                      ))}
                    </div>
                  </motion.div>

                  {/* Letter Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 mb-8">
                    {filteredLetters.map((letter, index) => (
                      <motion.div
                        key={letter.id}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: index * 0.02 }}
                      >
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div>
                                <LetterCard
                                  letter={letter}
                                  isSelected={selectedLetters.includes(letter.id)}
                                  onClick={() => toggleLetterSelection(letter.id)}
                                />
                              </div>
                            </TooltipTrigger>
                            <TooltipContent side="top" className="bg-card border shadow-lg px-4 py-3">
                              <div className="text-center">
                                {letter.example ? (
                                  <p className="font-medium">{letter.example}</p>
                                ) : (
                                  <p className="font-medium text-muted-foreground">
                                    Belum ada contoh penggunaan untuk huruf ini
                                  </p>
                                )}
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </motion.div>
                    ))}
                  </div>

                  {/* Selection Summary */}
                  <motion.div
                    className="bg-card border rounded-xl p-6"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                      <div className="w-full md:w-2/3">
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium flex items-center gap-1">
                            <BookOpen className="w-4 h-4" />
                            Huruf Dipilih: {selectedLetters.length}/{requiredLetters}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {selectedLetters.length === requiredLetters
                              ? "Siap untuk kuis!"
                              : `Pilih ${requiredLetters - selectedLetters.length} lagi`}
                          </span>
                        </div>

                        <Progress value={selectionProgress} className="h-3 rounded-full mb-4" />

                        {/* Selected letters preview */}
                        <div className="flex flex-wrap gap-2">
                          {selectedLetters.map((id) => {
                            const letter = letters.find((l) => l.id === id)
                            return (
                              <motion.div
                                key={id}
                                className="w-16 h-16 rounded-xl bg-primary/10 flex flex-col items-center justify-center text-primary cursor-pointer hover:bg-primary/20 p-1"
                                whileHover={{ scale: 1.1 }}
                                onClick={() => toggleLetterSelection(id)}
                              >
                                <span className="text-2xl font-bold leading-none">{letter?.character}</span>
                                <span className="text-xs text-primary/80">{letter?.romaji}</span>
                              </motion.div>
                            )
                          })}
                          {Array.from({ length: requiredLetters - selectedLetters.length }).map((_, i) => (
                            <div key={i} className="w-16 h-16 rounded-xl border-2 border-dashed border-muted-foreground/30" />
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-col items-center gap-4">
                        <Link href={route("quis")}>
                        <Button
                          size="lg"
                          className="px-8 py-6 text-lg"
                          disabled={selectedLetters.length !== requiredLetters}
                        >
                          Mulai Kuis
                          <Zap size={18} className="ml-2" />
                        </Button>
                        </Link>
                        {selectedLetters.length !== requiredLetters && (
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <AlertCircle size={14} />
                            Pilih tepat {requiredLetters} huruf untuk memulai
                          </p>
                        )}
                      </div>
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
