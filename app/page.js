'use client';

import { useState, useRef, useEffect } from 'react';

const AUDIO_DATA = [
  {
    id: 1,
    title: 'Matsalu rannaniidu karjakellad',
    imageUrl: '/images/matsalulambad.webp', 
    text: 'juuni 2026',
    audioUrl: '/audio/matsalu_rannaniit.mp3'
  },
  {
    id: 2,
    title: 'Kohila vihmavaling',
    imageUrl: '/images/kohilavihm.webp',
    text: 'juuni 2026',
    audioUrl: '/audio/kohila_vihm.mp3'
  },
  {
    id: 3,
    title: 'Kõnnujärve siristajad',
    imageUrl: '/images/k6nnuj2rve_p6llul.webp',
    text: 'august 2026',
    audioUrl: '/audio/k6nnuj2rve_p6llu_siristajad.mp3'
  },
  {
    id: 4,
    title: 'Lobi küla merekohin',
    imageUrl: '/images/lobik2bi.webp',
    text: 'juuli 2026',
    audioUrl: '/audio/lobik2bi.mp3'
  }
];


export default function Home() {
  const [activeItem, setActiveItem] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const [isLooping, setIsLooping] = useState(false); 
  const [activeIndex, setActiveIndex] = useState(0);

  const audioRef = useRef(null);
  const containerRef = useRef(null);

  // Jälgime kerimist, et teada saada mis kaart on ekraanil
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const height = window.innerHeight;
      const scrollTop = containerRef.current.scrollTop;
      const index = Math.round(scrollTop / height);
      setActiveIndex(index);
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
    }
    return () => {
      if (container) container.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && 'mediaSession' in navigator && window.MediaMetadata && activeItem) {
        navigator.mediaSession.metadata = new window.MediaMetadata({
          title: activeItem.title,
          artist: 'Audio Player',
          artwork: [{ src: activeItem.imageUrl, sizes: '512x512', type: 'image/webp' }]
        });
        
        navigator.mediaSession.setActionHandler('play', () => {
          if (audioRef.current) audioRef.current.play().then(() => setIsPlaying(true));
        });
        navigator.mediaSession.setActionHandler('pause', () => {
          if (audioRef.current) {
            audioRef.current.pause();
            setIsPlaying(false);
          }
        });
      }
    } catch (e) {
      console.log("MediaSession viga:", e);
    }
  }, [activeItem]);

  const handleOpen = (item) => {
    setActiveItem(item);
    setIsPlaying(false);
    setIsLoadingAudio(true);
    
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = item.audioUrl;
      audioRef.current.load();
    }
  };

  const handleClose = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setActiveItem(null);
    setIsPlaying(false);
    setIsLoadingAudio(false);
  };

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      setIsLoadingAudio(true);
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
          setIsLoadingAudio(false);
        })
        .catch(err => {
          console.log("Esituse tõrge:", err);
          setIsLoadingAudio(false);
        });
    }
  };

  const scrollToIndex = (index) => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: index * window.innerHeight,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div 
      ref={containerRef}
      className="h-screen w-screen bg-black text-white overflow-y-scroll snap-y snap-mandatory font-sans relative"
    >
      {/* Fikseeritud logo ülal servas */}
      <header className="fixed top-0 left-0 w-full z-40 flex justify-center items-center py-6 bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
        <img src="/images/logo.svg" alt="Logo" className="h-8 w-auto opacity-90 drop-shadow-md pointer-events-auto" />
      </header>

      {/* Paremas servas olevad mumutid / täpid */}
      <div className="fixed right-4 top-1/2 -translate-y-1/2 z-40 flex flex-col space-y-3 bg-black/30 p-2 rounded-full backdrop-blur-sm border border-white/10">
        {AUDIO_DATA.map((_, idx) => (
          <button
            key={idx}
            onClick={() => scrollToIndex(idx)}
            aria-label={`Slaid ${idx + 1}`}
            className={`transition-all duration-300 rounded-full cursor-pointer ${
              activeIndex === idx 
                ? 'w-3 h-3 bg-white scale-125 shadow-[0_0_8px_rgba(255,255,255,0.8)]' 
                : 'w-2 h-2 bg-white/40 hover:bg-white/70'
            }`}
          />
        ))}
      </div>

      {/* Kaartide nimekiri */}
      <main className="w-full">
        {AUDIO_DATA.map((item, index) => (
          <section 
            key={item.id} 
            className="w-full h-screen snap-start snap-always relative flex items-end justify-center pb-20 px-6"
          >
            {/* Taustapilt üle terve ekraani */}
            <div className="absolute inset-0 z-0">
              <img 
                src={item.imageUrl} 
                alt={item.title} 
                className="w-full h-full object-cover opacity-65"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
            </div>

            {/* Sisu (tekst ja nupp) */}
            <div className="relative z-10 w-full max-w-md flex flex-col items-center text-center space-y-4">
              <h2 className="text-2xl font-semibold text-white drop-shadow-md">{item.title}</h2>
              <p className="text-sm text-slate-300 max-w-xs leading-relaxed drop-shadow-sm">
                {item.text}
              </p>
              
              <button
                onClick={() => handleOpen(item)}
                type="button"
                className="mt-2 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white font-medium px-8 py-3 rounded-full border border-white/20 transition-all active:scale-95 cursor-pointer"
              >
                Mängi helifaili
              </button>
            </div>

            {/* Väike allapoole vihjav nool ainult esimesel kaardil */}
            {index === 0 && (
              <div className="absolute bottom-6 z-10 animate-bounce opacity-60">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            )}
          </section>
        ))}
      </main>

      {/* Audiopleieri Modal */}
      {activeItem && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black">
          <img 
            src={activeItem.imageUrl} 
            className="absolute inset-0 w-full h-full object-cover opacity-50" 
            alt="" 
          />
          
          <button 
            onClick={handleClose}
            type="button"
            className="absolute top-6 right-6 text-white/70 hover:text-white p-4 focus:outline-none z-20 transition-colors"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-md px-6">
            <button 
              onClick={togglePlay}
              type="button"
              className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white shadow-2xl border border-white/10 focus:outline-none transition-transform active:scale-90"
            >
              {isLoadingAudio ? (
                <svg className="animate-spin h-8 w-8 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              ) : isPlaying ? (
                <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                </svg>
              ) : (
                <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>

            <div className="mt-8 flex items-center space-x-3 bg-black/20 px-4 py-2 rounded-full backdrop-blur-md border border-white/10">
              <span className={`text-sm font-medium transition-colors ${isLooping ? 'text-white' : 'text-white/60'}`}>
                Loop
              </span>
              <button
                type="button"
                onClick={() => setIsLooping(!isLooping)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                  isLooping ? 'bg-white/80' : 'bg-white/20'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full transition-transform bg-white ${
                    isLooping ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <p className="text-white/95 text-center font-normal text-lg mt-8 px-4 leading-relaxed drop-shadow-lg">
              {activeItem.text}
            </p>
          </div>
        </div>
      )}

      <audio 
        ref={audioRef} 
        preload="auto" 
        loop={isLooping} 
        onCanPlayThrough={() => setIsLoadingAudio(false)}
        onPlay={() => setIsLoadingAudio(false)}
        onWaiting={() => setIsLoadingAudio(true)}
        onPlaying={() => setIsLoadingAudio(false)}
        onEnded={() => {
          setIsPlaying(false);
          setIsLoadingAudio(false);
        }}
      >
        {activeItem && <source src={activeItem.audioUrl} type="audio/mpeg" />}
      </audio>
    </div>
  );
}