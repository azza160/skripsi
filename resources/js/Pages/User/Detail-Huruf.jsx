"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
    ChevronLeft,
    ChevronRight,
    Volume2,
    ArrowLeft,
    BookOpen,
    Sparkles,
    Check,
    GraduationCap,
    RefreshCw,
} from "lucide-react";
import { Link,router } from "@inertiajs/react";
import { usePage } from "@inertiajs/react"; // Inertia hook untuk mengambil data
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogFooter, AlertDialogAction, AlertDialogCancel } from "@/components/ui/alert-dialog";
import Dashboard from "../../Layouts/DashboardLayout";
import axios from "axios";
import LevelUpAlert from "@/components/LevelUpAlert";
import ExpAlert from "@/components/ExpAlert";

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


// Loading Component
const Loading = () => {
    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="relative w-16 h-16">
                <motion.div
                    className="absolute inset-0 border-4 border-white border-t-transparent rounded-full"
                    animate={{
                        rotate: 360,
                    }}
                    transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                />
            </div>
        </div>
    );
};

// Alert Component
const Alert = ({ message, onClose }) => {
    return (
        <AlertDialog open={true} onOpenChange={onClose}>
            <AlertDialogContent className="z-[500] transition-all duration-300">
                <AlertDialogHeader>
                    <AlertDialogTitle>{message}</AlertDialogTitle>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogAction onClick={onClose}>
                        Tutup
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default function HiraganaDetailPage() {
    const [currentStroke, setCurrentStroke] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [showParticles, setShowParticles] = useState(false);
    const [isCharacterHovered, setIsCharacterHovered] = useState(false);
    const [showDialog, setShowDialog] = useState(false);
    const [isPageLoading, setIsPageLoading] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [showLevelUp, setShowLevelUp] = useState(false);
    const [showExpAlert, setShowExpAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [showAlert, setShowAlert] = useState(false);
    const [levelUpData, setLevelUpData] = useState(null);
    const [expData, setExpData] = useState(null);

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
    }
  

    const {
        huruf,
        contoh_penggunaan,
        gambar_huruf,
        jenis,
        kategori,
        idList,
        status,
        isNull
    } = usePage().props;

    

    const currentIndex = idList.findIndex((id) => id === huruf.id);
    const prevId = currentIndex > 0 ? idList[currentIndex - 1] : null;
    const nextId = currentIndex < idList.length - 1 ? idList[currentIndex + 1] : null;

    useEffect(() => {
        // Simulate initial page load
        const timer = setTimeout(() => {
            setIsPageLoading(false);
        }, 800);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        // Trigger particles effect on load
        setShowParticles(true);
        const timer = setTimeout(() => setShowParticles(false), 2000);
        return () => clearTimeout(timer);
    }, []);

  

    const nextStroke = () => {
        if (currentStroke < huruf.jumlah_coretan - 1) {
            setCurrentStroke((prev) => prev + 1);
        }
    };

    const prevStroke = () => {
        if (currentStroke > 0) {
            setCurrentStroke((prev) => prev - 1);
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2,
            },
        },
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: "spring", stiffness: 300, damping: 24 },
        },
    };

    // Pulse animation using Framer Motion instead of CSS keyframes
    const pulseAnimation = {
        scale: [1, 1.05, 1],
        opacity: [0.5, 0.8, 0.5],
        transition: {
            duration: 4,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "reverse",
        },
    };

    

    const handleClickPaham = async () => {
        setIsLoading(true);
        const requestData = {
            pembelajaran_id: `belajar-${jenis}-${kategori}`,
            progress: 1,    
            id_huruf: huruf.id,
            jenis: jenis
        };
        
        try {
            const response = await axios.post(route('user.belajar.update-user-huruf'), requestData);
            setIsLoading(false);
            
            if (response.data.success) {
                if (response.data.message === 'Level up!') {
                    setShowLevelUp(true);
                    // Pass the new level and unlocked features to LevelUpAlert
                    setLevelUpData({
                        level: response.data.data.newLevel,
                        unlockedFeatures: response.data.data.unlockedFeatures
                    });
                    // Delay reload until alert is shown
                    setTimeout(() => {
                        router.reload();
                    }, 3000);
                } else if (response.data.message === 'exp anda bertambah 5 exp') {
                    setShowExpAlert(true);
                    // Pass the exp data to ExpAlert
                    setExpData({
                        currentExp: response.data.data.currentExp,
                        expGained: response.data.data.expGained,
                        nextLevelExp: response.data.data.nextLevelExp
                    });
                    // Delay reload until alert is shown
                    setTimeout(() => {
                        router.reload();
                    }, 3000);
                } else if (response.data.message === 'Huruf sudah dipelajari') {
                    setAlertMessage('Huruf ini sudah kamu pelajari sebelumnya.');
                    setShowAlert(true);
                    setTimeout(() => {
                        router.reload();
                    }, 2000);
                } else if (response.data.message === 'Progress berhasil diperbarui,namun exp tidak bertambah') {
                    setAlertMessage('Huruf ini sudah pernah kamu pahami. Tidak ada EXP tambahan kali ini.');
                    setShowAlert(true);
                    setTimeout(() => {
                        router.reload();
                    }, 2000);
                }
            }
        } catch (error) {
            setIsLoading(false);
            console.error('Error details:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status
            });
            alert('Gagal update progress');
        }
    };

    const handleClickPaham2 = async () => {
        setIsLoading(true);
        const requestData = {
            id_huruf: huruf.id,
            jenis: jenis,
            pembelajaran_id: `belajar-${jenis}-${kategori}`
        };

        try {
            const response = await axios.post(route('user.belajar.update-user-huruf-paham'), requestData);
            setIsLoading(false);
            
            if (response.data.success) {
                setAlertMessage('Kamu menandai huruf ini sebagai belum dipahami. Ayo ulangi belajarnya!');
                setShowAlert(true);
                setTimeout(() => {
                    router.reload();
                }, 2000);
            }
        } catch (error) {
            setIsLoading(false);
            console.error('Error details:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status
            });
            alert('Gagal update progress');
        }
    };  
      
      

    return (
        <Dashboard>
            <>
                {isLoading && <Loading />}
                <AnimatePresence mode="wait">
                    {showLevelUp && <LevelUpAlert onClose={() => setShowLevelUp(false)} level={levelUpData?.level} unlockedFeatures={levelUpData?.unlockedFeatures} />}
                    {showExpAlert && <ExpAlert onClose={() => setShowExpAlert(false)} currentExp={expData?.currentExp} expGained={expData?.expGained} nextLevelExp={expData?.nextLevelExp} />}
                    {showAlert && <Alert message={alertMessage} onClose={() => setShowAlert(false)} />}
                </AnimatePresence>
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
                <div className="bg-transparent text-foreground">
                    {/* Decorative elements */}
                    <div className="fixed inset-0 pointer-events-none overflow-hidden">
                        <div className="absolute top-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
                        <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>
                    </div>

                    <div className="max-w-6xl mx-auto px-4 relative z-10">
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
                                    {/* breadcrump */}
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
                                            <span className="text-primary dark:text-violet-400">
                                                /
                                            </span>
                                            <Link href={route("huruf")}>
                                                <span className="text-muted-foreground dark:text-slate-400 hover:text-violet-800 dark:hover:text-violet-300 transition-all duration-300">
                                                    Huruf Jepang
                                                </span>
                                            </Link>
                                            <span className="text-primary dark:text-violet-400">
                                                /
                                            </span>
                                            <Link
                                                href={route(
                                                    jenis === "hiragana"
                                                        ? "kategori-huruf-hiragana"
                                                        : "kategori-huruf-katakana"
                                                )}
                                            >
                                                <span className="text-muted-foreground dark:text-slate-400 hover:text-viol;let-800 dark:hover:text-violet-300 transition-all duration-300 capitalize">
                                                    Kategori Huruf {jenis}
                                                </span>
                                            </Link>
                                            <span className="text-primary dark:text-violet-400">
                                                /
                                            </span>
                                            <Link
                                                href={route("huruf-list", {
                                                    jenis: jenis,
                                                    kategori: kategori,
                                                })}
                                            >
                                                <span className="text-muted-foreground dark:text-slate-400 hover:text-violet-800 dark:hover:text-violet-300 transition-all duration-300">
                                                    Huruf {jenis} {kategori}
                                                </span>
                                            </Link>
                                            <span className="text-primary dark:text-violet-400">
                                                /
                                            </span>
                                            <Link
                                                href={route("huruf-hiragana-detail", {
                                                    jenis: jenis,
                                                    kategori: kategori,
                                                    id: huruf.id,
                                                })}
                                            >
                                                <span className="text-violet-400 dark:text-violet-600">
                                                    Detail -{" "}
                                                    <span className="text-[20px]">
                                                        {huruf.huruf}
                                                    </span>
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
                                        className="mb-5 text-center relative"
                                    >
                                        <div className="py-8 px-4 relative z-0 bg-violet-300/20 dark:bg-violet-500/20 rounded-lg">
                                            <div className="inline-block mb-4 bg-violet-500/20 p-2 rounded-full">
                                                <GraduationCap className="h-8 w-8 text-slate-900 dark:text-slate-200" />
                                            </div>
                                            <h1 className="text-4xl md:text-5xl font-bold mb-3 text-slate-900 dark:text-slate-200 capitalize">
                                                Detail Huruf「{huruf.huruf}」
                                            </h1>
                                            <p className="text-slate-500 dark:text-slate-400 text-lg max-w-2xl mx-auto">
                                                Pelajari lebih dalam tentang huruf
                                                <span className="relative inline-block mx-1 px-2 bg-primary/10 dark:bg-primary/30 text-primary dark:text-violet-300 rounded-md">
                                                    {huruf.huruf}
                                                </span>
                                                , termasuk cara membaca, menulis, dan
                                                penggunaannya dalam
                                                <span className="relative inline-block mx-1 px-2 bg-primary/10 dark:bg-primary/30 text-primary dark:text-violet-300 rounded-md">
                                                    kosakata Jepang
                                                </span>
                                                .
                                                <br />
                                                <span className="text-sm inline-block mt-2 bg-primary/5 px-3 py-1 rounded-full">
                                                    Pahami huruf ini dengan contoh dan latihan
                                                    langsung!
                                                </span>
                                            </p>
                                        </div>
                                    </motion.div>

                                    <motion.div
                                        variants={containerVariants}
                                        initial="hidden"
                                        animate="visible"
                                        className="space-y-12"
                                    >
                                        {/* Character Header - Completely Redesigned */}
                                        <motion.div variants={itemVariants}>
                                            <div className={`relative overflow-hidden rounded-3xl shadow-xl border transition-all duration-500 ${
                                                status 
                                                ? 'bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/50 dark:to-green-950/50 border-emerald-200 dark:border-emerald-800/50' 
                                                : 'bg-background border-primary/20'
                                            }`}>
                                                {/* Background decorative elements */}
                                                <div className={`absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-70 ${
                                                    status 
                                                    ? 'bg-emerald-400/20 dark:bg-emerald-500/20' 
                                                    : 'bg-primary/10'
                                                }`}></div>
                                                <div className={`absolute bottom-0 left-0 w-64 h-64 rounded-full blur-2xl -translate-x-1/4 translate-y-1/4 ${
                                                    status 
                                                    ? 'bg-green-400/20 dark:bg-green-500/20' 
                                                    : 'bg-primary/5'
                                                }`}></div>

                                                {/* Content container */}
                                                <div className="relative z-10 p-8 md:p-10">
                                                    {/* Top info bar */}
                                                    <div className="flex flex-col lg:flex-row justify-between items-start sm:items-center mb-[80px] lg:mb-8 gap-4">
                                                        <div className="flex flex-wrap items-center gap-3">
                                                            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                                                                status 
                                                                ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300' 
                                                                : 'bg-primary/15 text-primary'
                                                            }`}>
                                                                {huruf.kategori}
                                                            </div>
                                                            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                                                                status 
                                                                ? 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300' 
                                                                : 'bg-primary/10 text-primary/80'
                                                            }`}>
                                                                Level: 1
                                                            </div>
                                                            {status && (
                                                                <motion.div
                                                                    initial={{ scale: 0, opacity: 0 }}
                                                                    animate={{ scale: 1, opacity: 1 }}
                                                                    transition={{ delay: 0.3, type: "spring" }}
                                                                    className="bg-emerald-100 dark:bg-emerald-900/50 px-3 py-1 rounded-full text-sm font-medium text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5"
                                                                >
                                                                    <Check className="h-3.5 w-3.5" />
                                                                    Sudah Dipelajari
                                                                </motion.div>
                                                            )}
                                                        </div>

                                                        <Button
                                                            onClick={() => handleClick(huruf.audio)}
                                                            className={`rounded-full px-4 py-2 flex items-center gap-2 shadow-md hover:shadow-lg transition-all w-full sm:w-auto justify-center ${
                                                                status 
                                                                ? 'bg-emerald-500 hover:bg-emerald-600 text-white' 
                                                                : 'bg-primary/90 hover:bg-primary text-white'
                                                            }`}
                                                        >
                                                            <Volume2
                                                                size={16}
                                                                className={
                                                                    isPlaying
                                                                        ? "animate-pulse"
                                                                        : ""
                                                                }
                                                            />
                                                            <span className="text-sm">
                                                                Dengarkan Pelafalan
                                                            </span>
                                                        </Button>
                                                    </div>

                                                    {/* Main character display */}
                                                    <div className="grid lg:grid-cols-2 gap-8 items-center">
                                                        {/* Left side - Character */}
                                                        <div className="flex justify-center my-6 md:my-0">
                                                            <div className="relative">
                                                                {/* Animated rings - Only dashed border */}
                                                                <div className="absolute inset-0 flex items-center justify-center">
                                                                    {/* Background pulse effect using Framer Motion */}
                                                                    <motion.div
                                                                        className={`w-48 h-48 md:w-64 md:h-64 rounded-full ${
                                                                            status 
                                                                            ? 'bg-emerald-400/20 dark:bg-emerald-500/20' 
                                                                            : 'bg-primary/5'
                                                                        }`}
                                                                        animate={pulseAnimation}
                                                                    ></motion.div>

                                                                    <motion.div
                                                                        className={`absolute w-56 h-56 md:w-72 md:h-72 rounded-full border-2 border-dashed ${
                                                                            status 
                                                                            ? 'border-emerald-400/30 dark:border-emerald-500/30' 
                                                                            : 'border-primary/30'
                                                                        }`}
                                                                        animate={{
                                                                            rotate: 360,
                                                                        }}
                                                                        transition={{
                                                                            duration: 40,
                                                                            repeat: Infinity,
                                                                            ease: "linear",
                                                                        }}
                                                                    ></motion.div>
                                                                </div>

                                                                {/* Character */}
                                                                <motion.div
                                                                    className="relative z-10 flex items-center justify-center"
                                                                    initial={{
                                                                        scale: 0.8,
                                                                        opacity: 0,
                                                                    }}
                                                                    animate={{
                                                                        scale: 1,
                                                                        opacity: 1,
                                                                    }}
                                                                    transition={{
                                                                        type: "spring",
                                                                        stiffness: 200,
                                                                        damping: 20,
                                                                        delay: 0.3,
                                                                    }}
                                                                    onHoverStart={() =>
                                                                        setIsCharacterHovered(
                                                                            true
                                                                        )
                                                                    }
                                                                    onHoverEnd={() =>
                                                                        setIsCharacterHovered(
                                                                            false
                                                                        )
                                                                    }
                                                                >
                                                                    <motion.div
                                                                        className={`text-8xl sm:text-9xl md:text-[12rem] font-bold ${
                                                                            status 
                                                                            ? 'text-emerald-600 dark:text-emerald-400' 
                                                                            : 'text-foreground'
                                                                        }`}
                                                                        whileHover={{
                                                                            scale: 1.1,
                                                                            textShadow: status 
                                                                                ? "0 0 8px rgba(16, 185, 129, 0.5)" 
                                                                                : "0 0 8px rgba(var(--primary), 0.5)",
                                                                        }}
                                                                        animate={
                                                                            isCharacterHovered
                                                                                ? {
                                                                                    y: [
                                                                                        0,
                                                                                        -10,
                                                                                        0,
                                                                                    ],
                                                                                    transition:
                                                                                        {
                                                                                            duration: 1.5,
                                                                                            repeat: Infinity,
                                                                                            repeatType:
                                                                                                "reverse",
                                                                                        },
                                                                                }
                                                                                : {}
                                                                        }
                                                                    >
                                                                        {huruf.huruf}
                                                                    </motion.div>

                                                                    <AnimatePresence>
                                                                        {(showParticles ||
                                                                            isCharacterHovered) && (
                                                                            <motion.div
                                                                                className="absolute inset-0 flex items-center justify-center"
                                                                                initial={{
                                                                                    opacity: 0,
                                                                                }}
                                                                                animate={{
                                                                                    opacity: 1,
                                                                                }}
                                                                                exit={{
                                                                                    opacity: 0,
                                                                                }}
                                                                            >
                                                                                {[
                                                                                    ...Array(
                                                                                        12
                                                                                    ),
                                                                                ].map(
                                                                                    (_, i) => (
                                                                                        <motion.div
                                                                                            key={
                                                                                                i
                                                                                            }
                                                                                            className={`absolute w-2 h-2 rounded-full ${
                                                                                                status 
                                                                                                ? 'bg-emerald-500' 
                                                                                                : 'bg-primary'
                                                                                            }`}
                                                                                            initial={{
                                                                                                x: 0,
                                                                                                y: 0,
                                                                                                scale: 0,
                                                                                            }}
                                                                                            animate={{
                                                                                                x:
                                                                                                    (Math.random() -
                                                                                                        0.5) *
                                                                                                    200,
                                                                                                y:
                                                                                                    (Math.random() -
                                                                                                        0.5) *
                                                                                                    200,
                                                                                                scale:
                                                                                                    Math.random() *
                                                                                                    2,
                                                                                                opacity: 0,
                                                                                            }}
                                                                                            transition={{
                                                                                                duration: 1.5,
                                                                                                ease: "easeOut",
                                                                                            }}
                                                                                        />
                                                                                    )
                                                                                )}
                                                                            </motion.div>
                                                                        )}
                                                                    </AnimatePresence>
                                                                </motion.div>
                                                            </div>
                                                        </div>

                                                        {/* Right side - Info */}
                                                        <div className="flex flex-col justify-center mt-[40px]">
                                                            <div className="space-y-6">
                                                                <div>
                                                                    <h1 className={`text-4xl md:text-5xl font-bold mb-2 tracking-tight flex flex-wrap items-center gap-3 ${
                                                                        status 
                                                                        ? 'text-emerald-700 dark:text-emerald-300' 
                                                                        : 'text-primary'
                                                                    }`}>
                                                                        <span>
                                                                            {huruf.romaji.toUpperCase()}
                                                                        </span>
                                                                        <span className="text-5xl text-muted-foreground">
                                                                            - {huruf.huruf}
                                                                        </span>
                                                                    </h1>
                                                                    <div className={`h-1 w-20 rounded-full mb-4 ${
                                                                        status 
                                                                        ? 'bg-emerald-500/50' 
                                                                        : 'bg-primary/50'
                                                                    }`}></div>
                                                                    <p className="text-muted-foreground text-lg">
                                                                        {huruf.deskripsi}
                                                                    </p>
                                                                </div>

                                                                <div className="grid grid-cols-2 gap-3 mt-4">
                                                                    <div className={`rounded-xl p-4 flex flex-col items-center text-center justify-center ${
                                                                        status 
                                                                        ? 'bg-emerald-100 dark:bg-emerald-900/30' 
                                                                        : 'bg-primary/10'
                                                                    }`}>
                                                                        <span className={`text-sm mb-1 ${
                                                                            status 
                                                                            ? 'text-emerald-700 dark:text-emerald-300' 
                                                                            : 'text-muted-foreground'
                                                                        }`}>
                                                                            Jumlah Coretan
                                                                        </span>
                                                                        <span className={`text-xl md:text-2xl font-bold ${
                                                                            status 
                                                                            ? 'text-emerald-600 dark:text-emerald-400' 
                                                                            : 'text-primary'
                                                                        }`}>
                                                                            {
                                                                                huruf.jumlah_coretan
                                                                            }
                                                                        </span>
                                                                    </div>
                                                                    <div className={`rounded-xl p-4 flex flex-col items-center justify-center text-center ${
                                                                        status 
                                                                        ? 'bg-emerald-100 dark:bg-emerald-900/30' 
                                                                        : 'bg-primary/10'
                                                                    }`}>
                                                                        <span className={`text-sm mb-1 ${
                                                                            status 
                                                                            ? 'text-emerald-700 dark:text-emerald-300' 
                                                                            : 'text-muted-foreground'
                                                                        }`}>
                                                                            Kategori
                                                                        </span>
                                                                        <span className={`text-xl md:text-2xl font-bold text-center ${
                                                                            status 
                                                                            ? 'text-emerald-600 dark:text-emerald-400' 
                                                                            : 'text-primary'
                                                                        }`}>
                                                                            {huruf.kategori}
                                                                        </span>
                                                                    </div>
                                                                </div>

                                                                {/* Understanding Status Buttons */}
                                                                <div className="flex flex-col sm:flex-row gap-3 mt-6">
                                                                    <Button
                                                                        onClick={() => handleClickPaham()}
                                                                        className={`flex-1 justify-center items-center shadow-md hover:shadow-lg transition-all duration-300 rounded-xl py-4 md:py-6 ${
                                                                            status 
                                                                            ? 'bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white' 
                                                                            : 'bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground'
                                                                        }`}
                                                                    >
                                                                        <div className="flex items-center justify-center gap-2">
                                                                            <Check className="h-5 w-5" />
                                                                            <span className="font-medium">Saya Paham</span>
                                                                        </div>
                                                                    </Button>
                                                                    {
                                                                        (!isNull && status) && (
                                                                        <Button
                                                                            variant="outline"
                                                                            className="flex-1 border-2 border-muted-foreground/30 hover:border-muted-foreground/50 hover:bg-muted/50 text-muted-foreground hover:text-foreground shadow-md hover:shadow-lg transition-all duration-300 rounded-xl py-4 md:py-6"
                                                                            onClick={() => handleClickPaham2()}  
                                                                        >
                                                                            <div className="flex items-center justify-center gap-2">
                                                                                <RefreshCw className="h-5 w-5" />
                                                                                <span className="font-medium">Belum Paham Lagi</span>
                                                                            </div>
                                                                        </Button>
                                                                        )
                                                                    }
                                                                </div>

                                                                <div className="flex flex-wrap gap-2 mt-2">
                                                                    <div className={`flex items-center gap-1 text-sm px-3 py-1 rounded-full ${
                                                                        status 
                                                                        ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300' 
                                                                        : 'bg-muted/50 text-muted-foreground'
                                                                    }`}>
                                                                        <Check
                                                                            size={14}
                                                                            className={status ? 'text-emerald-500' : 'text-primary'}
                                                                        />
                                                                        <span>Vokal Dasar</span>
                                                                    </div>
                                                                    <div className={`flex items-center gap-1 text-sm px-3 py-1 rounded-full ${
                                                                        status 
                                                                        ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300' 
                                                                        : 'bg-muted/50 text-muted-foreground'
                                                                    }`}>
                                                                        <Check
                                                                            size={14}
                                                                            className={status ? 'text-emerald-500' : 'text-primary'}
                                                                        />
                                                                        <span>
                                                                            Mudah Ditulis
                                                                        </span>
                                                                    </div>
                                                                    <div className={`flex items-center gap-1 text-sm px-3 py-1 rounded-full ${
                                                                        status 
                                                                        ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300' 
                                                                        : 'bg-muted/50 text-muted-foreground'
                                                                    }`}>
                                                                        <Check
                                                                            size={14}
                                                                            className={status ? 'text-emerald-500' : 'text-primary'}
                                                                        />
                                                                        <span>
                                                                            Sering Digunakan
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>

                                        {/* Stroke Order Viewer - Enhanced */}
                                        <motion.div
                                            variants={itemVariants}
                                            className="bg-card rounded-3xl shadow-xl p-8 border border-muted/50"
                                        >
                                            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                                                <div>
                                                    <h2 className="text-2xl font-bold mb-1 flex items-center gap-2">
                                                        <BookOpen
                                                            size={20}
                                                            className="text-primary"
                                                        />
                                                        Urutan Coretan
                                                    </h2>
                                                    <p className="text-muted-foreground text-sm">
                                                        Pelajari cara menulis huruf dengan benar
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex flex-col items-center">
                                                <div className="relative w-full max-w-md h-56 sm:h-72 bg-gradient-to-b from-muted/50 to-muted/30 rounded-2xl flex items-center justify-center mb-6 border border-muted/50 shadow-inner overflow-hidden">
                                                    {/* Decorative elements */}
                                                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
                                                    <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>

                                                    {gambar_huruf.length > 0 ? (
                                                        <motion.img
                                                            key={currentStroke}
                                                            src={
                                                                gambar_huruf[currentStroke].link
                                                            }
                                                            className="w-[220px] h-[220px] sm:w-[270px] sm:h-[270px] object-contain"
                                                            initial={{ opacity: 0, scale: 0.8 }}
                                                            animate={{ opacity: 1, scale: 1 }}
                                                            transition={{ duration: 0.3 }}
                                                        />
                                                    ) : (
                                                        <p className="text-slate-400 text-sm italic mt-4 text-center">
                                                            Gambar stroke coretan belum tersedia
                                                            untuk huruf ini.
                                                        </p>
                                                    )}
                                                </div>

                                                {/* Progress indicator */}
                                                <div className="w-full max-w-md mb-6">
                                                    <div className="flex justify-between mb-2">
                                                        <span className="text-sm font-medium">
                                                            Progress
                                                        </span>
                                                        <span className="text-sm text-primary font-medium">
                                                            {currentStroke + 1}/
                                                            {huruf.jumlah_coretan}
                                                        </span>
                                                    </div>
                                                    <div className="w-full bg-muted/50 rounded-full h-2.5 overflow-hidden">
                                                        <motion.div
                                                            className="bg-primary h-2.5 rounded-full"
                                                            initial={{
                                                                width: `${
                                                                    (1 / huruf.jumlah_coretan) *
                                                                    100
                                                                }%`,
                                                            }}
                                                            animate={{
                                                                width: `${
                                                                    ((currentStroke + 1) /
                                                                        huruf.jumlah_coretan) *
                                                                    100
                                                                }%`,
                                                            }}
                                                            transition={{ duration: 0.3 }}
                                                        ></motion.div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between w-full max-w-md gap-2">
                                                    <Button
                                                        onClick={prevStroke}
                                                        disabled={currentStroke === 0}
                                                        variant="outline"
                                                        className="flex items-center gap-1 rounded-xl shadow-sm hover:shadow transition-all disabled:opacity-50 text-xs sm:text-sm px-2 sm:px-4"
                                                    >
                                                        <ChevronLeft size={16} />
                                                        <span className="hidden sm:inline">
                                                            Sebelumnya
                                                        </span>
                                                    </Button>

                                                    <Button
                                                        onClick={nextStroke}
                                                        disabled={
                                                            currentStroke ===
                                                            huruf.jumlah_coretan - 1
                                                        }
                                                        variant="outline"
                                                        className="flex items-center gap-1 rounded-xl shadow-sm hover:shadow transition-all disabled:opacity-50 text-xs sm:text-sm px-2 sm:px-4"
                                                    >
                                                        <span className="hidden sm:inline">
                                                            Selanjutnya
                                                        </span>
                                                        <ChevronRight size={16} />
                                                    </Button>
                                                </div>
                                            </div>
                                        </motion.div>

                                        {/* Examples - Redesigned */}
                                        <motion.div variants={itemVariants}>
                                            <div className="flex items-center gap-2 mb-6">
                                                <h2 className="text-2xl font-bold flex items-center gap-2">
                                                    <Sparkles
                                                        size={20}
                                                        className="text-primary"
                                                    />
                                                    Contoh Penggunaan
                                                </h2>
                                                <div className="h-px flex-grow bg-gradient-to-r from-primary/20 to-transparent"></div>
                                            </div>

                                                    {
                                                        contoh_penggunaan && contoh_penggunaan.length > 0 ? (
                                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                                                                {contoh_penggunaan.map((example, index) => (
                                                                    <motion.div
                                                                        key={index}
                                                                        whileHover={{ y: -8, scale: 1.02 }}
                                                                        transition={{
                                                                            type: "spring",
                                                                            stiffness: 400,
                                                                            damping: 10,
                                                                        }}
                                                                    >
                                                                        <Card className="p-4 sm:p-6 h-full flex flex-col justify-between border border-primary/10 rounded-2xl shadow-lg hover:shadow-xl transition-all overflow-hidden relative bg-gradient-to-br from-card to-card/95">
                                                                            {/* Decorative corner */}
                                                                            <div className="absolute top-0 right-0 w-16 h-16 bg-primary/5 -translate-y-8 translate-x-8 rounded-full blur-xl"></div>

                                                                            <div className="flex justify-between items-start">
                                                                                <div>
                                                                                    <h3 className="text-3xl font-bold mb-1 text-foreground/90">
                                                                                        {example.kata}
                                                                                    </h3>
                                                                                    <p className="text-sm text-primary/80 font-medium">
                                                                                        {example.romaji}
                                                                                    </p>
                                                                                </div>
                                                                                <Button
                                                                                    size="icon"
                                                                                    variant="ghost"
                                                                                    className="h-10 w-10 rounded-full bg-primary/10 hover:bg-primary/20 text-primary"
                                                                                    onClick={() => handleClick(example.audio)}
                                                                                
                                                                                >
                                                                                    <Volume2 size={18} />
                                                                                </Button>
                                                                            </div>

                                                                            <div className="mt-4 pt-4 border-t border-primary/10">
                                                                                <p className="text-foreground/80 font-medium">
                                                                                    {example.arti}
                                                                                </p>
                                                                            </div>
                                                                        </Card>
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
                                                               Contoh Penggunaan Belum Ada
                                                            </h3>
                                                            <p className="text-muted-foreground max-w-md mb-4">
                                                                Huruf ini belum memiliki Contoh Penggunaan. Contoh Penggunaan akan
                                                                membantu Anda memahami penggunaan
                                                                huruf dalam berbagai konteks.
                                                            </p>
                                                            <Button
                                                                variant="outline"
                                                                className="rounded-full"
                                                            >
                                                                <Plus className="h-4 w-4 mr-2" />
                                                                Tambahkan Contoh Penggunaan
                                                            </Button>
                                                        </motion.div>
                                                        )
                                                    }
                                        </motion.div>

                                        {/* Learning Tip - Enhanced */}
                                        <motion.div
                                            variants={itemVariants}
                                            className="bg-gradient-to-r from-primary/10 to-transparent border border-primary/20 rounded-3xl p-8 flex items-start gap-6 shadow-lg"
                                        >
                                            <div className="bg-primary/20 text-primary rounded-full p-4 mt-1 shadow-inner">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="28"
                                                    height="28"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    className="lucide lucide-lightbulb"
                                                >
                                                    <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
                                                    <path d="M9 18h6" />
                                                    <path d="M10 22h4" />
                                                </svg>
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold mb-2">
                                                    Tips Belajar
                                                </h3>
                                                <p className="text-foreground/80 text-lg">
                                                    {huruf.catatan}
                                                </p>
                                            </div>
                                        </motion.div>
                                        

                                        {/* Navigation - Enhanced */}
                                        <motion.div
                                            variants={itemVariants}
                                            className="flex justify-between pt-6 border-t border-primary/10"
                                        >
                                            {prevId ? (
                                                <Link
                                                    href={route("huruf-hiragana-detail", {
                                                        jenis:jenis,
                                                        kategori:kategori,
                                                        id: prevId,
                                                    })}
                                                
                                                    data={{ idList }}
                                                >
                                                    <Button
                                                        variant="outline"
                                                        className="flex items-center gap-2 rounded-xl border-primary/20 hover:bg-primary/10 hover:border-primary/30 transition-all shadow-sm hover:shadow"
                                                    >
                                                        <ChevronLeft size={18} />
                                                        <span>Huruf Sebelumnya</span>
                                                    </Button>
                                                </Link>
                                            ) : (
                                        
                                                <Button
                                                disabled
                                                    variant="outline"
                                                    className="flex items-center gap-2 rounded-xl border-primary/20 hover:bg-primary/10 hover:border-primary/30 transition-all shadow-sm hover:shadow"
                                                >
                                                    <ChevronLeft size={18} />
                                                    <span>Huruf Sebelumnya</span>
                                                </Button>
                                            
                                            )}
                                            {
                                            nextId ? (
                                                <Link
                                                    href={route("huruf-hiragana-detail", {
                                                        jenis:jenis,
                                                        kategori:kategori,
                                                        id: nextId,
                                                    })}
                                                
                                                    data={{ idList }}
                                                >
                                                    <Button
                                                        variant="outline"
                                                        className="flex items-center gap-2 rounded-xl border-primary/20 hover:bg-primary/10 hover:border-primary/30 transition-all shadow-sm hover:shadow"
                                                    >
                                                        <span>Huruf Selanjutnya</span>
                                                        <ChevronRight size={18} />
                                                    </Button>
                                                </Link>
                                            ) : (
            
                                                <Button
                                                disabled
                                                    variant="outline"
                                                    className="flex items-center gap-2 rounded-xl border-primary/20 hover:bg-primary/10 hover:border-primary/30 transition-all shadow-sm hover:shadow"
                                                >
                                                    <span>Huruf Selanjutnya</span>
                                                    <ChevronRight size={18} />
                                                </Button>
        
                                            )
                                            }
                                            
                                        </motion.div>
                                    </motion.div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </>
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
