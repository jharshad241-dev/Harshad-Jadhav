import React, { useState } from 'react';
import { IconRenderer } from './IconRenderer';

export const SalonGalleryView: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<string>('All');

  const galleryItems = [
    {
      id: 'g-1',
      title: 'Precision Mid Skin Fade & Quiff',
      category: 'Hairstyles',
      imageUrl: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=600&q=80',
      stylist: 'Vaibhav Sharma',
    },
    {
      id: 'g-2',
      title: 'Full Beard Razor Sculpting',
      category: 'Beard Styles',
      imageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80',
      stylist: 'Alex D\'Souza',
    },
    {
      id: 'g-3',
      title: 'Customer Transformation Before & After',
      category: 'Before & After',
      imageUrl: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=600&q=80',
      stylist: 'Rahul Verma',
    },
    {
      id: 'g-4',
      title: 'Luxury Gold Ambiance & Barber Chairs',
      category: 'Salon Ambiance',
      imageUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=600&q=80',
      stylist: 'Vaibhav AI Saloon',
    },
    {
      id: 'g-5',
      title: 'Slick Back Executive Taper',
      category: 'Hairstyles',
      imageUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80',
      stylist: 'Vaibhav Sharma',
    },
    {
      id: 'g-6',
      title: 'Heavy Designer Stubble',
      category: 'Beard Styles',
      imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
      stylist: 'Alex D\'Souza',
    },
  ];

  const filters = ['All', 'Hairstyles', 'Beard Styles', 'Before & After', 'Salon Ambiance'];

  const filteredItems = galleryItems.filter(
    (item) => activeFilter === 'All' || item.category === activeFilter
  );

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6 space-y-6">
      {/* Title Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
          <IconRenderer name="Image" className="w-4 h-4" />
          <span>Inspiration Gallery</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-serif">
          Vaibhav Salon Lookbook & Ambiance
        </h1>
        <p className="text-neutral-400 text-xs sm:text-sm mt-1">
          Explore real customer transformations, razor artistry, and luxury salon aesthetics.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar bg-neutral-900/80 p-2 rounded-2xl border border-neutral-800">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
              activeFilter === f
                ? 'bg-amber-500 text-neutral-950 shadow-md shadow-amber-500/20'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="group relative rounded-2xl overflow-hidden border border-amber-500/20 hover:border-amber-400 transition-all bg-neutral-900 aspect-[4/3]"
          >
            <img
              src={item.imageUrl}
              alt={item.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent p-4 flex flex-col justify-end">
              <span className="text-[10px] font-mono text-amber-400 uppercase font-bold tracking-widest">
                {item.category} • {item.stylist}
              </span>
              <h3 className="font-extrabold text-sm text-white font-serif">{item.title}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
