import { useState, useCallback, useEffect } from "react";
import { Link, useSearch } from "wouter";
import { grammarData, QAPair } from "@/data/grammarData";

interface QuizItem {
  sectionTitle: string;
  subTitle: string;
  pair: QAPair;
}

function buildQuizItems(sectionId?: string, subIdx?: number): QuizItem[] {
  const items: QuizItem[] = [];
  for (const section of grammarData) {
    if (sectionId && section.id !== sectionId) continue;
    for (let i = 0; i < section.subSections.length; i++) {
      if (subIdx !== undefined && i !== subIdx) continue;
      const ss = section.subSections[i];
      for (const pair of ss.pairs) {
        items.push({ sectionTitle: section.title, subTitle: ss.title, pair });
      }
    }
  }
  return items;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function QuizPage() {
  const search = useSearch();
  const params = new URLSearchParams(search);
  const sectionId = params.get("section") || undefined;
  const subIdxRaw = params.get("sub");
  const subIdx = subIdxRaw !== null ? Number(subIdxRaw) : undefined;

  const [items, setItems] = useState<QuizItem[]>([]);
  const [current, setCurrent] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState({ correct: 0, wrong: 0 });
  const [done, setDone] = useState(false);
  const [selectedSection, setSelectedSection] = useState(sectionId || "all");

  const startQuiz = useCallback((secId: string) => {
    const all = buildQuizItems(secId === "all" ? undefined : secId);
    setItems(shuffle(all));
    setCurrent(0);
    setRevealed(false);
    setScore({ correct: 0, wrong: 0 });
    setDone(false);
  }, []);

  useEffect(() => {
    startQuiz(selectedSection);
  }, []);

  const item = items[current];

  const handleAnswer = (correct: boolean) => {
    setScore((s) => ({
      correct: s.correct + (correct ? 1 : 0),
      wrong: s.wrong + (correct ? 0 : 1),
    }));
    if (current + 1 >= items.length) {
      setDone(true);
    } else {
      setCurrent((c) => c + 1);
      setRevealed(false);
    }
  };

  if (done) {
    const total = score.correct + score.wrong;
    const pct = Math.round((score.correct / total) * 100);
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <header className="bg-white border-b border-gray-100 shadow-sm">
          <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
            <Link href="/">
              <button className="text-gray-500 text-sm hover:text-gray-800">← Home</button>
            </Link>
            <h1 className="text-xl font-bold text-gray-900">🧪 Quiz ফলাফল</h1>
          </div>
        </header>
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-10 max-w-sm w-full text-center">
            <div className="text-6xl mb-4">
              {pct >= 80 ? "🎉" : pct >= 50 ? "👍" : "📚"}
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-1">
              {pct >= 80 ? "অসাধারণ!" : pct >= 50 ? "ভালো হয়েছে!" : "আরও পড়তে হবে!"}
            </h2>
            <p className="text-gray-500 mb-6">তুমি {total}টির মধ্যে {score.correct}টি সঠিক করেছ।</p>
            <div className="text-4xl font-bold text-indigo-600 mb-6">{pct}%</div>
            <div className="flex gap-3">
              <div className="flex-1 bg-emerald-50 rounded-xl p-3">
                <div className="text-2xl font-bold text-emerald-600">{score.correct}</div>
                <div className="text-xs text-emerald-500 font-medium">সঠিক</div>
              </div>
              <div className="flex-1 bg-red-50 rounded-xl p-3">
                <div className="text-2xl font-bold text-red-500">{score.wrong}</div>
                <div className="text-xs text-red-400 font-medium">ভুল</div>
              </div>
            </div>
            <button
              onClick={() => startQuiz(selectedSection)}
              className="mt-6 w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
            >
              আবার শুরু করো
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
          <Link href="/">
            <button className="text-gray-500 text-sm hover:text-gray-800">← Home</button>
          </Link>
          <h1 className="text-xl font-bold text-gray-900 flex-1">🧪 Quiz</h1>
          <select
            value={selectedSection}
            onChange={(e) => {
              setSelectedSection(e.target.value);
              startQuiz(e.target.value);
            }}
            className="text-sm border border-gray-200 rounded-lg px-2 py-1.5 bg-white focus:outline-none"
          >
            <option value="all">সব টপিক</option>
            {grammarData.map((s) => (
              <option key={s.id} value={s.id}>
                {s.title}
              </option>
            ))}
          </select>
        </div>
        {items.length > 0 && (
          <div className="max-w-2xl mx-auto px-4 pb-3">
            <div className="flex items-center gap-3 text-sm text-gray-500">
              <span>
                {current + 1} / {items.length}
              </span>
              <div className="flex-1 bg-gray-100 rounded-full h-2">
                <div
                  className="bg-indigo-500 h-2 rounded-full transition-all"
                  style={{ width: `${((current) / items.length) * 100}%` }}
                />
              </div>
              <span className="text-emerald-600 font-semibold">{score.correct} ✓</span>
              <span className="text-red-400 font-semibold">{score.wrong} ✗</span>
            </div>
          </div>
        )}
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-8">
        {item ? (
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 max-w-xl w-full">
            <div className="text-xs text-gray-400 font-medium mb-1 uppercase tracking-wide">
              {item.sectionTitle} → {item.subTitle}
            </div>
            <p className="text-gray-800 font-semibold text-lg mb-6 leading-snug">{item.pair.question}</p>

            {!revealed ? (
              <button
                onClick={() => setRevealed(true)}
                className="w-full py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
              >
                উত্তর দেখো
              </button>
            ) : (
              <>
                <div className="bg-indigo-50 border border-indigo-200 rounded-xl px-5 py-4 mb-5">
                  <p className="text-sm text-indigo-400 font-semibold mb-1">সঠিক উত্তর:</p>
                  <p className="text-indigo-700 font-medium">{item.pair.answer}</p>
                </div>
                <p className="text-center text-sm text-gray-500 mb-3 font-medium">তুমি কি সঠিক করেছিলে?</p>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleAnswer(true)}
                    className="flex-1 py-3 bg-emerald-500 text-white rounded-xl font-bold hover:bg-emerald-600 transition-colors"
                  >
                    ✓ হ্যাঁ, পেরেছি
                  </button>
                  <button
                    onClick={() => handleAnswer(false)}
                    className="flex-1 py-3 bg-red-400 text-white rounded-xl font-bold hover:bg-red-500 transition-colors"
                  >
                    ✗ না, পারিনি
                  </button>
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="text-center text-gray-400">
            <p>কোনো প্রশ্ন নেই।</p>
          </div>
        )}
      </main>
    </div>
  );
}
