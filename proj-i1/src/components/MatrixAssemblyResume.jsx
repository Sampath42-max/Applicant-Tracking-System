import React, { useEffect, useRef, useState } from 'react';
import { animate, motion, useMotionValue, useReducedMotion, useTransform } from 'framer-motion';
import { Code2, GraduationCap, Mail, MapPin, Phone, Sparkles } from 'lucide-react';

const snapEase = [0.18, 0.82, 0.18, 1];
const shards = {
  header: { x: -220, y: -165, z: 310, rotateX: -36, rotateY: 28, rotateZ: -10 },
  profile: { x: -270, y: 90, z: -180, rotateX: 34, rotateY: -47, rotateZ: -16 },
  experience: { x: 54, y: -235, z: 225, rotateX: -44, rotateY: 22, rotateZ: 9 },
  skills: { x: 285, y: -52, z: -230, rotateX: 42, rotateY: 46, rotateZ: 17 },
  education: { x: -94, y: 226, z: -255, rotateX: -37, rotateY: -32, rotateZ: 12 },
  project: { x: 270, y: 210, z: 280, rotateX: 29, rotateY: -42, rotateZ: -13 },
};

const assemblyVariants = {
  dispersed: {},
  assembled: {
    transition: {
      delayChildren: 0.16,
      staggerChildren: 0.11,
    },
  },
};

const shardVariants = {
  dispersed: ({ x, y, z, rotateX, rotateY, rotateZ }) => ({
    x,
    y,
    z,
    rotateX,
    rotateY,
    rotateZ,
    opacity: 0,
    scale: 0.84,
    boxShadow: '0 40px 86px rgba(0, 0, 0, 0.52)',
  }),
  assembled: {
    x: 0,
    y: 0,
    z: 0,
    rotateX: 0,
    rotateY: 0,
    rotateZ: 0,
    opacity: 1,
    scale: 1,
    boxShadow: '0 14px 34px rgba(0, 0, 0, 0.22)',
    transition: { duration: 1.02, ease: snapEase },
  },
};

const Tile = ({ scatter, className = '', children }) => (
  <motion.section
    custom={scatter}
    variants={shardVariants}
    className={`overflow-hidden border border-amber-500/10 bg-slate-950/70 p-4 backdrop-blur-md ${className}`}
    style={{
      transformStyle: 'preserve-3d',
      backfaceVisibility: 'hidden',
      WebkitFontSmoothing: 'antialiased',
      textRendering: 'geometricPrecision',
    }}
  >
    {children}
  </motion.section>
);

const Label = ({ children }) => (
  <p className="mb-3 text-[9px] font-black uppercase tracking-[0.24em] text-slate-400">{children}</p>
);

const Contact = ({ icon: Icon, children }) => (
  <p className="flex items-center gap-2 text-[9px] leading-5 text-slate-400">
    <Icon className="h-3 w-3 shrink-0 text-white" />
    {children}
  </p>
);

const MatrixAssemblyResume = () => {
  const reducedMotion = useReducedMotion();
  const spinY = useMotionValue(0);
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const tiltY = useTransform(cursorX, [-1, 1], [-13, 13]);
  const tiltX = useTransform(cursorY, [-1, 1], [9, -9]);
  const cardRotateY = useTransform([spinY, tiltY], ([spin, tilt]) => spin + tilt);
  const spinControl = useRef(null);
  const trackingRef = useRef(false);
  const [assembled, setAssembled] = useState(Boolean(reducedMotion));
  const [tracking, setTracking] = useState(false);

  useEffect(() => {
    if (!assembled || tracking || reducedMotion) return undefined;

    spinControl.current = animate(spinY, spinY.get() + 360, {
      duration: 32,
      ease: 'linear',
      repeat: Infinity,
    });

    return () => spinControl.current?.stop();
  }, [assembled, reducedMotion, spinY, tracking]);

  useEffect(() => {
    if (!assembled || reducedMotion) return undefined;

    const trackCursor = (event) => {
      if (!trackingRef.current) {
        spinControl.current?.stop();
        spinY.set(Math.round(spinY.get() / 360) * 360);
        trackingRef.current = true;
        setTracking(true);
      }
      cursorX.set((event.clientX / window.innerWidth) * 2 - 1);
      cursorY.set((event.clientY / window.innerHeight) * 2 - 1);
    };

    const resumeSpin = () => {
      animate(cursorX, 0, { duration: 0.38, ease: 'easeOut' });
      animate(cursorY, 0, { duration: 0.38, ease: 'easeOut' });
      trackingRef.current = false;
      setTracking(false);
    };

    window.addEventListener('pointermove', trackCursor, { passive: true });
    document.documentElement.addEventListener('pointerleave', resumeSpin);
    window.addEventListener('blur', resumeSpin);

    return () => {
      window.removeEventListener('pointermove', trackCursor);
      document.documentElement.removeEventListener('pointerleave', resumeSpin);
      window.removeEventListener('blur', resumeSpin);
    };
  }, [assembled, cursorX, cursorY, reducedMotion, spinY]);

  return (
    <div className="relative flex h-full w-full items-center justify-center [perspective:2000px]">
      <motion.div
        initial={reducedMotion ? false : { opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: snapEase }}
        className="relative"
        data-testid="matrix-stage"
        data-interaction={tracking ? 'tracking' : assembled ? 'spinning' : 'assembling'}
        aria-label="Interactive three-dimensional matrix resume preview"
      >
        <motion.div
          data-testid="matrix-resume"
          variants={assemblyVariants}
          initial={reducedMotion ? false : 'dispersed'}
          animate="assembled"
          onAnimationComplete={() => setAssembled(true)}
          className="relative grid h-[474px] w-[min(636px,52vw)] min-w-[580px] grid-cols-[1.06fr_1.58fr_1fr] grid-rows-[112px_216px_130px] gap-2"
          style={{
            rotateX: assembled ? tiltX : 0,
            rotateY: assembled ? cardRotateY : 0,
            transformStyle: 'preserve-3d',
            willChange: 'transform',
          }}
        >
          <div
            aria-hidden="true"
            className="absolute -inset-4 -z-10 border border-amber-500/10 bg-slate-950/50 shadow-[0_38px_110px_rgba(2,6,23,0.62)]"
            style={{ transform: 'translateZ(-24px)', transformStyle: 'preserve-3d' }}
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 flex flex-col items-center justify-center border border-amber-500/10 bg-slate-950/90 text-center text-white"
            style={{ transform: 'rotateY(180deg) translateZ(2px)', backfaceVisibility: 'hidden' }}
          >
            <p className="text-[10px] font-black uppercase tracking-[0.36em] text-slate-400">ResumeNexa</p>
            <p className="mt-4 text-2xl font-black tracking-normal">Amelia Julia</p>
            <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.24em] text-amber-400">Product Architect</p>
          </div>

          <Tile scatter={shards.header} className="col-span-3 flex items-center justify-between px-6">
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.32em] text-amber-400">Product architect</p>
              <h2 className="mt-3 text-[30px] font-black leading-none text-white">Amelia Julia</h2>
            </div>
            <div className="border-l border-amber-500/10 pl-6 text-right">
              <p className="text-[9px] font-black uppercase tracking-[0.22em] text-slate-400">ResumeNexa</p>
              <p className="mt-3 text-[11px] font-bold text-amber-400">2026 Portfolio Resume</p>
            </div>
          </Tile>

          <Tile scatter={shards.profile} className="row-span-2 !bg-slate-950/80">
            <div className="mb-4 flex h-12 w-12 items-center justify-center border border-amber-500/20 bg-slate-900 text-base font-black text-white">
              AJ
            </div>
            <Label>Profile</Label>
            <p className="text-[9px] leading-4 text-slate-400">
              Builds elegant products from complicated workflows and human needs.
            </p>
            <div className="mt-5 space-y-1">
              <Contact icon={Mail}>amelia@email.com</Contact>
              <Contact icon={Phone}>+1 415 555 0192</Contact>
              <Contact icon={MapPin}>San Francisco</Contact>
            </div>
          </Tile>

          <Tile scatter={shards.experience}>
            <Label>Experience</Label>
            <div className="mb-5">
              <div className="flex justify-between gap-2 text-[10px] font-black text-white">
                <span className="text-amber-400">Lead Designer</span>
                <span className="text-amber-400">2021 - Now</span>
              </div>
              <p className="mt-1 text-[9px] font-bold text-white">Northstar Labs</p>
              <p className="mt-3 text-[9px] leading-4 text-slate-400">Raised activation by 32% through a rebuilt product flow.</p>
            </div>
            <div className="text-[10px] font-black text-amber-400">UX Designer</div>
            <p className="mt-1 text-[9px] text-slate-400">Atelier Digital / 2018 - 2021</p>
          </Tile>

          <Tile scatter={shards.skills}>
            <Label>Skills</Label>
            {['Systems', 'Research', 'Strategy', 'Prototyping'].map((skill, index) => (
              <div key={skill} className="mb-3">
                <div className="mb-1 flex justify-between text-[9px] font-bold text-amber-400">
                  <span>{skill}</span><span>{96 - index * 6}%</span>
                </div>
                <div className="h-[3px] bg-white/10">
                  <div className="h-full bg-amber-400" style={{ width: `${96 - index * 6}%` }} />
                </div>
              </div>
            ))}
          </Tile>

          <Tile scatter={shards.education} className="flex gap-4">
            <GraduationCap className="h-5 w-5 shrink-0 text-white" />
            <div>
              <Label>Education</Label>
              <p className="text-[10px] font-black text-white">M.Des Interaction</p>
              <p className="mt-2 text-[9px] leading-4 text-slate-400">California College of Arts<br /><span className="text-amber-400">2016 - 2018</span></p>
            </div>
          </Tile>

          <Tile scatter={shards.project}>
            <div className="mb-3 flex items-center gap-2">
              <Code2 className="h-4 w-4 text-white" />
              <Label>Project</Label>
            </div>
            <p className="text-[10px] font-black text-white">Atlas Console</p>
            <p className="mt-2 text-[9px] leading-4 text-slate-400">Operations suite</p>
            <Sparkles className="mt-3 h-3.5 w-3.5 text-slate-400" />
          </Tile>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={assembled ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          className="mt-6 text-center text-[10px] font-black uppercase tracking-[0.3em] text-slate-400"
        >
          Move cursor to direct the matrix
        </motion.p>
      </motion.div>
    </div>
  );
};

export default MatrixAssemblyResume;
