import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Mic, 
  MicOff, 
  Send, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  ArrowRight, 
  Clock, 
  Bot, 
  User,
  Volume2
} from 'lucide-react';
import { Navbar } from '../../components/common/Navbar';
import { Sidebar } from '../../components/common/Sidebar';
import { Footer } from '../../components/common/Footer';
import { interviewQuestions } from '../../data/mockInterview';
import { generateAIInterviewFeedback } from '../../utils/aiSimulator';
import { useAppData } from '../../context/AppDataContext';
import { useToast } from '../../context/ToastContext';
import { AIChatModal } from '../../components/common/AIChatModal';

export const MockInterviewPage = () => {
  const { addMockInterviewResult } = useAppData();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [questionIndex, setQuestionIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [userAnswer, setUserAnswer] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [feedbackResult, setFeedbackResult] = useState(null);

  const currentQuestion = interviewQuestions[questionIndex] || interviewQuestions[0];

  const toggleRecording = () => {
    if (!isRecording) {
      setIsRecording(true);
      addToast('Microphone active! Speak your answer clearly...', 'info');
      // Simulate speech-to-text transcript
      setTimeout(() => {
        setUserAnswer((prev) => prev + (prev ? " " : "") + currentQuestion.sampleAnswer);
        setIsRecording(false);
        addToast('Voice transcript captured successfully!', 'success');
      }, 3500);
    } else {
      setIsRecording(false);
    }
  };

  const handleSubmitAnswer = (e) => {
    e.preventDefault();
    if (!userAnswer.trim()) {
      addToast('Please type or record an answer before submitting.', 'info');
      return;
    }

    setIsEvaluating(true);
    addToast('CareerAI is evaluating your technical accuracy and communication confidence...', 'info');

    setTimeout(() => {
      setIsEvaluating(false);
      const evalData = generateAIInterviewFeedback(currentQuestion.question, userAnswer, currentQuestion.category);
      setFeedbackResult(evalData);
      addToast('AI evaluation ready!', 'success');
    }, 1200);
  };

  const handleNextQuestion = () => {
    if (questionIndex < interviewQuestions.length - 1) {
      setQuestionIndex((prev) => prev + 1);
      setUserAnswer('');
      setFeedbackResult(null);
    } else {
      // Finish interview
      const summaryResult = {
        id: `int-${Date.now()}`,
        role: "Software Engineer",
        date: "Just now",
        totalQuestions: interviewQuestions.length,
        score: 82,
        technicalScore: 85,
        communicationScore: 78,
        problemSolvingScore: 84,
        confidenceScore: 80,
        feedback: "Great job completing the full mock interview! Strong technical accuracy on React Virtual DOM and Node.js Event Loop.",
        weakAreas: ["System Design", "Pacing"],
        strongAreas: ["React Virtual DOM", "Node.js Event Loop"]
      };
      addMockInterviewResult(summaryResult);
      addToast('Mock Interview Completed! Viewing final results report.', 'success');
      navigate('/interview/results');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-brand-500 selection:text-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex-1 flex space-x-6">
        <Sidebar />

        <main className="flex-1 space-y-6">
          
          {/* Header */}
          <div className="p-4 rounded-2xl glass-card border border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="px-3 py-1 rounded-full bg-purple-950 text-purple-300 text-xs font-bold border border-purple-500/30">
                Question {questionIndex + 1} of {interviewQuestions.length}
              </span>
              <span className="text-xs text-slate-400">Category: <strong className="text-white capitalize">{currentQuestion.category}</strong></span>
            </div>

            <div className="flex items-center space-x-2 text-xs text-slate-400">
              <Clock className="w-4 h-4 text-brand-400" />
              <span>Pacing Timer: 02:45</span>
            </div>
          </div>

          {/* Question Card */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-950/80 via-slate-900 to-indigo-950/80 border border-purple-500/30 shadow-2xl space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-purple-600/30 border border-purple-500/40 flex items-center justify-center text-purple-300">
                <Bot className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-purple-300 uppercase tracking-widest">AI Technical Interviewer</span>
            </div>

            <h2 className="text-lg sm:text-xl font-extrabold text-white leading-relaxed">
              "{currentQuestion.question}"
            </h2>
          </div>

          {/* Answer Input Section */}
          <div className="p-6 rounded-3xl glass-card border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300">Your Answer (Voice or Text)</label>
              
              {/* Record Mic toggle button */}
              <button
                onClick={toggleRecording}
                className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  isRecording
                    ? 'bg-rose-950 text-rose-300 border-rose-500/50 animate-pulse'
                    : 'bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800'
                }`}
              >
                {isRecording ? <MicOff className="w-4 h-4 text-rose-400" /> : <Mic className="w-4 h-4 text-brand-400" />}
                <span>{isRecording ? 'Listening (Speak now...)' : 'Voice Record'}</span>
              </button>
            </div>

            <textarea
              rows={6}
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Type your response or click Voice Record to speak your answer..."
              className="w-full p-4 rounded-2xl bg-slate-900 border border-slate-700 text-xs text-white leading-relaxed focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            ></textarea>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => setUserAnswer(currentQuestion.sampleAnswer)}
                className="text-xs text-indigo-400 hover:underline"
              >
                Use Sample Response
              </button>

              <button
                onClick={handleSubmitAnswer}
                disabled={isEvaluating}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-brand-600 to-purple-600 hover:from-brand-500 hover:to-purple-500 text-white font-bold text-xs shadow-lg transition-all flex items-center gap-2"
              >
                {isEvaluating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Evaluating Answer...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit Answer for AI Rating</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* AI Feedback Results Card */}
          {feedbackResult && (
            <div className="p-6 rounded-3xl glass-card border border-emerald-500/40 space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <span className="text-xs font-bold uppercase text-slate-400">AI Response Score</span>
                  <div className="text-3xl font-extrabold text-emerald-400 mt-1">
                    {feedbackResult.overallScore} / 10
                  </div>
                </div>

                <div className="flex space-x-3 text-xs">
                  <div className="text-center p-2 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-slate-400 block">Accuracy</span>
                    <span className="font-bold text-brand-400">{feedbackResult.technicalAccuracy}</span>
                  </div>
                  <div className="text-center p-2 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-slate-400 block">Clarity</span>
                    <span className="font-bold text-indigo-400">{feedbackResult.communication}</span>
                  </div>
                </div>
              </div>

              {/* Positives & Improvements */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 space-y-1">
                  <span className="font-bold text-emerald-300">What You Did Well:</span>
                  <ul className="list-disc list-inside space-y-1 text-emerald-200">
                    {feedbackResult.whatYouDidWell.map((w, idx) => (
                      <li key={idx}>{w}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-3.5 rounded-2xl bg-yellow-950/40 border border-yellow-500/30 space-y-1">
                  <span className="font-bold text-yellow-300">Where You Can Improve:</span>
                  <ul className="list-disc list-inside space-y-1 text-yellow-200">
                    {feedbackResult.whereToImprove.map((imp, idx) => (
                      <li key={idx}>{imp}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Next Question / Finish Button */}
              <div className="pt-3 flex justify-end">
                <button
                  onClick={handleNextQuestion}
                  className="px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-lg transition-all flex items-center gap-1.5"
                >
                  <span>{questionIndex < interviewQuestions.length - 1 ? 'Next Question' : 'Complete Interview'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

        </main>
      </div>

      <AIChatModal />
      <Footer />
    </div>
  );
};
