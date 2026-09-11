import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  BookOpen,
  Search,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Flame,
} from 'lucide-react';
import { HEALTH_INFO_ARTICLES } from '../../data/hygienelyData';
import { HealthInfoArticle, UserGroup } from '../../types/hygienely';
import { HygieneIcon } from './HygieneIcon';
import { soundEffects } from '../../utils/soundEffects';

interface HealthInfoLibraryProps {
  userGroup: UserGroup;
}

export const HealthInfoLibrary: React.FC<HealthInfoLibraryProps> = ({ userGroup }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [expandedArticleId, setExpandedArticleId] = useState<string | null>(
    HEALTH_INFO_ARTICLES[0].id
  );

  const categories = [
    'All',
    'Personal Hygiene',
    'Oral Wellness',
    'Body Care',
    'Nutrition & Health',
    'Fitness & Sleep',
    'Environmental Health',
    'Student & Youth',
    'Senior Wellness',
    'Home & Kitchen',
  ];

  const filteredArticles = HEALTH_INFO_ARTICLES.filter((article) => {
    const matchesCategory =
      selectedCategory === 'All' || article.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch =
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.scientificWhy.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleExpand = (id: string) => {
    soundEffects.playClick();
    setExpandedArticleId((prev) => (prev === id ? null : id));
  };

  return (
    <div id="health-info-library-container" className="w-full max-w-5xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-500/15 via-emerald-500/15 to-cyan-500/15 dark:from-teal-950/40 dark:to-emerald-950/40 rounded-3xl p-6 sm:p-8 border border-teal-200/50 dark:border-teal-800/40 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-3xl">📚</span>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Health & Hygiene Wisdom Library
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-xl">
            Clinically backed, easy-to-read hygiene knowledge for students, homemakers, and seniors. Understand the scientific & biological "Why" behind everyday clean habits!
          </p>
        </div>

        {/* Search Input */}
        <div className="relative min-w-[260px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search guides, bacteria, dental..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 -mx-2 sm:mx-0 px-2 sm:px-0 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              soundEffects.playClick();
              setSelectedCategory(cat);
            }}
            className={`px-3.5 py-1.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/25'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Articles Accordion List */}
      <div className="space-y-4">
        {filteredArticles.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700">
            <span className="text-4xl">🔍</span>
            <p className="text-sm font-bold text-slate-600 dark:text-slate-300 mt-2">
              No hygiene guides match "{searchQuery}"
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="mt-3 px-4 py-2 rounded-xl bg-emerald-100 text-emerald-700 text-xs font-bold"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          filteredArticles.map((article) => {
            const isExpanded = expandedArticleId === article.id;

            return (
              <div
                key={article.id}
                id={`article-card-${article.id}`}
                className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden transition-all duration-200"
              >
                {/* Accordion Trigger Header */}
                <div
                  onClick={() => toggleExpand(article.id)}
                  className="p-5 sm:p-6 cursor-pointer flex items-center justify-between gap-4 hover:bg-slate-50/70 dark:hover:bg-slate-750 select-none transition"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-950/60 dark:to-teal-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-xl shrink-0 shadow-inner">
                      <HygieneIcon name={article.icon} className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300">
                          {article.category}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-50 dark:bg-cyan-900/40 text-cyan-700 dark:text-cyan-300">
                          {article.badge}
                        </span>
                      </div>
                      <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white mt-1">
                        {article.title}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1 sm:line-clamp-none">
                        {article.summary}
                      </p>
                    </div>
                  </div>

                  <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-500 shrink-0">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </div>

                {/* Expanded Detailed Content */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="border-t border-slate-100 dark:border-slate-700/60 p-5 sm:p-7 space-y-6"
                    >
                      {/* Scientific Why & Fun Fact */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 rounded-2xl bg-teal-50/60 dark:bg-teal-950/30 border border-teal-200/50 dark:border-teal-800/40 space-y-1">
                          <div className="flex items-center gap-1.5 text-xs font-black text-teal-800 dark:text-teal-200">
                            <span>🧬 The Biological "Why":</span>
                          </div>
                          <p className="text-xs text-teal-900 dark:text-teal-100 leading-relaxed">
                            {article.scientificWhy}
                          </p>
                        </div>

                        <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/50 dark:border-amber-800/40 space-y-1">
                          <div className="flex items-center gap-1.5 text-xs font-black text-amber-800 dark:text-amber-200">
                            <span>💡 Science Fun Fact:</span>
                          </div>
                          <p className="text-xs text-amber-900 dark:text-amber-100 leading-relaxed">
                            {article.funFact}
                          </p>
                        </div>
                      </div>

                      {/* Step-by-Step Practical Routine */}
                      {article.steps && article.steps.length > 0 && (
                        <div className="space-y-3">
                          <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">
                            Recommended Step-by-Step Ritual
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {article.steps.map((st, i) => (
                              <div
                                key={i}
                                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200/70 dark:border-slate-600/60"
                              >
                                <div className="text-xs font-black text-slate-800 dark:text-white flex items-center gap-1.5">
                                  <span className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px]">
                                    {i + 1}
                                  </span>
                                  <span>{st.title}</span>
                                </div>
                                <p className="text-xs text-slate-500 dark:text-slate-300 mt-1 leading-relaxed">
                                  {st.desc}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Do's and Don'ts Matrix */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Do's */}
                        <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800/40">
                          <div className="flex items-center gap-1.5 text-xs font-black text-emerald-800 dark:text-emerald-200 mb-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            <span>Golden Do's</span>
                          </div>
                          <ul className="space-y-1.5">
                            {article.doList.map((item, idx) => (
                              <li
                                key={idx}
                                className="text-xs text-emerald-950 dark:text-emerald-100 flex items-start gap-1.5"
                              >
                                <span className="text-emerald-500 font-bold">•</span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Don'ts */}
                        <div className="p-4 rounded-2xl bg-rose-50/60 dark:bg-rose-950/30 border border-rose-200/60 dark:border-rose-800/40">
                          <div className="flex items-center gap-1.5 text-xs font-black text-rose-800 dark:text-rose-200 mb-2">
                            <XCircle className="w-4 h-4 text-rose-600" />
                            <span>Unhealthy Don'ts</span>
                          </div>
                          <ul className="space-y-1.5">
                            {article.dontList.map((item, idx) => (
                              <li
                                key={idx}
                                className="text-xs text-rose-950 dark:text-rose-100 flex items-start gap-1.5"
                              >
                                <span className="text-rose-500 font-bold">•</span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
