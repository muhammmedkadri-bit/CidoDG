/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, MapPin, Sparkles, Image as ImageIcon, ChevronRight } from 'lucide-react';
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
    description: 'Sanırım kader bize inatla bir hikaye yazdırmaya kararlıydı. Ortak arkadaşlardan birinin hikayesinde görüp istek atmamla, haftalarca o isteğin kabul nöbetinde beklemek zorluydu...',
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
    description: 'En sevdiğimin, Fenerbahçemin sevincini paylaştığım bir hikayeyey hiç beklemediğim bir yanıt gelmişti. "Eski bir dost...". Kalbimin küt küt atışı, sandalyeden doğruluşum. Bir akşam üstüydü...',
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
    location: 'halanın evi'
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
    description: 'Umutsuz bir geceyi güzel kılan şey hayatının aşkını en sevdiğiniz yerde sürpriz bir şekilde görmek kadar güzeli olmaz bu dünyada. Temelli dönüş, yeni bir macera, iyiler, kötüler ve hatta ayrılık...',
    imageUrl: 'https://i.hizliresim.com/s3489yg.png',
    location: 'Salıncaklar'
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
    id: '15',
    title: 'Harabe bir ev...',
    description: 'Kaderin bazen çiçeklerle dolu bir evi hatalarla, yanlışlarla ve bilinmezliklerle harabeye çevirdiği hep görülmüştür ancak insanın kendi başına getirince...',
    imageUrl: 'https://i.hizliresim.com/la23owj.png',
    location: ''
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
    location: '27'
  },
  {
    id: '18',
    title: 'Mandalinalara triplenmeyeceğin harika bir yaş olsun...',
    description: '',
    imageUrl: 'https://i.hizliresim.com/nec7tt2.png',
    location: '27'
  },
  {
    id: '19',
    title: 'İyi ki doğdun \'Gece Saçlı\'',
    description: 'Her yaşına, her yaşantına ve her şeyine minnettarız. Varlığınla hayatımıza aydınlık kattığın için, sabrın ve kalbinin güzelliği ile bize abla, kardeş, dost, sırdaş ve yoldaş olduğun için iyi ki varsın. Nice güzel yaşlara. İyi ki doğdun gece saçlı güzel...',
    imageUrl: 'https://i.hizliresim.com/e1xuvk8.png',
    location: '03.09'
  }
];

interface CoverFlowCardProps {
  memory: Memory;
  index: number;
  activeIndex: number;
}

const CoverFlowCard: React.FC<CoverFlowCardProps> = ({ memory, index, activeIndex }) => {
  const [imageError, setImageError] = useState(false);

  const offset = index - activeIndex;
  const absOffset = Math.abs(offset);
  const zIndex = 100 - absOffset;
  const isActive = offset === 0;

  const translateX = offset * 25;
  const translateZ = absOffset > 0 ? -150 - absOffset * 50 : 0;
  const rotateY = offset === 0 ? 0 : offset > 0 ? -35 : 35;
  const opacity = 1 - Math.min(absOffset * 0.25, 0.8);

  // Render optimization: only render cards that are close to the active index
  if (absOffset > 3) return null;

  return (
    <motion.div
      style={{ zIndex }}
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
          isActive ? "shadow-[0_0_30px_rgba(255,255,255,0.15)] ring-1 ring-white/20" : "shadow-lg shadow-black/50"
        )}
      >
        {!imageError ? (
          <img
            src={memory.imageUrl}
            alt={memory.title}
            className={cn(
              "absolute inset-0 w-full h-full object-cover transition-transform duration-1000",
              isActive ? "scale-105" : "scale-100"
            )}
            onError={() => setImageError(true)}
            loading="lazy"
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
};

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
const InteractiveCandle = ({ onExtinguished }: { onExtinguished: () => void }) => {
  const [isLit, setIsLit] = useState(true);
  const [micState, setMicState] = useState<'idle' | 'listening' | 'error'>('idle');
  const [isStartup, setIsStartup] = useState(true);

  // Startup phase timer
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsStartup(false);
    }, 7000);
    return () => clearTimeout(timer);
  }, []);

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

          // "Blowing" threshold drastically lowered for easy detection
          if (average > 25) {
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

      // Extended fallback/manual off
      fallbackTimer = setTimeout(() => {
        if (isLit) {
          // Auto shut off in 15 seconds regardless
          setIsLit(false);
          onExtinguished();
          stopMic();
        }
      }, 15000);
    }

    return () => {
      clearTimeout(fallbackTimer);
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
          <p className="text-white/70 mt-4 text-lg font-light tracking-wide max-w-sm mx-auto p-4 bg-black/30 rounded-2xl border border-white/5 shadow-2xl backdrop-blur-md">
            Hadi bir dilek tut. Birazdan pasta ve mumun geldiğinde dileğini dile ve mumunu üflemek için mikrofon iznine izin ver. Her şey gönlünce olsun...
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-16 pointer-events-auto mt-8">
      <motion.h3
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-2xl font-serif text-amber-100 italic tracking-widest drop-shadow-[0_0_10px_rgba(253,230,138,0.5)] bg-black/40 px-6 py-2 rounded-full backdrop-blur-md border border-white/10 text-center z-50"
      >
        {isLit ? (
          <>
            Dileğini tut ve pastanı üfle...
            {micState === 'error' && <span className="block text-xs opacity-50 mt-1 font-sans tracking-normal">(Söndürmek için pastaya dokun)</span>}
          </>
        ) : "Dileğin kabul olsun..."}
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
        {/* The Flame */}
        <div className="absolute -top-16 w-16 h-28 flex justify-center z-30 pointer-events-none">
          <AnimatePresence>
            {isLit && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: [1, 1.15, 0.9, 1.05, 1],
                  opacity: 1,
                  rotate: [-3, 3, -1, 2, -2],
                  y: [0, -2, 1, -1, 0],
                  x: [-1, 1, -2, 1, 0]
                }}
                exit={{ scale: 0, opacity: 0, y: -40, filter: "blur(15px)" }}
                transition={{ duration: 0.1, repeat: Infinity, repeatType: "mirror" }}
                className="relative w-8 h-20 origin-bottom"
              >
                {/* Core white hot */}
                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-4 h-6 bg-white rounded-[50%_50%_20%_20%] z-40 blur-[1px]" />
                {/* Flame body */}
                <div
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-16 bg-gradient-to-t from-blue-400 via-orange-400 to-yellow-100 rounded-[50%_50%_40%_40%] shadow-[0_0_30px_rgba(250,150,0,0.9),0_0_60px_rgba(250,200,50,0.6)] blur-[1.5px] z-30 mix-blend-screen"
                  style={{ borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%' }}
                />
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-24 h-24 bg-orange-500/20 rounded-full blur-2xl z-10" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Smoke after extinguishing */}
          {!isLit && (
            <motion.div
              initial={{ opacity: 0, y: 0 }}
              animate={{ opacity: [0, 0.8, 0], y: -100, scale: 4, x: [0, -20, 15, -10] }}
              transition={{ duration: 3, ease: "easeOut" }}
              className="absolute bottom-4 w-4 h-12 bg-gray-200/50 blur-xl rounded-full"
            />
          )}
        </div>

        {/* The Candle */}
        <div className="relative w-4 h-24 z-20 mb-[-10px] drop-shadow-lg">
          {/* Wick */}
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-1.5 h-3 bg-zinc-900 rounded-t-full z-10" />

          {/* Candle Body */}
          <div className="absolute inset-0 bg-gradient-to-r from-teal-200 via-teal-50 to-teal-300 rounded-sm shadow-[inset_0_0_5px_rgba(0,0,0,0.2)] border-x border-teal-400/30 overflow-hidden">
            {/* Spiral Stripes */}
            <div className="absolute inset-0 bg-[#ffffff33] [transform:skewY(-20deg)] bg-[repeating-linear-gradient(to_bottom,transparent,transparent_8px,rgba(255,255,255,0.7)_8px,rgba(255,255,255,0.7)_16px)]" />
          </div>
        </div>

        {/* The White Chocolate Cake Base */}
        <div className="relative w-72 h-36 flex flex-col items-center">
          {/* Cake Top Surface */}
          <div className="absolute top-0 w-72 h-20 bg-gradient-to-b from-[#fffbeb] to-[#fef3c7] rounded-[50%] border-t border-white shadow-[inset_0_-4px_10px_rgba(180,100,20,0.15)] z-20 flex items-center justify-center">

            {/* Writing on the cake */}
            <div className="absolute bottom-3 text-[#78350f] font-serif italic font-bold text-base leading-tight text-center [transform:rotateX(55deg)] drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)] opacity-90 select-none">
              Nice yaşlara<br />Çidoş
            </div>

            {/* Gourmet Berries and Decorations */}
            {/* Strawberry 1 */}
            <div className="absolute top-4 left-10 w-4 h-5 bg-gradient-to-br from-red-500 to-red-700 rounded-t-full rounded-b-xl shadow-[2px_2px_4px_rgba(0,0,0,0.3)] [transform:rotateX(55deg)_rotate(-15deg)] z-30">
              <div className="absolute top-0 left-1 w-2 h-1.5 bg-green-600 rounded-full" />
              <div className="absolute top-1 left-1 w-0.5 h-0.5 bg-yellow-200/50 rounded-full" />
            </div>
            {/* Strawberry 2 */}
            <div className="absolute top-12 right-20 w-5 h-6 bg-gradient-to-br from-red-500 to-red-800 rounded-t-full rounded-b-xl shadow-[3px_3px_5px_rgba(0,0,0,0.3)] [transform:rotateX(55deg)_rotate(35deg)] z-30">
              <div className="absolute -top-0.5 left-1.5 w-2 h-2 bg-green-600 rounded-full" />
              <div className="absolute top-2 left-1.5 w-1 h-1 bg-yellow-200/50 rounded-full" />
            </div>
            {/* Strawberry 3 */}
            <div className="absolute bottom-6 left-12 w-4 h-5 bg-gradient-to-br from-red-600 to-red-900 rounded-t-full rounded-b-xl shadow-[2px_2px_4px_rgba(0,0,0,0.3)] [transform:rotateX(55deg)_rotate(80deg)] z-30">
              <div className="absolute top-0 right-1 w-1.5 h-1 bg-green-600 rounded-full" />
            </div>
            {/* Cherry 1 */}
            <div className="absolute top-3 right-16 w-3.5 h-3.5 bg-red-800 rounded-full shadow-[2px_2px_4px_rgba(0,0,0,0.4)] [transform:rotateX(55deg)] z-30">
              <div className="absolute bottom-2 left-1/2 w-4 h-4 rounded-tl-full border-t border-l border-[#4d2c18]" />
            </div>
            {/* Cherry 2 */}
            <div className="absolute top-6 left-24 w-4 h-4 bg-red-800 rounded-full shadow-[2px_2px_4px_rgba(0,0,0,0.4)] [transform:rotateX(55deg)] z-30">
              <div className="absolute bottom-2 right-1/2 w-4 h-5 rounded-tr-full border-t border-r border-[#4d2c18]" />
            </div>

            {/* Dollops of cream */}
            <div className="absolute top-8 left-16 w-6 h-6 bg-white rounded-full shadow-sm [transform:rotateX(55deg)] blur-[0.5px]" />
            <div className="absolute bottom-3 right-8 w-7 h-7 bg-white rounded-full shadow-sm [transform:rotateX(55deg)] blur-[0.5px]" />
            <div className="absolute top-4 right-24 w-5 h-5 bg-white rounded-full shadow-sm [transform:rotateX(55deg)] blur-[0.5px]" />
          </div>

          {/* Cake Cylinder Body */}
          <div className="absolute top-10 w-72 h-20 bg-gradient-to-b from-[#fef3c7] via-[#fde68a] to-[#fcd34d] rounded-b-[50%] shadow-[inset_0_-15px_30px_rgba(150,80,10,0.3)] z-10 overflow-hidden">
            {/* Chocolate/Icing drips */}
            <div className="absolute top-0 left-8 w-6 h-10 bg-[#fffbeb] rounded-b-full shadow-sm" />
            <div className="absolute top-0 left-20 w-4 h-14 bg-[#fffbeb] rounded-b-full shadow-sm" />
            <div className="absolute top-0 left-36 w-8 h-8 bg-[#fffbeb] rounded-b-full shadow-sm" />
            <div className="absolute top-0 right-16 w-7 h-12 bg-[#fffbeb] rounded-b-full shadow-sm" />
            <div className="absolute top-0 right-6 w-5 h-9 bg-[#fffbeb] rounded-b-full shadow-sm" />
            <div className="absolute top-0 right-28 w-8 h-10 bg-[#fffbeb] rounded-b-full shadow-sm" />
          </div>

          {/* Cake Plate Base */}
          <div className="absolute bottom-0 w-80 h-16 bg-gradient-to-b from-gray-200 via-gray-300 to-gray-500 rounded-[50%] shadow-[0_15px_30px_rgba(0,0,0,0.6)] z-0 border-b-4 border-gray-600 flex items-center justify-center">
            {/* Inner plate rim */}
            <div className="w-[90%] h-[80%] rounded-[50%] shadow-[inset_0_2px_4px_rgba(255,255,255,0.7)] border-t border-gray-400/50" />
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

  // Note: Removed sync preloading of images to free up the main thread
  // during the initial load of the application. The images are now pre-loaded
  // fully explicitly via the user button click.

  const displayMemories = useMemo(() => SAMPLE_MEMORIES, []);
  const isFinished = activeIndex === displayMemories.length - 1;

  const handleStart = async () => {
    setIsLoading(true);
    let loaded = 0;
    const total = displayMemories.length;

    await Promise.all(displayMemories.map(memory => {
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
        img.src = memory.imageUrl;
      });
    }));

    setTimeout(() => {
      setIsLoading(false);
      setShowIntro(false);
    }, 800);
  };

  // Make sure to resets triggers when moving away
  useEffect(() => {
    if (!isFinished) {
      setIsFinaleTriggered(false);
      setShowFinaleCandle(false);
    }
  }, [isFinished]);

  const triggerFinale = () => {
    setIsFinaleTriggered(true);

    // Confetti burst from edges
    const duration = 2500;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 8,
        angle: 60,
        spread: 60,
        origin: { x: -0.1, y: 1 },
        colors: ['#ffffff', '#fde047', '#f472b6', '#38bdf8']
      });
      confetti({
        particleCount: 8,
        angle: 120,
        spread: 60,
        origin: { x: 1.1, y: 1 },
        colors: ['#ffffff', '#fde047', '#f472b6', '#38bdf8']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();

    // Show candle wrapper (which starts with the 7-sec delay component)
    setShowFinaleCandle(true);
  };

  const handleNext = () => {
    setActiveIndex(i => (i < displayMemories.length - 1 && !isExtinguished ? i + 1 : i));
  };

  const handlePrev = () => {
    setActiveIndex(i => (i > 0 && !isExtinguished ? i - 1 : i));
  };

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
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden font-sans bg-black touch-none select-none">

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

      <StarlightBackground />
      {!showIntro && <FairyLights />}

      {/* Floating Letters Sequence */}
      {!showIntro && (
        <div className="fixed top-12 md:top-24 left-1/2 -translate-x-1/2 w-full max-w-2xl flex justify-center z-40 text-xl sm:text-2xl md:text-3xl font-serif text-amber-50 drop-shadow-[0_0_15px_rgba(253,230,138,0.8)] pointer-events-none mix-blend-screen whitespace-nowrap">
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
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center space-y-6"
              >
                <div className="w-12 h-12 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin shadow-[0_0_15px_rgba(245,158,11,0.5)]" />
                <div className="text-center space-y-2">
                  <p className="text-white/80 font-serif italic text-lg tracking-wide animate-pulse">
                    Hediyen düzenleniyor lütfen biraz bekle...
                  </p>
                  <p className="text-amber-500/80 font-mono text-sm tracking-[0.3em] font-medium">
                    %{loadingProgress}
                  </p>
                </div>
              </motion.div>
            ) : (
              <button
                onClick={handleStart}
                className="group relative px-10 py-4 rounded-full overflow-hidden bg-white/5 border border-white/10 transition-all hover:bg-white/10 hover:border-white/25 active:scale-95"
              >
                <span className="relative z-10 flex items-center gap-3 font-medium tracking-[0.2em] text-xs text-white/80 uppercase">
                  Hediyeyi ziyaret et <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
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
            {/* Global Swipe Overlay - Background transparent added for solid hit detection on mobile */}
            <motion.div
              className={cn(
                "absolute inset-0 z-40 touch-none bg-transparent w-full h-full",
                !showFinaleCandle ? "cursor-grab active:cursor-grabbing" : "cursor-default"
              )}
              drag={!showFinaleCandle ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.15}
              onDragEnd={(e, { offset, velocity }) => {
                if (showFinaleCandle) return;

                // Optimized thresholds for perfect mobile responsiveness
                const swipeDistance = offset.x;
                const swipeVelocity = velocity.x;

                if (swipeDistance < -20 || swipeVelocity < -300) {
                  handleNext();
                } else if (swipeDistance > 20 || swipeVelocity > 300) {
                  handlePrev();
                }
              }}
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
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                  onClick={triggerFinale}
                  className="px-8 py-3 rounded-full bg-amber-500/20 text-amber-100 border border-amber-500/30 backdrop-blur-md shadow-[0_0_20px_rgba(251,191,36,0.2)] hover:bg-amber-500/40 hover:scale-105 transition-all outline-none"
                >
                  Hadi mumuna üfle 🎉
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
                    <InteractiveCandle onExtinguished={() => {
                      // Wait 3 seconds for the smoke animation to play before hiding everything!
                      setTimeout(() => setIsExtinguished(true), 3000);
                    }} />
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
    </div>
  );
}
