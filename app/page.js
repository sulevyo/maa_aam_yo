'use client';

import { useState, useRef, useEffect } from 'react';

const AUDIO_DATA = [
  {
    id: 1,
    title: 'Matsalu rannaniit',
    imageUrl: '/images/matsalulambad.webp', 
    text: 'Karjakell Matsalu rannaniidul.',
    audioUrl: '/audio/matsalu_rannaniit.mp3'
  },
  {
    id: 2,
    title: 'Kohila äikesevihm',
    imageUrl: '/images/kohilavihm.webp',
    text: 'Kohila äikesevihm.',
    audioUrl: '/audio/kohila_vihm.mp3'
  }
];

export default function Home() {
  const [activeItem, setActiveItem] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  
  const [isLooping, setIsLooping] = useState(false); 
  
  const audioRef = useRef(null);

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
      console.log("MediaSession viga seadmes:", e);
    }
  }, [activeItem]);

  const handleOpen = (item) => {
    setActiveItem(item);
    setIsPlaying(false);
    setIsLoadingAudio(false);
    
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
          console.log("Esituse tõrge seadmes:", err);
          setIsLoadingAudio(false);
        });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-bl from-slate-900 to-slate-700 font-sans flex flex-col items-center">
      
      <header className="w-full max-w-xl flex justify-center items-center px-6 py-8">
        <img src="/images/logo.svg" alt="Logo" className="h-10 w-auto opacity-90 drop-shadow-md" />
      </header>

      <main className="w-full max-w-xl px-6 pb-12 grid grid-cols-1 sm:grid-cols-2 gap-8 flex-1 items-start">
        {AUDIO_DATA.map((item) => (
          <button 
            key={item.id} 
            onClick={() => handleOpen(item)}
            type="button"
            className="flex flex-col h-fit text-left space-y-3 w-full appearance-none bg-transparent border-0 p-0 outline-none block cursor-pointer group"
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            <div className="w-full aspect-square bg-white/10 rounded-2xl overflow-hidden shadow-xl border border-white/20">
              <img 
                src={item.imageUrl} 
                alt={item.title} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
              />
            </div>
            <p className="text-sm text-slate-200 sm:text-slate-100 font-medium leading-relaxed px-1 drop-shadow-sm">
              {item.text}
            </p>
          </button>
        ))}
      </main>

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
            style={{ WebkitTapHighlightColor: 'transparent' }}
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
              style={{ WebkitTapHighlightColor: 'transparent' }}
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
                style={{ WebkitTapHighlightColor: 'transparent' }}
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
        preload="none" 
        loop={isLooping} 
        onPlay={() => setIsLoadingAudio(false)}
        onWaiting={() => setIsLoadingAudio(true)}
        onPlaying={() => setIsLoadingAudio(false)}
        onEnded={() => {
          setIsPlaying(false);
          setIsLoadingAudio(false);
        }}
      />
    </div>
  );
}
