import { useState } from "react";
import { Link, useParams } from "wouter";
import { grammarData } from "@/data/grammarData";

const colorHeaderMap: Record<string, string> = {
  blue: "from-blue-600 to-blue-400",
  purple: "from-purple-600 to-purple-400",
  green: "from-green-600 to-green-400",
  orange: "from-orange-600 to-orange-400",
  red: "from-red-600 to-red-400",
  teal: "from-teal-600 to-teal-400",
};

const colorAccentMap: Record<string, string> = {
  blue: "border-blue-300 bg-blue-50",
  purple: "border-purple-300 bg-purple-50",
  green: "border-green-300 bg-green-50",
  orange: "border-orange-300 bg-orange-50",
  red: "border-red-300 bg-red-50",
  teal: "border-teal-300 bg-teal-50",
};

const colorTextMap: Record<string, string> = {
  blue: "text-blue-700",
  purple: "text-purple-700",
  green: "text-green-700",
  orange: "text-orange-700",
  red: "text-red-700",
  teal: "text-teal-700",
};

export default function SectionPage() {
  const params = useParams<{ id: string }>();
  const section = grammarData.find((s) => s.id === params.id);
  const [revealedAnswers, setRevealedAnswers] = useState<Set<string>>(new Set());
  const [activeSubSection, setActiveSubSection] = useState(0);

  if (!section) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">Section পাওয়া যায়নি।</p>
          <Link href="/">
            <button className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg">← ফিরে যাও</button>
          </Link>
        </div>
      </div>
    );
  }

  const toggleAnswer = (key: string) => {
    setRevealedAnswers((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const currentSub = section.subSections[activeSubSection];

  const revealAll = () => {
    const keys = currentSub.pairs.map((p) => `${activeSubSection}-${p.id}`);
    setRevealedAnswers((prev) => {
      const next = new Set(prev);
      keys.forEach((k) => next.add(k));
      return next;
    });
  };

  const hideAll = () => {
    const keys = currentSub.pairs.map((p) => `${activeSubSection}-${p.id}`);
    setRevealedAnswers((prev) => {
      const next = new Set(prev);
      keys.forEach((k) => next.delete(k));
      return next;
    });
  };

  const allRevealed = currentSub.pairs.every((p) =>
    revealedAnswers.has(`${activeSubSection}-${p.id}`)
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <header className={`bg-gradient-to-r ${colorHeaderMap[section.color]} text-white shadow-md`}>
        <div className="max-w-5xl mx-auto px-4 py-5 flex items-center gap-4">
          <Link href="/">
            <button className="bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors">
              ← Home
            </button>
          </Link>
          <div>
            <h1 className="text-xl font-bold flex items-center gap-2">
              <span>{section.icon}</span> {section.title}
            </h1>
            <p className="text-sm text-white/80">
              {section.subSections.reduce((a, ss) => a + ss.pairs.length, 0)}টি উদাহরণ
            </p>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="flex gap-2 flex-wrap mb-6">
          {section.subSections.map((ss, idx) => (
            <button
              key={idx}
              onClick={() => setActiveSubSection(idx)}
              className={`px-4 py-2 rounded-lg text-sm font-medium border-2 transition-all ${
                activeSubSection === idx
                  ? `${colorAccentMap[section.color]} ${colorTextMap[section.color]} border-current`
                  : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
              }`}
            >
              {ss.title}
              <span className="ml-1.5 text-xs opacity-60">({ss.pairs.length})</span>
            </button>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className={`text-lg font-bold ${colorTextMap[section.color]}`}>
              {currentSub.title}
            </h2>
            <div className="flex gap-2">
              <button
                onClick={allRevealed ? hideAll : revealAll}
                className="text-sm px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 font-medium transition-colors"
              >
                {allRevealed ? "সব লুকাও" : "সব দেখাও"}
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {currentSub.pairs.map((pair, pIdx) => {
              const key = `${activeSubSection}-${pair.id}`;
              const revealed = revealedAnswers.has(key);
              return (
                <div
                  key={pair.id}
                  className="border border-gray-100 rounded-xl overflow-hidden"
                >
                  <div className="flex gap-3 p-4 bg-gray-50">
                    <span className="text-gray-400 text-sm font-bold min-w-[28px]">
                      {pIdx + 1}.
                    </span>
                    <p className="text-gray-800 font-medium flex-1">{pair.question}</p>
                    <button
                      onClick={() => toggleAnswer(key)}
                      className={`text-xs px-3 py-1 rounded-lg font-semibold shrink-0 transition-colors ${
                        revealed
                          ? "bg-gray-200 text-gray-600"
                          : `${colorAccentMap[section.color]} ${colorTextMap[section.color]}`
                      }`}
                    >
                      {revealed ? "লুকাও" : "উত্তর"}
                    </button>
                  </div>
                  {revealed && (
                    <div className={`px-4 py-3 border-t border-gray-100 ${colorAccentMap[section.color]}`}>
                      <div className="flex gap-2">
                        <span className={`text-xs font-bold uppercase tracking-wide ${colorTextMap[section.color]} min-w-[60px]`}>
                          উত্তর:
                        </span>
                        <p className={`font-medium ${colorTextMap[section.color]}`}>{pair.answer}</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-6 flex gap-4 justify-center">
          <Link href={`/quiz?section=${section.id}&sub=${activeSubSection}`}>
            <button className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-colors">
              🧪 এই টপিকে Quiz দাও
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
