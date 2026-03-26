import { useState } from "react";
import { Link } from "wouter";
import { grammarData } from "@/data/grammarData";

export default function BrowsePage() {
  const [selectedSection, setSelectedSection] = useState<string>("all");
  const [search, setSearch] = useState("");

  const filtered = grammarData.filter(
    (s) => selectedSection === "all" || s.id === selectedSection
  );

  const searchLower = search.toLowerCase();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/">
            <button className="text-gray-500 hover:text-gray-800 text-sm font-medium">← Home</button>
          </Link>
          <h1 className="text-xl font-bold text-gray-900 flex-1">📖 সব উদাহরণ</h1>
        </div>
        <div className="max-w-5xl mx-auto px-4 pb-4 flex gap-3 flex-wrap">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="খোঁজো..."
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm flex-1 min-w-[180px] focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
          <select
            value={selectedSection}
            onChange={(e) => setSelectedSection(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300"
          >
            <option value="all">সব টপিক</option>
            {grammarData.map((s) => (
              <option key={s.id} value={s.id}>
                {s.icon} {s.title}
              </option>
            ))}
          </select>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6 space-y-8">
        {filtered.map((section) => (
          <div key={section.id}>
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              {section.icon} {section.title}
            </h2>
            {section.subSections.map((ss, ssIdx) => {
              const filteredPairs = ss.pairs.filter(
                (p) =>
                  p.question.toLowerCase().includes(searchLower) ||
                  p.answer.toLowerCase().includes(searchLower)
              );
              if (filteredPairs.length === 0) return null;
              return (
                <div key={ssIdx} className="mb-6">
                  <h3 className="text-sm font-bold uppercase tracking-wide text-gray-400 mb-3 px-1">
                    {ss.title}
                  </h3>
                  <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                    {filteredPairs.map((pair, pIdx) => (
                      <div
                        key={pair.id}
                        className={`flex gap-4 px-5 py-4 ${
                          pIdx < filteredPairs.length - 1 ? "border-b border-gray-50" : ""
                        }`}
                      >
                        <span className="text-gray-300 text-sm font-bold min-w-[24px] pt-0.5">
                          {pIdx + 1}
                        </span>
                        <div className="flex-1">
                          <p className="text-gray-800 font-medium mb-1">{pair.question}</p>
                          <p className="text-indigo-600 text-sm">{pair.answer}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </main>
    </div>
  );
}
