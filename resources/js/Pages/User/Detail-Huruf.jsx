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
} from "lucide-react";
import { Link } from "@inertiajs/react";
import { usePage } from "@inertiajs/react"; // Inertia hook untuk mengambil data

import Dashboard from "../../Layouts/DashboardLayout";

// Contoh data untuk huruf Hiragana "あ" (a)
const hiraganaData = {
    character: "あ",
    romaji: "a",
    description:
        "Huruf ini mewakili bunyi 'A', dan sering digunakan dalam kata dasar bahasa Jepang.",
    strokeCount: 3,

    tip: "Huruf 'あ' merupakan salah satu dari lima vokal dasar dalam Hiragana.",
    prev: "ん",
    next: "い",
    category: "Vokal",
    level: "Dasar",
};

export default function HiraganaDetailPage() {
    const [currentStroke, setCurrentStroke] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [showParticles, setShowParticles] = useState(false);
    const [isCharacterHovered, setIsCharacterHovered] = useState(false);
  

    const {
        huruf,
        contoh_penggunaan,
        gambar_huruf,
        jenis,
        kategori,
        idList
    } = usePage().props;

      console.log(idList)
    

    const currentIndex = idList.findIndex((id) => id === huruf.id);
    const prevId = currentIndex > 0 ? idList[currentIndex - 1] : null;
    const nextId = currentIndex < idList.length - 1 ? idList[currentIndex + 1] : null;

    useEffect(() => {
        // Trigger particles effect on load
        setShowParticles(true);
        const timer = setTimeout(() => setShowParticles(false), 2000);
        return () => clearTimeout(timer);
    }, []);

    const playPronunciation = () => {
        setIsPlaying(true);
        // Simulasi pemutaran audio
        const audio = new Audio(`/audio/${huruf.romaji}.mp3`);
        audio.play().catch((e) => console.error("Audio playback failed:", e));
        setTimeout(() => setIsPlaying(false), 1000);
    };

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

    return (
        <Dashboard>
            <div className="bg-transparent text-foreground ">
                {/* Decorative elements */}
                <div className="fixed inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute top-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>
                </div>

                <div className="max-w-6xl mx-auto px-4  relative z-10">
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
                            <div className="relative overflow-hidden rounded-3xl bg-background shadow-xl border border-primary/20">
                                {/* Background decorative elements */}
                                <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-70"></div>
                                <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-2xl -translate-x-1/4 translate-y-1/4"></div>

                                {/* Content container */}
                                <div className="relative z-10 p-8 md:p-10">
                                    {/* Top info bar */}
                                    <div className="flex flex-col lg:flex-row justify-between items-start sm:items-center mb-[80px] lg:mb-8 gap-4">
                                        <div className="flex flex-wrap items-center gap-3">
                                            <div className="bg-primary/15 text-primary px-3 py-1 rounded-full text-sm font-medium">
                                                {huruf.kategori}
                                            </div>
                                            <div className="bg-primary/10 text-primary/80 px-3 py-1 rounded-full text-sm font-medium">
                                                Level: {hiraganaData.level}
                                            </div>
                                        </div>

                                        <Button
                                            onClick={playPronunciation}
                                            className="bg-primary/90 hover:bg-primary text-white rounded-full px-4 py-2 flex items-center gap-2 shadow-md hover:shadow-lg transition-all w-full sm:w-auto justify-center"
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
                                                        className="w-48 h-48 md:w-64 md:h-64 rounded-full"
                                                        animate={pulseAnimation}
                                                    ></motion.div>

                                                    <motion.div
                                                        className="absolute w-56 h-56 md:w-72 md:h-72 rounded-full border-2 border-dashed border-primary/30"
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
                                                        className="text-8xl sm:text-9xl md:text-[12rem] font-bold text-foreground"
                                                        whileHover={{
                                                            scale: 1.1,
                                                            textShadow:
                                                                "0 0 8px rgba(var(--primary), 0.5)",
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
                                                                            className="absolute w-2 h-2 rounded-full bg-primary"
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
                                                    <h1 className="text-4xl md:text-5xl font-bold mb-2 tracking-tight flex flex-wrap items-center gap-3">
                                                        <span className="text-primary">
                                                            {huruf.romaji.toUpperCase()}
                                                        </span>
                                                        <span className="text-5xl text-muted-foreground">
                                                            - {huruf.huruf}
                                                        </span>
                                                    </h1>
                                                    <div className="h-1 w-20 bg-primary/50 rounded-full mb-4"></div>
                                                    <p className="text-muted-foreground text-lg">
                                                        {huruf.deskripsi}
                                                    </p>
                                                </div>

                                                <div className="grid grid-cols-2 gap-3 mt-4">
                                                    <div className="bg-primary/10 rounded-xl p-4 flex flex-col items-center justify-center">
                                                        <span className="text-sm text-muted-foreground mb-1">
                                                            Jumlah Coretan
                                                        </span>
                                                        <span className="text-2xl font-bold text-primary">
                                                            {
                                                                huruf.jumlah_coretan
                                                            }
                                                        </span>
                                                    </div>
                                                    <div className="bg-primary/10 rounded-xl p-4 flex flex-col items-center justify-center">
                                                        <span className="text-sm text-muted-foreground mb-1">
                                                            Kategori
                                                        </span>
                                                        <span className="text-2xl font-bold text-primary">
                                                            {huruf.kategori}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="flex flex-wrap gap-2 mt-2">
                                                    <div className="flex items-center gap-1 text-sm bg-muted/50 px-3 py-1 rounded-full">
                                                        <Check
                                                            size={14}
                                                            className="text-primary"
                                                        />
                                                        <span>Vokal Dasar</span>
                                                    </div>
                                                    <div className="flex items-center gap-1 text-sm bg-muted/50 px-3 py-1 rounded-full">
                                                        <Check
                                                            size={14}
                                                            className="text-primary"
                                                        />
                                                        <span>
                                                            Mudah Ditulis
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-1 text-sm bg-muted/50 px-3 py-1 rounded-full">
                                                        <Check
                                                            size={14}
                                                            className="text-primary"
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
                                                    onClick={() => {
                                                        const audio = new Audio(
                                                            `/audio/${example.romaji}.mp3`
                                                        );
                                                        audio
                                                            .play()
                                                            .catch((e) =>
                                                                console.error(
                                                                    "Audio playback failed:",
                                                                    e
                                                                )
                                                            );
                                                    }}
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
                </div>
            </div>
        </Dashboard>
    );
}
