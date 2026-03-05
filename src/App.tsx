/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'motion/react';
import { Heart, MapPin, Calendar, RefreshCw, ChevronRight, Sparkles, Image as ImageIcon } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Memory } from './types';

// Utility for tailwind classes
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const SAMPLE_MEMORIES: Memory[] = [
  {
    id: '16',
    title: 'Yeni yaşın sana ve sevdiklerine güzellikler getirsin.',
    description: 'Her şeyin en iyisini hak eden kalbin daima güzelliklerle karşılaşsın. Irz düşmanı Bedir efendinin bol öpücükleriyle dolu olsun.',
    imageUrl: 'https://i.hizliresim.com/m19aqwm.png',
    location: ''
  },
  {
    id: '15',
    title: 'Harabe bir ev...',
    description: 'Kaderin bazen çiçeklerle dolu bir evi hatalarla, yanlışlarla ve bilinmezliklerle harabeye çevirdiği hep görülmüştür ancak insanın kendi başına getirince...',
    imageUrl: 'https://i.hizliresim.com/3biw0tt.png',
    location: ''
  },
  {
    id: '14',
    title: 'Ve son defa görüşeceğimizi bilmezken bile iyi ki vardın...',
    description: '',
    imageUrl: 'https://i.hizliresim.com/5ynd064.png',
    location: 'Park'
  },
  {
    id: '13',
    title: 'Bir şehri gözlerinle esir alırken...',
    description: '',
    imageUrl: 'https://i.hizliresim.com/r3r8kw0.png',
    location: 'Şahin tepe'
  },
  {
    id: '12',
    title: 'Çocuklar gibi eğlenirken...',
    description: '',
    imageUrl: 'https://i.hizliresim.com/4aqr8xb.png',
    location: 'AVM'
  },
  {
    id: '11',
    title: '3.Lambanın altında...',
    description: '',
    imageUrl: 'https://i.hizliresim.com/7ci35ed.png',
    location: '3.Lambanın altı'
  },
  {
    id: '10',
    title: 'Bir çocuk parkının tek bankında...',
    description: '',
    imageUrl: 'https://i.hizliresim.com/1mg0hgm.png',
    location: 'Çocuk parkı'
  },
  {
    id: '9',
    title: 'Mabed\'de yeniden...',
    description: 'Umutsuz bir geceyi güzel kılan şey hayatının aşkını en sevdiğiniz yerde sürpriz bir şekilde görmek kadar güzeli olmaz bu dünyada. Temelli dönüş, yeni bir macera, iyiler, kötüler ve hatta ayrılık...',
    imageUrl: 'https://i.hizliresim.com/s3489yg.png',
    location: 'Salıncaklar'
  },
  {
    id: '5',
    title: 'Hasret bitiyor...',
    description: 'Aylar süren mesajlaşmalar, bekleyişler, memlekete dönüş ve bir aşkın ayak sesleri...',
    imageUrl: 'https://i.hizliresim.com/bndel5p.png',
    location: 'Antalya / Cizre'
  },
  {
    id: '4',
    title: 'Hatırlanmak...',
    description: 'En sevdiğimin, Fenerbahçemin sevincini paylaştığım bir hikayeyey hiç beklemediğim bir yanıt gelmişti. "Eski bir dost...". Kalbimin küt küt atışı, sandalyeden doğruluşum. Bir akşam üstüydü...',
    imageUrl: 'https://i.hizliresim.com/qa7em2o.png',
    location: 'Antalya / Cizre'
  },
  {
    id: '3',
    title: 'Ve ilk adım...',
    description: 'İstek sonunda kabul olmuş ve sanırım hatırlanmıştım. Kafede kısacık süren bir birlikteliğin, orada çizilen kaderin ilk adımı atılmıştı artık...',
    imageUrl: 'https://i.hizliresim.com/hp6y7e8.png',
    location: 'Cizre / Antalya'
  },
  {
    id: '2',
    title: 'Aylar sonra rastgele bir story',
    description: 'Sanırım kader bize inatla bir hikaye yazdırmaya kararlıydı. Ortak arkadaşlardan birinin hikayesinde görüp istek atmamla, haftalarca o isteğin kabul nöbetinde beklemek zorluydu...',
    imageUrl: 'https://i.hizliresim.com/jj174xu.png',
    location: 'Cizre'
  },
  {
    id: '1',
    title: 'Her şeyin başlangıcı',
    description: 'Seninle ilk oturduğumuz o masada, o gün hayatımın en güzel yolculuğuna çıkacağımı bilmiyordum. Gözlerine ilk baktığım o an, kalbimdeki heyecanı hala dün gibi hatırlıyorum. O günden beri her anımız benim için paha biçilemez.',
    imageUrl: 'https://i.hizliresim.com/ln8bd2t.png',
    location: 'Kasaba Cafe'
  },
  {
    id: '7',
    title: 'İlk bakış, ilk gülüş, ilk öpücük...',
    description: 'Bir aşkın ilk ateşi yakılmıştı. her şeyin ilki ilk defa yaşanacaktı... Gözlerinin içine bakarak... Öldüğümde hayat hikayem film şeridi gibi gösterildiğinde ilk defa öyle gülümseyeceğimdir.',
    imageUrl: 'https://i.hizliresim.com/o5gdad8.png',
    location: 'halanın evi'
  },
  {
    id: '6',
    title: 'Kavuşmaya ramak kala',
    description: 'Onca yıllık ömrümde kalbimin en sert ve en heyecanlı atışlarını hissetmek inanılmazdı. Bir aşkın ilk adımını atmak, bir hikayeyi başlatmaya ramak kalmıştı. hasret bitmişti...',
    imageUrl: 'https://i.hizliresim.com/omuj6ta.png',
    location: 'Cizre'
  },
  {
    id: '8',
    title: 'Hasret aşk ile harmanlanıyor...',
    description: 'Hayatın acımasız kanunları iki aşığı yine birbirinden uzakta tutunca aşk daha da alevlenirmiş. Ağlamalar, özlemler, acılar...',
    imageUrl: 'https://i.hizliresim.com/pywtdlu.png',
    location: 'Cizre / Antalya'
  }
];

interface CardProps {
  memory: Memory;
  onSwipe: (direction: 'left' | 'right') => void;
  isTop: boolean;
}

const SwipeCard: React.FC<CardProps> = ({ memory, onSwipe, isTop }) => {
  const [imageError, setImageError] = useState(false);
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-30, 30]);
  const opacity = useTransform(x, [-250, -150, 0, 150, 250], [0, 1, 1, 1, 0]);
  const scale = useTransform(x, [-200, 0, 200], [1.1, 1, 1.1]);
  
  const swipeLabel = useTransform(x, [-150, 0, 150], ["Geç", "", "Beğendim"]);
  const swipeLabelColor = useTransform(x, [-150, 0, 150], ["#ef4444", "#ffffff", "#22c55e"]);
  const swipeLabelOpacity = useTransform(x, [-150, -50, 0, 50, 150], [1, 0, 0, 0, 1]);

  const handleDragEnd = (_: any, info: any) => {
    const threshold = 120;
    if (info.offset.x > threshold) {
      onSwipe('right');
    } else if (info.offset.x < -threshold) {
      onSwipe('left');
    }
  };

  const imageUrl = useMemo(() => {
    if (memory.imageUrl.startsWith('http')) return memory.imageUrl;
    return memory.imageUrl;
  }, [memory.imageUrl]);

  return (
    <motion.div
      style={{ x, rotate, opacity, scale, zIndex: isTop ? 10 : 0 }}
      drag={isTop ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.9}
      dragTransition={{ bounceStiffness: 600, bounceDamping: 20 }}
      onDragEnd={handleDragEnd}
      initial={{ scale: 0.8, opacity: 0, y: 40 }}
      animate={{ 
        scale: isTop ? 1 : 0.95, 
        opacity: isTop ? 1 : 0.5, 
        y: isTop ? 0 : 15,
        transition: { type: "spring", stiffness: 300, damping: 25 }
      }}
      exit={(custom: number) => ({
        x: custom > 0 ? 800 : -800,
        opacity: 0,
        rotate: custom > 0 ? 45 : -45,
        transition: { duration: 0.5, ease: "easeIn" }
      })}
      className={cn(
        "absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing touch-none",
        !isTop && "pointer-events-none"
      )}
    >
      <div className="relative w-full h-full rounded-3xl overflow-hidden glass-card group shadow-2xl">
        {/* Image */}
        {!imageError ? (
          <img
            src={imageUrl}
            alt={memory.title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
            onError={() => {
              console.error("Image failed to load:", imageUrl);
              setImageError(true);
            }}
          />
        ) : (
          <div className="absolute inset-0 bg-zinc-900 flex flex-col items-center justify-center p-6 text-center space-y-4">
            <Sparkles className="text-white/20 w-12 h-12" />
            <p className="text-white/40 text-sm font-serif italic">Görsel yüklenemedi ama anımız hep burada...</p>
          </div>
        )}
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent" />

        {/* Swipe Label */}
        <motion.div
          style={{ opacity: swipeLabelOpacity }}
          className="absolute top-10 left-10 z-20 font-serif text-4xl font-bold uppercase tracking-widest"
        >
          <motion.span style={{ color: swipeLabelColor }}>{swipeLabel}</motion.span>
        </motion.div>

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-8 space-y-4">
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="space-y-1"
          >
            <h2 className="text-3xl font-serif font-medium tracking-wide text-white shadow-sm">{memory.title}</h2>
            <div className="flex items-center gap-4 text-white/60 text-sm font-sans">
              {memory.location && <span className="flex items-center gap-1"><MapPin size={14} /> {memory.location}</span>}
            </div>
          </motion.div>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-lg text-white/90 font-serif italic leading-relaxed"
          >
            "{memory.description}"
          </motion.p>
        </div>
      </div>
    </motion.div>
  );
};

const FloatingParticles = () => {
  const particles = useMemo(() => Array.from({ length: 20 }), []);
  
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map((_, i) => (
        <motion.div
          key={i}
          initial={{ 
            opacity: 0,
            x: Math.random() * 100 + "%",
            y: "110%",
            scale: Math.random() * 0.5 + 0.5
          }}
          animate={{ 
            opacity: [0, 0.3, 0.3, 0],
            y: "-10%",
            x: (Math.random() * 100) + (Math.random() * 20 - 10) + "%",
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            delay: Math.random() * 20,
            ease: "linear"
          }}
          className="absolute"
        >
          {i % 3 === 0 ? (
            <Heart size={Math.random() * 15 + 10} className="text-rose-500/20 fill-rose-500/10" />
          ) : (
            <div 
              className="rounded-full bg-white/10 blur-[1px]" 
              style={{ 
                width: Math.random() * 8 + 4 + 'px', 
                height: Math.random() * 8 + 4 + 'px' 
              }} 
            />
          )}
        </motion.div>
      ))}
    </div>
  );
};

export default function App() {
  const [memories, setMemories] = useState<Memory[]>(SAMPLE_MEMORIES);
  const [showIntro, setShowIntro] = useState(true);
  const [isFinished, setIsFinished] = useState(false);
  const [lastSwipeDirection, setLastSwipeDirection] = useState(0);

  const handleSwipe = (direction: 'left' | 'right') => {
    setLastSwipeDirection(direction === 'right' ? 1 : -1);
    setMemories((prev) => {
      const newMemories = [...prev];
      newMemories.pop();
      if (newMemories.length === 0) {
        setIsFinished(true);
      }
      return newMemories;
    });
  };

  const resetMemories = () => {
    setMemories(SAMPLE_MEMORIES);
    setShowIntro(true);
    setIsFinished(false);
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden font-sans">
      <div className="atmosphere" />
      <FloatingParticles />

      <AnimatePresence>
        {showIntro ? (
          <motion.div
            key="intro"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -100 }}
            className="z-50 text-center space-y-8 p-6 max-w-md"
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4 }}
              className="inline-block"
            >
              <Heart size={64} className="text-rose-500 fill-rose-500/20" />
            </motion.div>
            <div className="space-y-4">
              <h1 className="text-5xl font-serif font-light tracking-tighter">İyi ki Doğdun...</h1>
              <p className="text-white/60 font-serif italic text-xl">
                Senin için küçük bir anı tüneli hazırladım. Her kartta bizden bir parça var.
              </p>
            </div>
            <button
              onClick={() => setShowIntro(false)}
              className="group relative px-8 py-3 rounded-full overflow-hidden glass-card transition-all hover:scale-105 active:scale-95"
            >
              <span className="relative z-10 flex items-center gap-2 font-medium tracking-widest text-sm uppercase">
                Tünele Gir <ChevronRight size={16} />
              </span>
              <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </button>
          </motion.div>
        ) : isFinished ? (
          <motion.div
            key="finished"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="z-50 text-center space-y-12 p-8 glass-card rounded-3xl max-w-lg"
          >
            <div className="space-y-4">
              <Sparkles size={48} className="mx-auto text-amber-400" />
              <h2 className="text-4xl font-serif">Mutlu Yıllar</h2>
              <p className="text-white/70 font-serif italic text-xl leading-relaxed">
                Anılarımız her zaman kalbimde en değerli köşede kalacak. Yeni yaşın sana tüm güzellikleri getirsin.
              </p>
            </div>
            <div className="flex flex-col gap-4">
              <button
                onClick={resetMemories}
                className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl bg-white text-black font-bold hover:bg-white/90 transition-colors"
              >
                <RefreshCw size={18} /> Tekrar İzle
              </button>
              <p className="text-white/40 text-xs uppercase tracking-[0.2em]">Seni Unutmadım</p>
            </div>
          </motion.div>
        ) : (
          <div className="relative w-[90vw] max-w-[400px] aspect-[3/4] perspective-1000">
            <AnimatePresence mode="popLayout" custom={lastSwipeDirection}>
              {memories.map((memory, index) => (
                <SwipeCard
                  key={memory.id}
                  memory={memory}
                  onSwipe={handleSwipe}
                  isTop={index === memories.length - 1}
                />
              ))}
            </AnimatePresence>
            
            {/* Background stack hint */}
            {memories.length > 1 && (
              <div className="absolute -z-10 inset-x-4 -bottom-4 h-full glass-card rounded-3xl opacity-20 scale-90" />
            )}
          </div>
        )}
      </AnimatePresence>

      {/* Floating particles or subtle elements */}
      <div className="fixed bottom-10 left-10 text-white/20 font-serif italic text-sm pointer-events-none">
        Nice mutlu yaşlara tombiş tavuk
      </div>
      <div className="fixed top-10 right-10 text-white/20 font-serif italic text-sm pointer-events-none">
        {new Date().toLocaleDateString('tr-TR')}
      </div>
    </div>
  );
}
