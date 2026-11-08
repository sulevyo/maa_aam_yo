'use client';

import { Analytics } from '@vercel/analytics/react';
import { useState, useRef, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const AUDIO_DATA = [
  {
    id: 'matsalu-rannaniidud',
    title: 'Matsalu rannaniidu karjakellad',
    imageUrl: '/images/matsalulambad.webp', 
    text: 'juuni 2026',
    audioUrl: '/audio/matsalu_rannaniit.mp3'
  },
  {
    id: 'kohila-vihmavaling',
    title: 'Kohila vihmavaling',
    imageUrl: '/images/kohilavihm.webp',
    text: 'juuni 2026',
    audioUrl: '/audio/kohila_vihm.mp3'
  },
  {
    id: 'lobi-kula-merekohin',
    title: 'Lobi küla merekohin',
    imageUrl: '/images/lobik2bi.webp',
    text: 'juuli 2026',
    audioUrl: '/audio/lobik2bi.mp3'
  },
  {
    id: 'konnujarve-siristajad',
    title: 'Kõnnujärve siristajad',
    imageUrl: '/images/k6nnuj2rve_p6llul.webp',
    text: 'august 2026',
    audioUrl: '/audio/k6nnuj2rve_p6llu_siristajad.mp3'
  },
  {
    id: 'mustoja-varahommik',
    title: 'Mustoja varahommik',
    imageUrl: '/images/mustoja.webp',
    text: 'august 2026',
    audioUrl: '/audio/mustoja.mp3'
  }
];

function MainContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const trackParam = searchParams.get('track');

  const [activeItem, setActiveItem] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const [isLooping, setIsLooping] = useState(false); 
  const [activeIndex, setActiveIndex] = useState(0);

  const logoVariants = ['/images/logo.svg', '/images/logo2.svg', '/images/logo3.svg'];
  const [currentLogoIndex, setCurrentLogoIndex] = useState(0);

  const handleLogoClick = () => {
    setCurrentLogoIndex((prevIndex) => (prevIndex + 1) % logoVariants.length);
  };

  const audioRef = useRef(null);
  const containerRef = useRef(null);

  // 1. Jälgime URL-i parameetrit ?track=ID
  useEffect(() => {
    if (trackParam) {
      const item = AUDIO_DATA.find((a) => String(a.id) === String(trackParam));
      if (item) {
        setActiveItem(item);
      }
    } else {
      setActiveItem(null);
      setIsPlaying(false);
      setIsLoadingAudio(false);
      if (audioRef.current) {
        audioRef.current.pause();
      }
    }
  }, [trackParam]);

  // 2. HELI MÄNGIMINE
  useEffect(() => {
    if (!activeItem || !audioRef.current) return;

    const audio = audioRef.current;
    setIsLoadingAudio(true);
    setIsPlaying(true);

    audio.pause();
    audio.src = activeItem.audioUrl;
    audio.load();

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsLoadingAudio(false);
          setIsPlaying(true);
        })
        .catch((err) => {
          console.log("Automaatse esituse tõrge (brauseri piirang):", err);
          setIsLoadingAudio(false);
          setIsPlaying(false);
        });
    }
  }, [activeItem]);

  // Jälgime kerimist mummude jaoks
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

  // MediaSession seadistus
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
    router.push(`/?track=${item.id}`, { scroll: false });
  };

  const handleClose = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    router.push('/', { scroll: false });
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
      className="h-screen w-full overflow-x-hidden overflow-y-scroll snap-y snap-mandatory font-sans relative bg-black text-white"
    >
      <header className="fixed top-0 left-0 right-0 w-full z-40 grid grid-cols-3 items-center px-6 sm:px-10 py-5 bg-gradient-to-b from-black/60 via-black/20 to-transparent pointer-events-none">
        <div /> {/* Vasak tühi lahter tasakaaluks */}
        
        <div className="flex justify-center pointer-events-auto">
          <img 
            src={logoVariants[currentLogoIndex]} 
            alt="Logo" 
            onClick={handleLogoClick}
            className="h-7 sm:h-8 w-auto opacity-95 drop-shadow-md block select-none" 
          />
        </div>

        {/* Sotsiaalmeedia ikoonid paremal */}
        <div className="flex items-center justify-end space-x-4 pointer-events-auto">
          <a
            href="https://www.instagram.com/maa.aam.official/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="text-white/80 hover:text-white transition-colors p-1 flex items-center justify-center"
          >
            <svg className="w-5 h-5 fill-current block" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
          </a>

          <a
            href="https://www.youtube.com/@maa.aam.official"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="YouTube"
            className="text-white/80 hover:text-white transition-colors p-1 flex items-center justify-center"
          >
            <svg className="w-5 h-5 fill-current block" viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
          </a>
        </div>
      </header>

      {/* Paremas servas olevad mummud */}
      <div className="fixed right-5 top-1/2 -translate-y-1/2 z-40 flex flex-col items-center justify-center space-y-4">
        {AUDIO_DATA.map((_, idx) => (
          <button
            key={idx}
            onClick={() => scrollToIndex(idx)}
            aria-label={`Slaid ${idx + 1}`}
            className="w-5 h-5 flex items-center justify-center cursor-pointer focus:outline-none"
          >
            <span
              className={`block rounded-full transition-all duration-300 ${
                activeIndex === idx
                  ? 'w-3 h-3 bg-white scale-125 shadow-[0_0_10px_rgba(255,255,255,0.9)]'
                  : 'w-2 h-2 bg-white/40 hover:bg-white/80'
              }`}
            />
          </button>
        ))}
      </div>

      {/* Kaartide nimekiri */}
      <main className="w-full">
        {AUDIO_DATA.map((item, index) => (
          <section 
            key={item.id} 
            className="w-full h-screen snap-start snap-always relative flex items-end justify-center pb-20 px-6"
          >
            <div className="absolute inset-0 z-0">
              <img 
                src={item.imageUrl} 
                alt={item.title} 
                className="w-full h-full object-cover opacity-65"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
            </div>

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
                Ava
              </button>
            </div>

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
      />

      <Analytics />
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="h-screen w-screen bg-black" />}>
      <MainContent />
    </Suspense>
  );
}