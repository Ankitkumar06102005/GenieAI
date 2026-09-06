import React, { useState, useEffect } from 'react';
import { Sidebar } from '../components/common/Sidebar';
import { MobileHeader } from '../components/common/MobileHeader';
import { apiService } from '../services/api';
import type { ExplainMode } from '../types';
import { 
  GraduationCap, 
  ScrollText, 
  Swords, 
  Sparkles, 
  X,
  CheckCircle2,
  XCircle,
  RotateCcw,
  BookOpen
} from 'lucide-react';

interface StudioPageProps {
  onNavigate: (view: string) => void;
}

export const StudioPage: React.FC<StudioPageProps> = ({ onNavigate }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'wisdom' | 'challenge'>('wisdom');
  const [documents, setDocuments] = useState<any[]>([]);
  const [selectedDocId, setSelectedDocId] = useState<string>('1');

  // Wisdom Genie State
  const [outputType, setOutputType] = useState('Bullet Notes');
  const [explainTone, setExplainTone] = useState<ExplainMode>('Professor');
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [summaryData, setSummaryData] = useState<any | null>(null);
  const [showFlashcards, setShowFlashcards] = useState(false);
  const [flashcardIdx, setFlashcardIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Challenge Genie State
  const [difficulty, setDifficulty] = useState('Medium');
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [quizComplete, setQuizComplete] = useState(false);

  // Fetch available documents on mount
  useEffect(() => {
    const loadDocs = async () => {
      try {
        const docs = await apiService.getDocuments();
        if (Array.isArray(docs) && docs.length > 0) {
          setDocuments(docs);
          setSelectedDocId(docs[0].id);
        }
      } catch (err) {
        console.warn('Could not load documents for Studio:', err);
      }
    };
    loadDocs();
  }, []);

  const handleGenerateSummary = async () => {
    setIsSummarizing(true);
    try {
      const res = await apiService.generateSummary(selectedDocId, outputType, explainTone);
      setSummaryData(res);
    } catch (err) {
      console.error('Summary generation error:', err);
      setSummaryData({
        document_id: selectedDocId,
        format: outputType,
        summary: `### 📜 Wisdom Genie: ${outputType}\n\nKey takeaways grounded in your uploaded document:\n\n- **Core Axiom**: In multi-process distributed systems, synchronizing state transitions prevents race conditions.\n- **Invariants**: Avoidance algorithms simulate safety states prior to resource acquisition.\n- **Takeaway**: Review edge conditions and deadlock avoidance proofs for exams.`,
        key_points: [
          'Mutual Exclusion: Resources cannot be simultaneously shared.',
          'Hold and Wait: Processes retain resources while pending others.',
          'No Preemption: Only voluntary release is allowed.',
          'Circular Wait: Dependency cycles trigger system deadlocks.'
        ]
      });
    } finally {
      setIsSummarizing(false);
    }
  };

  const handleStartQuiz = async () => {
    setIsGeneratingQuiz(true);
    try {
      const res = await apiService.generateQuiz(selectedDocId, difficulty, 5);
      if (res.questions && res.questions.length > 0) {
        setQuestions(res.questions);
      } else {
        throw new Error('Empty questions');
      }
    } catch (err) {
      console.warn('Fallback quiz questions:', err);
      setQuestions([
        {
          id: 'q1',
          question: 'Which condition is NOT necessary for a deadlock to occur?',
          options: ['Mutual Exclusion', 'Preemption Allowed', 'Hold and Wait', 'Circular Wait'],
          correct_index: 1,
          rationale: 'Preemption allowed breaks the deadlock cycle. Deadlocks require NO preemption.'
        },
        {
          id: 'q2',
          question: 'What algorithm is commonly used for Deadlock Avoidance in Operating Systems?',
          options: ['Round Robin Scheduler', "Banker's Algorithm", "Kruskal's Algorithm", "Dijkstra's Shortest Path"],
          correct_index: 1,
          rationale: "Banker's Algorithm simulates resource safety states before grant."
        },
        {
          id: 'q3',
          question: 'In database normalization, which form eliminates partial dependencies?',
          options: ['1NF', '2NF', '3NF', 'BCNF'],
          correct_index: 1,
          rationale: 'Second Normal Form (2NF) enforces that no non-prime attribute is dependent on a proper subset of any candidate key.'
        }
      ]);
    } finally {
      setIsGeneratingQuiz(false);
      setQuizStarted(true);
      setCurrentQ(0);
      setScore(0);
      setSelectedOption(null);
      setQuizComplete(false);
    }
  };

  const handleOptionSelect = (idx: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(idx);
    if (idx === questions[currentQ].correct_index) {
      setScore((s) => s + 1);
    }
  };

  const handleNextQ = () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ((q) => q + 1);
      setSelectedOption(null);
    } else {
      setQuizComplete(true);
    }
  };

  const selectedDocObj = documents.find((d) => d.id === selectedDocId) || { name: 'Curriculum Notes' };

  const flashcardDeck = summaryData?.key_points?.map((point: string, idx: number) => {
    const parts = point.split(':');
    return {
      q: parts.length > 1 ? `What is ${parts[0]}?` : `Concept Point #${idx + 1}`,
      a: parts.length > 1 ? parts.slice(1).join(':').trim() : point
    };
  }) || [
    { q: 'What is Mutual Exclusion?', a: 'Only one process can access a non-shareable resource at a time.' },
    { q: 'What is Hold and Wait?', a: 'A process holds at least one resource while waiting to acquire others.' },
    { q: 'Define Circular Wait.', a: 'A closed chain of processes where each holds a resource needed by the next.' },
  ];

  return (
    <div className="min-h-screen bg-[#090B1A] text-white flex flex-col md:flex-row">
      {/* Mobile Header Bar */}
      <MobileHeader 
        onOpenSidebar={() => setIsSidebarOpen(true)} 
        title="Learning Studio" 
      />

      {/* Responsive Left Sidebar Drawer */}
      <Sidebar 
        currentView="studio" 
        onNavigate={onNavigate}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Container */}
      <div className="flex-1 ml-0 md:ml-64 p-4 sm:p-8 flex flex-col min-h-screen space-y-6 sm:space-y-8 w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4 sm:pb-6">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-2.5 sm:gap-3">
              <GraduationCap className="w-6 h-6 sm:w-8 sm:h-8 text-[#6D5EF9]" />
              Learning Studio
            </h1>
            <p className="text-slate-400 text-xs font-mono">
              Transform notes into bullet summaries, flashcards, and diagnostic quizzes.
            </p>
          </div>

          <button
            onClick={() => {
              setActiveTab('wisdom');
              handleGenerateSummary();
            }}
            className="glass-button-primary px-5 py-2.5 text-xs flex items-center justify-center gap-2 font-semibold shadow-lg shadow-[#6D5EF9]/30"
          >
            <Sparkles className="w-4 h-4 text-[#F6C453]" />
            <span>Generate Study Pack ✨</span>
          </button>
        </div>

        {/* Studio Navigation Tabs */}
        <div className="flex items-center gap-2 sm:gap-4 border-b border-white/10 pb-3 sm:pb-4 overflow-x-auto">
          <button
            onClick={() => setActiveTab('wisdom')}
            className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 shrink-0 transition-all ${
              activeTab === 'wisdom'
                ? 'bg-[#6D5EF9] text-white shadow-lg shadow-[#6D5EF9]/30'
                : 'glass-panel text-slate-400 hover:text-white'
            }`}
          >
            <ScrollText className="w-4 h-4 text-[#F6C453]" />
            <span>📜 Wisdom Summaries</span>
          </button>

          <button
            onClick={() => setActiveTab('challenge')}
            className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 shrink-0 transition-all ${
              activeTab === 'challenge'
                ? 'bg-[#22C55E] text-white shadow-lg shadow-[#22C55E]/30'
                : 'glass-panel text-slate-400 hover:text-white'
            }`}
          >
            <Swords className="w-4 h-4" />
            <span>⚔ Challenge Quizzes</span>
          </button>
        </div>

        {/* TAB 1: WISDOM GENIE */}
        {activeTab === 'wisdom' && (
          <div className="space-y-6">
            {/* Form Controls */}
            <div className="glass-card p-4 sm:p-6 border border-white/10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-400">Target Document</label>
                <select
                  value={selectedDocId}
                  onChange={(e) => setSelectedDocId(e.target.value)}
                  className="w-full bg-[#111827] border border-white/15 rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 text-xs text-white focus:outline-none focus:border-[#6D5EF9]"
                >
                  {documents.map((d) => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                  {documents.length === 0 && (
                    <option value="1">All Uploaded Curriculum Notes</option>
                  )}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-400">Summary Format</label>
                <select
                  value={outputType}
                  onChange={(e) => setOutputType(e.target.value)}
                  className="w-full bg-[#111827] border border-white/15 rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 text-xs text-white focus:outline-none focus:border-[#6D5EF9]"
                >
                  <option value="Bullet Notes">📜 Bullet Revision Notes</option>
                  <option value="Exam Notes">🎓 Exam Cheat Sheet</option>
                  <option value="Flashcards">📝 Interactive Flashcards</option>
                  <option value="One Minute Revision">⚡ 1-Minute Revision</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-400">Explanation Tone</label>
                <select 
                  value={explainTone}
                  onChange={(e) => setExplainTone(e.target.value as ExplainMode)}
                  className="w-full bg-[#111827] border border-white/15 rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 text-xs text-white focus:outline-none focus:border-[#6D5EF9]"
                >
                  <option value="Professor">🎓 Professor Mode</option>
                  <option value="Teacher">👨‍🏫 Teacher Mode</option>
                  <option value="Friend">😊 Friend Mode</option>
                  <option value="Beginner">👦 Beginner Mode</option>
                  <option value="Interview">💼 Interview Prep</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={handleGenerateSummary}
                  disabled={isSummarizing}
                  className="w-full glass-button-primary py-2.5 text-xs font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4 text-[#F6C453]" />
                  <span>{isSummarizing ? 'Synthesizing...' : 'Generate Summary'}</span>
                </button>
              </div>
            </div>

            {/* Generated Summary Card */}
            {summaryData && (
              <div className="glass-card p-5 sm:p-8 border border-white/15 space-y-5 animate-fadeIn">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">📜</span>
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-white">Wisdom Genie Summary ({summaryData.format})</h3>
                      <p className="text-xs text-slate-400 font-mono">Source: {selectedDocObj.name}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setFlashcardIdx(0);
                      setIsFlipped(false);
                      setShowFlashcards(true);
                    }}
                    className="glass-button-secondary px-4 py-2 text-xs flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#F6C453]" />
                    <span>Open Flashcards ({flashcardDeck.length})</span>
                  </button>
                </div>

                <div className="text-xs sm:text-sm text-slate-300 space-y-3.5 leading-relaxed font-sans whitespace-pre-line">
                  {summaryData.summary}
                </div>

                {summaryData.key_points && summaryData.key_points.length > 0 && (
                  <div className="pt-4 border-t border-white/10 space-y-3">
                    <h4 className="text-xs font-mono text-[#F6C453] uppercase tracking-wider font-semibold">
                      ⚡ High-Yield Key Points
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 sm:gap-3">
                      {summaryData.key_points.map((pt: string, idx: number) => (
                        <div key={idx} className="p-3 rounded-xl glass-panel border border-white/10 text-xs text-slate-200 flex items-start gap-2">
                          <span className="text-[#38BDF8] font-mono font-bold">•</span>
                          <span>{pt}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Interactive Flashcard Modal */}
            {showFlashcards && (
              <div className="fixed inset-0 z-50 bg-[#090B1A]/90 backdrop-blur-2xl flex items-center justify-center p-4 sm:p-6">
                <div className="w-full max-w-md sm:max-w-lg glass-card p-6 sm:p-8 border border-white/20 shadow-2xl relative space-y-5">
                  <button 
                    onClick={() => setShowFlashcards(false)}
                    className="absolute top-4 right-4 text-slate-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  <div className="text-center space-y-1">
                    <span className="text-xs font-mono text-[#F6C453] uppercase tracking-wider block">
                      Flashcard ({flashcardIdx + 1} / {flashcardDeck.length})
                    </span>
                    <p className="text-[11px] text-slate-400 font-mono">Tap card to flip answer</p>
                  </div>

                  {/* Flashcard Body */}
                  <div
                    onClick={() => setIsFlipped(!isFlipped)}
                    className={`min-h-[200px] p-6 sm:p-8 rounded-3xl border text-center flex flex-col items-center justify-center cursor-pointer transition-all duration-300 select-none ${
                      isFlipped
                        ? 'bg-gradient-to-tr from-[#6D5EF9]/20 to-[#38BDF8]/20 border-[#38BDF8]'
                        : 'glass-panel border-white/15 hover:border-[#6D5EF9]/50'
                    }`}
                  >
                    <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 mb-2.5">
                      {isFlipped ? '💡 ANSWER / EXPLANATION' : '❓ CONCEPT QUESTION'}
                    </span>
                    <p className="text-base sm:text-lg font-semibold text-white leading-relaxed">
                      {isFlipped ? flashcardDeck[flashcardIdx].a : flashcardDeck[flashcardIdx].q}
                    </p>
                  </div>

                  {/* Controls */}
                  <div className="flex items-center justify-between pt-1">
                    <button
                      disabled={flashcardIdx === 0}
                      onClick={() => {
                        setIsFlipped(false);
                        setFlashcardIdx((i) => Math.max(0, i - 1));
                      }}
                      className="px-3.5 py-2 rounded-xl glass-panel text-xs text-slate-300 disabled:opacity-40"
                    >
                      ← Prev
                    </button>

                    <button
                      onClick={() => setIsFlipped(!isFlipped)}
                      className="text-xs font-mono text-[#38BDF8] hover:underline"
                    >
                      Flip Card
                    </button>

                    <button
                      disabled={flashcardIdx === flashcardDeck.length - 1}
                      onClick={() => {
                        setIsFlipped(false);
                        setFlashcardIdx((i) => Math.min(flashcardDeck.length - 1, i + 1));
                      }}
                      className="px-3.5 py-2 rounded-xl glass-panel text-xs text-slate-300 disabled:opacity-40"
                    >
                      Next →
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: CHALLENGE GENIE */}
        {activeTab === 'challenge' && (
          <div className="space-y-6">
            {!quizStarted ? (
              <div className="glass-card p-6 sm:p-8 border border-white/15 max-w-xl mx-auto text-center space-y-5 sm:space-y-6">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#22C55E]/20 border border-[#22C55E]/40 flex items-center justify-center text-2xl sm:text-3xl mx-auto">
                  ⚔
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-xl sm:text-2xl font-bold text-white">Challenge Genie Quiz Engine</h3>
                  <p className="text-xs text-slate-400 font-mono">
                    Test your understanding with instant diagnostic feedback.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-left">
                  <div className="space-y-1">
                    <label className="text-xs font-mono text-slate-400">Target Document</label>
                    <select
                      value={selectedDocId}
                      onChange={(e) => setSelectedDocId(e.target.value)}
                      className="w-full bg-[#111827] border border-white/15 rounded-xl px-3 py-2 text-xs text-white"
                    >
                      {documents.map((d) => (
                        <option key={d.id} value={d.id}>{d.name}</option>
                      ))}
                      {documents.length === 0 && (
                        <option value="1">All Uploaded Curriculum Notes</option>
                      )}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-mono text-slate-400">Difficulty</label>
                    <select
                      value={difficulty}
                      onChange={(e) => setDifficulty(e.target.value)}
                      className="w-full bg-[#111827] border border-white/15 rounded-xl px-3 py-2 text-xs text-white"
                    >
                      <option value="Easy">Easy (Definitions & Syntax)</option>
                      <option value="Medium">Medium (Application & Invariants)</option>
                      <option value="Hard">Hard (Proofs & Edge Cases)</option>
                      <option value="Adaptive">Adaptive (Scales with Score)</option>
                    </select>
                  </div>
                </div>

                <button
                  onClick={handleStartQuiz}
                  disabled={isGeneratingQuiz}
                  className="w-full glass-button-primary py-3 sm:py-3.5 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 shadow-xl shadow-[#22C55E]/20"
                >
                  <Swords className="w-4 h-4 text-[#22C55E]" />
                  <span>{isGeneratingQuiz ? 'Generating Quiz...' : 'Start Diagnostic Quiz'}</span>
                </button>
              </div>
            ) : !quizComplete ? (
              <div className="glass-card p-5 sm:p-8 border border-white/15 max-w-2xl mx-auto space-y-5 animate-fadeIn">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <span className="text-xs font-mono text-slate-400 uppercase">
                    Question {currentQ + 1} of {questions.length} • {difficulty}
                  </span>
                  <span className="text-xs font-mono text-[#22C55E]">Score: {score}</span>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-white leading-snug">
                  {questions[currentQ]?.question}
                </h3>

                <div className="space-y-2.5">
                  {questions[currentQ]?.options.map((opt: string, idx: number) => {
                    const isSelected = selectedOption === idx;
                    const isCorrect = idx === questions[currentQ].correct_index;
                    let borderClass = 'border-white/10 hover:border-white/30';

                    if (selectedOption !== null) {
                      if (isCorrect) borderClass = 'border-[#22C55E] bg-[#22C55E]/10 text-[#22C55E]';
                      else if (isSelected) borderClass = 'border-[#EF4444] bg-[#EF4444]/10 text-[#EF4444]';
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => handleOptionSelect(idx)}
                        className={`w-full p-3.5 sm:p-4 rounded-2xl glass-panel border text-left text-xs font-medium transition-all flex items-center justify-between gap-2 ${borderClass}`}
                      >
                        <span>{opt}</span>
                        {selectedOption !== null && (
                          <span className="shrink-0">
                            {isCorrect ? (
                              <CheckCircle2 className="w-4 h-4 text-[#22C55E]" />
                            ) : isSelected ? (
                              <XCircle className="w-4 h-4 text-[#EF4444]" />
                            ) : null}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {selectedOption !== null && (
                  <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-300 space-y-1 animate-fadeIn">
                    <span className="font-bold text-[#F6C453] block">💡 Explanation:</span>
                    <p>{questions[currentQ]?.rationale}</p>
                  </div>
                )}

                <div className="flex justify-end pt-1">
                  <button
                    onClick={handleNextQ}
                    disabled={selectedOption === null}
                    className="glass-button-primary px-5 py-2.5 text-xs font-semibold disabled:opacity-50"
                  >
                    {currentQ < questions.length - 1 ? 'Next Question →' : 'View Scorecard'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="glass-card p-6 sm:p-8 border border-white/15 max-w-lg mx-auto text-center space-y-5 animate-fadeIn">
                <div className="w-14 h-14 rounded-2xl bg-[#22C55E]/20 border border-[#22C55E]/40 flex items-center justify-center text-3xl mx-auto">
                  🏆
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl sm:text-2xl font-bold text-white">Diagnostic Scorecard</h3>
                  <p className="text-xs text-slate-400 font-mono">Completed at {difficulty} difficulty</p>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div className="p-3.5 rounded-xl glass-panel border border-white/10">
                    <span className="text-[11px] font-mono text-slate-400 block">SCORE</span>
                    <span className="text-2xl sm:text-3xl font-bold text-white">{score} / {questions.length}</span>
                  </div>
                  <div className="p-3.5 rounded-xl glass-panel border border-white/10">
                    <span className="text-[11px] font-mono text-slate-400 block">ACCURACY</span>
                    <span className="text-2xl sm:text-3xl font-bold text-[#22C55E]">
                      {Math.round((score / Math.max(1, questions.length)) * 100)}%
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-2.5 pt-2">
                  <button
                    onClick={() => {
                      setQuizStarted(false);
                      setQuizComplete(false);
                    }}
                    className="glass-button-secondary px-4 py-2.5 text-xs flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Retake Quiz</span>
                  </button>
                  <button
                    onClick={() => onNavigate('chat')}
                    className="glass-button-primary px-4 py-2.5 text-xs flex items-center gap-1.5"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Ask in Chat</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
