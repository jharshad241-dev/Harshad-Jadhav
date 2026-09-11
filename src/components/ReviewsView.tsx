import React, { useState } from 'react';
import { IconRenderer } from './IconRenderer';
import { REVIEWS_DATA } from '../data/saloonData';
import { ReviewItem } from '../types';

export const ReviewsView: React.FC = () => {
  const [reviewsList, setReviewsList] = useState<ReviewItem[]>(REVIEWS_DATA);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  // Form State
  const [newName, setNewName] = useState<string>('');
  const [newRating, setNewRating] = useState<number>(5);
  const [newComment, setNewComment] = useState<string>('');
  const [newServiceName, setNewServiceName] = useState<string>('Vaibhav Signature Royal Haircut');

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newComment) return;

    const created: ReviewItem = {
      id: `rev-${Date.now()}`,
      customerName: newName,
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      rating: newRating,
      date: 'Just now',
      comment: newComment,
      serviceName: newServiceName,
      verified: true,
    };

    setReviewsList([created, ...reviewsList]);
    setShowAddModal(false);
    setNewName('');
    setNewComment('');
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6 space-y-6">
      {/* Title & Ratings Overview Header */}
      <div className="bg-gradient-to-r from-neutral-900 via-neutral-950 to-neutral-900 rounded-3xl border-2 border-amber-500/30 p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
            <IconRenderer name="Star" className="w-4 h-4 text-amber-400" />
            <span>Customer Testimonials</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-serif">
            Ratings & Verified Customer Reviews
          </h1>
          <p className="text-neutral-400 text-xs sm:text-sm mt-1">
            Over 2,400+ executive gentlemen trust Vaibhav AI Saloon for precision haircuts and beard sculpting.
          </p>
        </div>

        {/* Rating Score Card & Write Review Button */}
        <div className="flex items-center gap-4 bg-neutral-950 p-4 rounded-2xl border border-amber-500/30 shrink-0">
          <div className="text-center">
            <span className="text-3xl font-black text-amber-400 font-mono block">4.92</span>
            <div className="flex items-center gap-0.5 text-amber-400 my-0.5">
              {[...Array(5)].map((_, i) => (
                <IconRenderer key={i} name="Star" className="w-3.5 h-3.5 fill-amber-400" />
              ))}
            </div>
            <span className="text-[10px] text-neutral-400 font-mono">2,480+ Reviews</span>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-neutral-950 font-extrabold text-xs shadow-lg shadow-amber-500/20 hover:brightness-110 cursor-pointer"
          >
            Write a Review
          </button>
        </div>
      </div>

      {/* Reviews Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {reviewsList.map((rev) => (
          <div
            key={rev.id}
            className="bg-neutral-900/90 rounded-2xl border border-amber-500/20 p-5 space-y-3 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <img
                    src={rev.avatarUrl}
                    alt={rev.customerName}
                    className="w-9 h-9 rounded-full object-cover border border-amber-400"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h3 className="font-bold text-xs text-white">{rev.customerName}</h3>
                    <span className="text-[10px] text-emerald-400 font-semibold block">
                      ✓ Verified Customer
                    </span>
                  </div>
                </div>

                <div className="flex items-center text-amber-400">
                  {[...Array(rev.rating)].map((_, i) => (
                    <IconRenderer key={i} name="Star" className="w-3 h-3 fill-amber-400" />
                  ))}
                </div>
              </div>

              <p className="text-xs text-neutral-300 leading-relaxed italic">
                "{rev.comment}"
              </p>
            </div>

            <div className="pt-2 border-t border-neutral-800 flex items-center justify-between text-[10px] text-neutral-500 font-mono">
              <span>{rev.serviceName}</span>
              <span>{rev.date}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Write Review Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-neutral-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-amber-500/40 w-full max-w-md rounded-2xl p-6 space-y-4 text-white">
            <h3 className="text-base font-extrabold font-serif">Write a Salon Review</h3>

            <form onSubmit={handleAddReview} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-neutral-300 block mb-1">Your Name:</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-white outline-none focus:border-amber-400"
                  placeholder="e.g. Rahul Sharma"
                />
              </div>

              <div>
                <label className="font-bold text-neutral-300 block mb-1">Rating (1 to 5):</label>
                <select
                  value={newRating}
                  onChange={(e) => setNewRating(Number(e.target.value))}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-amber-400 font-bold outline-none"
                >
                  <option value={5}>★★★★★ (5 Stars - Excellent)</option>
                  <option value={4}>★★★★☆ (4 Stars - Very Good)</option>
                  <option value={3}>★★★☆☆ (3 Stars - Average)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-neutral-300 block mb-1">Review Comments:</label>
                <textarea
                  required
                  rows={3}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-white outline-none focus:border-amber-400"
                  placeholder="Describe your haircut or beard styling experience..."
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2 rounded-xl bg-neutral-800 text-neutral-400 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-neutral-950 font-extrabold cursor-pointer"
                >
                  Post Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
