
import React from 'react';

const EventsPage = () => (
  <div className="min-h-screen bg-gradient-to-b from-black to-purple-900 pt-24 px-6">
    <h1 className="text-4xl md:text-6xl font-bold text-white mb-8">Upcoming Events</h1>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {[1, 2, 3, 4].map((item) => (
        <div key={item} className="bg-black/40 backdrop-blur-md border border-white/10 rounded-lg overflow-hidden hover:border-purple-500 transition-all p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-1/3 aspect-video bg-gradient-to-br from-purple-800 to-blue-900 rounded-lg flex items-center justify-center">
              <span className="text-4xl">🎉</span>
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-semibold text-white">JESTFLY Live Show #{item}</h3>
                <div className="bg-purple-900/60 text-purple-200 px-3 py-1 rounded-full text-xs">
                  {item < 3 ? "Upcoming" : "Tickets Available"}
                </div>
              </div>
              <p className="text-white/70 mt-2">Join us for an unforgettable night of music and visuals</p>
              <div className="mt-4 flex flex-wrap gap-3">
                <div className="bg-white/10 px-3 py-1 rounded-full text-white/80 text-sm">July 2{item}, 2023</div>
                <div className="bg-white/10 px-3 py-1 rounded-full text-white/80 text-sm">9:00 PM</div>
                <div className="bg-white/10 px-3 py-1 rounded-full text-white/80 text-sm">Club Neon</div>
              </div>
              <button className="mt-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-2 rounded-full transition-colors">
                Get Tickets
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default EventsPage;
