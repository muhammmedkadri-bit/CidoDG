/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, MapPin, Sparkles, Image as ImageIcon, ChevronRight, Play } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import confetti from 'canvas-confetti';
import { Memory } from './types';

// Utility for tailwind classes
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const CARD_LETTERS = [
  { char: "İ", spaceAfter: false },
  { char: "y", spaceAfter: false },
  { char: "i", spaceAfter: true },
  { char: "K", spaceAfter: false },
  { char: "i", spaceAfter: true },
  { char: "D", spaceAfter: false },
  { char: "o", spaceAfter: false },
  { char: "ğ", spaceAfter: false },
  { char: "d", spaceAfter: false },
  { char: "u", spaceAfter: false },
  { char: "n", spaceAfter: true },
  { char: "G", spaceAfter: false },
  { char: "e", spaceAfter: false },
  { char: "c", spaceAfter: false },
  { char: "e", spaceAfter: true },
  { char: "S", spaceAfter: false },
  { char: "a", spaceAfter: false },
  { char: "ç", spaceAfter: false },
  { char: "lı", spaceAfter: false },
];

// Chronologically ordered memories from first encounter to the birthday ending
const SAMPLE_MEMORIES: Memory[] = [
  {
    id: '1',
    title: 'Her şeyin başlangıcı',
    description: 'Her şeyin başlangıcı olan o an... İyisiyle, kötüsüyle yaşanacak her şeyin ilk adımı olacağını melekler bile tahmin edemezdi. Kısa ve sessiz bir başlangıç için kader o kafeyi seçti.',
    imageUrl: 'https://i.hizliresim.com/ln8bd2t.png',
    location: 'Kasaba Cafe'
  },
  {
    id: '2',
    title: 'Aylar sonra rastgele bir story',
    description: 'Sanırım kader bize inatla bir hikaye yazdırmaya kararlıydı. Ortak arkadaşlardan birinin hikayesinde görüp istek atmam, haftlaraca isteğin kabul nöbetinde yatıp kalkmam... Zorlu bir süreçti.',
    imageUrl: 'https://i.hizliresim.com/jj174xu.png',
    location: 'Cizre'
  },
  {
    id: '3',
    title: 'Ve ilk adım...',
    description: 'İstek sonunda kabul olmuş ve sanırım hatırlanmıştım. Kafede kısacık süren bir birlikteliğin, orada çizilen kaderin ilk adımı atılmıştı artık...',
    imageUrl: 'https://i.hizliresim.com/hp6y7e8.png',
    location: 'Cizre / Antalya'
  },
  {
    id: '4',
    title: 'Hatırlanmak...',
    description: 'O gün deliler gibi sevindiğim Fenerbahçe galibiyeti için paylaştığım story\'ye hiç ummadığım bir yanıt gelmişti. \'Eski dostum\'... Kalbimin küt küt atışı, sandalyeden fırlayışım. Bir akşam üstüydü',
    imageUrl: 'https://i.hizliresim.com/qa7em2o.png',
    location: 'Antalya / Cizre'
  },
  {
    id: '5',
    title: 'Hasret bitiyor...',
    description: 'Aylar süren mesajlaşmalar, bekleyişler, memlekete dönüş ve bir aşkın ayak sesleri...',
    imageUrl: 'https://i.hizliresim.com/bndel5p.png',
    location: 'Antalya / Cizre'
  },
  {
    id: '6',
    title: 'Kavuşmaya ramak kala',
    description: 'Onca yıllık ömrümde kalbimin en sert ve en heyecanlı atışlarını hissetmek inanılmazdı. Bir aşkın ilk adımını atmak, bir hikayeyi başlatmaya ramak kalmıştı. hasret bitmişti...',
    imageUrl: 'https://i.hizliresim.com/omuj6ta.png',
    location: 'Cizre'
  },
  {
    id: '7',
    title: 'İlk bakış, ilk gülüş, ilk öpücük...',
    description: 'Bir aşkın ilk ateşi yakılmıştı. her şeyin ilki ilk defa yaşanacaktı... Gözlerinin içine bakarak... Öldüğümde hayat hikayem film şeridi gibi gösterildiğinde ilk defa öyle gülümseyeceğimdir.',
    imageUrl: 'https://i.hizliresim.com/o5gdad8.png',
    location: '03.09'
  },
  {
    id: '8',
    title: 'Hasret aşk ile harmanlanıyor...',
    description: 'Hayatın acımasız kanunları iki aşığı yine birbirinden uzakta tutunca aşk daha da alevlenirmiş. Ağlamalar, özlemler, acılar...',
    imageUrl: 'https://i.hizliresim.com/pywtdlu.png',
    location: 'Cizre / Antalya'
  },
  {
    id: '9',
    title: 'Mabed\'de yeniden...',
    description: 'Umutsuzca memlekete gelirsin ümidiyle üzülürken anı beraber yaşamak için beni salıncaklara gönderdiğin ve arkamdan gelip bana sarıldığın, sürpriz yaptığın o gece. O gece bütün dünya benim olsa o kadar sevinmezdim. Bu dönüş kesin ve temelli bir dönüştü. Yeni ve soluksuz bir macera iyilikler, kötülükler hatta uzun bir zaman sonra da ayrılık...',
    imageUrl: 'https://i.hizliresim.com/s3489yg.png',
    location: 'Salıncaklar'
  },
  {
    id: '15',
    title: 'Harabe bir ev...',
    description: 'Kaderin en deli dolu aşkları bile dizginleyip evlerini harabeye çevirdiği görülmüştür. Bunun ağırlığını ise ancak yaşayarak öğrenebilirmiş insan... O ev, o bahçe, çocuklar, kediler, vişne suları, beyaz çikolatalar ve niceleri. Bir hikayeyi kötü yanlarıyla değil de iyi yanlarıyla hatırlamak her zaman en güzeli olacak....',
    imageUrl: 'https://i.hizliresim.com/la23owj.png',
    location: ''
  },
  {
    id: '10',
    title: 'Bir çocuk parkının tek bankında...',
    description: '',
    imageUrl: 'https://i.hizliresim.com/1mg0hgm.png',
    location: 'Çocuk parkı'
  },
  {
    id: '11',
    title: '3.Lambanın altında...',
    description: '',
    imageUrl: 'https://i.hizliresim.com/7ci35ed.png',
    location: '3.Lambanın altı'
  },
  {
    id: '12',
    title: 'Çocuklar gibi eğlenirken...',
    description: '',
    imageUrl: 'https://i.hizliresim.com/4aqr8xb.png',
    location: 'AVM'
  },
  {
    id: '13',
    title: 'Bir şehri gözlerinle esir alırken...',
    description: '',
    imageUrl: 'https://i.hizliresim.com/r3r8kw0.png',
    location: 'Şahin tepe'
  },
  {
    id: '14',
    title: 'Ve son defa görüşeceğimizi bilmezken bile iyi ki vardın...',
    description: '',
    imageUrl: 'https://i.hizliresim.com/5ynd064.png',
    location: 'Park'
  },
  {
    id: '16',
    title: 'Yeni yaşın sana ve sevdiklerine güzellikler getirsin.',
    description: 'Her şeyin en iyisini hak eden kalbin daima güzelliklerle karşılaşsın. Irz düşmanı Bedir efendinin bol öpücükleriyle dolu olsun.',
    imageUrl: 'https://i.hizliresim.com/mcb3zcb.png',
    location: ''
  },
  {
    id: '17',
    title: 'Yoğurda düşman olmayacağın...',
    description: '',
    imageUrl: 'https://i.hizliresim.com/gelcfct.png',
    location: '🤍'
  },
  {
    id: '18',
    title: 'Mandalinalara triplenmeyeceğin harika bir yaş olsun...',
    description: '',
    imageUrl: 'https://i.hizliresim.com/nec7tt2.png',
    location: '🤍'
  },
  {
    id: '19',
    title: 'İyi ki doğdun \'Gece Saçlı\'',
    description: 'Her yaşına, her yaşantına ve her şeyine minnettarız. Varlığınla hayatımıza aydınlık kattığın için, sabrın ve kalbinin güzelliği ile bize abla, kardeş, dost, sırdaş ve yoldaş olduğun için iyi ki varsın. Nice güzel yaşlara. İyi ki doğdun gece saçlı güzel...',
    imageUrl: 'https://i.hizliresim.com/e1xuvk8.png',
    location: 'Bu yaşında ve her yaşında...'
  }
];

interface CoverFlowCardProps {
  memory: Memory;
  index: number;
  activeIndex: number;
}

const CoverFlowCard = React.memo(({ memory, index, activeIndex }: CoverFlowCardProps) => {
  const [imageError, setImageError] = useState(false);

  const offset = index - activeIndex;
  const absOffset = Math.abs(offset);
  const zIndex = 100 - absOffset;
  const isActive = offset === 0;

  const translateX = offset * 25;
  const translateZ = absOffset > 0 ? -150 - absOffset * 50 : 0;

  // Creates a soft 'flip' sensation on transition (more dynamic rotation based on distance)
  const rotateY = offset === 0 ? 0 : offset * -25;

  const opacity = 1 - Math.min(absOffset * 0.25, 0.8);

  // Render optimization: only render cards that are close to the active index
  if (absOffset > 3) return null;

  return (
    <motion.div
      style={{ zIndex, willChange: 'transform' }}
      initial={false}
      animate={{
        x: `${translateX}%`,
        z: translateZ,
        rotateY,
        opacity,
        scale: isActive ? 1 : 0.85
      }}
      transition={{ type: "spring", stiffness: 350, damping: 30, mass: 0.8 }}
      className={cn(
        "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[76vw] sm:w-[60vw] md:w-full max-w-sm aspect-[2/3] md:aspect-[3/4] origin-center touch-none pointer-events-none"
      )}
    >
      <div
        className={cn(
          "relative w-full h-full rounded-2xl overflow-hidden bg-black/40 transition-shadow duration-500",
          isActive ? "ring-1 ring-white/20 sm:shadow-[0_0_30px_rgba(255,255,255,0.15)]" : "border border-white/10 sm:border-0 sm:shadow-lg sm:shadow-black/50"
        )}
      >
        {/* Shimmer Effect Outline (Active only) */}
        {isActive && (
          <div className="absolute inset-0 pointer-events-none rounded-2xl z-50">
            <div className="absolute inset-0 rounded-2xl p-[1px] bg-[linear-gradient(110deg,rgba(255,255,255,0),rgba(255,255,255,0.4),rgba(255,255,255,0))] [background-size:200%_100%] animate-[shimmer-border_3s_infinite_linear]" style={{ WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)', WebkitMaskComposite: 'xor', maskComposite: 'exclude' }} />
          </div>
        )}
        {!imageError ? (
          <img
            src={memory.imageUrl}
            alt={memory.title}
            className={cn(
              "absolute inset-0 w-full h-full object-cover transition-transform duration-1000",
              isActive ? "scale-105" : "scale-100"
            )}
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="absolute inset-0 bg-zinc-900 border border-white/5 flex flex-col items-center justify-center p-6 text-center">
            <Sparkles className="text-white/20 w-8 h-8 mb-4" />
            <p className="text-white/40 text-xs font-serif italic">Görsel yüklenemedi...</p>
          </div>
        )}

        <div className={cn(
          "absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent transition-opacity duration-300",
          !isActive && "opacity-70"
        )} />

        <AnimatePresence>
          {isActive && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="absolute bottom-0 left-0 right-0 p-6 space-y-3 pointer-events-auto"
            >
              <h2 className="text-2xl font-serif font-medium tracking-wide text-white drop-shadow-md leading-snug">
                {memory.title}
              </h2>
              {memory.location && (
                <div className="flex items-center gap-1.5 text-white/60 text-xs font-sans uppercase tracking-widest">
                  <MapPin size={12} /> <span>{memory.location}</span>
                </div>
              )}
              {memory.description && (
                <p className="text-sm text-white/80 font-serif italic leading-relaxed pt-2 border-t border-white/10">
                  {memory.description}
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {!isActive && (
          <div className="absolute inset-0 bg-black/60 pointer-events-none" />
        )}
      </div>
    </motion.div>
  );
});

// Highly optimized passive touch listener for swiping without React re-renders or Framer Motion drag overhead
const SwipeOverlay = React.memo(({ onSwipeLeft, onSwipeRight, disabled }: { onSwipeLeft: () => void, onSwipeRight: () => void, disabled: boolean }) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const swipeData = useRef({ startX: 0, startTime: 0, isDragging: false });

  useEffect(() => {
    const el = overlayRef.current;
    if (!el) return;

    const handleTouchStart = (e: TouchEvent) => {
      if (disabled) return;
      swipeData.current = {
        startX: e.touches[0].clientX,
        startTime: Date.now(),
        isDragging: true
      };
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!swipeData.current.isDragging || disabled) return;

      const endX = e.changedTouches[0].clientX;
      const deltaX = endX - swipeData.current.startX;
      const deltaTime = Date.now() - swipeData.current.startTime;
      const velocity = deltaX / (deltaTime || 1) * 1000;

      swipeData.current.isDragging = false;

      // Direct React state updates without rAF to prevent iOS Safari/Chrome compositor layer freezing
      if (deltaX < -20 || velocity < -300) {
        onSwipeLeft();
      } else if (deltaX > 20 || velocity > 300) {
        onSwipeRight();
      }
    };

    el.addEventListener('touchstart', handleTouchStart, { passive: true });
    el.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      el.removeEventListener('touchstart', handleTouchStart);
      el.removeEventListener('touchend', handleTouchEnd);
    };
  }, [disabled, onSwipeLeft, onSwipeRight]);

  return (
    <div
      ref={overlayRef}
      className={cn(
        "absolute inset-0 z-40 touch-pan-y bg-transparent w-full h-full",
        !disabled ? "cursor-grab active:cursor-grabbing" : "cursor-default"
      )}
    />
  );
});

// Highly optimized, zero-layer CSS animation for mobile "fireflies"
const MobileFireflies = React.memo(() => {
  const flies = useMemo(() => Array.from({ length: 12 }), []);

  return (
    <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden md:hidden">
      {flies.map((_, i) => {
        const xStart = Math.random() * 100;
        const yStart = Math.random() * 100 + 20; // Start mostly lower
        const xEnd = (Math.random() - 0.5) * 80 + 'vw';
        const yEnd = -Math.random() * 100 - 50 + 'vh';
        const dur = Math.random() * 6 + 4;
        const del = Math.random() * 5;
        const opacity = Math.random() * 0.4 + 0.2;

        return (
          <div
            key={i}
            className="absolute rounded-full bg-amber-200/80 shadow-[0_0_8px_rgba(253,230,138,0.8)] blur-[0.5px]"
            style={{
              width: Math.random() * 2 + 1.5 + 'px',
              height: Math.random() * 2 + 1.5 + 'px',
              left: `${xStart}%`,
              top: `${yStart}%`,
              animation: `firefly-float ${dur}s ease-in-out ${del}s infinite`,
              '--x-end': xEnd,
              '--y-end': yEnd,
              '--firefly-opacity': opacity
            } as React.CSSProperties}
          />
        );
      })}
    </div>
  );
});

const StarlightBackground = () => {
  const stars = useMemo(() => Array.from({ length: 80 }), []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 bg-[#050505]">
      {stars.map((_, i) => {
        const minOp = Math.random() * 0.3 + 0.1;
        const maxOp = Math.random() * 0.7 + 0.3;
        const dur = Math.random() * 4 + 2;
        const del = Math.random() * 5;

        return (
          <div
            key={i}
            className="absolute rounded-full bg-white blur-[0.5px]"
            style={{
              width: Math.random() * 1.5 + 0.5 + 'px',
              height: Math.random() * 1.5 + 0.5 + 'px',
              top: Math.random() * 100 + "%",
              left: Math.random() * 100 + "%",
              opacity: minOp,
              animation: `starlight ${dur}s ease-in-out ${del}s infinite`,
              '--min-opacity': minOp,
              '--max-opacity': maxOp
            } as React.CSSProperties}
          />
        );
      })}
    </div>
  );
};

// SVG Fairy Lights string hanging from top
const FairyLights = () => {
  const bulbCount = 15;
  return (
    <div className="fixed top-0 left-0 w-full h-48 pointer-events-none z-10 overflow-hidden mix-blend-screen">
      <svg width="100%" height="100%" preserveAspectRatio="none" className="absolute top-0 opacity-20">
        <path d="M0,5 Q20,80 50,40 T100,50" stroke="white" strokeWidth="1" fill="none" />
        <path d="M0,45 Q30,90 70,30 T100,20" stroke="white" strokeWidth="1" fill="none" />
      </svg>
      {Array.from({ length: bulbCount }).map((_, i) => {
        const dur = Math.random() * 2 + 1.5;
        const del = Math.random() * 2;
        return (
          <div
            key={i}
            className="absolute rounded-full bg-yellow-100 shadow-[0_0_15px_rgba(253,224,71,0.9),0_0_30px_rgba(253,224,71,0.4)] blur-[1px]"
            style={{
              width: Math.random() * 4 + 4 + 'px',
              height: Math.random() * 4 + 4 + 'px',
              left: `${(i * (100 / bulbCount)) + Math.random() * 5}%`,
              top: `${Math.random() * 60 + 10}px`,
              animation: `fairy-light ${dur}s ease-in-out ${del}s infinite`
            }}
          />
        );
      })}
    </div>
  );
};

// Interactive candle component for the finale
const InteractiveCandle = ({ onExtinguished, onCakeAppears }: { onExtinguished: () => void, onCakeAppears?: () => void }) => {
  const [isLit, setIsLit] = useState(true);
  const [micState, setMicState] = useState<'idle' | 'listening' | 'error'>('idle');
  const [isStartup, setIsStartup] = useState(true);

  // Startup phase timer
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsStartup(false);
      onCakeAppears?.();
    }, 27000);
    return () => clearTimeout(timer);
  }, [onCakeAppears]);

  useEffect(() => {
    let audioContext: AudioContext | null = null;
    let stream: MediaStream | null = null;
    let rafId: number;
    let fallbackTimer: NodeJS.Timeout;

    const stopMic = () => {
      if (rafId) cancelAnimationFrame(rafId);
      if (stream) stream.getTracks().forEach(track => track.stop());
      if (audioContext && audioContext.state !== 'closed') audioContext.close();
    };

    const startMic = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        setMicState('listening');

        // Use type assertion for cross-browser AudioContext
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContextClass) {
          throw new Error("AudioContext not supported");
        }

        audioContext = new AudioContextClass();
        const analyser = audioContext.createAnalyser();
        const microphone = audioContext.createMediaStreamSource(stream);
        microphone.connect(analyser);

        analyser.smoothingTimeConstant = 0.5;
        analyser.fftSize = 256;

        const dataArray = new Uint8Array(analyser.frequencyBinCount);

        const checkAudioLevel = () => {
          if (!isLit) return; // This will stop the recursive check if isLit changes natively, but we also rely on cleanup
          analyser.getByteFrequencyData(dataArray);

          let sum = 0;
          for (let i = 0; i < dataArray.length; i++) {
            sum += dataArray[i];
          }
          const average = sum / dataArray.length;

          // Blowing creates huge low-frequency (bass) energy from wind noise on the mic.
          // By checking the lowest frequency bins (bass) and ensuring high frequencies (treble) are quiet,
          // we can effectively ignore loud music, singing, or talking, since human voice/music has high frequencies.
          let lowSum = 0;
          let highSum = 0;

          for (let i = 0; i < 5; i++) lowSum += dataArray[i];
          for (let i = 50; i < 100; i++) highSum += dataArray[i];

          const lowAverage = Math.round(lowSum / 5);
          const highAverage = Math.round(highSum / 50);

          // Pure blow = Intense bass wind noise (> 230) + very little high frequency noise (< 80)
          if (lowAverage > 230 && highAverage < 80) {
            setIsLit(false);
            onExtinguished();
            stopMic(); // Immediately kill mic on blow
            return;
          }

          rafId = requestAnimationFrame(checkAudioLevel);
        };

        checkAudioLevel();
      } catch (err) {
        console.warn("Mikrofon izni alınamadı, tıklama ile sönme devrede:", err);
        setMicState('error');
      }
    };

    if (!isStartup) {
      if (isLit) {
        startMic();
      } else {
        stopMic();
      }
    }

    return () => {
      stopMic();
    };
  }, [isLit, onExtinguished, isStartup]); // react to startup phase ending

  if (isStartup) {
    return (
      <div className="flex flex-col items-center justify-center space-y-8 mt-12 pointer-events-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="text-center"
        >
          <h2 className="text-3xl font-serif text-white/90 italic tracking-widest drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">
            Son bir şey daha...
          </h2>
          <div className="group relative mt-6 p-[2px] rounded-2xl overflow-hidden bg-transparent transition-all shadow-[0_0_20px_rgba(255,255,255,0.05)] max-w-sm mx-auto">
            {/* Silver Animated Background Layer */}
            <div className="absolute inset-[-100%] bg-[conic-gradient(from_0deg,transparent_0%,rgba(200,200,200,0.8)_20%,transparent_40%)] animate-[spin_4s_linear_infinite]" />

            {/* Inner surface */}
            <div className="relative bg-zinc-900/90 rounded-[calc(1rem-1px)] backdrop-blur-md p-6">
              <p className="text-white/90 text-lg font-light tracking-wide leading-relaxed">
                En son oturduğumuz salıncaklara küçük bir hediye bıraktım eğer istersen alabilirsin. Merak etme orada olmayacağım. Pastan birazdan ekrana gelecek. Pastan geldiğinde mumlara üflediğini anlamak için mikrofon izni gerekecek lütfen ona izin ver, en güzel dileklerini tut ve mumlara doğru üfle. Bu hediyeyi bu yaşında değil her yaşında her doğum gününde aç. Kalbim daima seninle. Tekrar iyi ki doğdun.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-16 pointer-events-auto mt-8">
      <motion.h3
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-3xl md:text-4xl font-serif text-amber-50 italic tracking-[0.1em] drop-shadow-[0_0_15px_rgba(253,230,138,0.8)] bg-black/60 px-8 py-4 rounded-full backdrop-blur-xl border border-white/20 text-center z-50 transition-all duration-1000"
      >
        {isLit ? (
          <>
            Bir dilek tut ve muma üfle...
            {micState === 'error' && <span className="block text-sm opacity-60 mt-2 font-sans tracking-normal not-italic">(Söndürmek için pastaya dokun)</span>}
          </>
        ) : "Dileklerinin kabul olacağı nice yaşlara..."}
      </motion.h3>

      <div
        className={cn(
          "relative flex flex-col items-center",
          micState === 'error' && isLit ? "cursor-pointer" : "cursor-default"
        )}
        onClick={() => {
          if (isLit && micState === 'error') {
            setIsLit(false);
            onExtinguished();
          }
        }}
      >
        {/* Custom Cake Container */}
        <div className="relative w-[340px] md:w-[400px] flex items-center justify-center flex-col scale-[1.3] md:scale-[1.4] translate-y-16 pointer-events-none drop-shadow-2xl">
          <img
            src="/pasta.png"
            alt="Custom Birthday Cake"
            className="w-full h-auto object-contain z-10"
          />

          {/* --- Flame Dual Wrapper overlaying the image --- */}
          <div className="absolute inset-0 z-30 pointer-events-none">

            {/* Flame Left (Number 2) — blue base anchored to the candle tip triangle */}
            <div
              className="absolute w-14 h-28 flex items-end justify-center pointer-events-none"
              style={{ bottom: '56.5%', left: '32%', transform: 'translate(calc(-50% + 32px), -130px)' }}
            >
              <AnimatePresence>
                {isLit && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ scale: 0, opacity: 0, y: -40, filter: 'blur(15px)' }}
                    transition={{ duration: 0.2 }}
                    className="relative w-6 h-14 origin-bottom animate-[candle-flicker_3s_infinite_ease-in-out]"
                  >
                    <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-24 h-24 bg-orange-500/15 rounded-full blur-xl z-10" />
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-7 h-14 bg-orange-500/40 rounded-[50%_50%_50%_50%_/_60%_60%_40%_40%] blur-md z-20 mix-blend-screen" />
                    <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-4 h-10 bg-gradient-to-t from-blue-600 via-orange-400 to-yellow-200 rounded-[50%_50%_50%_50%_/_70%_70%_30%_30%] shadow-[0_0_18px_rgba(255,150,0,0.8)] blur-[1px] z-30 mix-blend-screen" />
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-1.5 h-4 bg-white rounded-[50%_50%_50%_50%_/_60%_60%_40%_40%] shadow-[0_0_8px_white] z-40" />
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-blue-800/80 rounded-full blur-[2px] z-50 mix-blend-multiply" />
                  </motion.div>
                )}
              </AnimatePresence>
              {!isLit && (
                <motion.div
                  initial={{ opacity: 0, y: 0 }}
                  animate={{ opacity: [0, 0.7, 0], y: -70, scale: 2.5, x: [0, -12, 8, -4] }}
                  transition={{ duration: 3, ease: 'easeOut' }}
                  className="absolute bottom-0 w-2.5 h-8 bg-gray-200/50 blur-xl rounded-full"
                />
              )}
            </div>

            {/* Flame Right (Number 7) — blue base anchored to the candle tip triangle */}
            <div
              className="absolute w-14 h-28 flex items-end justify-center pointer-events-none"
              style={{ bottom: '56.5%', left: '57%', transform: 'translate(calc(-50% + 4px), -127px)' }}
            >
              <AnimatePresence>
                {isLit && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ scale: 0, opacity: 0, y: -40, filter: 'blur(15px)' }}
                    transition={{ duration: 0.2 }}
                    className="relative w-6 h-14 origin-bottom animate-[candle-flicker_3.2s_infinite_ease-in-out_0.5s]"
                  >
                    <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-24 h-24 bg-orange-500/15 rounded-full blur-xl z-10" />
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-7 h-14 bg-orange-500/40 rounded-[50%_50%_50%_50%_/_60%_60%_40%_40%] blur-md z-20 mix-blend-screen" />
                    <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-4 h-10 bg-gradient-to-t from-blue-600 via-orange-400 to-yellow-200 rounded-[50%_50%_50%_50%_/_70%_70%_30%_30%] shadow-[0_0_18px_rgba(255,150,0,0.8)] blur-[1px] z-30 mix-blend-screen" />
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-1.5 h-4 bg-white rounded-[50%_50%_50%_50%_/_60%_60%_40%_40%] shadow-[0_0_8px_white] z-40" />
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-blue-800/80 rounded-full blur-[2px] z-50 mix-blend-multiply" />
                  </motion.div>
                )}
              </AnimatePresence>
              {!isLit && (
                <motion.div
                  initial={{ opacity: 0, y: 0 }}
                  animate={{ opacity: [0, 0.7, 0], y: -70, scale: 2.5, x: [0, 12, -8, 4] }}
                  transition={{ duration: 3, ease: 'easeOut' }}
                  className="absolute bottom-0 w-2.5 h-8 bg-gray-200/50 blur-xl rounded-full"
                />
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [showFinaleCandle, setShowFinaleCandle] = useState(false);
  const [isFinaleTriggered, setIsFinaleTriggered] = useState(false);
  const [isExtinguished, setIsExtinguished] = useState(false);
  const [hasSeenConfetti, setHasSeenConfetti] = useState(false);
  const [isPlayingBaseAudio, setIsPlayingBaseAudio] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  // during the initial load of the application. The images are now pre-loaded
  // fully explicitly via the user button click.

  const displayMemories = useMemo(() => SAMPLE_MEMORIES, []);
  const isFinished = activeIndex === displayMemories.length - 1;

  const handleStart = async () => {
    // Play immediately on user interaction at a comfortable volume
    if (audioRef.current && !isPlayingBaseAudio) {
      audioRef.current.volume = 0.6;
      setIsPlayingBaseAudio(true); // Start spinning the record immediately!
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.warn("Auto-play was prevented by the browser.", error);
        });
      }
    }

    setIsLoading(true);
    let loaded = 0;
    // +1 for pasta.png preload
    const total = displayMemories.length + 1;

    // Preload the birthday cake image along with all memory photos so it's
    // already in the browser cache when the final InteractiveCandle card appears.
    const preloadUrls = [
      ...displayMemories.map(m => m.imageUrl),
      '/pasta.png',
    ];

    await Promise.all(preloadUrls.map(src => {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          loaded++;
          setLoadingProgress(Math.round((loaded / total) * 100));
          resolve(true);
        };
        img.onerror = () => {
          loaded++;
          setLoadingProgress(Math.round((loaded / total) * 100));
          resolve(false);
        };
        img.src = src;
      });
    }));

    setTimeout(() => {
      // Wait for needle animation to land (approx 1s) then hide intro
      setTimeout(() => {
        setIsLoading(false);
        setShowIntro(false);
      }, 1000);
    }, 500);
  };

  // Make sure to resets triggers when moving away
  useEffect(() => {
    if (!isFinished) {
      setIsFinaleTriggered(false);
      setShowFinaleCandle(false);
    }
  }, [isFinished]);



  // Trigger confetti automatically when reaching the last card
  useEffect(() => {
    if (isFinished && !hasSeenConfetti) {
      setHasSeenConfetti(true);

      const duration = 2500;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 8,
          angle: 60,
          spread: 60,
          origin: { x: -0.1, y: 1 },
          colors: ['#ff0a54', '#ff477e', '#ff7096', '#ff85a1', '#ffffff'],
          shapes: ['heart' as any, 'circle']
        });
        confetti({
          particleCount: 8,
          angle: 120,
          spread: 60,
          origin: { x: 1.1, y: 1 },
          colors: ['#ff0a54', '#ff477e', '#ff7096', '#ff85a1', '#ffffff'],
          shapes: ['heart' as any, 'circle']
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };

      frame();
    }
  }, [isFinished, hasSeenConfetti]);

  const triggerFinale = () => {
    setIsFinaleTriggered(true);
    // Show candle wrapper (which starts with the 7-sec delay component)
    setShowFinaleCandle(true);
  };

  const handleNext = useCallback(() => {
    setActiveIndex(i => (i < SAMPLE_MEMORIES.length - 1 && !isExtinguished ? i + 1 : i));
  }, [isExtinguished]);

  const handlePrev = useCallback(() => {
    setActiveIndex(i => (i > 0 && !isExtinguished ? i - 1 : i));
  }, [isExtinguished]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showIntro) return;
      if (e.key === 'ArrowRight' || e.key === ' ') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex, showIntro, displayMemories.length]);

  return (
    <div className="relative min-h-[100dvh] w-full flex flex-col items-center justify-center overflow-hidden font-sans bg-black touch-none select-none">

      {/* Blackout overlay after candle is blown */}
      <div
        className={cn(
          "absolute inset-0 bg-black z-[100] flex flex-col items-center justify-center transition-opacity duration-[3000ms] pointer-events-none",
          isExtinguished ? "opacity-100 pointer-events-auto" : "opacity-0"
        )}
      >
        <button
          onClick={() => {
            setIsExtinguished(false);
            setShowIntro(true);
            setActiveIndex(0);
            setShowFinaleCandle(false);
          }}
          className={cn(
            "px-10 py-4 rounded-full border border-white/20 text-white/80 tracking-[0.2em] uppercase text-sm hover:bg-white/10 transition-all duration-1000",
            isExtinguished ? "opacity-100 translate-y-0 delay-[2500ms]" : "opacity-0 translate-y-4"
          )}
        >
          Tekrar Bak
        </button>
      </div>

      <div className="hidden md:block">
        <StarlightBackground />
      </div>
      {!showIntro && (
        <div className="hidden md:block">
          <FairyLights />
        </div>
      )}

      {/* Lightweight CSS Fireflies for Mobile Only */}
      {!showIntro && <MobileFireflies />}

      {/* Floating Letters Sequence */}
      {!showIntro && (
        <div className="hidden md:flex fixed top-12 md:top-24 left-1/2 -translate-x-1/2 w-full max-w-2xl justify-center z-40 text-xl sm:text-2xl md:text-3xl font-serif text-amber-50 drop-shadow-[0_0_15px_rgba(253,230,138,0.8)] pointer-events-none mix-blend-screen whitespace-nowrap">
          {CARD_LETTERS.map((item, idx) => (
            <React.Fragment key={idx}>
              <AnimatePresence>
                {activeIndex >= idx && (
                  <motion.span
                    initial={{ opacity: 0, y: 150, scale: 2 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{
                      duration: 2.5,
                      ease: "circOut"
                    }}
                    className="inline-block relative"
                  >
                    <motion.span
                      animate={{ opacity: [1, 0.4, 1] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: Math.random() }}
                    >
                      {item.char}
                    </motion.span>
                  </motion.span>
                )}
              </AnimatePresence>
              {item.spaceAfter && <span className="w-2 md:w-4 inline-block" />}
            </React.Fragment>
          ))}
        </div>
      )}

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(30,30,40,0.5)_0%,transparent_100%)] pointer-events-none z-0" />

      <AnimatePresence>
        {showIntro ? (
          <motion.div
            key="intro"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="z-50 text-center space-y-12 p-8 max-w-lg relative"
          >
            <motion.div
              animate={{ filter: ["blur(4px)", "blur(0px)", "blur(4px)"] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 w-48 h-48 bg-white/5 rounded-full blur-3xl"
            />
            <div className="space-y-6">
              <div className="mx-auto flex justify-center text-5xl mb-4 drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]">
                🎂
              </div>
              <h1 className="text-4xl md:text-5xl font-serif font-light tracking-tight text-white/90 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                İyi ki doğdun Çiğdem
              </h1>
              <p className="text-white/50 font-serif italic text-lg leading-relaxed px-4">
                Bu hediye hayatında sadece bir kişiden alabileceğin deneyim ve güzelliklerle dolu bir hediye...
              </p>
            </div>
            {isLoading ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center space-y-8"
              >
                {/* Vinyl Record Player */}
                <div className="relative w-40 h-40">
                  {/* Retro Wooden Turntable Base */}
                  <div className="absolute inset-0 bg-[#3E2723] rounded-xl shadow-[inset_0_2px_15px_rgba(0,0,0,0.8),inset_0_0_0_4px_#5D4037,0_15px_35px_rgba(0,0,0,0.8)] border border-[#795548] overflow-hidden flex items-center justify-center">
                    {/* Brass/Gold Corner Accents */}
                    <div className="absolute top-1 left-1 w-2 h-2 rounded-full bg-yellow-600 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)]" />
                    <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-yellow-600 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)]" />
                    <div className="absolute bottom-1 left-1 w-2 h-2 rounded-full bg-yellow-600 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)]" />
                    <div className="absolute bottom-1 right-1 w-2 h-2 rounded-full bg-yellow-600 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)]" />

                    {/* Small red light indicator */}
                    <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-red-500/90 shadow-[0_0_8px_red]" />

                    {/* Internal metal platter base */}
                    <div className="absolute inset-0 m-auto w-36 h-36 bg-zinc-800 rounded-full shadow-[inset_0_5px_15px_rgba(0,0,0,0.8)] border-4 border-zinc-700/50" />
                  </div>

                  {/* Record Platter / Vinyl */}
                  <div className="absolute inset-2 flex items-center justify-center">
                    <div className={cn(
                      "w-32 h-32 bg-zinc-950 rounded-full shadow-[0_4px_10px_rgba(0,0,0,0.8)] border-2 border-stone-800 flex items-center justify-center relative",
                      isPlayingBaseAudio ? "animate-[spin-record_2s_linear_infinite]" : ""
                    )}>
                      {/* Vinyl Grooves */}
                      <div className="absolute inset-2 border border-white/10 rounded-full mix-blend-screen" />
                      <div className="absolute inset-4 border border-white/10 rounded-full mix-blend-screen" />
                      <div className="absolute inset-6 border border-white/10 rounded-full mix-blend-screen" />

                      {/* Vinyl Center Label (Vintage Red/Gold) */}
                      <div className="w-10 h-10 bg-red-800 rounded-full flex items-center justify-center outline outline-1 outline-[#d4af37] shadow-[inset_0_0_10px_rgba(0,0,0,0.5)] border-2 border-[#d4af37]">
                        {/* Spindle hole */}
                        <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full shadow-inner z-10" />
                      </div>

                      {/* Gloss Reflection */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-transparent rounded-full mix-blend-overlay pointer-events-none" />
                    </div>
                  </div>

                  {/* Record Player Arm / Needle (Brass and Wood) */}
                  <div className="absolute top-4 right-3 z-10 w-6 h-24 origin-[top_center] pointer-events-none">
                    <div className={cn(
                      "w-full h-full origin-[80%_10%] transition-transform duration-1000 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
                      isPlayingBaseAudio ? "rotate-12" : "-rotate-12"
                    )}>
                      {/* Brass Base Pivot */}
                      <div className="w-6 h-6 bg-gradient-to-br from-yellow-300 via-yellow-600 to-yellow-800 rounded-full shadow-lg ml-auto border border-yellow-700/50 flex items-center justify-center">
                        <div className="w-2 h-2 bg-yellow-900 rounded-full shadow-inner" />
                      </div>
                      {/* Tonearm (Gold/Brass) */}
                      <div className="w-1.5 h-16 bg-gradient-to-r from-yellow-400 via-yellow-200 to-yellow-600 mx-auto -mt-2 rounded-full shadow-[2px_0_5px_rgba(0,0,0,0.5)]" />
                      {/* Cartridge/Needle Body (Wood/Gold) */}
                      <div className="w-3.5 h-7 bg-gradient-to-b from-[#5D4037] to-[#3E2723] mx-auto -mt-1 rounded-sm shadow-xl flex justify-end border-t-2 border-yellow-500">
                        {/* Literal Needle Tip */}
                        <div className="w-0.5 h-2 bg-zinc-400 -ml-1 mt-6 shadow-sm" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-center">
                  <span className="text-white/80 font-serif italic tracking-widest text-sm mb-3 animate-pulse">
                    Başlıyoruz...
                  </span>
                  <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden shadow-inner">
                    <div
                      className="h-full bg-amber-500/80 transition-all duration-300 ease-out"
                      style={{ width: `${loadingProgress}%` }}
                    />
                  </div>
                </div>
              </motion.div>
            ) : (
              <button
                onClick={handleStart}
                className="group relative px-10 py-5 rounded-full overflow-hidden bg-transparent transition-all hover:bg-white/5 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.05)] hover:shadow-[0_0_30px_rgba(255,255,255,0.1)] mx-auto flex items-center justify-center min-w-[260px]"
              >
                {/* Silver Animated Background Layer */}
                <div className="absolute inset-[-50%] bg-[conic-gradient(from_0deg,transparent_0%,rgba(200,200,200,0.8)_20%,transparent_40%)] animate-[spin_4s_linear_infinite]" />

                {/* Inner button surface */}
                <div className="absolute inset-[2px] bg-zinc-900/90 rounded-full backdrop-blur-md" />

                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite] rounded-full pointer-events-none" />

                <span className="relative z-10 flex items-center justify-center gap-3 font-serif font-medium tracking-widest text-sm text-white/90 uppercase drop-shadow-md">
                  Hediyeyi gör <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform opacity-70" />
                </span>
              </button>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="gallery"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
            className="w-full h-full absolute inset-0 flex flex-col items-center justify-center [perspective:1200px]"
          >
            <SwipeOverlay
              disabled={showFinaleCandle}
              onSwipeLeft={handleNext}
              onSwipeRight={handlePrev}
            />

            {/* Gallery Tunnel */}
            <div className={cn(
              "relative z-30 w-full max-w-5xl h-[65vh] flex items-center justify-center [transform-style:preserve-3d] pointer-events-none transition-transform duration-1000",
              isFinaleTriggered ? "-translate-y-16 scale-95 opacity-50 blur-sm" : ""
            )}>
              {/* Only rendering the closest cards prevents massive render blocking initially */}
              {displayMemories.map((memory, index) => {
                const absOffset = Math.abs(index - activeIndex);
                if (absOffset > 3) return null;
                return (
                  <CoverFlowCard
                    key={memory.id}
                    memory={memory}
                    index={index}
                    activeIndex={activeIndex}
                  />
                );
              })}
            </div>

            {/* Manual Finale Trigger Button */}
            {!isFinaleTriggered && isFinished && (
              <div className="absolute bottom-16 left-0 right-0 flex justify-center z-50 pointer-events-auto">
                <motion.button
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1 }}
                  onClick={triggerFinale}
                  className="group relative px-10 py-5 rounded-full overflow-hidden bg-transparent transition-all hover:bg-white/5 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.05)] hover:shadow-[0_0_30px_rgba(255,255,255,0.1)] mx-auto flex items-center justify-center min-w-[260px]"
                >
                  {/* Silver Animated Background Layer */}
                  <div className="absolute inset-[-50%] bg-[conic-gradient(from_0deg,transparent_0%,rgba(200,200,200,0.8)_20%,transparent_40%)] animate-[spin_4s_linear_infinite]" />

                  {/* Inner button surface */}
                  <div className="absolute inset-[2px] bg-zinc-900/90 rounded-full backdrop-blur-md" />

                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite] rounded-full pointer-events-none" />

                  <span className="relative z-10 flex items-center justify-center gap-3 font-serif font-medium tracking-widest text-sm text-white/90 uppercase drop-shadow-md">
                    Pastanı çağır <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform opacity-70" />
                  </span>
                </motion.button>
              </div>
            )}

            {/* Finale Section - Appears after button click */}
            <div className="absolute bottom-8 left-0 right-0 flex items-center justify-center z-50 pointer-events-none">
              <AnimatePresence>
                {showFinaleCandle && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8, y: 50 }}
                    animate={{ opacity: 1, scale: 1, y: -20 }}
                    transition={{ type: "spring", stiffness: 100, damping: 20 }}
                  >
                    <InteractiveCandle 
                      onCakeAppears={() => {
                        if (audioRef.current) {
                          audioRef.current.pause();
                        }
                        setIsPlayingBaseAudio(false);
                      }}
                      onExtinguished={() => {
                        // Wait 3 seconds for the smoke animation to play before hiding everything!
                        setTimeout(() => setIsExtinguished(true), 3000);
                      }} 
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="fixed top-20 left-1/2 -translate-x-1/2 text-white/20 font-serif italic text-xs tracking-widest pointer-events-none opacity-50 z-50 mix-blend-screen whitespace-nowrap hidden md:block">
        {!showIntro && !showFinaleCandle && "Fotoğraf geçişleri için ekranı kaydırın veya yön tuşlarını kullanın"}
      </div>

      {/* Hidden Native Preloader to prevent mobile browser re-fetching images on swipe unmounts */}
      <div className="hidden" aria-hidden="true">
        {displayMemories.map(m => (
          <img key={`preload-${m.id}`} src={m.imageUrl} alt="" loading="eager" />
        ))}
      </div>

      {/* Persistent Audio Element - Guarantees better mobile support than new Audio() */}
      {/* Note: display: none or hidden can sometimes suspend media decoding on mobile WebKit. Moving off-screen instead. */}
      <audio
        ref={audioRef}
        src="/song.mp3"
        loop
        preload="auto"
        className="fixed -top-[9999px] -left-[9999px] opacity-0 pointer-events-none"
        aria-hidden="true"
        playsInline // Extremely crucial for iOS autoplay
      />
    </div>
  );
}
