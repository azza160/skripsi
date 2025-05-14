"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import {
  ArrowLeft,
  ArrowRight,
  Repeat,
  Check,
  RotateCcw,
  Settings,
  VolumeX,
  Volume2,
  Trash2,
  Plus,
  Clock,
  BookOpen,
  CheckCircle2,
  CircleX,
  GripVertical,
  Flame,
  Trophy,
  Brain,
  Star,
  Sparkles,
} from "lucide-react"
import Dashboard from "../../Layouts/DashboardLayout"

// Sample data - in a real app this would come from props
const sampleVocabulary = [
  {
    id: 1,
    kanji: "水",
    romaji: "mizu",
    furigana: "みず",
    arti: "air",
    catatan: "Kanji dasar",
    contoh_kalimat: {
      kanji: "水を飲みます。",
      furigana: "みずをのみます。",
      romaji: "Mizu o nomimasu.",
      arti: "Saya minum air.",
    },
    mastered: false,
  },
  {
    id: 2,
    kanji: "火",
    romaji: "hi",
    furigana: "ひ",
    arti: "api",
    catatan: "Kanji dasar",
    contoh_kalimat: {
      kanji: "火が見えます。",
      furigana: "ひがみえます。",
      romaji: "Hi ga miemasu.",
      arti: "Api terlihat.",
    },
    mastered: true,
  },
  {
    id: 3,
    kanji: "山",
    romaji: "yama",
    furigana: "やま",
    arti: "gunung",
    catatan: "Kanji dasar",
    contoh_kalimat: {
      kanji: "山に登ります。",
      furigana: "やまにのぼります。",
      romaji: "Yama ni noborimasu.",
      arti: "Saya mendaki gunung.",
    },
    mastered: false,
  },
  {
    id: 4,
    kanji: "図書館",
    romaji: "toshokan",
    furigana: "としょかん",
    arti: "perpustakaan",
    catatan: "Gabungan kanji 図 (gambar/peta), 書 (buku), 館 (gedung/tempat)",
    contoh_kalimat: {
      kanji: "私は図書館で本を読みます。",
      furigana: "わたしはとしょかんでほんをよみます。",
      romaji: "Watashi wa toshokan de hon o yomimasu.",
      arti: "Saya membaca buku di perpustakaan.",
    },
    mastered: false,
  },
]

// Available fields for flashcards
const availableFields = [
  { id: "kanji", label: "Kanji" },
  { id: "romaji", label: "Romaji" },
  { id: "furigana", label: "Furigana" },
  { id: "arti", label: "Arti" },
  { id: "catatan", label: "Catatan" },
  { id: "contoh_kalimat.kanji", label: "Contoh Kalimat (Kanji)" },
  { id: "contoh_kalimat.furigana", label: "Contoh Kalimat (Furigana)" },
  { id: "contoh_kalimat.romaji", label: "Contoh Kalimat (Romaji)" },
  { id: "contoh_kalimat.arti", label: "Contoh Kalimat (Arti)" },
]

export default function Flashcard() {
  // State for vocabulary data
  const [vocabulary, setVocabulary] = useState(sampleVocabulary)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [progress, setProgress] = useState(0)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [activePanel, setActivePanel] = useState("front")
  const [showMasteredAnimation, setShowMasteredAnimation] = useState(false)
  const [showNotMasteredAnimation, setShowNotMasteredAnimation] = useState(false)
  const [streak, setStreak] = useState(0)
  const [cardKey, setCardKey] = useState(0) // Key for card animation

  // Timer ref
  const timerRef = useRef(null)
  const flashcardRef = useRef(null)
  // Preview scroll ref
  const previewRef = useRef(null)

  // State for flashcard configuration with predefined styles
  const [frontFields, setFrontFields] = useState([{ id: "kanji", order: 1 }])

  const [backFields, setBackFields] = useState([
    { id: "furigana", order: 1 },
    { id: "romaji", order: 2 },
    { id: "arti", order: 3 },
    { id: "contoh_kalimat.kanji", order: 4, showAudio: true },
    { id: "contoh_kalimat.arti", order: 5 },
  ])

  // Get current vocabulary item
  const currentVocab = vocabulary[currentIndex]

  // Calculate progress
  useEffect(() => {
    const masteredCount = vocabulary.filter((item) => item.mastered).length
    const newProgress = (masteredCount / vocabulary.length) * 100
    setProgress(newProgress)
  }, [vocabulary])

  // Timer effect
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setElapsedTime((prev) => prev + 1)
    }, 1000)

    return () => {
      clearInterval(timerRef.current)
    }
  }, [])

  // Reset preview scroll when panel changes
  useEffect(() => {
    if (previewRef.current) {
      previewRef.current.scrollTop = 0
    }
  }, [activePanel])

  // Format time
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  // Function to get nested field value
  const getFieldValue = (item, fieldId) => {
    if (fieldId.includes(".")) {
      const [parent, child] = fieldId.split(".")
      return item[parent]?.[child] || ""
    }
    return item[fieldId] || ""
  }

  // Function to get field label
  const getFieldLabel = (fieldId) => {
    return availableFields.find((f) => f.id === fieldId)?.label || fieldId
  }

  // Navigation functions
  const goToNext = () => {
    setIsFlipped(false)
    setCardKey((prev) => prev + 1) // Change key to force animation
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % vocabulary.length)
    }, 200)
  }

  const goToPrevious = () => {
    setIsFlipped(false)
    setCardKey((prev) => prev + 1) // Change key to force animation
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + vocabulary.length) % vocabulary.length)
    }, 200)
  }

  const flipCard = () => {
    setIsFlipped((prev) => !prev)
  }

  const toggleMastered = () => {
    const updatedVocabulary = [...vocabulary]
    const newMasteredState = !updatedVocabulary[currentIndex].mastered

    updatedVocabulary[currentIndex] = {
      ...updatedVocabulary[currentIndex],
      mastered: newMasteredState,
    }

    setVocabulary(updatedVocabulary)

    // Update streak
    if (newMasteredState) {
      setStreak((prev) => prev + 1)
      setShowMasteredAnimation(true)
      setTimeout(() => setShowMasteredAnimation(false), 1500)
    } else {
      setStreak(0)
      setShowNotMasteredAnimation(true)
      setTimeout(() => setShowNotMasteredAnimation(false), 1500)
    }
  }

  // Speech synthesis function
  const speakText = (text, isExample = false) => {
    if (!text || typeof window === "undefined") return

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = "ja-JP" // Japanese language

    // Adjust pitch and rate for example sentences
    if (isExample) {
      utterance.rate = 0.8 // Slightly slower for examples
    }

    window.speechSynthesis.speak(utterance)
  }

  // Settings functions
  const addField = (side, fieldId) => {
    if (!fieldId) return

    const fields = side === "front" ? frontFields : backFields
    const setFields = side === "front" ? setFrontFields : setBackFields

    // Check if field already exists
    if (fields.some((f) => f.id === fieldId)) return

    const newField = {
      id: fieldId,
      order: fields.length + 1,
      showAudio: fieldId === "contoh_kalimat.kanji" || fieldId === "kanji",
    }

    setFields([...fields, newField])
  }

  const removeField = (side, fieldId) => {
    const fields = side === "front" ? frontFields : backFields
    const setFields = side === "front" ? setFrontFields : setBackFields

    const updatedFields = fields.filter((f) => f.id !== fieldId)
    // Reorder remaining fields
    const reorderedFields = updatedFields.map((field, index) => ({
      ...field,
      order: index + 1,
    }))

    setFields(reorderedFields)
  }

  const toggleFieldAudio = (fieldId) => {
    // Only allow toggling audio for back fields and only for kanji and example sentence
    if (fieldId !== "kanji" && fieldId !== "contoh_kalimat.kanji") return

    const updatedFields = backFields.map((field) => {
      if (field.id === fieldId) {
        return { ...field, showAudio: !field.showAudio }
      }
      return field
    })

    setBackFields(updatedFields)
  }

  // Handle drag end for reordering
  const handleDragEnd = (result, side) => {
    if (!result.destination) return

    const fields = side === "front" ? frontFields : backFields
    const setFields = side === "front" ? setFrontFields : setBackFields

    const items = Array.from(fields)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    // Update order values
    const updatedItems = items.map((item, index) => ({
      ...item,
      order: index + 1,
    }))

    setFields(updatedItems)
  }

  // Sort fields by order
  const sortedFrontFields = [...frontFields].sort((a, b) => a.order - b.order)
  const sortedBackFields = [...backFields].sort((a, b) => a.order - b.order)

  // Check if field is an example sentence
  const isExampleField = (fieldId) => {
    return fieldId.startsWith("contoh_kalimat")
  }

  // Get field styling based on field type
  const getFieldStyling = (fieldId) => {
    const styles = {
      container: "",
      label: "",
      value: "",
      wrapper: "",
    }

    if (fieldId === "kanji") {
      styles.container = "mb-1 w-full flex flex-col items-center justify-center"
      styles.wrapper = "relative flex justify-center items-center mb-1"
      styles.value = "text-6xl font-bold text-primary z-10"
    } else if (fieldId === "furigana") {
      styles.container = "mb-3 w-full flex justify-center"
      styles.value = "text-2xl text-primary/80 px-6 py-1 relative z-10"
      styles.wrapper = "relative"
    } else if (fieldId === "romaji") {
      styles.container = "mb-3 w-full flex justify-center"
      styles.value = "text-xl italic text-primary/70"
      styles.wrapper = "px-6 py-1.5 bg-primary/5 rounded-full relative overflow-hidden"
    } else if (fieldId === "arti") {
      styles.container = "mb-4 w-full flex justify-center"
      styles.value = "text-2xl font-semibold"
      styles.wrapper =
        "relative px-6 py-2 after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-1/2 after:h-0.5 after:bg-primary/30 after:rounded-full"
    } else if (fieldId === "catatan") {
      styles.container = "mb-2 w-full flex justify-center"
      styles.value = "text-sm italic text-muted-foreground"
      styles.wrapper = "px-4 py-1 bg-muted/30 rounded-full"
    } else if (isExampleField(fieldId)) {
      styles.container = "w-full px-4 py-3 bg-primary/5 rounded-lg mb-3 border border-primary/10"
      styles.label = "text-xs uppercase tracking-wide text-primary/60 mb-1 font-semibold"
      styles.value = fieldId === "contoh_kalimat.arti" ? "text-sm" : "text-base font-medium"
    }

    return styles
  }

  // Render field content
  const renderFieldContent = (field) => {
    const value = getFieldValue(currentVocab, field.id)
    const isExample = isExampleField(field.id)
    const styles = getFieldStyling(field.id)

    // Only show catatan if explicitly added as a field
    const showCatatan =
      field.id === "arti" &&
      currentVocab.catatan &&
      !backFields.some((f) => f.id === "catatan") &&
      !frontFields.some((f) => f.id === "catatan")

    return (
      <div key={field.id} className={`flex flex-col items-center ${styles.container}`}>
        {isExample && <div className={styles.label}>{getFieldLabel(field.id)}</div>}

        <div className="flex flex-col items-center justify-center w-full">
          <div className={styles.wrapper}>
            <div className={`text-center ${styles.value}`}>{value}</div>

            {field.id === "kanji" && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="absolute w-full h-full bg-primary/5 rounded-full blur-xl opacity-70"></div>
                <div className="absolute w-24 h-24 bg-primary/10 rounded-full"></div>
                <div className="absolute w-16 h-16 border-2 border-primary/20 rounded-full"></div>
              </div>
            )}

            {field.id === "furigana" && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
            )}

            {field.id === "romaji" && (
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-purple-500/5 -z-10"></div>
            )}
          </div>

          {/* Audio button below kanji */}
          {field.id === "kanji" && field.showAudio && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors flex-shrink-0 mb-3"
              onClick={() => speakText(value, false)}
            >
              <Volume2 className="h-4 w-4 text-primary" />
            </motion.button>
          )}

          {/* Audio button for example sentences stays inline */}
          {field.id === "contoh_kalimat.kanji" && field.showAudio && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="mt-1 p-2 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors flex-shrink-0 self-center"
              onClick={() => speakText(value, true)}
            >
              <Volume2 className="h-4 w-4 text-primary" />
            </motion.button>
          )}
        </div>

        {showCatatan && (
          <div className="mt-1 text-sm text-muted-foreground italic px-4 py-1 bg-muted/30 rounded-full">
            {currentVocab.catatan}
          </div>
        )}
      </div>
    )
  }

  return (
    <Dashboard>
      <div className="max-w-4xl mx-auto px-4 py-10 relative">
      <div ref={flashcardRef} className="relative">
        {/* Mastered Animation */}
        <AnimatePresence>
          {showMasteredAnimation && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.2 }}
              className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none"
              style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}
            >
              <div className="bg-green-500/20 backdrop-blur-sm rounded-full p-16">
                <CheckCircle2 className="h-24 w-24 text-green-500" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

         {/* Not Mastered Animation - Now positioned relative to the flashcard */}
         <AnimatePresence>
            {showNotMasteredAnimation && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.2 }}
                className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none"
              >
                <div className="bg-red-500/20 backdrop-blur-sm rounded-full p-16">
                  <CircleX className="h-24 w-24 text-red-500" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        {/* Premium Header Section */}
        <div className="mb-12">
          <div className="relative mb-8">
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl"></div>

            <div className="relative">
              <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-primary via-purple-500 to-primary bg-clip-text text-transparent text-center">
                Flashcard Mode
              </h1>
              <p className="text-muted-foreground max-w-2xl mx-auto text-center mb-6 px-4">
                Pelajari kosakata Jepang dengan metode flashcard interaktif yang dirancang untuk memaksimalkan daya
                ingat dan pemahaman Anda.
              </p>
            </div>
          </div>

          {/* Integrated Settings Panel */}
          <AnimatePresence mode="wait">
              {isSettingsOpen ? (
                <motion.div
                  key="settings"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="w-full transition-all duration-300 max-w-4xl mx-auto mt-8 mb-10"
                >
                <div className=" border border-primary/20 rounded-2xl shadow-lg p-6 overflow-hidden">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h2 className="text-2xl font-bold">Pengaturan Flashcard</h2>
                      <p className="text-muted-foreground">
                        Atur konten dan urutan tampilan flashcard sesuai kebutuhan belajar Anda.
                      </p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setIsSettingsOpen(false)}
                      className="p-2.5 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors"
                    >
                      <ArrowLeft className="h-5 w-5 text-primary" />
                    </motion.button>
                  </div>

                  <div className="space-y-6">
                    <div className="flex space-x-2 mb-4">
                      <Button
                        variant={activePanel === "front" ? "default" : "outline"}
                        onClick={() => setActivePanel("front")}
                        className="flex-1"
                      >
                        Sisi Depan
                      </Button>
                      <Button
                        variant={activePanel === "back" ? "default" : "outline"}
                        onClick={() => setActivePanel("back")}
                        className="flex-1"
                      >
                        Sisi Belakang
                      </Button>
                    </div>

                    <div className="mb-4">
                      <Label htmlFor="add-field" className="mb-2 block">
                        Tambah Field
                      </Label>
                      <div className="flex space-x-2">
                        <Select onValueChange={(value) => addField(activePanel, value)}>
                          <SelectTrigger id="add-field">
                            <SelectValue placeholder="Pilih field" />
                          </SelectTrigger>
                          <SelectContent>
                            {availableFields.map((field) => (
                              <SelectItem key={field.id} value={field.id}>
                                {field.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Button
                          variant="outline"
                          onClick={() => addField(activePanel, document.getElementById("add-field")?.value)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Drag and Drop Field Ordering */}
                    <div className="space-y-2">
                      <Label className="mb-2 block">Atur Urutan (Drag & Drop)</Label>

                      <DragDropContext onDragEnd={(result) => handleDragEnd(result, activePanel)}>
                        <Droppable droppableId="fields">
                          {(provided) => (
                            <div
                              {...provided.droppableProps}
                              ref={provided.innerRef}
                              className="space-y-2 max-h-[25vh] overflow-y-auto pr-1"
                            >
                              {(activePanel === "front" ? sortedFrontFields : sortedBackFields).map((field, index) => (
                                <Draggable key={field.id} draggableId={field.id} index={index}>
                                  {(provided) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      className="bg-card/50 border rounded-lg p-3 shadow-sm"
                                    >
                                      <div className="flex justify-between items-center">
                                        <div className="flex items-center">
                                          <div {...provided.dragHandleProps} className="mr-2 cursor-grab">
                                            <GripVertical className="h-5 w-5 text-muted-foreground" />
                                          </div>
                                          <span className="font-medium">{getFieldLabel(field.id)}</span>
                                        </div>

                                        <div className="flex items-center space-x-2">
                                          {(field.id === "kanji" || field.id === "contoh_kalimat.kanji") && (
                                            <Button
                                              variant="ghost"
                                              size="icon"
                                              onClick={() => toggleFieldAudio(field.id)}
                                              className={field.showAudio ? "text-primary" : "text-muted-foreground"}
                                            >
                                              {field.showAudio ? (
                                                <Volume2 className="h-4 w-4" />
                                              ) : (
                                                <VolumeX className="h-4 w-4" />
                                              )}
                                            </Button>
                                          )}

                                          <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => removeField(activePanel, field.id)}
                                          >
                                            <Trash2 className="h-4 w-4" />
                                          </Button>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </Draggable>
                              ))}
                              {provided.placeholder}
                            </div>
                          )}
                        </Droppable>
                      </DragDropContext>
                    </div>

                    {/* Improved Preview with fixed height and scrolling */}
                    <div className="mt-6">
                      <h3 className="text-lg font-medium mb-4">Preview</h3>

                      <div ref={previewRef} className="bg-card rounded-lg p-4 h-[45vh] overflow-y-auto shadow-inner">
                        <div className="min-h-[450px] w-full flex flex-col items-center justify-start pt-8 pb-8">
                          {activePanel === "front"
                            ? sortedFrontFields.map((field) => {
                                const value = getFieldValue(currentVocab, field.id)
                                const styles = getFieldStyling(field.id)
                                return (
                                  <div key={field.id} className={`flex flex-col items-center ${styles.container}`}>
                                    <div className={styles.wrapper}>
                                      <div className={styles.value}>{value}</div>
                                    </div>
                                    {field.id === "kanji" && field.showAudio && (
                                      <div className="p-2 rounded-full bg-primary/10 mb-3">
                                        <Volume2 className="h-4 w-4 text-primary" />
                                      </div>
                                    )}
                                  </div>
                                )
                              })
                            : sortedBackFields.map((field) => {
                                const value = getFieldValue(currentVocab, field.id)
                                const isExample = isExampleField(field.id)
                                const styles = getFieldStyling(field.id)

                                // Only show catatan if explicitly added as a field
                                const showCatatan =
                                  field.id === "arti" &&
                                  currentVocab.catatan &&
                                  !backFields.some((f) => f.id === "catatan") &&
                                  !frontFields.some((f) => f.id === "catatan")

                                return (
                                  <div key={field.id} className={`flex flex-col items-center ${styles.container}`}>
                                    {isExample && <div className={styles.label}>{getFieldLabel(field.id)}</div>}
                                    <div className="flex flex-col items-center">
                                      <div className={styles.wrapper}>
                                        <div className={styles.value}>{value}</div>
                                      </div>

                                      {field.id === "kanji" && field.showAudio && (
                                        <div className="p-2 rounded-full bg-primary/10 mb-3 mt-1">
                                          <Volume2 className="h-4 w-4 text-primary" />
                                        </div>
                                      )}

                                      {field.id === "contoh_kalimat.kanji" && field.showAudio && (
                                        <div className="p-2 rounded-full bg-primary/10 mt-1 self-center">
                                          <Volume2 className="h-4 w-4 text-primary" />
                                        </div>
                                      )}
                                    </div>

                                    {showCatatan && (
                                      <div className="mt-1 text-sm text-muted-foreground italic px-4 py-1 bg-muted/30 rounded-full">
                                        {currentVocab.catatan}
                                      </div>
                                    )}
                                  </div>
                                )
                              })}
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 flex justify-center">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-6 py-3 rounded-full bg-gradient-to-r from-primary to-purple-500 hover:from-primary/90 hover:to-purple-500/90 text-white shadow-md flex items-center"
                        onClick={() => setIsSettingsOpen(false)}
                      >
                        <Check className="mr-2 h-5 w-5" />
                        <span>Simpan Pengaturan</span>
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
              key="main-content"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                {/* Stats section - only shown when settings are closed */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6 px-2">
                  {/* Stats Card 1 - Timer */}
                  <div className="bg-gradient-to-br from-card to-card/80 rounded-xl p-4 shadow-md border border-primary/10 flex items-center">
                    <div className="bg-primary/10 p-3 rounded-full mr-3">
                      <Clock className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Waktu Belajar</p>
                      <p className="text-xl font-mono font-bold">{formatTime(elapsedTime)}</p>
                    </div>
                  </div>

                  {/* Stats Card 2 - Progress */}
                  <div className="bg-gradient-to-br from-card to-card/80 rounded-xl p-4 shadow-md border border-primary/10">
                    <div className="flex items-center mb-2">
                      <div className="bg-primary/10 p-3 rounded-full mr-3">
                        <BookOpen className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Progress</p>
                        <p className="text-xl font-bold">{Math.round(progress)}%</p>
                      </div>
                    </div>
                    <div className="w-full bg-primary/10 rounded-full h-2.5 overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-primary to-purple-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.5 }}
                      ></motion.div>
                    </div>
                  </div>

                  {/* Stats Card 3 - Streak */}
                  <div className="bg-transparent rounded-xl p-4 shadow-md border border-primary/10 flex items-center sm:col-span-2 lg:col-span-1">
                    <div className="bg-primary/10 p-3 rounded-full mr-3">
                      <Flame className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Streak</p>
                      <div className="flex items-center">
                        <p className="text-xl font-bold">{streak}</p>
                        <Badge className="ml-2 bg-primary/20 text-primary border-none">
                          {vocabulary.filter((v) => v.mastered).length}/{vocabulary.length} Dikuasai
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center items-center space-x-2 mb-2">
                  <Badge className="px-3 py-1.5 bg-primary/10 text-primary border-none">
                    <Brain className="h-4 w-4 mr-1.5" /> Kosakata {currentIndex + 1} dari {vocabulary.length}
                  </Badge>

                  {vocabulary.filter((v) => v.mastered).length === vocabulary.length && (
                    <Badge className="px-3 py-1.5 bg-green-500/10 text-green-500 border-none">
                      <Trophy className="h-4 w-4 mr-1.5" /> Semua Dikuasai!
                    </Badge>
                  )}
                </div>

                {/* Modern Flashcard Display with Animation */}
                <div className="relative flex justify-center mb-16">
                  <div className="w-full max-w-md perspective-1000">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={`${cardKey}-${isFlipped ? "back" : "front"}`}
                        initial={{ rotateY: 90, opacity: 0 }}
                        animate={{ rotateY: 0, opacity: 1 }}
                        exit={{ rotateY: -90, opacity: 0 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className="relative w-full"
                        style={{ transformStyle: "preserve-3d" }}
                      >
                        <Card
                          className={`w-full min-h-[450px] flex items-center justify-center overflow-hidden rounded-3xl shadow-lg relative ${
                            currentVocab.mastered
                              ? "bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-emerald-950/20 dark:via-green-950/20 dark:to-teal-950/20"
                              : "bg-gradient-to-br from-slate-50 via-card to-slate-50 dark:from-slate-950/20 dark:via-card dark:to-slate-950/20"
                          }`}
                        >
                          {/* Card decorative patterns */}
                          <div className="absolute inset-0 overflow-hidden opacity-5 pointer-events-none">
                            {currentVocab.mastered ? (
                              // Modern pattern for mastered cards
                              <div className="absolute inset-0">
                                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                                  <pattern id="stars" width="50" height="50" patternUnits="userSpaceOnUse">
                                    <path
                                      d="M25,10 L27,17 L34,17 L28,22 L31,30 L25,25 L19,30 L22,22 L16,17 L23,17 Z"
                                      fill="currentColor"
                                    />
                                  </pattern>
                                  <rect width="100%" height="100%" fill="url(#stars)" />
                                </svg>
                              </div>
                            ) : (
                              // Modern pattern for unmastered cards
                              <div className="absolute inset-0">
                                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                                  <pattern id="dots" width="20" height="20" patternUnits="userSpaceOnUse">
                                    <circle cx="10" cy="10" r="1.5" fill="currentColor" />
                                  </pattern>
                                  <rect width="100%" height="100%" fill="url(#dots)" />
                                </svg>
                              </div>
                            )}
                          </div>

                          {/* Card border glow effect */}
                          <div
                            className="absolute inset-0 rounded-3xl border-2 border-opacity-50 pointer-events-none"
                            style={{
                              borderColor: currentVocab.mastered
                                ? "rgba(16, 185, 129, 0.3)"
                                : "rgba(99, 102, 241, 0.3)",
                              boxShadow: currentVocab.mastered
                                ? "0 0 15px rgba(16, 185, 129, 0.3), inset 0 0 15px rgba(16, 185, 129, 0.2)"
                                : "0 0 15px rgba(99, 102, 241, 0.3), inset 0 0 15px rgba(99, 102, 241, 0.2)",
                            }}
                          ></div>

                          {/* Mastery indicator */}
                          <div className="absolute top-4 right-4 z-10">
                            {currentVocab.mastered && (
                              <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                              >
                                <Badge className="px-3 py-1.5 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 border-none shadow-md text-white">
                                  <Star className="h-3.5 w-3.5 mr-1.5 fill-white" /> Dikuasai
                                </Badge>
                              </motion.div>
                            )}
                          </div>

                          {/* Enhanced Side indicator */}
                          <div className="absolute top-4 left-4 text-xs font-medium px-3 py-1.5 rounded-full bg-primary/10 text-primary backdrop-blur-sm border border-primary/20 shadow-sm">
                            {isFlipped ? "Back" : "Front"}
                          </div>

                          {/* Card content with beautiful styling and extra padding */}
                          <div className="flex flex-col items-center justify-center h-full w-full py-12 px-8">
                            {isFlipped
                              ? sortedBackFields.map(renderFieldContent)
                              : sortedFrontFields.map(renderFieldContent)}
                          </div>

                          {/* Enhanced Card number indicator */}
                          <div className="absolute bottom-4 right-4 text-xs font-medium px-3 py-1.5 rounded-full bg-primary/10 text-primary backdrop-blur-sm border border-primary/20 shadow-sm flex items-center">
                            <span className="font-bold mr-1">{currentIndex + 1}</span>
                            <span className="text-primary/60">/</span>
                            <span className="ml-1">{vocabulary.length}</span>
                          </div>

                          {/* Mastery decoration */}
                          {currentVocab.mastered && (
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-5 pointer-events-none">
                              <Star className="h-64 w-64 text-green-500 fill-green-500/20" />
                            </div>
                          )}
                        </Card>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>

                {/* Responsive Navigation Controls */}
                <div className="flex justify-center mb-10">
                  <div className="bg-card shadow-md rounded-2xl border border-primary/20 p-1.5 flex flex-wrap justify-center gap-1 sm:gap-0 sm:flex-nowrap">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-3 sm:px-5 py-2.5 rounded-xl sm:rounded-full hover:bg-primary/10 transition-colors flex items-center"
                      onClick={goToPrevious}
                    >
                      <ArrowLeft className="mr-1 h-4 w-4 text-primary" /> <span className="hidden sm:inline">Prev</span>
                    </motion.button>

                    <div className="hidden sm:block w-px h-8 self-center bg-border mx-1"></div>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-3 sm:px-5 py-2.5 rounded-xl sm:rounded-full hover:bg-primary/10 transition-colors flex items-center"
                      onClick={flipCard}
                    >
                      <Repeat className="mr-1 h-4 w-4 text-primary" /> <span className="hidden sm:inline">Flip</span>
                    </motion.button>

                    <div className="hidden sm:block w-px h-8 self-center bg-border mx-1"></div>

                    {/* Redesigned mastery toggle button */}
                    {currentVocab.mastered ? (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-3 sm:px-5 py-2.5 rounded-xl sm:rounded-full flex items-center transition-all bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white shadow-sm"
                        onClick={toggleMastered}
                      >
                        <Star className="mr-1 h-4 w-4 fill-white" /> <span className="hidden sm:inline">Dikuasai</span>
                      </motion.button>
                    ) : (
                      <motion.button
                        whileHover={{ scale: 1.05, backgroundColor: "rgba(239, 68, 68, 0.1)" }}
                        whileTap={{ scale: 0.95 }}
                        className="px-3 sm:px-5 py-2.5 rounded-xl sm:rounded-full flex items-center transition-all border-2 border-red-500/30 text-red-500 hover:border-red-500/50"
                        onClick={toggleMastered}
                      >
                        <RotateCcw className="mr-1 h-4 w-4" /> <span className="hidden sm:inline">Belum Paham</span>
                      </motion.button>
                    )}

                    <div className="hidden sm:block w-px h-8 self-center bg-border mx-1"></div>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-3 sm:px-5 py-2.5 rounded-xl sm:rounded-full hover:bg-primary/10 transition-colors flex items-center"
                      onClick={goToNext}
                    >
                      <span className="hidden sm:inline">Next</span>{" "}
                      <ArrowRight className="ml-1 h-4 w-4 text-primary" />
                    </motion.button>
                  </div>
                </div>

                 {/* Settings Button - Moved to bottom */}
                 <div className="flex justify-center mt-10 mb-5">
                    <motion.button
                      whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(var(--primary-rgb), 0.3)" }}
                      whileTap={{ scale: 0.95 }}
                      className="px-6 py-3 rounded-full bg-gradient-to-r from-primary to-purple-500 hover:from-primary/90 hover:to-purple-500/90 text-white shadow-md flex items-center relative overflow-hidden group"
                      onClick={() => setIsSettingsOpen(true)}
                    >
                      <div className="absolute inset-0 bg-white/20 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 "></div>
                      <Settings className="mr-2 h-5 w-5 relative z-10" />
                      <span className="relative z-10">Atur Flashcard</span>
                      <Sparkles className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-white/70 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </motion.button>
                  </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Modern Settings Button - only visible when settings are closed */}
        {!isSettingsOpen && (
          <div className="flex justify-center mt-6">
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(var(--primary-rgb), 0.3)" }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 rounded-full bg-gradient-to-r from-primary to-purple-500 hover:from-primary/90 hover:to-purple-500/90 text-white shadow-md flex items-center relative overflow-hidden group"
              onClick={() => setIsSettingsOpen(true)}
            >
              <div className="absolute inset-0 bg-white/20 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 "></div>
              <Settings className="mr-2 h-5 w-5 relative z-10" />
              <span className="relative z-10">Atur Flashcard</span>
              <Sparkles className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-white/70 opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.button>
          </div>
        )}
      </div>
      </div>
    </Dashboard>
  )
}
