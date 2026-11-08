'use client';

import { Analytics } from '@vercel/analytics/react';
import { useState, useRef, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

// ───────── SEADISTUS ─────────
const INSTAGRAM_URL = 'https://www.instagram.com/maa.aam.official/';
const YOUTUBE_URL = 'https://www.youtube.com/@maa.aam.official';

const SLEEP_OPTIONS = [0, 15, 30, 60]; // minutit; 0 = välja lülitatud
const FADE_MS = 10000; // heli vaibub viimase 10 sekundi jooksul (ei tööta iOS-is, seal heli lihtsalt peatub)

const AUDIO_DATA = [
  {
    id: 'matsalu-rannaniidud',
    title: 'Matsalu rannaniidu karjakellad',
    imageUrl: '/images/matsalulambad.webp',
    date: 'juuni 2026',
    note: '', 
    audioUrl: '/audio/matsalu_rannaniit.mp3',
  },
  {
    id: 'kohila-vihmavaling',
    title: 'Kohila vihmavaling',
    imageUrl: '/images/kohilavihm.webp',
    date: 'juuni 2026',
    note: '',
    audioUrl: '/audio/kohila_vihm.mp3',
  },
  {
    id: 'lobi-kula-merekohin',
    title: 'Lobi küla merekohin',
    imageUrl: '/images/lobik2bi.webp',
    date: 'juuli 2026',
    note: '',
    audioUrl: '/audio/lobik2bi.mp3',
  },
  {
    id: 'konnujarve-siristajad',
    title: 'Kõnnujärve siristajad',
    imageUrl: '/images/k6nnuj2rve_p6llul.webp',
    date: 'august 2026',
    note: '',
    audioUrl: '/audio/k6nnuj2rve_p6llu_siristajad.mp3',
  },
  {
    id: 'mustoja-varahommik',
    title: 'Mustoja varahommik',
    imageUrl: '/images/mustoja.webp',
    date: 'august 2026',
    note: '',
    audioUrl: '/audio/mustoja.mp3',
  },
];

const LOGOS = ['/images/logo.svg', '/images/logo2.svg', '/images/logo3.svg'];

// ───────── IKOONID ─────────
const ICON = {
  play: 'M8 5v14l11-7z',
  pause: 'M6 19h4V5H6v14zm8-14v14h4V5h-4z',
  close: 'M6 18L18 6M6 6l12 12',
  info: 'M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z',
  share: 'M9 8.25H7.5a2.25 2.25 0 00-2.25 2.25v9a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25H15m0-3l-3-3m0 0l-3 3m3-3V15',
  loop: 'M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99',
  moon: 'M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z',
  down: 'M19 9l-7 7-7-7',
  instagram:
    'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z',
  youtube:
    'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z',
};

const Fill = ({ d, className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d={d} />
  </svg>
);
const Stroke = ({ d, className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path d={d} />
  </svg>
);

const fmt = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
const PILL =
  'flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm backdrop-blur-md transition-colors';

function MainContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const trackParam = searchParams.get('track');
  const activeItem = AUDIO_DATA.find((a) => a.id === trackParam) || null;

  const audioRef = useRef(null);
  const loadedIdRef = useRef(null); // milline lugu on audio-elementi laetud
  const openedInApp = useRef(false); // kas pleier avati rakenduse seest (siis saab "tagasi" kasutada)
  const sleepEndRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [sleepMin, setSleepMin] = useState(0);
  const [time, setTime] = useState({ current: 0, duration: 0 });
  const [activeIndex, setActiveIndex] = useState(0);
  const [showInfo, setShowInfo] = useState(false);
  const [logoIndex, setLogoIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  // ── Heli laadimine ──
  const loadTrack = (item, autoplay) => {
    const audio = audioRef.current;
    if (!audio) return;
    loadedIdRef.current = item.id;
    setHasError(false);
    setTime({ current: 0, duration: 0 });
    audio.pause();
    audio.src = item.audioUrl;
    audio.volume = 1;
    audio.load();
    if (autoplay) {
      setIsLoading(true);
      audio.play().catch(() => setIsLoading(false));
    }
  };

  // URL-i ?track= muutus (otselink, brauseri tagasi/edasi, sulgemine)
  useEffect(() => {
    const audio = audioRef.current;
    if (activeItem) {
      if (loadedIdRef.current !== activeItem.id) loadTrack(activeItem, false);
    } else {
      loadedIdRef.current = null;
      openedInApp.current = false;
      sleepEndRef.current = null;
      setSleepMin(0);
      setIsPlaying(false);
      setIsLoading(false);
      if (audio) {
        audio.pause();
        audio.removeAttribute('src'); // lõpetab ka faili allalaadimise
        audio.load();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trackParam]);

  // Lukustusekraani juhtnupud
  useEffect(() => {
    if (!activeItem || !('mediaSession' in navigator) || !window.MediaMetadata) return;
    try {
      navigator.mediaSession.metadata = new window.MediaMetadata({
        title: activeItem.title,
        artist: 'maa.aam',
        album: 'Eesti loodushelid',
        artwork: [{ src: activeItem.imageUrl, type: 'image/webp' }],
      });
      navigator.mediaSession.setActionHandler('play', () => audioRef.current?.play());
      navigator.mediaSession.setActionHandler('pause', () => audioRef.current?.pause());
    } catch (e) {
      console.log('MediaSession viga:', e);
    }
    return () => {
      try {
        navigator.mediaSession.setActionHandler('play', null);
        navigator.mediaSession.setActionHandler('pause', null);
      } catch {}
    };
  }, [activeItem]);

  // ── Tegevused ──
  const handleOpen = (item) => {
    openedInApp.current = true;
    loadTrack(item, true); // play() peab käima otse puudutuse sees, muidu blokeerib iOS
    router.push(`/?track=${item.id}`, { scroll: false });
  };

  const handleClose = () => {
    if (openedInApp.current) router.back();
    else router.replace('/', { scroll: false });
  };

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      setHasError(false);
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  };

  const handleSeek = (e) => {
    const v = Number(e.target.value);
    if (audioRef.current) audioRef.current.currentTime = v;
    setTime((t) => ({ ...t, current: v }));
  };

  const cycleSleep = () => {
    const next = SLEEP_OPTIONS[(SLEEP_OPTIONS.indexOf(sleepMin) + 1) % SLEEP_OPTIONS.length];
    setSleepMin(next);
    sleepEndRef.current = next ? Date.now() + next * 60000 : null;
    if (audioRef.current) audioRef.current.volume = 1;
  };

  // timeupdate tuleb ka siis, kui ekraan on lukus, seega töötab unetaimer usaldusväärsemalt kui setTimeout
  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    if (!audio) return;
    const end = sleepEndRef.current;
    if (end) {
      const left = end - Date.now();
      if (left <= 0) {
        audio.pause();
        audio.volume = 1;
        sleepEndRef.current = null;
        setSleepMin(0);
      } else if (left < FADE_MS) {
        audio.volume = left / FADE_MS;
      }
    }
    const cur = Math.floor(audio.currentTime);
    const dur = audio.duration || 0;
    setTime((t) => (t.current === cur && t.duration === dur ? t : { current: cur, duration: dur }));
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/?track=${activeItem.id}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: activeItem.title, url });
      } else {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {}
  };

  const handleScroll = (e) => {
    const el = e.currentTarget;
    setActiveIndex(Math.round(el.scrollTop / el.clientHeight));
  };

  const scrollToIndex = (index) => {
    const el = document.getElementById('scroller');
    if (el) el.scrollTo({ top: index * el.clientHeight, behavior: 'smooth' });
  };

  // Escape sulgeb infopaneeli või pleieri
  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== 'Escape') return;
      if (showInfo) setShowInfo(false);
      else if (activeItem) handleClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  return (
    <div
      id="scroller"
      onScroll={handleScroll}
      className="relative h-dvh w-full snap-y snap-mandatory overflow-x-hidden overflow-y-scroll bg-black text-white"
    >
      {/* Päis */}
      <header
        className="pointer-events-none fixed inset-x-0 top-0 z-40 grid grid-cols-3 items-center bg-gradient-to-b from-black/60 to-transparent px-5 pb-6 sm:px-10"
        style={{ paddingTop: 'max(1.25rem, env(safe-area-inset-top))' }}
      >
        <div className="pointer-events-auto justify-self-start">
          <button
            type="button"
            onClick={() => setShowInfo(true)}
            aria-label="Info"
            className="-ml-2 p-2 text-white/80 transition-colors hover:text-white"
          >
            <Stroke d={ICON.info} className="h-6 w-6" />
          </button>
        </div>

        <div className="pointer-events-auto flex justify-center">
          <img
            src={LOGOS[logoIndex]}
            alt="maa.aam"
            onClick={() => setLogoIndex((i) => (i + 1) % LOGOS.length)}
            className="block h-7 w-auto select-none opacity-95 drop-shadow-md sm:h-8"
          />
        </div>

        <div className="pointer-events-auto flex items-center justify-end gap-3">
          <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="p-1 text-white/80 transition-colors hover:text-white">
            <Fill d={ICON.instagram} className="block h-5 w-5" />
          </a>
          <a href={YOUTUBE_URL} target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="p-1 text-white/80 transition-colors hover:text-white">
            <Fill d={ICON.youtube} className="block h-5 w-5" />
          </a>
        </div>
      </header>

      {/* Punktid paremal */}
      <nav className="fixed right-4 top-1/2 z-40 flex -translate-y-1/2 flex-col items-center">
        {AUDIO_DATA.map((item, idx) => (
          <button
            key={item.id}
            type="button"
            onClick={() => scrollToIndex(idx)}
            aria-label={item.title}
            aria-current={activeIndex === idx}
            className="flex h-6 w-6 items-center justify-center"
          >
            <span
              className={`block rounded-full transition-all duration-300 ${
                activeIndex === idx ? 'h-2.5 w-2.5 bg-white' : 'h-1.5 w-1.5 bg-white/40'
              }`}
            />
          </button>
        ))}
      </nav>

      {/* Lood */}
      <main className="w-full">
        {AUDIO_DATA.map((item, index) => (
          <section
            key={item.id}
            className="relative flex h-dvh w-full snap-start snap-always items-end px-7"
            style={{ paddingBottom: 'max(4.5rem, calc(env(safe-area-inset-bottom) + 3rem))' }}
          >
            <div className="absolute inset-0">
              <img
                src={item.imageUrl}
                alt=""
                loading={index === 0 ? 'eager' : 'lazy'}
                decoding="async"
                className="h-full w-full object-cover opacity-70"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/5" />
            </div>

            <div className="relative z-10 w-full max-w-md pr-8">
              <h2 className="font-serif text-4xl font-light leading-[1.1] text-white drop-shadow-md sm:text-5xl">
                {item.title}
              </h2>
              <p className="mt-3 text-sm text-white/60">{item.date}</p>
              <button
                type="button"
                onClick={() => handleOpen(item)}
                className="mt-7 flex items-center gap-2.5 rounded-full border border-white/25 bg-white/10 py-3 pl-5 pr-7 text-sm text-white backdrop-blur-md transition active:scale-95"
              >
                <Fill d={ICON.play} className="h-4 w-4" />
                Kuula
              </button>
            </div>

            {index === 0 && (
              <div className="absolute inset-x-0 bottom-5 z-10 flex animate-bounce justify-center opacity-50">
                <Stroke d={ICON.down} className="h-6 w-6 text-white" />
              </div>
            )}
          </section>
        ))}
      </main>

      {/* Pleier */}
      {activeItem && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={activeItem.title}
          className="fixed inset-0 z-50 flex animate-fade-in flex-col items-center justify-center overscroll-contain bg-black"
        >
          <img src={activeItem.imageUrl} alt="" className="absolute inset-0 h-full w-full object-cover opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/80" />

          <div
            className="absolute inset-x-0 top-0 flex items-center justify-between px-3"
            style={{ paddingTop: 'max(0.75rem, env(safe-area-inset-top))' }}
          >
            <button type="button" onClick={handleClose} aria-label="Sulge" className="p-3 text-white/70 transition-colors hover:text-white">
              <Stroke d={ICON.close} className="h-7 w-7" />
            </button>
            <button type="button" onClick={handleShare} aria-label="Jaga linki" className="flex items-center gap-2 p-3 text-sm text-white/70 transition-colors hover:text-white">
              {copied && <span>Link kopeeritud</span>}
              <Stroke d={ICON.share} className="h-6 w-6" />
            </button>
          </div>

          <div className="relative z-10 flex w-full max-w-md flex-col items-center px-8 text-center">
            <h2 className="font-serif text-3xl font-light leading-tight text-white drop-shadow-lg">{activeItem.title}</h2>
            <p className="mt-2 text-sm text-white/50">{activeItem.date}</p>

            <div className="relative mt-12 flex h-28 w-28 items-center justify-center">
              {isPlaying && <span className="absolute inset-0 animate-breathe rounded-full bg-white/20 motion-reduce:animate-none" />}
              <button
                type="button"
                onClick={togglePlay}
                aria-label={isPlaying ? 'Paus' : 'Mängi'}
                className="relative flex h-24 w-24 items-center justify-center rounded-full border border-white/15 bg-white/20 text-white shadow-2xl backdrop-blur-md transition-transform active:scale-90"
              >
                {isLoading ? (
                  <span className="h-8 w-8 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                ) : isPlaying ? (
                  <Fill d={ICON.pause} className="h-10 w-10" />
                ) : (
                  <Fill d={ICON.play} className="h-12 w-12" />
                )}
              </button>
            </div>

            {hasError && <p className="mt-6 text-sm text-red-300/90">Heli laadimine ebaõnnestus. Kontrolli ühendust ja proovi uuesti.</p>}

            <div className="mt-10 w-full">
              <input
                type="range"
                min={0}
                max={time.duration || 0}
                step={1}
                value={Math.min(time.current, time.duration || 0)}
                onChange={handleSeek}
                disabled={!time.duration}
                aria-label="Asukoht helifailis"
                className="h-1 w-full accent-white"
              />
              <div className="mt-2 flex justify-between text-xs tabular-nums text-white/50">
                <span>{fmt(time.current)}</span>
                <span>{time.duration ? fmt(time.duration) : '–:––'}</span>
              </div>
            </div>

            <div className="mt-8 flex gap-3">
              <button
                type="button"
                onClick={() => setIsLooping((l) => !l)}
                aria-pressed={isLooping}
                className={`${PILL} ${isLooping ? 'bg-white/90 text-black' : 'bg-white/10 text-white/70'}`}
              >
                <Stroke d={ICON.loop} className="h-4 w-4" />
                Kordus
              </button>
              <button
                type="button"
                onClick={cycleSleep}
                aria-pressed={sleepMin > 0}
                className={`${PILL} ${sleepMin ? 'bg-white/90 text-black' : 'bg-white/10 text-white/70'}`}
              >
                <Stroke d={ICON.moon} className="h-4 w-4" />
                {sleepMin ? `${sleepMin} min` : 'Unetaimer'}
              </button>
            </div>

            {activeItem.note && <p className="mt-10 text-base leading-relaxed text-white/80">{activeItem.note}</p>}
          </div>
        </div>
      )}

      {/* Infopaneel */}
      {showInfo && (
        <div role="dialog" aria-modal="true" aria-label="Info" className="fixed inset-0 z-[60] animate-fade-in overflow-y-auto overscroll-contain bg-black/95 backdrop-blur-xl">
          <button
            type="button"
            onClick={() => setShowInfo(false)}
            aria-label="Sulge"
            className="fixed right-3 z-10 p-3 text-white/70 transition-colors hover:text-white"
            style={{ top: 'max(0.75rem, env(safe-area-inset-top))' }}
          >
            <Stroke d={ICON.close} className="h-7 w-7" />
          </button>

          <div
            className="mx-auto flex min-h-full max-w-md flex-col px-8"
            style={{ paddingTop: 'max(6rem, calc(env(safe-area-inset-top) + 4rem))', paddingBottom: 'max(3rem, env(safe-area-inset-bottom))' }}
          >
            {/* ↓↓↓ MUUDA TEKSTID OMA HÄÄLEGA ↓↓↓ */}
            <h2 className="font-serif text-4xl font-light leading-tight">Eesti loodus nii, nagu ta kõlab</h2>

            <div className="mt-10 space-y-8 leading-relaxed text-white/70">
              <section>
                <h3 className="mb-2 font-serif text-xl text-white">Mida me teeme</h3>
                <p>
                  Salvestan Eesti loodushelisid ise: rannaniitudel, metsades, järvede ja mere ääres. Iga heli on ühe koha ja ühe hetke jäädvustus,
                  jagatud siin võimalikult puhtal kujul.
                </p>
              </section>
              <section>
                <h3 className="mb-2 font-serif text-xl text-white">Miks me seda teeme</h3>
                <p>
                  Müra on meie ümber järjest rohkem. Loodushelid aitavad rahuneda, keskenduda ja magama jääda. Tahan, et need oleksid ühe
                  puudutuse kaugusel, ilma konto, reklaami ja liigse lärmita.
                </p>
              </section>
              <section>
                <h3 className="mb-2 font-serif text-xl text-white">Kuidas kuulata</h3>
                <p>Parima kogemuse annavad kõrvaklapid ja vaikne ruum. Uneks või meditatsiooniks saad pleieris määrata unetaimeri.</p>
              </section>
            </div>

            {/* ↑↑↑ */}

            <div className="mt-auto flex gap-6 pt-12 text-sm text-white/50">
              <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-white">Instagram</a>
              <a href={YOUTUBE_URL} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-white">YouTube</a>
            </div>
          </div>
        </div>
      )}

      <audio
        ref={audioRef}
        preload="metadata"
        loop={isLooping}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onWaiting={() => setIsLoading(true)}
        onCanPlay={() => setIsLoading(false)}
        onPlaying={() => setIsLoading(false)}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleTimeUpdate}
        onEnded={() => setIsPlaying(false)}
        onError={() => {
          if (loadedIdRef.current) {
            setHasError(true);
            setIsLoading(false);
          }
        }}
      />

      <Analytics />
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="h-dvh w-screen bg-black" />}>
      <MainContent />
    </Suspense>
  );
}
