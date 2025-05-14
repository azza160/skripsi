"use client"

import { DialogTrigger } from "@/components/ui/dialog"

import { useState, useEffect, useRef } from "react"
import { Head } from '@inertiajs/react';
import { Link } from '@inertiajs/react';
import { useLayout } from "../../Layouts/DashboardLayout"
import { motion, AnimatePresence, useInView } from "framer-motion"
import {
  Search,
  Star,
  StarOff,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  Lightbulb,
  BookOpenCheck,
  FlipHorizontal,
  Check,
  X,
  Volume2,
  Sparkles,
  Filter,
  Award,
  Loader2,
  MessageSquareQuote,
  Flame,
  Clock,
  Zap,
  Repeat,
  BarChart3,
  BookOpen,
  GraduationCap,
  Target,
  Brain,
  Trophy,
  BookMarked,
  Bookmark,
  Eye,
  EyeOff,
} from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import Dashboard from "@/Layouts/DashboardLayout"

// Sample data for demonstration
const sampleVocabulary = [
  {
    id: 1,
    kanji: "挨拶",
    furigana: "あいさつ",
    romaji: "Aisatsu",
    meaning: "Salam",
    isFavorite: true,
    isLearned: true,
    category: "umum",
    example: "朝の挨拶をしました。",
    exampleFurigana: "あさの あいさつを しました。",
    exampleRomaji: "Asa no aisatsu o shimashita.",
    exampleMeaning: "Saya mengucapkan salam pagi.",
    level: "N5",
    lastStudied: "2 jam yang lalu",
  },
  {
    id: 2,
    kanji: "おはよう",
    furigana: "おはよう",
    romaji: "Ohayou",
    meaning: "Selamat pagi",
    isFavorite: false,
    isLearned: true,
    category: "salam",
    example: "おはよう、元気？",
    exampleFurigana: "おはよう、げんき？",
    exampleRomaji: "Ohayou, genki?",
    exampleMeaning: "Selamat pagi, apa kabar?",
    level: "N5",
    lastStudied: "1 hari yang lalu",
  },
  {
    id: 3,
    kanji: "今日は",
    furigana: "こんにちは",
    romaji: "Konnichiwa",
    meaning: "Selamat siang",
    isFavorite: true,
    isLearned: false,
    category: "salam",
    example: "こんにちは、お元気ですか？",
    exampleFurigana: "こんにちは、おげんきですか？",
    exampleRomaji: "Konnichiwa, ogenki desu ka?",
    exampleMeaning: "Selamat siang, bagaimana kabarmu?",
    level: "N5",
    lastStudied: "3 hari yang lalu",
  },
  {
    id: 4,
    kanji: "今晩は",
    furigana: "こんばんは",
    romaji: "Konbanwa",
    meaning: "Selamat malam",
    isFavorite: false,
    isLearned: false,
    category: "salam",
    example: "こんばんは、お疲れ様でした。",
    exampleFurigana: "こんばんは、おつかれさまでした。",
    exampleRomaji: "Konbanwa, otsukaresama deshita.",
    exampleMeaning: "Selamat malam, terima kasih atas kerja kerasmu.",
    level: "N5",
    lastStudied: "5 hari yang lalu",
  },
  {
    id: 5,
    kanji: "さようなら",
    furigana: "さようなら",
    romaji: "Sayounara",
    meaning: "Selamat tinggal",
    isFavorite: false,
    isLearned: false,
    category: "salam",
    example: "さようなら、また会いましょう。",
    exampleFurigana: "さようなら、またあいましょう。",
    exampleRomaji: "Sayounara, mata aimashou.",
    exampleMeaning: "Selamat tinggal, sampai jumpa lagi.",
    level: "N5",
    lastStudied: "1 minggu yang lalu",
  },
  {
    id: 6,
    kanji: "有難う",
    furigana: "ありがとう",
    romaji: "Arigatou",
    meaning: "Terima kasih",
    isFavorite: true,
    isLearned: true,
    category: "umum",
    example: "ご親切にありがとうございます。",
    exampleFurigana: "ごしんせつに ありがとう ございます。",
    exampleRomaji: "Goshinsetsu ni arigatou gozaimasu.",
    exampleMeaning: "Terima kasih atas kebaikanmu.",
    level: "N5",
    lastStudied: "2 hari yang lalu",
  },
  {
    id: 7,
    kanji: "すみません",
    furigana: "すみません",
    romaji: "Sumimasen",
    meaning: "Permisi/Maaf",
    isFavorite: false,
    isLearned: false,
    category: "umum",
    example: "すみません、トイレはどこですか？",
    exampleFurigana: "すみません、トイレは どこですか？",
    exampleRomaji: "Sumimasen, toire wa doko desu ka?",
    exampleMeaning: "Permisi, di mana toilet?",
    level: "N5",
    lastStudied: "4 hari yang lalu",
  },
  {
    id: 8,
    kanji: "頂きます",
    furigana: "いただきます",
    romaji: "Itadakimasu",
    meaning: "Selamat makan",
    isFavorite: false,
    isLearned: false,
    category: "makanan",
    example: "食事の前に「いただきます」と言います。",
    exampleFurigana: "しょくじの まえに「いただきます」と いいます。",
    exampleRomaji: "Shokuji no mae ni 'itadakimasu' to iimasu.",
    exampleMeaning: "Kita mengucapkan 'itadakimasu' sebelum makan.",
    level: "N5",
    lastStudied: "6 hari yang lalu",
  },
  {
    id: 9,
    kanji: "ご馳走様",
    furigana: "ごちそうさま",
    romaji: "Gochisousama",
    meaning: "Terima kasih atas makanannya",
    isFavorite: false,
    isLearned: false,
    category: "makanan",
    example: "食事の後に「ごちそうさま」と言います。",
    exampleFurigana: "しょくじの あとに「ごちそうさま」と いいます。",
    exampleRomaji: "Shokuji no ato ni 'gochisousama' to iimasu.",
    exampleMeaning: "Kita mengucapkan 'gochisousama' setelah makan.",
    level: "N5",
    lastStudied: "8 hari yang lalu",
  },
  {
    id: 10,
    kanji: "勉強",
    furigana: "べんきょう",
    romaji: "Benkyou",
    meaning: "Belajar",
    isFavorite: true,
    isLearned: false,
    category: "aktivitas",
    example: "毎日日本語を勉強しています。",
    exampleFurigana: "まいにち にほんごを べんきょうしています。",
    exampleRomaji: "Mainichi nihongo o benkyou shite imasu.",
    exampleMeaning: "Saya belajar bahasa Jepang setiap hari.",
    level: "N5",
    lastStudied: "3 hari yang lalu",
  },
  {
    id: 11,
    kanji: "学校",
    furigana: "がっこう",
    romaji: "Gakkou",
    meaning: "Sekolah",
    isFavorite: false,
    isLearned: true,
    category: "tempat",
    example: "学校に行きます。",
    exampleFurigana: "がっこうに いきます。",
    exampleRomaji: "Gakkou ni ikimasu.",
    exampleMeaning: "Saya pergi ke sekolah.",
    level: "N5",
    lastStudied: "1 hari yang lalu",
  },
  {
    id: 12,
    kanji: "先生",
    furigana: "せんせい",
    romaji: "Sensei",
    meaning: "Guru",
    isFavorite: true,
    isLearned: true,
    category: "profesi",
    example: "先生は親切です。",
    exampleFurigana: "せんせいは しんせつです。",
    exampleRomaji: "Sensei wa shinsetsu desu.",
    exampleMeaning: "Guru itu baik hati.",
    level: "N5",
    lastStudied: "2 hari yang lalu",
  },
]

// Fungsi untuk memainkan suara (simulasi)
const playSound = (word) => {
  // Dalam implementasi nyata, ini akan memutar file audio
  console.log(`Playing sound for: ${word}`)
  // Simulasi feedback visual
  const synth = window.speechSynthesis
  const utterance = new SpeechSynthesisUtterance(word)
  utterance.lang = "ja-JP"
  synth.speak(utterance)
}

// Komponen untuk menampilkan kanji dengan furigana di bawahnya (vertikal)
const KanjiWithFurigana = ({ kanji, furigana, kanjiClassName = "", furiganaClassName = "" }) => {
  return (
    <div className="inline-flex flex-col items-center justify-center">
      <div className={`${kanjiClassName}`}>{kanji}</div>
      <div className={`text-xs text-muted-foreground ${furiganaClassName}`}>{furigana}</div>
    </div>
  )
}

// Komponen untuk menampilkan kalimat contoh dengan kanji dan furigana
const ExampleSentence = ({ example, furigana, romaji, meaning }) => {
  // Memisahkan kalimat menjadi karakter-karakter
  const kanjiChars = example.split("")
  const furiganaChars = furigana.split("")

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-1 justify-center">
        {kanjiChars.map((char, index) => (
          <KanjiWithFurigana
            key={index}
            kanji={char}
            furigana={furiganaChars[index] || ""}
            kanjiClassName="text-base"
            furiganaClassName="text-[10px]"
          />
        ))}
      </div>
      <div className="text-sm italic text-muted-foreground">{romaji}</div>
      <div className="text-sm font-medium">{meaning}</div>
    </div>
  )
}

// Komponen untuk jalur belajar dengan animasi
const LearningPath = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: false, amount: 0.3 })

  const steps = [
    {
      number: 1,
      title: "Dasar-dasar Kosakata",
      description: "Pelajari 50 kosakata dasar untuk percakapan sehari-hari",
      status: "completed", // completed, in-progress, locked
      icon: <BookOpen className="h-5 w-5" />,
    },
    {
      number: 2,
      title: "Kosakata Sehari-hari",
      description: "Pelajari 100 kosakata untuk situasi umum",
      status: "in-progress",
      icon: <Target className="h-5 w-5" />,
    },
    {
      number: 3,
      title: "Kosakata Lanjutan",
      description: "Pelajari 150 kosakata untuk percakapan lanjutan",
      status: "locked",
      icon: <Lock className="h-5 w-5" />,
    },
    {
      number: 4,
      title: "Penguasaan Kosakata",
      description: "Kuasai 200+ kosakata untuk berbagai situasi",
      status: "locked",
      icon: <Trophy className="h-5 w-5" />,
    },
  ]

  return (
    <Card className="border border-primary/10 overflow-hidden">
      <CardHeader className="pb-2 bg-gradient-to-r from-primary/5 to-transparent">
        <CardTitle className="text-lg flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" /> Jalur Belajar Kosakata
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="relative" ref={ref}>
          {/* Garis penghubung animasi */}
          <div
            className="absolute left-[24px] top-8 bottom-8 w-[2px] bg-muted"
            style={{
              maskImage: isInView
                ? "linear-gradient(to bottom, #000 0%, #000 100%)"
                : "linear-gradient(to bottom, #000 0%, transparent 0%)",
              maskSize: "100% 100%",
              maskPosition: "0 0",
              transition: "mask-size 1.5s ease-in-out",
              WebkitMaskImage: isInView
                ? "linear-gradient(to bottom, #000 0%, #000 100%)"
                : "linear-gradient(to bottom, #000 0%, transparent 0%)",
              WebkitMaskSize: "100% 100%",
              WebkitMaskPosition: "0 0",
            }}
          />

          <div className="space-y-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="flex items-start gap-4"
              >
                <div
                  className={cn(
                    "relative z-10 flex items-center justify-center w-12 h-12 rounded-full",
                    step.status === "completed"
                      ? "bg-green-500 text-white"
                      : step.status === "in-progress"
                        ? "bg-primary text-white"
                        : "bg-muted text-muted-foreground",
                  )}
                >
                  {step.icon}
                </div>
                <div className="flex-1 pt-1">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                      <h4 className="font-medium flex items-center gap-2">
                        {step.title}
                        {step.status === "completed" && (
                          <Badge className="bg-green-500/10 text-green-600 border-green-500/30 rounded-full">
                            <Check size={10} className="mr-1" /> Selesai
                          </Badge>
                        )}
                        {step.status === "in-progress" && (
                          <Badge className="bg-primary/10 text-primary border-primary/30 rounded-full">
                            <Target size={10} className="mr-1" /> Sedang Dipelajari
                          </Badge>
                        )}
                      </h4>
                      <p className="text-sm text-muted-foreground">{step.description}</p>
                    </div>
                    {step.status !== "locked" && (
                      <Button
                        size="sm"
                        variant={step.status === "completed" ? "outline" : "default"}
                        className={cn(
                          "rounded-full",
                          step.status === "completed" && "border-green-500/30 text-green-600 hover:bg-green-500/10",
                        )}
                      >
                        {step.status === "completed" ? "Ulangi" : "Lanjutkan"}
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function VocabularyContent({ vocabulary = sampleVocabulary }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filter, setFilter] = useState("all")
  const [sortBy, setSortBy] = useState("a-z")
  const [showStickyBar, setShowStickyBar] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [vocabList, setVocabList] = useState(vocabulary)
  const [todayVocab, setTodayVocab] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [isSearching, setIsSearching] = useState(false)
  const [showBottomSearch, setShowBottomSearch] = useState(false)
  const [showBottomFilter, setShowBottomFilter] = useState(false)
  const [streakDays, setStreakDays] = useState(7)
  const [lastStudied, setLastStudied] = useState("2 jam yang lalu")
  const [expandedCard, setExpandedCard] = useState(null)
  const [isMobilePage, setIsMobilePage] = useState(false)
  const [todayVocabFavorite, setTodayVocabFavorite] = useState(false)
  const { sidebarOpen, isMobile} = useLayout()
  const contentRef = useRef(null)
  const filterSectionRef = useRef(null)
  const searchInputRef = useRef(null)

  const itemsPerPage = 6

  // Check if mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobilePage(window.innerWidth < 768)
    }
    checkIfMobile()
    window.addEventListener("resize", checkIfMobile)
    return () => window.removeEventListener("resize", checkIfMobile)
  }, [])

  // Get a random vocabulary for "Today's Vocabulary"
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * vocabulary.length)
    setTodayVocab(vocabulary[randomIndex])

    // Simulasi progress belajar
    const learnedCount = vocabulary.filter((item) => item.isLearned).length
    setProgress((learnedCount / vocabulary.length) * 100)
  }, [vocabulary])

  // Handle scroll to show sticky search bar at BOTTOM
  useEffect(() => {
    const handleScroll = () => {
      if (filterSectionRef.current) {
        const position = filterSectionRef.current.getBoundingClientRect()
        // Menampilkan sticky bar ketika section filter sudah tidak terlihat (scrolled past)
        setShowStickyBar(position.bottom < 0)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Filter and sort vocabulary with loading simulation
  useEffect(() => {
    const filterAndSortVocabulary = async () => {
      setIsSearching(true)

      // Simulasi loading untuk pencarian
      await new Promise((resolve) => setTimeout(resolve, 300))

      let filtered = [...vocabulary]

      // Apply filter
      if (filter === "favorite") {
        filtered = filtered.filter((item) => item.isFavorite)
      } else if (filter === "learned") {
        filtered = filtered.filter((item) => item.isLearned)
      } else if (filter === "not-learned") {
        filtered = filtered.filter((item) => !item.isLearned)
      }

      // Apply search
      if (searchTerm) {
        filtered = filtered.filter(
          (item) =>
            item.romaji.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.meaning.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.furigana.includes(searchTerm.toLowerCase()) ||
            (item.kanji && item.kanji.includes(searchTerm)),
        )
      }

      // Apply sort
      if (sortBy === "a-z") {
        filtered.sort((a, b) => a.romaji.localeCompare(b.romaji))
      } else if (sortBy === "newest") {
        filtered.sort((a, b) => b.id - a.id)
      } else if (sortBy === "favorite") {
        filtered.sort((a, b) => (b.isFavorite ? 1 : 0) - (a.isFavorite ? 1 : 0))
      }

      setVocabList(filtered)
      setCurrentPage(1)
      setIsSearching(false)
    }

    filterAndSortVocabulary()
  }, [vocabulary, filter, sortBy, searchTerm])

  // Toggle favorite status
  const toggleFavorite = (id) => {
    setVocabList((prev) => prev.map((item) => (item.id === id ? { ...item, isFavorite: !item.isFavorite } : item)))
  }

  // Toggle learned status
  const toggleLearned = (id) => {
    setVocabList((prev) => {
      const newList = prev.map((item) => (item.id === id ? { ...item, isLearned: !item.isLearned } : item))

      // Update progress
      const learnedCount = newList.filter((item) => item.isLearned).length
      setProgress((learnedCount / newList.length) * 100)

      return newList
    })
  }

  // Calculate pagination
  const totalPages = Math.ceil(vocabList.length / itemsPerPage)
  const currentItems = vocabList.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  }

  // Stats calculation
  const stats = {
    total: vocabulary.length,
    learned: vocabulary.filter((item) => item.isLearned).length,
    favorite: vocabulary.filter((item) => item.isFavorite).length,
  }

  // Simulasi memainkan suara
  const handlePlaySound = (word) => {
    setIsPlaying(true)
    playSound(word)
    setTimeout(() => setIsPlaying(false), 1500)
  }

  // Toggle expanded card
  const toggleExpandCard = (id) => {
    setExpandedCard(expandedCard === id ? null : id)
  }

  // Get level color
  const getLevelColor = (level) => {
    switch (level) {
      case "N5":
        return "bg-emerald-500"
      case "N4":
        return "bg-blue-500"
      case "N3":
        return "bg-yellow-500"
      case "N2":
        return "bg-orange-500"
      case "N1":
        return "bg-red-500"
      default:
        return "bg-primary"
    }
  }

  const toggleTodayFavorite = () => {
    setTodayVocabFavorite(!todayVocabFavorite)
    if (todayVocab) {
      toggleFavorite(todayVocab.id)
    }
  }

  return (
    <>
     

      <div ref={contentRef} className="max-w-6xl mx-auto px-4 ">
        
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex items-center space-x-2 text-sm bg-gradient-to-r from-background to-muted/50 dark:from-slate-950 dark:to-slate-900/50 p-3 rounded-lg shadow-sm border border-border/50 dark:border-slate-800/50  mb-[50px] w-fit"
          >
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <Link href={route('dashboard')}>
                <span className="text-muted-foreground dark:text-slate-400 hover:text-violet-800 dark:hover:text-violet-300 transition-all duration-300">Dashboard</span>
              </Link>
              <span className="text-primary dark:text-violet-400">/</span>
              <Link href={route('list-kosakata')}>
                <span className="text-violet-400 dark:text-violet-600">List Kosakata</span>
              </Link>
           
            </div>
            <motion.div 
              className="h-1 w-1 rounded-full bg-primary/50 dark:bg-violet-500/50"
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            />
          </motion.div>
        {/* Header Section dengan desain yang ditingkatkan */}
     
         <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="mb-10 text-center relative"
              >
  
  <div className="py-8 px-4 relative z-0 bg-violet-300/20 dark:bg-violet-500/20 rounded-lg">
  <div className="inline-block mb-4 bg-violet-500/20 p-2 rounded-full">
  <GraduationCap className="h-8 w-8 text-slate-900 dark:text-slate-200" />
</div>
<h1 className="text-4xl md:text-5xl font-bold mb-3 text-slate-900 dark:text-slate-200 capitalize">
  Daftar Kosakata Jepang
</h1>
<p className="text-slate-500 dark:text-slate-400 text-lg max-w-2xl mx-auto">
  Temukan berbagai
  <span className="relative inline-block mx-1 px-2 bg-primary/10 dark:bg-primary/30 text-primary dark:text-violet-300 rounded-md">kosakata Jepang</span>
  yang bisa kamu pelajari dan kuasai, lengkap dengan arti,
  <span className="relative inline-block mx-1 px-2 bg-primary/10 dark:bg-primary/30 text-primary dark:text-violet-300 rounded-md my-1">cara baca</span>,
  dan
  <span className="relative inline-block mx-1 px-2 bg-primary/10 dark:bg-primary/30 text-primary dark:text-violet-300 rounded-md">contoh penggunaannya</span>.
  <br />
  <span className="text-sm inline-block mt-2 bg-primary/5 px-3 py-1 rounded-full">
    Tingkatkan pemahamanmu lewat daftar kosakata ini!
  </span>
</p>

  </div>
            </motion.div>

        {/* Today's Vocabulary - Ditingkatkan dengan format kanji di atas, furigana di bawah */}
        {todayVocab && (
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <Card className="overflow-hidden border border-primary/20 relative transition-all duration-300 ease-in-out hover:shadow-lg hover:scale-[1.01]">
              {/* Background gradient dari kanan ke kiri */}
              <div
                className={`absolute inset-0 -z-10 transition-all duration-500 ease-in-out ${
                  todayVocabFavorite
                    ? "bg-gradient-to-r from-yellow-500/10 via-primary/5 to-yellow-500/10"
                    : "bg-gradient-to-l from-primary/15 to-transparent"
                }`}
              ></div>

              <CardHeader className="pb-0">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <Sparkles className="w-4 h-4 mr-2 text-primary" />
                    Kosakata Hari Ini
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">{Math.round(progress)}% Dipelajari</span>
                    <Progress value={progress} className="w-24 h-2" />
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-6">
                <div className="grid md:grid-cols-[1fr_1fr] gap-6">
                  {/* Bagian kiri: Kosakata dengan kanji di atas, furigana di bawah */}
                  <div className="flex flex-col items-center justify-center space-y-6">
                    <div className="text-center">
                      {/* Kanji di atas, furigana di bawah */}
                      <div className="mb-6">
                        <div className="text-6xl font-bold text-primary mb-1">{todayVocab.kanji}</div>
                        <div className="text-sm text-muted-foreground">{todayVocab.furigana}</div>
                      </div>
                      <div className="text-3xl font-medium mb-2">{todayVocab.romaji}</div>
                      <div className="text-xl flex items-center justify-center gap-2 mb-6">
                        <span>{todayVocab.meaning}</span>
                        {todayVocab.meaning.includes("Selamat") && <span className="text-2xl">👋</span>}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3 justify-center">
                      <Button
                        className="gap-2 rounded-full bg-primary hover:bg-primary/90 text-white"
                        onClick={() => toggleLearned(todayVocab.id)}
                      >
                        <BookOpenCheck size={18} />
                        <Link href={route('detail-kosakata')}>Pelajari Sekarang</Link>
                      </Button>

                      <Button
                        variant="outline"
                        className={`gap-2 rounded-full transition-all duration-300 ${
                          isPlaying
                            ? "bg-primary text-primary-foreground border-primary"
                            : "border-primary/20 hover:bg-primary/10 hover:text-primary"
                        }`}
                        onClick={() => handlePlaySound(todayVocab.romaji)}
                        disabled={isPlaying}
                      >
                        <Volume2 size={18} className={isPlaying ? "animate-pulse" : ""} />
                        {isPlaying ? "Memutar..." : "Dengarkan"}
                      </Button>
                    </div>
                  </div>

                  {/* Bagian kanan: Contoh kalimat dengan kanji di atas, furigana di bawah */}
                  <div className="bg-white/50 backdrop-blur-sm rounded-xl p-5 border border-primary/10 shadow-sm">
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <MessageSquareQuote className="text-primary" size={18} />
                      <h4 className="font-medium text-sm">Contoh Kalimat</h4>
                    </div>

                    <div className="space-y-4">
                      {/* Contoh kalimat dengan kanji di atas, furigana di bawah */}
                      <div className="flex flex-col items-center justify-center">
                        {/* Kanji */}
                        <div className="text-xl font-medium mb-1 text-center">{todayVocab.example}</div>
                        {/* Furigana */}
                        <div className="text-xs text-muted-foreground mb-3 text-center">
                          {todayVocab.exampleFurigana}
                        </div>
                        {/* Romaji */}
                        <div className="text-sm italic text-muted-foreground mb-2 text-center">
                          {todayVocab.exampleRomaji}
                        </div>
                        {/* Arti */}
                        <div className="text-sm font-medium text-center px-4 py-2 bg-primary/5 rounded-full">
                          {todayVocab.exampleMeaning}
                        </div>
                      </div>

                      {/* Elemen baru yang lebih menarik */}
                      <div className="mt-4 pt-4 border-t border-primary/10">
                        <div className="flex items-center justify-between text-xs">
                          <Badge variant="outline" className="rounded-full bg-primary/5 border-primary/20">
                            Level {todayVocab.level}
                          </Badge>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-full hover:bg-primary/5 hover:text-primary transition-all duration-300 hover:scale-110"
                              onClick={toggleTodayFavorite}
                            >
                              {todayVocab.isFavorite ? (
                                <Star size={16} className="text-yellow-500 fill-yellow-500" />
                              ) : (
                                <Star size={16} />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-full hover:bg-primary/5 hover:text-primary"
                            >
                              <Share size={16} />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Statistics Summary */}
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <motion.div variants={itemVariants}>
              <Card className="border border-primary/20 h-full transition-all duration-300 ease-in-out hover:shadow-md hover:scale-[1.02] hover:bg-primary/[0.02]">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="bg-primary/10 p-3 rounded-xl">
                    <BarChart3 size={28} className="text-primary" />
                  </div>
                  <div>
                    <div className="flex items-baseline gap-1">
                      <div className="text-3xl font-bold">{stats.total}</div>
                      <div className="text-xs text-muted-foreground">kata</div>
                    </div>
                    <div className="text-sm font-medium text-muted-foreground">Total Kosakata</div>
                    <Progress value={100} className="h-1 mt-2" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="border border-green-500/20 h-full transition-all duration-300 ease-in-out hover:shadow-md hover:scale-[1.02] hover:bg-green-500/[0.02]">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="bg-green-500/10 p-3 rounded-xl">
                    <Award size={28} className="text-green-500" />
                  </div>
                  <div>
                    <div className="flex items-baseline gap-1">
                      <div className="text-3xl font-bold">{stats.learned}</div>
                      <div className="text-xs text-muted-foreground">kata</div>
                    </div>
                    <div className="text-sm font-medium text-muted-foreground">Sudah Dipelajari</div>
                    <Progress value={(stats.learned / stats.total) * 100} className="h-1 mt-2 bg-muted/50" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="border border-yellow-500/20 h-full transition-all duration-300 ease-in-out hover:shadow-md hover:scale-[1.02] hover:bg-yellow-500/[0.02]">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="bg-yellow-500/10 p-3 rounded-xl">
                    <Flame size={28} className="text-yellow-500" />
                  </div>
                  <div>
                    <div className="flex items-baseline gap-1">
                      <div className="text-3xl font-bold">{streakDays}</div>
                      <div className="text-xs text-muted-foreground">hari</div>
                    </div>
                    <div className="text-sm font-medium text-muted-foreground">Streak Belajar</div>
                    <div className="flex gap-1 mt-2">
                      {[...Array(7)].map((_, i) => (
                        <div
                          key={i}
                          className={`h-1 flex-1 rounded-full ${i < streakDays ? "bg-yellow-500" : "bg-muted/50"}`}
                        ></div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>

        {/* Search & Filter Section */}
        <motion.div
          id="filter-section"
          ref={filterSectionRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8 py-4 border-b border-primary/10"
        >
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-grow">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                <Search className="h-4 w-4" />
              </div>
              <Input
                ref={searchInputRef}
                placeholder="Cari kosakata..."
                className="pl-9 border-primary/20 focus-visible:ring-primary/30 rounded-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 rounded-full border-primary/20 hover:bg-primary/10"
                  >
                    <SlidersHorizontal size={16} />
                    <span className="hidden sm:inline">Urutkan</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="rounded-xl border-primary/20">
                  <DropdownMenuItem onClick={() => setSortBy("a-z")}>A-Z</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("newest")}>Terbaru</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("favorite")}>Favorit</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Tabs defaultValue="all" className="w-fit">
                <TabsList className="grid grid-cols-4 h-9 p-1 rounded-full bg-muted/50">
                  <TabsTrigger
                    value="all"
                    onClick={() => setFilter("all")}
                    className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    Semua
                  </TabsTrigger>
                  <TabsTrigger
                    value="favorite"
                    onClick={() => setFilter("favorite")}
                    className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    <Star size={16} />
                  </TabsTrigger>
                  <TabsTrigger
                    value="learned"
                    onClick={() => setFilter("learned")}
                    className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    <Check size={16} />
                  </TabsTrigger>
                  <TabsTrigger
                    value="not-learned"
                    onClick={() => setFilter("not-learned")}
                    className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    <X size={16} />
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="hidden sm:flex rounded-full border-primary/20 hover:bg-primary/10"
                  >
                    <FlipHorizontal size={16} />
                  </Button>
                </DialogTrigger>
                <DialogContent className="rounded-xl">
                  <DialogHeader>
                    <DialogTitle>Mode Flashcard</DialogTitle>
                    <DialogDescription>Ubah tampilan menjadi mode flashcard untuk latihan.</DialogDescription>
                  </DialogHeader>
                  <div className="py-4">
                    <p>Fitur mode flashcard akan segera hadir!</p>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </motion.div>

        {/* Vocabulary Grid - Ditingkatkan dengan format kanji di atas, furigana di bawah */}
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="mb-12">
          {isSearching ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-8 w-8 text-primary animate-spin mb-4" />
              <p className="text-muted-foreground">Mencari kosakata...</p>
            </div>
          ) : vocabList.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="bg-muted/30 p-4 rounded-full mb-4">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-1">Tidak ada hasil</h3>
              <p className="text-muted-foreground max-w-md">
                Tidak ada kosakata yang sesuai dengan pencarian Anda. Coba kata kunci lain atau ubah filter.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {currentItems.map((item) => (
                <motion.div key={item.id} variants={itemVariants}>
                  <Card
                    className="h-full border border-primary/10 overflow-hidden transition-all duration-300 hover:shadow-lg hover:translate-y-[-5px] hover:border-primary/30 flex flex-col"
                    style={{
                      background: `radial-gradient(circle at top right, ${item.isFavorite ? "rgba(250, 204, 21, 0.05)" : "rgba(var(--primary), 0.03)"}, transparent 70%)`,
                    }}
                  >
                    {/* Card Header dengan layout yang lebih elegan dan left-aligned */}
                    <CardHeader className="pb-2 pt-4 px-5 flex-shrink-0">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          {/* Kanji di atas, furigana di bawah, left-aligned */}
                          <div className="text-3xl font-bold text-primary mb-1">{item.kanji}</div>
                          <div className="text-xs text-muted-foreground mb-2">{item.furigana}</div>
                          <div className="text-lg font-medium mb-1">{item.romaji}</div>
                          <div className="text-base text-muted-foreground">{item.meaning}</div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleFavorite(item.id)
                          }}
                          className="p-2 rounded-full hover:bg-yellow-500/10 transition-all duration-300 hover:scale-125 hover:rotate-12"
                        >
                          {item.isFavorite ? (
                            <Star size={20} className="text-yellow-500 fill-yellow-500" />
                          ) : (
                            <StarOff size={20} className="text-muted-foreground" />
                          )}
                        </button>
                      </div>
                    </CardHeader>

                    {/* Card Content dengan label aksi yang lebih menarik */}
                    <CardContent className="px-5 pt-2 flex-grow flex flex-col">
                      {/* Status dipelajari dan Lihat Contoh secara vertikal di semua device */}
                      <div className="flex flex-col gap-3 mb-4 mt-auto">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleLearned(item.id)}
                          className={`rounded-full transition-all duration-300 hover:scale-105 flex items-center justify-start ${
                            item.isLearned
                              ? "bg-green-500/5 text-green-600 border-green-500/30 hover:bg-green-500/10"
                              : "bg-muted/30 hover:bg-muted/50"
                          }`}
                        >
                          {item.isLearned ? (
                            <BookMarked size={16} className="mr-2 text-green-600" />
                          ) : (
                            <Bookmark size={16} className="mr-2" />
                          )}
                          {item.isLearned ? "Sudah Dipelajari" : "Belum Dipelajari"}
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleExpandCard(item.id)}
                          className={`rounded-full transition-all duration-300 hover:scale-105 border-primary/20 text-primary hover:bg-primary/5 flex items-center justify-start ${
                            expandedCard === item.id ? "bg-primary/5" : ""
                          }`}
                        >
                          {expandedCard === item.id ? (
                            <EyeOff size={16} className="mr-2" />
                          ) : (
                            <Eye size={16} className="mr-2" />
                          )}
                          {expandedCard === item.id ? "Sembunyikan Contoh" : "Lihat Contoh"}
                        </Button>
                      </div>

                      {/* Expanded content with example - improved design */}
                      <AnimatePresence>
                        {expandedCard === item.id && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <div className="bg-muted/20 rounded-lg p-5 mb-4 border border-primary/5">
                              <div className="flex items-center mb-4">
                                <MessageSquareQuote size={16} className="text-primary mr-2" />
                                <p className="text-sm font-medium">Contoh Kalimat</p>
                                <div className="h-[1px] flex-grow ml-2 bg-gradient-to-r from-primary/20 to-transparent"></div>
                              </div>

                              {/* Contoh kalimat dengan kanji di atas, furigana di bawah, left-aligned */}
                              <div className="space-y-4">
                                {/* Kanji */}
                                <div className="text-lg font-medium">{item.example}</div>
                                {/* Furigana */}
                                <div className="text-xs text-muted-foreground -mt-2">{item.exampleFurigana}</div>
                                {/* Romaji */}
                                <div className="text-sm italic text-muted-foreground">{item.exampleRomaji}</div>
                                {/* Arti */}
                                <div className="text-sm font-medium px-3 py-2 bg-white/50 rounded-md border border-primary/5">
                                  {item.exampleMeaning}
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </CardContent>

                    {/* Card Footer dengan tombol pelajari kosakata */}
                    <CardFooter className="pt-0 px-5 pb-5">
                      <div className="w-full flex flex-col gap-2">
                        <Button
                          className="w-full rounded-full bg-primary hover:bg-primary/90 gap-2 transition-all duration-300 hover:scale-105 hover:shadow-md"
                          onClick={() => toggleLearned(item.id)}
                        >
                          <BookOpen size={16} /> Pelajari Kosakata
                        </Button>

                        <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
                          <div className="flex items-center">
                            <div className={`w-3 h-3 rounded-full mr-1.5 ${getLevelColor(item.level)}`}></div>
                            <div className="bg-gradient-to-r from-muted/50 to-transparent px-2 py-1 rounded-full">
                              Level {item.level || "N5"}
                            </div>
                          </div>
                          <span className="flex items-center gap-1">
                            <Clock size={12} /> {item.lastStudied || "Belum dipelajari"}
                          </span>
                        </div>
                      </div>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Pagination - Dipindahkan ke bawah grid kosakata */}
        {totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex justify-center mt-10 mb-16"
          >
            <Card className="border border-primary/10 inline-block shadow-sm hover:shadow-md transition-all duration-300">
              <CardContent className="p-2 flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="rounded-full h-9 w-9 hover:bg-primary/5"
                >
                  <ChevronLeft size={16} />
                </Button>

                <div className="flex gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "ghost"}
                      size="icon"
                      onClick={() => setCurrentPage(page)}
                      className={`rounded-full h-9 w-9 transition-all duration-200 ${
                        currentPage === page ? "bg-primary text-primary-foreground" : "hover:bg-primary/5"
                      }`}
                    >
                      {page}
                    </Button>
                  ))}
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="rounded-full h-9 w-9 hover:bg-primary/5"
                >
                  <ChevronRight size={16} />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Jalur Belajar Kosakata - Ditingkatkan dengan animasi */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-12"
        >
          <LearningPath />
        </motion.div>

        {/* Elemen tambahan di bawah list kosakata */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mb-12 grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* Tips Belajar */}
          <Card className="border border-primary/10 transition-all duration-300 ease-in-out hover:shadow-md hover:scale-[1.01] hover:bg-yellow-500/[0.01]">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="bg-yellow-500/10 p-3 rounded-full">
                  <Lightbulb className="text-yellow-500 h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2">Tips Belajar</h3>
                  <p className="text-muted-foreground text-sm">
                    Ulangi kosakata keras-keras 3x setiap hari agar lebih cepat hafal. Gunakan dalam kalimat sederhana
                    untuk memperkuat ingatan.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Statistik Belajar */}
          <Card className="border border-primary/10 transition-all duration-300 ease-in-out hover:shadow-md hover:scale-[1.01] hover:bg-primary/[0.01]">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <Zap className="text-primary h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2">Statistik Belajar</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Repeat className="text-primary h-4 w-4" />
                      <div>
                        <div className="text-sm font-medium">{streakDays} Hari</div>
                        <div className="text-xs text-muted-foreground">Streak Belajar</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="text-primary h-4 w-4" />
                      <div>
                        <div className="text-sm font-medium">{lastStudied}</div>
                        <div className="text-xs text-muted-foreground">Terakhir Belajar</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Pagination */}
        {totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex justify-center mb-12"
          >
            <Card className="border border-primary/10 inline-block">
              <CardContent className="p-2 flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="rounded-full h-9 w-9"
                >
                  <ChevronLeft size={16} />
                </Button>

                <div className="flex gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "ghost"}
                      size="icon"
                      onClick={() => setCurrentPage(page)}
                      className={`rounded-full h-9 w-9 ${
                        currentPage === page ? "bg-primary text-primary-foreground" : ""
                      }`}
                    >
                      {page}
                    </Button>
                  ))}
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="rounded-full h-9 w-9"
                >
                  <ChevronRight size={16} />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>

      {/* Sticky Search Bar - DIBAWAH LAYAR dengan search dan filter langsung */}
      <AnimatePresence>
        {showStickyBar && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className={cn(
              "fixed bottom-0 max-full  bg-background/95 backdrop-blur-md border-t border-primary/20 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] z-50 py-3 px-4",
              isMobile ? "left-0 right-0" : sidebarOpen ? "left-80 right-0" : "left-20 right-0",
               "transition-all duration-300"
            )}
          >
            <div className="max-w-6xl mx-auto">
              {/* Tampilkan search input langsung jika showBottomSearch true */}
              {showBottomSearch ? (
                <div className="mb-3">
                  <div className="flex items-center gap-2">
                    <div className="relative flex-grow">
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                        <Search className="h-4 w-4" />
                      </div>
                      <Input
                        placeholder="Cari kosakata..."
                        className="pl-9 border-primary/20 focus-visible:ring-primary/30 rounded-full"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        autoFocus
                      />
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full"
                      onClick={() => setShowBottomSearch(false)}
                    >
                      <X size={16} />
                    </Button>
                  </div>
                </div>
              ) : showBottomFilter ? (
                <div className="mb-3">
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Filter & Urutkan</h4>
                      <Button
                        variant="outline"
                        size="icon"
                        className="rounded-full"
                        onClick={() => setShowBottomFilter(false)}
                      >
                        <X size={16} />
                      </Button>
                    </div>

                    <div>
                      <h5 className="text-sm text-muted-foreground mb-2">Tampilkan</h5>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          size="sm"
                          variant={filter === "all" ? "default" : "outline"}
                          onClick={() => setFilter("all")}
                          className="rounded-full"
                        >
                          Semua
                        </Button>
                        <Button
                          size="sm"
                          variant={filter === "favorite" ? "default" : "outline"}
                          onClick={() => setFilter("favorite")}
                          className="rounded-full gap-1"
                        >
                          <Star size={14} />
                          Favorit
                        </Button>
                        <Button
                          size="sm"
                          variant={filter === "learned" ? "default" : "outline"}
                          onClick={() => setFilter("learned")}
                          className="rounded-full gap-1"
                        >
                          <Check size={14} />
                          Sudah Dipelajari
                        </Button>
                        <Button
                          size="sm"
                          variant={filter === "not-learned" ? "default" : "outline"}
                          onClick={() => setFilter("not-learned")}
                          className="rounded-full gap-1"
                        >
                          <X size={14} />
                          Belum Dipelajari
                        </Button>
                      </div>
                    </div>

                    <div>
                      <h5 className="text-sm text-muted-foreground mb-2">Urutkan</h5>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          size="sm"
                          variant={sortBy === "a-z" ? "default" : "outline"}
                          onClick={() => setSortBy("a-z")}
                          className="rounded-full"
                        >
                          A-Z
                        </Button>
                        <Button
                          size="sm"
                          variant={sortBy === "newest" ? "default" : "outline"}
                          onClick={() => setSortBy("newest")}
                          className="rounded-full"
                        >
                          Terbaru
                        </Button>
                        <Button
                          size="sm"
                          variant={sortBy === "favorite" ? "default" : "outline"}
                          onClick={() => setSortBy("favorite")}
                          className="rounded-full"
                        >
                          Favorit
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full border-primary/20 hover:bg-primary/10 gap-2"
                    onClick={() => setShowBottomSearch(true)}
                  >
                    <Search size={16} />
                    Cari
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full border-primary/20 hover:bg-primary/10 gap-2"
                    onClick={() => setShowBottomFilter(true)}
                  >
                    <Filter size={16} />
                    Filter
                  </Button>

                  <div className="ml-auto">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" className="rounded-full gap-2">
                          <FlipHorizontal size={16} />
                          Mode Flashcard
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="rounded-xl">
                        <DialogHeader>
                          <DialogTitle>Mode Flashcard</DialogTitle>
                          <DialogDescription>Ubah tampilan menjadi mode flashcard untuk latihan.</DialogDescription>
                        </DialogHeader>
                        <div className="py-4">
                          <p>Fitur mode flashcard akan segera hadir!</p>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default function KosakataINdex(){
  return (
    <Dashboard>
      <VocabularyContent></VocabularyContent>
    </Dashboard>
  )
}

// Komponen Lock untuk ikon kunci
const Lock = ({ size, className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  )
}

// Komponen Share untuk ikon berbagi
const Share = ({ size, className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
      <polyline points="16 6 12 2 8 6" />
      <line x1="12" x2="12" y1="2" y2="15" />
    </svg>
  )
}
