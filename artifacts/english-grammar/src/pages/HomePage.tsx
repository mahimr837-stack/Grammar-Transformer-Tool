import { Link } from "wouter";
import { grammarData } from "@/data/grammarData";

const colorMap: Record<string, string> = {
  blue: "bg-blue-50 border-blue-200 hover:bg-blue-100 text-blue-700",
  purple: "bg-purple-50 border-purple-200 hover:bg-purple-100 text-purple-700",
  green: "bg-green-50 border-green-200 hover:bg-green-100 text-green-700",
  orange: "bg-orange-50 border-orange-200 hover:bg-orange-100 text-orange-700",
  red: "bg-red-50 border-red-200 hover:bg-red-100 text-red-700",
  teal: "bg-teal-50 border-teal-200 hover:bg-teal-100 text-teal-700",
};

const badgeMap: Record<string, string> = {
  blue: "bg-blue-100 text-blue-600",
  purple: "bg-purple-100 text-purple-600",
  green: "bg-green-100 text-green-600",
  orange: "bg-orange-100 text-orange-600",
  red: "bg-red-100 text-red-600",
  teal: "bg-teal-100 text-teal-600",
};

export default function HomePage() {
  const totalQuestions = grammarData.reduce(
    (sum, s) => sum + s.subSections.reduce((a, ss) => a + ss.pairs.length, 0),
    0
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50">
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-lg">E</div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">English Grammar</h1>
              <p className="text-sm text-gray-500">Transformation of Sentences</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-10">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-800 mb-3">সব টপিক একসাথে</h2>
          <p className="text-gray-500 text-lg">
            মোট <span className="font-semibold text-indigo-600">{totalQuestions}টি</span> উদাহরণ —  পড়ো, বোঝো, আর নিজেকে পরীক্ষা করো।
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {grammarData.map((section) => {
            const total = section.subSections.reduce((a, ss) => a + ss.pairs.length, 0);
            return (
              <Link key={section.id} href={`/section/${section.id}`}>
                <div
                  className={`border-2 rounded-2xl p-6 cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md ${colorMap[section.color]}`}
                >
                  <div className="text-4xl mb-3">{section.icon}</div>
                  <h3 className="text-xl font-bold mb-2">{section.title}</h3>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {section.subSections.map((ss) => (
                      <span
                        key={ss.title}
                        className={`text-xs px-2 py-1 rounded-full font-medium ${badgeMap[section.color]}`}
                      >
                        {ss.title}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium opacity-70">{total}টি উদাহরণ</span>
                    <span className="text-sm font-semibold">দেখো →</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="text-3xl mb-3">📖</div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">সব উদাহরণ দেখো</h3>
            <p className="text-gray-500 text-sm mb-4">প্রতিটি টপিকের প্রশ্ন ও উত্তর পরপর দেখে মুখস্থ করো।</p>
            <Link href="/browse">
              <button className="w-full bg-indigo-600 text-white py-2.5 rounded-xl font-semibold hover:bg-indigo-700 transition-colors">
                Browse করো
              </button>
            </Link>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="text-3xl mb-3">🧪</div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">নিজেকে পরীক্ষা করো</h3>
            <p className="text-gray-500 text-sm mb-4">প্রশ্ন দেখো, উত্তর ভাবো, তারপর মিলিয়ে দেখো কতটা পারলে।</p>
            <Link href="/quiz">
              <button className="w-full bg-emerald-600 text-white py-2.5 rounded-xl font-semibold hover:bg-emerald-700 transition-colors">
                Quiz শুরু করো
              </button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
