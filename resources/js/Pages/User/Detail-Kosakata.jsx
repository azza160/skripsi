"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import {
    ChevronLeft,
    Volume2,
    Eye,
    EyeOff,
    Bookmark,
    BookmarkCheck,
    Star,
    Sparkles,
    BookOpen,
    Brain,
    Lightbulb,
    Zap,
    Flame,
    ArrowRight,
    Check,
    PauseCircle,
    Repeat,
    GraduationCap,
    Heart,
    Pencil,
    Palette,
    MessageCircle,
    Users,
    BookmarkIcon,
    Info,
    HelpCircle,
    ExternalLink,
} from "lucide-react";
import Dashboard from "../../Layouts/DashboardLayout";
import { cn } from "@/lib/utils";
import { useLayout } from "../../Layouts/DashboardLayout";
import { Link, usePage } from "@inertiajs/react";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogFooter,
    AlertDialogAction,
    AlertDialogCancel,
} from "@/components/ui/alert-dialog";


// Sample data - in a real app, this would come from props or API
const vocabularyData = {
    id: 1,
    word: "食べる",
    kanji: "食べる",
    furigana: "たべる",
    romaji: "taberu",
    meaning: "to eat",
    type: "verb",
    level: "N5",
    progress: 65,
    isFavorite: false,
    isLearned: false,
    audio: "/audio/taberu.mp3",
    examples: [
        {
            id: 1,
            kanji: "私 は 毎日 朝ごはん を 食べます。",
            furigana: "わたし は まいにち あさごはん を たべます。",
            romaji: "Watashi wa mainichi asagohan o tabemasu.",
            meaning: "I eat breakfast every day.",
            audio: "/audio/example1.mp3",
        },
    ],
    conjugations: [
        {
            form: "Present (Plain)",
            kanji: "食べる",
            furigana: "たべる",
            romaji: "taberu",
            meaning: "eat",
            audio: "/audio/taberu_plain.mp3",
            examples: [
                {
                    kanji: "私 は 毎日 果物 を 食べる。",
                    furigana: "わたし は まいにち くだもの を たべる。",
                    romaji: "Watashi wa mainichi kudamono o taberu.",
                    meaning: "I eat fruit every day.",
                },
                {
                    kanji: "彼 は よく ここ で 食べる。",
                    furigana: "かれ は よく ここ で たべる。",
                    romaji: "Kare wa yoku koko de taberu.",
                    meaning: "He often eats here.",
                },
            ],
        },
        {
            form: "Present (Polite)",
            kanji: "食べます",
            furigana: "たべます",
            romaji: "tabemasu",
            meaning: "eat",
            audio: "/audio/taberu_polite.mp3",
            examples: [
                {
                    kanji: "私 は 朝 ご飯 を 食べます。",
                    furigana: "わたし は あさ ごはん を たべます。",
                    romaji: "Watashi wa asa gohan o tabemasu.",
                    meaning: "I eat breakfast.",
                },
                {
                    kanji: "彼女 は いつも 7時 に 食べます。",
                    furigana: "かのじょ は いつも 7じ に たべます。",
                    romaji: "Kanojo wa itsumo shichi-ji ni tabemasu.",
                    meaning: "She always eats at 7 o'clock.",
                },
            ],
        },
    ],

    mnemonics: "Think of 'taberu' as 'table-ru' - you eat at a table!",
    notes: "This is a regular -ru verb (Group 2), which means its conjugation follows a predictable pattern.",
    stats: {
        views: 1243,
        learners: 856,
        favorites: 124,
        lastUpdated: "2023-11-15",
    },
    tags: ["食べ物", "動詞", "日常生活"],
};

// Empty data for comparison
const emptyConjugations = [];
const emptyPatterns = [];

const VocabularyDetailContent = ({vocabularyData}) => {
    const [showFurigana, setShowFurigana] = useState(true);
    const [isFavorite, setIsFavorite] = useState(vocabularyData.isFavorite);
    const [isLearned, setIsLearned] = useState(vocabularyData.isLearned);
    const [progress, setProgress] = useState(vocabularyData.progress);
    const [activeExample, setActiveExample] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [showEmptyState, setShowEmptyState] = useState(false);
    const [activeTab, setActiveTab] = useState("conjugations");
    const [hoverState, setHoverState] = useState({
        kanji: false,
        meaning: false,
    });
    const [flashcardMode, setFlashcardMode] = useState(false);
    const [flashcardFlipped, setFlashcardFlipped] = useState(false);
    const [streakCount, setStreakCount] = useState(3);
    const [showConfetti, setShowConfetti] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showBottomNav, setShowBottomNav] = useState(false);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [showWritingModal, setShowWritingModal] = useState(false);
    const { sidebarOpen, isMobile } = useLayout();
    const kanjiRef = useRef(null);
    const audioRef = useRef(null);
    const containerRef = useRef(null);
    const [showDialog, setShowDialog] = useState(false);



    useEffect(() => {
        // Initialize speech synthesis
        if (typeof window !== "undefined" && window.speechSynthesis) {
            audioRef.current = new SpeechSynthesisUtterance();

            // Try to find a Japanese voice
            const voices = window.speechSynthesis.getVoices();
            const japaneseVoice = voices.find((voice) =>
                voice.lang.includes("ja")
            );

            if (japaneseVoice) {
                audioRef.current.voice = japaneseVoice;
            }

            audioRef.current.lang = "ja-JP";
            audioRef.current.rate = 0.8;
        }

        return () => {
            if (
                typeof window !== "undefined" &&
                window.speechSynthesis &&
                audioRef.current
            ) {
                window.speechSynthesis.cancel();
            }
        };
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            if (currentScrollY > 150) {
                setShowBottomNav(true);
            } else {
                setShowBottomNav(false);
            }

            setLastScrollY(currentScrollY);
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, [lastScrollY]);

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
            },
        },
    };

    const pulseVariants = {
        pulse: {
            scale: [1, 1.05, 1],
            transition: {
                duration: 1.5,
                repeat: Infinity,
                repeatType: "reverse",
            },
        },
    };

    const floatVariants = {
        float: {
            y: [0, -10, 0],
            transition: {
                duration: 3,
                repeat: Infinity,
                repeatType: "reverse",
            },
        },
    };

    const bottomNavVariants = {
        hidden: { y: 100, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: "spring", stiffness: 300, damping: 30 },
        },
    };


    const toggleFavorite = () => {
        setIsFavorite(!isFavorite);
        if (!isFavorite) {
            triggerConfetti();
        }
    };

    const markAsLearned = () => {
        setIsLearned(true);
        setProgress(100);
        triggerConfetti();
    };

    const triggerConfetti = () => {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
    };

    const highlightExample = (id) => {
        setActiveExample(id);
    };

    const clearHighlight = () => {
        setActiveExample(null);
    };

    const toggleFlashcard = () => {
        setFlashcardFlipped(!flashcardFlipped);
    };

    const handleKanjiHover = () => {
        if (kanjiRef.current) {
            kanjiRef.current.style.textShadow = "0 0 15px var(--primary)";
        }
        setHoverState({ ...hoverState, kanji: true });
    };

    const handleKanjiLeave = () => {
        if (kanjiRef.current) {
            kanjiRef.current.style.textShadow = "none";
        }
        setHoverState({ ...hoverState, kanji: false });
    };

    const openWritingModal = (e) => {
        e.preventDefault();
        setShowWritingModal(true);
    };

    // Confetti component
    const Confetti = () => {
        return (
            <div className="fixed inset-0 pointer-events-none z-50">
                {Array.from({ length: 100 }).map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-2 h-2 rounded-full"
                        style={{
                            backgroundColor: [
                                "#FF5252",
                                "#FF4081",
                                "#E040FB",
                                "#7C4DFF",
                                "#536DFE",
                                "#448AFF",
                                "#40C4FF",
                                "#18FFFF",
                                "#64FFDA",
                                "#69F0AE",
                                "#B2FF59",
                                "#EEFF41",
                                "#FFFF00",
                                "#FFD740",
                                "#FFAB40",
                                "#FF6E40",
                            ][Math.floor(Math.random() * 16)],
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                        }}
                        initial={{
                            y: -20,
                            opacity: 1,
                            scale: Math.random() * 0.5 + 0.5,
                        }}
                        animate={{
                            y: window.innerHeight,
                            opacity: 0,
                            rotate: Math.random() * 360,
                        }}
                        transition={{
                            duration: Math.random() * 2 + 1,
                            ease: "easeOut",
                        }}
                    />
                ))}
            </div>
        );
    };

    const WritingPracticeModal = () => {
        return (
            <AnimatePresence>
                {showWritingModal && (
                    <motion.div
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowWritingModal(false)}
                    >
                        <motion.div
                            className="bg-background rounded-xl border-2 border-primary/20 shadow-xl max-w-md w-full overflow-hidden"
                            initial={{ scale: 0.9, y: 20, opacity: 0 }}
                            animate={{ scale: 1, y: 0, opacity: 1 }}
                            exit={{ scale: 0.9, y: 20, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="p-6 bg-gradient-to-r from-primary/20 to-transparent">
                                <h3 className="text-xl font-bold">
                                    Latihan Menulis
                                </h3>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Praktikkan menulis kanji dan kana
                                </p>
                            </div>
                            <div className="p-6">
                                <div className="flex flex-col items-center justify-center mb-6">
                                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                                        <Pencil className="h-8 w-8 text-primary" />
                                    </div>
                                    <h4 className="text-lg font-medium mb-2">
                                        Fitur Segera Hadir!
                                    </h4>
                                    <p className="text-center text-muted-foreground">
                                        Kami sedang mengembangkan fitur latihan
                                        menulis untuk membantu Anda mempelajari
                                        kanji dan kana dengan lebih efektif.
                                    </p>
                                </div>
                                <div className="flex justify-end">
                                    <Button
                                        onClick={() =>
                                            setShowWritingModal(false)
                                        }
                                        className="rounded-full"
                                    >
                                        Tutup
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        );
    };

       //audio method
       const playAudio = (url) => {
        if (!url) return;
        const audio = new Audio(url);
        audio.play().catch((e) => console.error("Gagal memutar audio:", e));
    };

    const handleClick = (audio) => {
        if (audio) {
            playAudio(audio);
        } else {
            setShowDialog(true);
        }
    };


    return (
        <>
            <AlertDialog
                open={showDialog}
                onOpenChange={setShowDialog}
                className="z-[500] transition-all duration-300"
            >
                <AlertDialogContent className="z-[500] transition-all duration-300">
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Audio belum tersedia
                        </AlertDialogTitle>
                    </AlertDialogHeader>
                    <p className="text-sm text-muted-foreground">
                        Maaf, audio untuk huruf ini belum tersedia. Silakan coba
                        huruf lainnya.
                    </p>
                    <AlertDialogFooter>
                        <AlertDialogAction onClick={() => setShowDialog(false)}>
                            Tutup
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            <motion.div
                ref={containerRef}
                className="max-w-6xl mx-auto px-4  relative"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
            >
                {showConfetti && <Confetti />}
                {showWritingModal && <WritingPracticeModal />}

                {/* Navigation Bar - Now sticks to bottom when scrolling */}
                <AnimatePresence>
                    <motion.div
                        variants={bottomNavVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        className={cn(
                            "fixed bottom-0 max-full  bg-background/95 backdrop-blur-md border-t border-primary/20 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] z-50 py-3 px-4",
                            isMobile
                                ? "left-0 right-0"
                                : sidebarOpen
                                ? "left-80 right-0"
                                : "left-20 right-0",
                            "transition-all duration-300"
                        )}
                    >
                        <div className="max-w-6xl mx-auto flex items-center justify-between">
                            <motion.div
                                className="flex items-center gap-2"
                                whileHover={{ x: -5 }}
                                transition={{ type: "spring", stiffness: 400 }}
                            >
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                onClick={() =>
                                                    setShowFurigana(!showFurigana)
                                                }
                                                className="rounded-full hover:bg-primary/10 transition-all duration-300"
                                            >
                                                {showFurigana ? (
                                                    <EyeOff className="h-4 w-4" />
                                                ) : (
                                                    <Eye className="h-4 w-4" />
                                                )}
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            {showFurigana
                                                ? "Sembunyikan Furigana"
                                                : "Tampilkan Furigana"}
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                variant={
                                                    isFavorite
                                                        ? "default"
                                                        : "outline"
                                                }
                                                size="icon"
                                                onClick={toggleFavorite}
                                                className="rounded-full transition-all duration-300 hover:bg-primary/10"
                                            >
                                                {isFavorite ? (
                                                    <BookmarkCheck className="h-4 w-4" />
                                                ) : (
                                                    <Bookmark className="h-4 w-4" />
                                                )}
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            {isFavorite
                                                ? "Hapus dari Favorit"
                                                : "Tambahkan ke Favorit"}
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </motion.div>

                            <div className="flex items-center gap-3">
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                onClick={() =>
                                                    setFlashcardMode(!flashcardMode)
                                                }
                                                className="rounded-full hover:bg-primary/10 transition-all duration-300"
                                            >
                                                <BookOpen className="h-4 w-4" />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            Mode Flashcard
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>

                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-center space-x-2 text-sm bg-gradient-to-r from-background to-muted/50 dark:from-slate-950 dark:to-slate-900/50 p-3 rounded-lg shadow-sm border border-border/50 dark:border-slate-800/50  mb-[50px] w-fit"
                >
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                        <Link href={route("dashboard")}>
                            <span className="text-muted-foreground dark:text-slate-400 hover:text-violet-800 dark:hover:text-violet-300 transition-all duration-300">
                                Dashboard
                            </span>
                        </Link>
                        <span className="text-primary dark:text-violet-400">/</span>
                        <Link href={route("list-kosakata")}>
                            <span className="text-muted-foreground dark:text-slate-400 hover:text-violet-800 dark:hover:text-violet-300 transition-all duration-300">
                                List Kosakata
                            </span>
                        </Link>
                        <span className="text-primary dark:text-violet-400">/</span>
                        <Link href={route("detail-kosakata",{
                            id:vocabularyData.id
                        })}>
                            <span className="text-violet-400 dark:text-violet-600 capitalize">
                                Detail - {vocabularyData.romaji}
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
                            Detil Kosakata「{vocabularyData.furigana}」
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 text-lg max-w-2xl mx-auto">
                            Pelajari lebih dalam kosakata
                            <span className="relative inline-block mx-1 px-2 bg-primary/10 dark:bg-primary/30 text-primary dark:text-violet-300 rounded-md">
                                {vocabularyData.furigana}
                            </span>
                            , yang berarti
                            <span className="relative inline-block mx-1 px-2 bg-primary/10 dark:bg-primary/30 text-primary dark:text-violet-300 rounded-md">
                            {vocabularyData.meaning}
                            </span>
                            , lengkap dengan bentuk lain, cara baca, dan
                            penggunaannya dalam kalimat sehari-hari.
                            <br />
                            <span className="text-sm inline-block mt-2 bg-primary/5 px-3 py-1 rounded-full">
                                Kuasai makna dan konteks dari setiap kosakata yang
                                kamu pelajari!
                            </span>
                        </p>
                    </div>
                </motion.div>

                {/* Flashcard Mode - Enhanced with better design */}
                {flashcardMode ? (
                    <motion.div
                        className="mb-8"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                    >
                        <div className="text-center mb-6 relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-primary/10 blur-xl opacity-50"></div>
                            <motion.h2
                                className="text-2xl font-bold text-primary relative z-10"
                                initial={{ y: -20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.5 }}
                            >
                                Mode Flashcard
                            </motion.h2>
                            <motion.p
                                className="text-sm text-muted-foreground relative z-10"
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                            >
                                Klik kartu untuk membaliknya
                            </motion.p>
                        </div>

                        <div className="relative">
                            {/* Decorative elements */}
                            <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl"></div>
                            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl"></div>

                            <motion.div
                                className="w-full h-[350px] perspective-1000 cursor-pointer relative z-10"
                                onClick={toggleFlashcard}
                                whileHover={{ scale: 1.02 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                <motion.div
                                    className="relative w-full h-full transition-all duration-500"
                                    initial={false}
                                    animate={{
                                        rotateY: flashcardFlipped ? 180 : 0,
                                    }}
                                    transition={{ duration: 0.6 }}
                                    style={{ transformStyle: "preserve-3d" }}
                                >
                                    {/* Front of card (Kanji) */}
                                    <div
                                        className={`absolute w-full h-full backface-hidden rounded-xl border-2 border-primary/30 bg-gradient-to-br from-primary/10 to-primary/5 flex flex-col items-center justify-center p-6 shadow-lg shadow-primary/10 ${
                                            flashcardFlipped
                                                ? "opacity-0"
                                                : "opacity-100"
                                        }`}
                                        style={{ backfaceVisibility: "hidden" }}
                                    >
                                        <div className="absolute top-4 right-4 flex gap-2">
                                            <Badge
                                                variant="outline"
                                                className="bg-primary/10 border-primary/20 capitalize"
                                            >
                                                {vocabularyData.type}
                                            </Badge>
                                        </div>

                                        <motion.div
                                            className="text-8xl md:text-9xl font-bold mb-6 text-primary/90 relative"
                                            variants={floatVariants}
                                            animate="float"
                                        >
                                            {vocabularyData.kanji}
                                            <div className="absolute -inset-8 bg-primary/5 rounded-full blur-xl -z-10"></div>
                                        </motion.div>

                                        <div className="flex gap-3">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleClick(vocabularyData.audio)}
                                                className="rounded-full hover:bg-primary/20 transition-all duration-300 border-primary/30"
                                            >
                                                <Volume2 className="h-4 w-4 mr-2" />
                                                <span>Dengarkan</span>
                                            </Button>
                                        </div>

                                        <div className="absolute bottom-4 left-0 right-0 text-center">
                                            <motion.p
                                                className="text-sm text-muted-foreground"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 0.7 }}
                                                transition={{
                                                    delay: 1,
                                                    duration: 0.5,
                                                }}
                                            >
                                                Tap untuk membalik
                                            </motion.p>
                                        </div>
                                    </div>

                                    {/* Back of card (Meaning) */}
                                    <div
                                        className={`absolute w-full h-full backface-hidden rounded-xl border-2 border-primary/30 bg-gradient-to-br from-primary/10 to-primary/5 flex flex-col items-center justify-center p-6 shadow-lg shadow-primary/10 ${
                                            !flashcardFlipped
                                                ? "opacity-0"
                                                : "opacity-100"
                                        }`}
                                        style={{
                                            backfaceVisibility: "hidden",
                                            transform: "rotateY(180deg)",
                                        }}
                                    >
                                        <div className="text-center relative">
                                            <div className="absolute inset-0 bg-primary/5 rounded-full blur-xl -z-10 transform scale-150"></div>

                                            <div className="text-2xl font-medium mb-3">
                                                {vocabularyData.romaji}
                                            </div>
                                            <div className="text-4xl font-bold mb-4 text-primary">
                                                {vocabularyData.meaning}
                                            </div>

                                            {showFurigana && (
                                                <div className="text-xl text-muted-foreground mb-6 bg-primary/10 px-4 py-2 rounded-full inline-block">
                                                    {vocabularyData.furigana}
                                                </div>
                                            )}

                                            <div className="mt-2 mb-6 max-w-md mx-auto">
                                                <div className="flex items-center gap-2 bg-amber-500/10 p-3 rounded-lg">
                                                    <Lightbulb className="h-5 w-5 text-amber-500 flex-shrink-0" />
                                                    <span className="text-sm">
                                                        {vocabularyData.mnemonics}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex justify-center gap-3">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleClick(vocabularyData.audio)}
                                                    className="rounded-full hover:bg-primary/20 transition-all duration-300 border-primary/30"
                                                >
                                                    <Volume2 className="h-4 w-4 mr-2" />
                                                    <span>Dengarkan</span>
                                                </Button>
                                            </div>

                                            <div className="absolute bottom-4 left-0 right-0 text-center">
                                                <motion.p
                                                    className="text-sm text-muted-foreground"
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 0.7 }}
                                                    transition={{
                                                        delay: 1,
                                                        duration: 0.5,
                                                    }}
                                                >
                                                    Tap untuk membalik
                                                </motion.p>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </motion.div>
                        </div>

                        <div className="flex justify-center mt-8 gap-3">
                            <Button
                                variant="outline"
                                onClick={() => setFlashcardMode(false)}
                                className="rounded-full px-6 py-2 border-primary/30 hover:bg-primary/10 transition-all duration-300"
                            >
                                Kembali ke Detail
                            </Button>
                        </div>
                    </motion.div>
                ) : (
                    <>
                        {/* Main Vocabulary Card - Enhanced with better design */}
                        <motion.div variants={itemVariants}>
                            <Card
                                className={`mb-10 overflow-hidden border-2 border-primary/20 relative shadow-xl shadow-primary/5 ${
                                    isFavorite
                                        ? "bg-gradient-to-br from-transparent via-amber-50/10 to-transparent"
                                        : ""
                                }`}
                            >
                                {/* Background decorative elements */}
                                <div className="absolute -right-20 top-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl"></div>
                                <div className="absolute left-40 bottom-0 w-60 h-60 bg-primary/10 rounded-full blur-3xl"></div>

                                <CardHeader className="bg-gradient-to-r from-primary/20 to-transparent relative z-10 pb-6">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <CardTitle className="flex items-center gap-2 text-2xl md:text-3xl">
                                                <span className="text-primary">
                                                    {vocabularyData.meaning}
                                                </span>
                                            </CardTitle>
                                            <CardDescription className="mt-2 text-base">
                                                Kata kerja reguler grup 2 (-ru)
                                            </CardDescription>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button
                                                            variant={
                                                                isFavorite
                                                                    ? "default"
                                                                    : "outline"
                                                            }
                                                            size="icon"
                                                            onClick={toggleFavorite}
                                                            className="rounded-full transition-all duration-300 hover:bg-primary/10"
                                                        >
                                                            {isFavorite ? (
                                                                <BookmarkCheck className="h-4 w-4" />
                                                            ) : (
                                                                <Bookmark className="h-4 w-4" />
                                                            )}
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        {isFavorite
                                                            ? "Hapus dari Favorit"
                                                            : "Tambahkan ke Favorit"}
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </div>
                                    </div>
                                </CardHeader>

                                <CardContent className="pt-6 relative z-10">
                                    <div className="flex flex-col lg:flex-row md:items-center gap-8 mb-8">
                                        <motion.div
                                            className="text-center relative"
                                            whileHover={{ scale: 1.05 }}
                                            transition={{
                                                type: "spring",
                                                stiffness: 300,
                                            }}
                                        >
                                            <div className="absolute inset-0 bg-primary/10 rounded-full blur-xl transform scale-150"></div>
                                            <motion.div
                                                ref={kanjiRef}
                                                className="text-6xl md:text-8xl font-bold mb-3 relative z-10 bg-gradient-to-br from-primary to-primary/70 bg-clip-text text-transparent transition-all duration-300"
                                                onMouseEnter={handleKanjiHover}
                                                onMouseLeave={handleKanjiLeave}
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                {vocabularyData.kanji}
                                            </motion.div>

                                            {showFurigana && (
                                                <motion.div
                                                    className="text-xl text-primary/80 font-medium relative z-10"
                                                    initial={{ opacity: 0, y: -10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ duration: 0.3 }}
                                                >
                                                    {vocabularyData.furigana}
                                                </motion.div>
                                            )}

                                            <motion.div
                                                className="mt-4 relative z-10"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: 0.5 }}
                                            >
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleClick(vocabularyData.audio)}
                                                    className={`rounded-full transition-all duration-300 ${
                                                        isPlaying
                                                            ? "bg-primary text-primary-foreground animate-pulse"
                                                            : "bg-primary/10 hover:bg-primary/20 border-primary/30"
                                                    }`}
                                                >
                                                    {isPlaying ? (
                                                        <PauseCircle className="h-4 w-4 mr-1" />
                                                    ) : (
                                                        <Volume2 className="h-4 w-4 mr-1" />
                                                    )}
                                                    <span>
                                                        {isPlaying
                                                            ? "Memutar..."
                                                            : "Dengarkan"}
                                                    </span>
                                                </Button>
                                            </motion.div>
                                        </motion.div>

                                        <div className="flex-1 bg-gradient-to-br from-primary/10 to-transparent rounded-xl p-5 border border-primary/20 shadow-md">
                                            <div className="flex flex-col gap-3">
                                                <div className="flex justify-between items-center">
                                                    <div className="text-2xl font-medium text-primary/90">
                                                        {vocabularyData.romaji}
                                                    </div>
                                                </div>
                                                <div className="text-xl">
                                                    {vocabularyData.meaning}
                                                </div>

                                                <div className="mt-3 pt-3 border-t border-primary/10">
                                                    <div className="text-sm font-medium mb-1 text-muted-foreground">
                                                        Catatan:
                                                    </div>
                                                    <div className="text-sm bg-primary/10 p-3 rounded-md">
                                                        {vocabularyData.notes}
                                                    </div>
                                                </div>

                                                <div className="mt-3">
                                                    <div className="text-sm font-medium mb-1 text-muted-foreground">
                                                        Mnemonic:
                                                    </div>
                                                    <div className="flex items-center gap-2 bg-amber-500/10 p-3 rounded-md">
                                                        <Lightbulb className="h-4 w-4 text-amber-500 flex-shrink-0" />
                                                        <span className="text-sm">
                                                            {
                                                                vocabularyData.mnemonics
                                                            }
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-6 mb-2">
                                        <div className="flex justify-between items-center mb-3">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-medium">
                                                    Progress Pembelajaran
                                                </span>
                                                <Badge
                                                    variant="outline"
                                                    className={`${
                                                        isFavorite
                                                            ? "bg-amber-100/50 border-amber-200"
                                                            : "bg-primary/10 border-primary/20"
                                                    }`}
                                                >
                                                    {progress}%
                                                </Badge>
                                            </div>

                                            {progress < 100 && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={markAsLearned}
                                                    className="text-xs rounded-full hover:bg-primary/10"
                                                >
                                                    <Check className="h-3 w-3 mr-1" />
                                                    <span>Tandai Selesai</span>
                                                </Button>
                                            )}
                                        </div>

                                        <div className="relative h-4 rounded-full overflow-hidden">
                                            <div className="absolute inset-0 bg-primary/10 rounded-full"></div>
                                            <motion.div
                                                className="absolute top-0 left-0 h-full bg-primary rounded-full"
                                                initial={{ width: 0 }}
                                                animate={{ width: `${progress}%` }}
                                                transition={{
                                                    duration: 1,
                                                    delay: 0.5,
                                                }}
                                            ></motion.div>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap items-center justify-between gap-3 mt-6 pt-4 border-t border-primary/10">
                                        <div className="flex items-center gap-4">
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() =>
                                                                setFlashcardMode(
                                                                    true
                                                                )
                                                            }
                                                            className="rounded-full hover:bg-primary/10 flex items-center gap-2"
                                                        >
                                                            <BookOpen className="h-4 w-4" />
                                                            <span>Flashcard</span>
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        Belajar dengan Flashcard
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>

                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="rounded-full hover:bg-primary/10 flex items-center gap-2"
                                                            onClick={
                                                                openWritingModal
                                                            }
                                                        >
                                                            <Pencil className="h-4 w-4" />
                                                            <span>
                                                                Latihan Menulis
                                                            </span>
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        Latihan Menulis Kanji
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </div>

                                        <Button
                                            variant={
                                                isLearned ? "outline" : "default"
                                            }
                                            onClick={markAsLearned}
                                            disabled={isLearned}
                                            className="gap-2 rounded-full px-4"
                                        >
                                            {isLearned ? (
                                                <>
                                                    <Star className="h-4 w-4 text-amber-500" />
                                                    <span>Sudah Dipelajari</span>
                                                </>
                                            ) : (
                                                <>
                                                    <GraduationCap className="h-4 w-4" />
                                                    <span>
                                                        Tandai Sudah Dipelajari
                                                    </span>
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Example Sentences - Enhanced with better styling and interactivity */}
                        <motion.div variants={itemVariants} className="mb-10">
                            <div className="flex items-center gap-3 mb-6 bg-gradient-to-r from-primary/20 to-transparent p-3 rounded-lg">
                                <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                                    <MessageCircle className="h-5 w-5 text-primary" />
                                </div>
                                <h2 className="text-2xl font-bold">
                                    Contoh Kalimat
                                </h2>
                            </div>
                            {
                                vocabularyData.examples.length > 0 ? (
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                        {vocabularyData.examples.map((example, index) => (
                                            <motion.div
                                                key={example.id}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.1 * index }}
                                                whileHover={{
                                                    scale: 1.02,
                                                    boxShadow:
                                                        "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                                                }}
                                                onMouseEnter={() =>
                                                    highlightExample(example.id)
                                                }
                                                onMouseLeave={clearHighlight}
                                                className={`p-5 rounded-xl border-2 transition-all duration-300 ${
                                                    activeExample === example.id
                                                        ? "border-primary bg-gradient-to-br from-primary/10 to-transparent shadow-lg shadow-primary/10"
                                                        : "border-primary/20 hover:border-primary/30 bg-gradient-to-br from-primary/5 to-transparent"
                                                }`}
                                            >
                                                <div className="flex justify-between items-start mb-4">
                                                    <div className="flex-1">
                                                        <div className="text-lg font-medium mb-3 leading-relaxed tracking-wide">
                                                            {example.kanji}
                                                        </div>
                                                        {showFurigana && (
                                                            <div className="text-sm text-muted-foreground mb-3 leading-relaxed tracking-wide">
                                                                {example.furigana}
                                                            </div>
                                                        )}
                                                        <div className="text-base mb-3">
                                                            {example.romaji}
                                                        </div>
                                                        <div className="text-base text-muted-foreground font-medium bg-primary/5 p-2 rounded-md">
                                                            "{example.meaning}"
                                                        </div>
                                                    </div>
                                                    <motion.div
                                                        whileHover={{
                                                            scale: 1.1,
                                                            rotate: 10,
                                                        }}
                                                        whileTap={{ scale: 0.9 }}
                                                        className="ml-3"
                                                    >
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => handleClick  (example.audio)}
                                                            className={`rounded-full h-10 w-10 ${
                                                                isPlaying
                                                                    ? "bg-primary text-primary-foreground"
                                                                    : "bg-primary/10 hover:bg-primary/20 border border-primary/30"
                                                            }`}
                                                        >
                                                            {isPlaying ? (
                                                                <PauseCircle className="h-5 w-5" />
                                                            ) : (
                                                                <Volume2 className="h-5 w-5" />
                                                            )}
                                                        </Button>
                                                    </motion.div>
                                                </div>

                                                <div className="flex justify-end gap-2 mt-3">
                                                    <TooltipProvider>
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className="rounded-full text-xs"
                                                                >
                                                                    <Heart className="h-3 w-3 mr-1" />
                                                                    <span>Simpan</span>
                                                                </Button>
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                Simpan contoh kalimat ini
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>

                                                    <TooltipProvider>
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className="rounded-full text-xs"
                                                                >
                                                                    <Repeat className="h-3 w-3 mr-1" />
                                                                    <span>Ulangi</span>
                                                                </Button>
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                Ulangi audio
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                ) : (
                                    <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="p-8 rounded-xl border-2 border-dashed border-primary/20 flex flex-col items-center justify-center text-center"
                                >
                                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                                        <Sparkles className="h-8 w-8 text-primary/50" />
                                    </div>
                                    <h3 className="text-xl font-medium mb-2">
                                        Belum Ada Contoh Kalimat
                                    </h3>
                                    <p className="text-muted-foreground max-w-md mb-4">
                                        Kosakata ini belum memiliki Contoh Kalimat.Contoh Kalimat akan
                                        membantu Anda memahami penggunaan
                                        kata dalam berbagai konteks.
                                    </p>
                                    <Button
                                        variant="outline"
                                        className="rounded-full"
                                    >
                                        <Plus className="h-4 w-4 mr-2" />
                                        Tambahkan Contoh Kalimat
                                    </Button>
                                </motion.div>
                                )
                            }
                        </motion.div>

                        {/* Conjugations and Usage Patterns - Enhanced with better styling and interactivity */}
                        <motion.div variants={itemVariants} className="mb-10">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3 bg-gradient-to-r from-primary/20 to-transparent p-3 rounded-lg">
                                    <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                                        <Brain className="h-5 w-5 text-primary" />
                                    </div>
                                    <h2 className="text-2xl font-bold">
                                        Bentuk Lainnya
                                    </h2>
                                </div>

                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                        setShowEmptyState(!showEmptyState)
                                    }
                                    className="rounded-full text-xs"
                                >
                                    {showEmptyState
                                        ? "Tampilkan Data"
                                        : "Lihat Tanpa Data"}
                                </Button>
                            </div>

                            <Tabs
                                defaultValue="conjugations"
                                value={activeTab}
                                onValueChange={setActiveTab}
                                className="relative"
                            >
                                <div className="absolute -inset-4 -z-10 bg-gradient-to-br from-primary/10 via-transparent to-primary/5 rounded-xl blur-xl opacity-50"></div>

                            

                                <TabsContent value="conjugations" className="mt-6">
                                    {showEmptyState ||
                                    vocabularyData.conjugations.length === 0 ? (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="p-8 rounded-xl border-2 border-dashed border-primary/20 flex flex-col items-center justify-center text-center"
                                        >
                                            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                                                <Sparkles className="h-8 w-8 text-primary/50" />
                                            </div>
                                            <h3 className="text-xl font-medium mb-2">
                                                Belum Ada Bentuk Konjugasi
                                            </h3>
                                            <p className="text-muted-foreground max-w-md mb-4">
                                                Kosakata ini belum memiliki bentuk
                                                konjugasi. Bentuk konjugasi akan
                                                membantu Anda memahami penggunaan
                                                kata dalam berbagai konteks.
                                            </p>
                                            <Button
                                                variant="outline"
                                                className="rounded-full"
                                            >
                                                <Plus className="h-4 w-4 mr-2" />
                                                Tambahkan Konjugasi
                                            </Button>
                                        </motion.div>
                                    ) : (
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                            {vocabularyData.conjugations.map(
                                                (conj, index) => (
                                                    <motion.div
                                                        key={index}
                                                        initial={{
                                                            opacity: 0,
                                                            y: 20,
                                                        }}
                                                        animate={{
                                                            opacity: 1,
                                                            y: 0,
                                                        }}
                                                        transition={{
                                                            delay: 0.1 * index,
                                                        }}
                                                        className="border-2 border-primary/20 rounded-xl overflow-hidden shadow-md"
                                                    >
                                                        <div className="bg-gradient-to-r from-primary/20 to-transparent p-3 flex justify-between items-center">
                                                            <div className="font-medium">
                                                                {conj.form}
                                                            </div>
                                                            <Badge
                                                                variant="outline"
                                                                className="bg-primary/10 border-primary/20"
                                                            >
                                                                {conj.kanji}
                                                            </Badge>
                                                        </div>

                                                        <div className="p-4">
                                                            <div className="flex justify-between items-start mb-3">
                                                                <div>
                                                                    {showFurigana && (
                                                                        <div className="text-sm text-muted-foreground mb-1">
                                                                            {
                                                                                conj.furigana
                                                                            }
                                                                        </div>
                                                                    )}
                                                                    <div className="text-base mb-1">
                                                                        {
                                                                            conj.romaji
                                                                        }
                                                                    </div>
                                                                    <div className="text-sm text-muted-foreground">
                                                                        "
                                                                        {
                                                                            conj.meaning
                                                                        }
                                                                        "
                                                                    </div>
                                                                </div>
                                                                <motion.div
                                                                    whileHover={{
                                                                        scale: 1.1,
                                                                        rotate: 10,
                                                                    }}
                                                                    whileTap={{
                                                                        scale: 0.9,
                                                                    }}
                                                                >
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        onClick={() => handleClick(conj.audio)}
                                                                        className="rounded-full h-9 w-9 bg-primary/10 hover:bg-primary/20 border border-primary/30"
                                                                    >
                                                                        <Volume2 className="h-4 w-4" />
                                                                    </Button>
                                                                </motion.div>
                                                            </div>

                                                            <div className="mt-3 pt-3 border-t border-primary/10">
                                                                <div className="text-sm font-medium mb-2">
                                                                    Contoh:
                                                                </div>
                                                                {conj.examples.map(
                                                                    (
                                                                        example,
                                                                        idx
                                                                    ) => (
                                                                        <div
                                                                            key={
                                                                                idx
                                                                            }
                                                                            className="mb-3 bg-primary/10 p-3 rounded-lg"
                                                                        >
                                                                            <div className="text-base font-medium mb-1">
                                                                                {
                                                                                    example.kanji
                                                                                }
                                                                            </div>
                                                                            {showFurigana && (
                                                                                <div className="text-sm text-muted-foreground mb-1">
                                                                                    {
                                                                                        example.furigana
                                                                                    }
                                                                                </div>
                                                                            )}
                                                                            <div className="text-sm mb-1">
                                                                                {
                                                                                    example.romaji
                                                                                }
                                                                            </div>
                                                                            <div className="text-sm text-muted-foreground">
                                                                                "
                                                                                {
                                                                                    example.meaning
                                                                                }
                                                                                "
                                                                            </div>
                                                                        </div>
                                                                    )
                                                                )}
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                )
                                            )}
                                        </div>
                                    )}
                                </TabsContent>

                            </Tabs>
                        </motion.div>

                    

                        {/* Community Section - Replacing Practice Section */}
                        <motion.div
                            variants={itemVariants}
                            className="mb-10"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <div className="flex items-center gap-3 mb-6 bg-gradient-to-r from-primary/20 to-transparent p-3 rounded-lg">
                                <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                                    <Users className="h-5 w-5 text-primary" />
                                </div>
                                <h2 className="text-2xl font-bold">
                                    Komunitas Belajar
                                </h2>
                            </div>

                            <div className="border-2 border-primary/20 rounded-xl overflow-hidden shadow-lg">
                                <div className="bg-gradient-to-r from-primary/20 to-transparent p-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-primary/30 flex items-center justify-center">
                                                <Users className="h-5 w-5 text-primary-foreground" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-medium">
                                                    Diskusi Kosakata
                                                </h3>
                                                <p className="text-sm text-muted-foreground">
                                                    Bagikan tips dan trik belajar
                                                    dengan pengguna lain
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Badge
                                                variant="outline"
                                                className="bg-primary/10 border-primary/20"
                                            >
                                                <Users className="h-3 w-3 mr-1" />
                                                <span>
                                                    {vocabularyData.stats.learners}{" "}
                                                    Pelajar
                                                </span>
                                            </Badge>
                                            <Badge
                                                variant="outline"
                                                className="bg-primary/10 border-primary/20"
                                            >
                                                <MessageCircle className="h-3 w-3 mr-1" />
                                                <span>12 Komentar</span>
                                            </Badge>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-5">
                                    <div className="mb-6">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                                                <Info className="h-4 w-4 text-primary" />
                                            </div>
                                            <h4 className="text-base font-medium">
                                                Statistik Kosakata
                                            </h4>
                                        </div>

                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                            <div className="bg-primary/5 p-3 rounded-lg text-center">
                                                <div className="text-sm text-muted-foreground mb-1">
                                                    Dilihat
                                                </div>
                                                <div className="text-lg font-medium">
                                                    {vocabularyData.stats.views}
                                                </div>
                                            </div>
                                            <div className="bg-primary/5 p-3 rounded-lg text-center">
                                                <div className="text-sm text-muted-foreground mb-1">
                                                    Pelajar
                                                </div>
                                                <div className="text-lg font-medium">
                                                    {vocabularyData.stats.learners}
                                                </div>
                                            </div>
                                            <div className="bg-primary/5 p-3 rounded-lg text-center">
                                                <div className="text-sm text-muted-foreground mb-1">
                                                    Favorit
                                                </div>
                                                <div className="text-lg font-medium">
                                                    {vocabularyData.stats.favorites}
                                                </div>
                                            </div>
                                            <div className="bg-primary/5 p-3 rounded-lg text-center">
                                                <div className="text-sm text-muted-foreground mb-1">
                                                    Diperbarui
                                                </div>
                                                <div className="text-lg font-medium">
                                                    {
                                                        vocabularyData.stats
                                                            .lastUpdated
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mb-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                                                    <HelpCircle className="h-4 w-4 text-primary" />
                                                </div>
                                                <h4 className="text-base font-medium">
                                                    Pertanyaan Populer
                                                </h4>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="rounded-full text-xs"
                                            >
                                                Lihat Semua
                                            </Button>
                                        </div>

                                        <div className="space-y-3">
                                            <div className="border border-primary/20 rounded-lg p-3 hover:bg-primary/5 transition-colors cursor-pointer">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <Badge
                                                        variant="outline"
                                                        className="text-xs bg-amber-500/10 text-amber-600 border-amber-200"
                                                    >
                                                        Terjawab
                                                    </Badge>
                                                    <span className="text-sm text-muted-foreground">
                                                        Ditanyakan oleh Budi
                                                    </span>
                                                </div>
                                                <p className="text-sm font-medium">
                                                    Apa perbedaan penggunaan 食べる
                                                    dan 食う?
                                                </p>
                                            </div>
                                            <div className="border border-primary/20 rounded-lg p-3 hover:bg-primary/5 transition-colors cursor-pointer">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <Badge
                                                        variant="outline"
                                                        className="text-xs bg-primary/10 border-primary/20"
                                                    >
                                                        Diskusi
                                                    </Badge>
                                                    <span className="text-sm text-muted-foreground">
                                                        Ditanyakan oleh Ani
                                                    </span>
                                                </div>
                                                <p className="text-sm font-medium">
                                                    Bagaimana cara mengingat
                                                    konjugasi kata kerja ini dengan
                                                    mudah?
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <Button
                                            variant="outline"
                                            className="rounded-full gap-2 border-primary/30 hover:bg-primary/10"
                                        >
                                            <MessageCircle className="h-4 w-4" />
                                            <span>Ajukan Pertanyaan</span>
                                        </Button>

                                        <Button
                                            variant="default"
                                            className="rounded-full gap-2"
                                        >
                                            <ExternalLink className="h-4 w-4" />
                                            <span>Lihat Forum</span>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                    
                    </>
                )}
            </motion.div>
        </>
    );
};

export default function VocabularyDetailIndex() {
    const {kosakata} = usePage().props;
    console.log(kosakata);
    return (
        <Dashboard>
            <VocabularyDetailContent vocabularyData={kosakata} />
        </Dashboard>
    );
}

const Plus = ({ className }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="M12 5v14M5 12h14" />
    </svg>
);
