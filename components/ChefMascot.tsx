"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { useSpring, animated } from "@react-spring/web";
import { useDrag } from "@use-gesture/react";

// ─── dimensions ───────────────────────────────────────────────────────────────
const CHEF_W = 200;
const CHEF_H = 200;
const HAT_W = 80;
const HAT_H = 72;
const HAT_REST_X = (CHEF_W - HAT_W) / 2;
const HAT_REST_Y = -HAT_H + 30;

// ─── boing sound ──────────────────────────────────────────────────────────────
function playBoing() {
  try {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AC();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination);
    osc.type = "sine";
    osc.frequency.setValueAtTime(700, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(140, ctx.currentTime + 0.45);
    gain.gain.setValueAtTime(0.22, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.48);
    osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.5);
  } catch { /* ignore */ }
}

// ─── DETAILED CHEF HAT SVG ────────────────────────────────────────────────────
function ChefHatSVG() {
  return (
    <svg width={HAT_W} height={HAT_H} viewBox="0 0 80 72" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="hatGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#e8e8e8"/>
          <stop offset="40%" stopColor="#ffffff"/>
          <stop offset="100%" stopColor="#d0d0d0"/>
        </linearGradient>
        <linearGradient id="brimGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff"/>
          <stop offset="100%" stopColor="#ddd"/>
        </linearGradient>
        <filter id="hatShadow">
          <feDropShadow dx="1" dy="2" stdDeviation="2" floodColor="#00000033"/>
        </filter>
      </defs>
      {/* Brim base */}
      <rect x="4" y="54" width="72" height="16" rx="8" fill="url(#brimGrad)" filter="url(#hatShadow)"/>
      <rect x="4" y="54" width="72" height="16" rx="8" stroke="#c0c0c0" strokeWidth="1"/>
      {/* Black band */}
      <rect x="4" y="57" width="72" height="7" rx="3.5" fill="#1a1a2e"/>
      {/* Band highlight */}
      <rect x="8" y="58" width="60" height="2" rx="1" fill="#2d2d4e" opacity="0.6"/>

      {/* Hat body – tall cylinder with slight taper */}
      <path d="M16 58 C12 44 10 24 18 10 C22 3 30 0 40 0 C50 0 58 3 62 10 C70 24 68 44 64 58 Z"
        fill="url(#hatGrad)" filter="url(#hatShadow)"/>
      <path d="M16 58 C12 44 10 24 18 10 C22 3 30 0 40 0 C50 0 58 3 62 10 C70 24 68 44 64 58 Z"
        stroke="#c8c8c8" strokeWidth="1.2" fill="none"/>

      {/* Crease lines for realism */}
      <path d="M26 54 C24 40 24 20 30 8" stroke="#ddd" strokeWidth="1.2" strokeLinecap="round"/>
      <path d="M54 54 C56 40 56 20 50 8" stroke="#ddd" strokeWidth="1.2" strokeLinecap="round"/>
      <path d="M38 54 C37 40 37 18 39 6" stroke="#e8e8e8" strokeWidth="0.8" strokeLinecap="round"/>

      {/* Puffy top dome */}
      <ellipse cx="40" cy="5" rx="20" ry="7" fill="white"/>
      <ellipse cx="40" cy="5" rx="20" ry="7" stroke="#d0d0d0" strokeWidth="1"/>
      {/* Highlight on dome */}
      <ellipse cx="35" cy="3.5" rx="9" ry="3" fill="white" opacity="0.7"/>
    </svg>
  );
}

type Reaction = "happy" | "sad" | "angry" | "surprised" | "silly";

// ─── DETAILED CHEF BODY SVG ───────────────────────────────────────────────────
function ChefBodySVG({ reaction = "happy" }: { reaction?: Reaction }) {
  return (
    <svg width={CHEF_W} height={CHEF_H} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        {/* Skin gradient */}
        <radialGradient id="skinGrad" cx="50%" cy="40%" r="55%">
          <stop offset="0%" stopColor="#FFD5A8"/>
          <stop offset="100%" stopColor="#FFBA7A"/>
        </radialGradient>
        {/* Coat gradient */}
        <linearGradient id="coatGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#e8e8e8"/>
          <stop offset="50%" stopColor="#ffffff"/>
          <stop offset="100%" stopColor="#e0e0e0"/>
        </linearGradient>
        {/* Pants gradient */}
        <linearGradient id="pantsGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#374151"/>
          <stop offset="100%" stopColor="#1F2937"/>
        </linearGradient>
        {/* Cheek glow */}
        <radialGradient id="cheekGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FF9999" stopOpacity="0.6"/>
          <stop offset="100%" stopColor="#FF9999" stopOpacity="0"/>
        </radialGradient>
        <filter id="softShadow">
          <feDropShadow dx="2" dy="3" stdDeviation="3" floodColor="#00000025"/>
        </filter>
        <filter id="subtleShadow">
          <feDropShadow dx="1" dy="1" stdDeviation="1.5" floodColor="#00000020"/>
        </filter>
        {/* Biryani gradients */}
        <linearGradient id="biryaniGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f59e0b"/>
          <stop offset="100%" stopColor="#b45309"/>
        </linearGradient>
        <linearGradient id="plateGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff"/>
          <stop offset="100%" stopColor="#d1d5db"/>
        </linearGradient>
        <filter id="steamBlur" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="1.5"/>
        </filter>
      </defs>

      <g transform="translate(35, 0)">

      {/* ══ PANTS ══ */}
      <rect x="34" y="148" width="26" height="42" rx="10" fill="url(#pantsGrad)"/>
      <rect x="70" y="148" width="26" height="42" rx="10" fill="url(#pantsGrad)"/>
      {/* Pant crease */}
      <line x1="47" y1="152" x2="47" y2="186" stroke="#374151" strokeWidth="1"/>
      <line x1="83" y1="152" x2="83" y2="186" stroke="#374151" strokeWidth="1"/>

      {/* ══ SHOES ══ */}
      <ellipse cx="47" cy="191" rx="17" ry="8" fill="#111827"/>
      <ellipse cx="83" cy="191" rx="17" ry="8" fill="#111827"/>
      {/* Shoe highlight */}
      <ellipse cx="42" cy="188" rx="7" ry="3" fill="#374151" opacity="0.5"/>
      <ellipse cx="78" cy="188" rx="7" ry="3" fill="#374151" opacity="0.5"/>

      {/* ══ COAT BODY ══ */}
      <rect x="30" y="85" width="70" height="90" rx="20" fill="#FFFFFF" stroke="#E0E0E0" strokeWidth="1" />
      {/* V-neck collar */}
      <path d="M 55 85 L 65 105 L 75 85" fill="none" stroke="#E0E0E0" strokeWidth="1" />
      
      {/* Buttons – left column */}
      <circle cx="55" cy="115" r="4" fill="#D0D0D0" />
      <circle cx="55" cy="135" r="4" fill="#D0D0D0" />
      <circle cx="55" cy="155" r="4" fill="#D0D0D0" />
      {/* Buttons – right column */}
      <circle cx="75" cy="115" r="4" fill="#D0D0D0" />
      <circle cx="75" cy="135" r="4" fill="#D0D0D0" />
      <circle cx="75" cy="155" r="4" fill="#D0D0D0" />


      {/* ══ LEFT UPPER ARM (angled down-outward from shoulder) ══ */}
      <path d="M 30 95 C 10 100 5 118 12 130" stroke="#FFFFFF" strokeWidth="16" strokeLinecap="round" fill="none"/>
      <path d="M 30 95 C 10 100 5 118 12 130" stroke="#E0E0E0" strokeWidth="16" strokeLinecap="round" fill="none" opacity="0.4"/>

      {/* ══ RIGHT UPPER ARM ══ */}
      <path d="M 100 95 C 120 100 125 118 118 130" stroke="#FFFFFF" strokeWidth="16" strokeLinecap="round" fill="none"/>
      <path d="M 100 95 C 120 100 125 118 130" stroke="#E0E0E0" strokeWidth="16" strokeLinecap="round" fill="none" opacity="0.4"/>

      {/* ══ LEFT FOREARM — bends inward/upward to hold plate ══ */}
      <path d="M 12 130 C 8 140 18 148 30 146" stroke="#FFFFFF" strokeWidth="14" strokeLinecap="round" fill="none"/>
      <path d="M 12 130 C 8 140 18 148 30 146" stroke="#E0E0E0" strokeWidth="14" strokeLinecap="round" fill="none" opacity="0.4"/>

      {/* ══ RIGHT FOREARM — bends inward/upward to hold plate ══ */}
      <path d="M 118 130 C 122 140 112 148 100 146" stroke="#FFFFFF" strokeWidth="14" strokeLinecap="round" fill="none"/>
      <path d="M 118 130 C 122 140 112 148 100 146" stroke="#E0E0E0" strokeWidth="14" strokeLinecap="round" fill="none" opacity="0.4"/>

      {/* ══ LEFT HAND — flat open palm facing up under plate ══ */}
      <g>
        {/* Palm */}
        <ellipse cx="33" cy="148" rx="16" ry="8" fill="#F4A460" stroke="#D4956A" strokeWidth="0.8"/>
        {/* Thumb extending left */}
        <path d="M 18 147 C 13 143 12 138 16 136" stroke="#F4A460" strokeWidth="7" strokeLinecap="round" fill="none"/>
        {/* Index finger */}
        <path d="M 25 141 C 22 134 24 128 27 127" stroke="#F4A460" strokeWidth="5.5" strokeLinecap="round" fill="none"/>
        <path d="M 25 141 C 22 134 24 128 27 127" stroke="#D4956A" strokeWidth="0.7" strokeLinecap="round" fill="none"/>
        {/* Middle finger */}
        <path d="M 33 140 C 31 133 33 127 36 126" stroke="#F4A460" strokeWidth="5.5" strokeLinecap="round" fill="none"/>
        <path d="M 33 140 C 31 133 33 127 36 126" stroke="#D4956A" strokeWidth="0.7" strokeLinecap="round" fill="none"/>
        {/* Ring finger */}
        <path d="M 40 141 C 39 134 41 128 44 128" stroke="#F4A460" strokeWidth="5" strokeLinecap="round" fill="none"/>
        <path d="M 40 141 C 39 134 41 128 44 128" stroke="#D4956A" strokeWidth="0.7" strokeLinecap="round" fill="none"/>
        {/* Pinky */}
        <path d="M 46 143 C 45 137 47 132 49 133" stroke="#F4A460" strokeWidth="4" strokeLinecap="round" fill="none"/>
        {/* Knuckle line */}
        <path d="M 22 145 Q 33 142 48 145" stroke="#D4956A" strokeWidth="0.8" strokeLinecap="round" fill="none" opacity="0.5"/>
      </g>

      {/* ══ RIGHT HAND — flat open palm facing up under plate ══ */}
      <g>
        {/* Palm */}
        <ellipse cx="97" cy="148" rx="16" ry="8" fill="#F4A460" stroke="#D4956A" strokeWidth="0.8"/>
        {/* Thumb extending right */}
        <path d="M 112 147 C 117 143 118 138 114 136" stroke="#F4A460" strokeWidth="7" strokeLinecap="round" fill="none"/>
        {/* Index finger */}
        <path d="M 105 141 C 108 134 106 128 103 127" stroke="#F4A460" strokeWidth="5.5" strokeLinecap="round" fill="none"/>
        <path d="M 105 141 C 108 134 106 128 103 127" stroke="#D4956A" strokeWidth="0.7" strokeLinecap="round" fill="none"/>
        {/* Middle finger */}
        <path d="M 97 140 C 99 133 97 127 94 126" stroke="#F4A460" strokeWidth="5.5" strokeLinecap="round" fill="none"/>
        <path d="M 97 140 C 99 133 97 127 94 126" stroke="#D4956A" strokeWidth="0.7" strokeLinecap="round" fill="none"/>
        {/* Ring finger */}
        <path d="M 90 141 C 91 134 89 128 86 128" stroke="#F4A460" strokeWidth="5" strokeLinecap="round" fill="none"/>
        <path d="M 90 141 C 91 134 89 128 86 128" stroke="#D4956A" strokeWidth="0.7" strokeLinecap="round" fill="none"/>
        {/* Pinky */}
        <path d="M 84 143 C 85 137 83 132 81 133" stroke="#F4A460" strokeWidth="4" strokeLinecap="round" fill="none"/>
        {/* Knuckle line */}
        <path d="M 108 145 Q 97 142 82 145" stroke="#D4956A" strokeWidth="0.8" strokeLinecap="round" fill="none" opacity="0.5"/>
      </g>

      {/* ══ PLATE & BIRYANI — resting on the palms ══ */}
      <g>
        {/* Plate shadow */}
        <ellipse cx="65" cy="152" rx="42" ry="7" fill="#00000030"/>
        {/* Plate outer rim */}
        <ellipse cx="65" cy="148" rx="40" ry="10" fill="url(#plateGrad)" filter="url(#softShadow)"/>
        {/* Plate inner well */}
        <ellipse cx="65" cy="146" rx="34" ry="8" fill="#f9fafb"/>
        {/* Plate highlight */}
        <path d="M 38 143 Q 50 140 60 142" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>

        {/* Biryani mound — starts at plate surface */}
        <path d="M 32 146 C 30 125 46 115 65 114 C 84 115 100 125 98 146 Z" fill="url(#biryaniGrad)"/>
        {/* Biryani highlight */}
        <path d="M 42 130 C 48 120 58 116 65 116" stroke="#fcd34d" strokeWidth="1.2" strokeLinecap="round" opacity="0.5" fill="none"/>
        {/* Rice grain texture */}
        <path d="M 42 136 Q 45 134 47 136 M 52 128 Q 55 125 57 128 M 62 124 Q 65 121 67 124 M 72 128 Q 75 125 77 128 M 82 136 Q 85 134 87 136 M 55 138 Q 58 136 60 138 M 65 132 Q 68 130 70 132 M 75 140 Q 78 138 80 140 M 37 142 Q 40 140 42 142 M 88 142 Q 91 140 93 142" stroke="#fcd34d" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.85"/>
        {/* Cashews */}
        <ellipse cx="53" cy="130" rx="3" ry="1.4" fill="#fef08a" transform="rotate(-20 53 130)"/>
        <ellipse cx="68" cy="124" rx="3" ry="1.4" fill="#fef08a" transform="rotate(30 68 124)"/>
        <ellipse cx="80" cy="133" rx="3" ry="1.4" fill="#fef08a" transform="rotate(45 80 133)"/>
        <ellipse cx="45" cy="140" rx="3" ry="1.4" fill="#fef08a" transform="rotate(-40 45 140)"/>
        <ellipse cx="83" cy="141" rx="3" ry="1.4" fill="#fef08a" transform="rotate(-10 83 141)"/>
        {/* Chili / tomato bits */}
        <circle cx="58" cy="127" r="1.5" fill="#ef4444" opacity="0.9"/>
        <circle cx="73" cy="135" r="1.5" fill="#ef4444" opacity="0.9"/>
        <circle cx="44" cy="136" r="1.5" fill="#ef4444" opacity="0.9"/>
        <circle cx="86" cy="134" r="1.5" fill="#ef4444" opacity="0.9"/>
        {/* Mint / coriander leaves on peak */}
        <path d="M 65 114 Q 60 109 63 106 Q 67 109 65 114" fill="#22c55e"/>
        <path d="M 65 114 Q 57 111 55 114 Q 60 117 65 114" fill="#16a34a"/>
        <path d="M 65 114 Q 73 111 75 114 Q 70 117 65 114" fill="#15803d"/>

        {/* ══ STEAM rising from top of biryani mound ══ */}
        {/* Steam paths start exactly at the tip of the mound (y=106) */}
        <path className="steam-1" d="M 50 108 Q 44 90 52 72 Q 58 56 48 38" stroke="rgba(255,255,255,0.9)" strokeWidth="2.5" strokeLinecap="round" fill="none" filter="url(#steamBlur)"/>
        <path className="steam-2" d="M 65 106 Q 73 88 63 68 Q 55 50 65 30" stroke="rgba(255,255,255,0.9)" strokeWidth="3" strokeLinecap="round" fill="none" filter="url(#steamBlur)"/>
        <path className="steam-3" d="M 80 108 Q 86 90 78 72 Q 72 56 82 38" stroke="rgba(255,255,255,0.9)" strokeWidth="2" strokeLinecap="round" fill="none" filter="url(#steamBlur)"/>
      </g>

      {/* ══ NECK ══ */}
      <rect x="52" y="72" width="26" height="20" rx="12" fill="url(#skinGrad)"/>
      <rect x="52" y="72" width="26" height="20" rx="12" stroke="#FFBA7A" strokeWidth="0.8" fill="none"/>

      {/* ══ HEAD ══ */}
      {/* Head shadow for depth */}
      <ellipse cx="66" cy="49" rx="33" ry="33" fill="#FFBA7A" opacity="0.3"/>
      {/* Main head */}
      <ellipse cx="65" cy="47" rx="32" ry="32" fill="url(#skinGrad)" filter="url(#softShadow)"/>
      <ellipse cx="65" cy="47" rx="32" ry="32" stroke="#FFBA7A" strokeWidth="1.2" fill="none"/>

      {/* Chubby cheeks */}
      <ellipse cx="38" cy="56" rx="10" ry="7" fill="url(#cheekGrad)"/>
      <ellipse cx="92" cy="56" rx="10" ry="7" fill="url(#cheekGrad)"/>

      {/* ══ FACE ══ */}

      {/* Eye whites */}
      <ellipse cx="51" cy="44" rx="8" ry="9" fill="white"/>
      <ellipse cx="79" cy="44" rx="8" ry="9" fill="white"/>
      {/* Eye outlines */}
      <ellipse cx="51" cy="44" rx="8" ry="9" stroke="#FFBA7A" strokeWidth="0.8" fill="none"/>
      <ellipse cx="79" cy="44" rx="8" ry="9" stroke="#FFBA7A" strokeWidth="0.8" fill="none"/>

      {/* Irises */}
      <circle cx="52" cy="45" r="5.5" fill="#5B4033"/>
      <circle cx="80" cy="45" r="5.5" fill="#5B4033"/>
      {/* Pupils */}
      <circle cx="52" cy="45" r="3.2" fill="#1a1008"/>
      <circle cx="80" cy="45" r="3.2" fill="#1a1008"/>
      {/* Eye shine highlights */}
      <circle cx="54" cy="42.5" r="1.8" fill="white"/>
      <circle cx="82" cy="42.5" r="1.8" fill="white"/>
      <circle cx="50.5" cy="46" r="0.9" fill="white" opacity="0.6"/>
      <circle cx="78.5" cy="46" r="0.9" fill="white" opacity="0.6"/>

      {/* Eyelids / upper lash line */}
      <path d="M43 38 Q51 34 59 38" stroke="#4a3020" strokeWidth="2.2" strokeLinecap="round" fill="none"/>
      <path d="M71 38 Q79 34 87 38" stroke="#4a3020" strokeWidth="2.2" strokeLinecap="round" fill="none"/>

      {/* Eyebrows */}
      <path d={
        reaction === "sad" ? "M43 36 Q51 32 59 30" :
        reaction === "angry" ? "M43 30 Q51 32 59 36" :
        reaction === "surprised" ? "M43 28 Q51 23 59 28" :
        reaction === "silly" ? "M43 28 Q51 25 59 28" :
        "M43 35 Q51 30 59 35"
      } stroke="#8B5E3C" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d={
        reaction === "sad" ? "M71 30 Q79 32 87 36" :
        reaction === "angry" ? "M71 36 Q79 32 87 30" :
        reaction === "surprised" ? "M71 28 Q79 23 87 28" :
        reaction === "silly" ? "M71 35 Q79 32 87 35" :
        "M71 35 Q79 30 87 35"
      } stroke="#8B5E3C" strokeWidth="2.5" strokeLinecap="round" fill="none" />

      {/* Nose */}
      <path d="M62 52 C60 56 63 60 65 60 C67 60 70 56 68 52" stroke="#D4956A" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
      <circle cx="63" cy="58" r="1.5" fill="#D4956A" opacity="0.5"/>
      <circle cx="67" cy="58" r="1.5" fill="#D4956A" opacity="0.5"/>

      {/* Mouth */}
      {reaction === "surprised" ? (
        <circle cx="65" cy="70" r="4" stroke="#C8825A" strokeWidth="2.8" fill="none" />
      ) : (
        <path d={
          reaction === "sad" ? "M55 72 Q65 65 75 72" :
          reaction === "angry" ? "M50 72 Q65 66 80 72" :
          reaction === "silly" ? "M55 65 Q65 68 75 73" :
          "M50 65 Q65 78 80 65"
        } stroke="#C8825A" strokeWidth="2.8" strokeLinecap="round" fill="none" />
      )}
      
      {/* Teeth */}
      <path d="M54 67 Q65 75 76 67" stroke="none" fill="white" opacity={reaction === "happy" ? 1 : 0} />
      {/* Smile dimples */}
      <circle cx="50" cy="66" r="2.5" fill="#D4956A" opacity={reaction === "happy" ? 0.4 : 0} />
      <circle cx="80" cy="66" r="2.5" fill="#D4956A" opacity={reaction === "happy" ? 0.4 : 0} />

      {/* Ear left */}
      <ellipse cx="33" cy="47" rx="6" ry="8" fill="url(#skinGrad)" stroke="#FFBA7A" strokeWidth="0.8"/>
      <path d="M35 41 C31 44 31 50 35 53" stroke="#D4956A" strokeWidth="1.2" fill="none"/>
      {/* Ear right */}
      <ellipse cx="97" cy="47" rx="6" ry="8" fill="url(#skinGrad)" stroke="#FFBA7A" strokeWidth="0.8"/>
      <path d="M95 41 C99 44 99 50 95 53" stroke="#D4956A" strokeWidth="1.2" fill="none"/>

      {/* Hair peek (just a hint above ears) */}
      <path d="M34 22 Q65 12 96 22" stroke="#6B3F1E" strokeWidth="0" fill="#6B3F1E"/>
      </g>
    </svg>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ChefMascot() {
  const chefRef = useRef<HTMLDivElement>(null);

  const [hatSpring, hatApi] = useSpring(() => ({
    x: 0, y: 0,
    config: { tension: 200, friction: 10, mass: 1 },
  }));

  const [lineVisible, setLineVisible] = useState(false);
  const [reaction, setReaction] = useState<Reaction>("happy");
  const [lineData, setLineData] = useState({ x1: 0, y1: 0, x2: 0, y2: 0, cx: 0, cy: 0 });
  const getHeadAnchor = useCallback(() => {
    const el = chefRef.current;
    if (!el) return { x: 0, y: 0 };
    const rect = el.getBoundingClientRect();
    return { x: rect.left + CHEF_W / 2, y: rect.top + 16 };
  }, []);

  const bindHat = useDrag(
    ({ first, active, movement: [mx, my], event }) => {
      event.preventDefault?.();
      if (first) { 
        setLineVisible(true);
        const reactions: Reaction[] = ["sad", "angry", "surprised", "silly"];
        setReaction(reactions[Math.floor(Math.random() * reactions.length)]);
      }

      hatApi.start({ x: mx, y: my, immediate: active });

      if (active) {
        const el = chefRef.current;
        if (el) {
          const rect = el.getBoundingClientRect();
          const hatRestAbsX = rect.left + HAT_REST_X + HAT_W / 2;
          const hatRestAbsY = rect.top + HAT_REST_Y + HAT_H / 2;
          const hatCurX = hatRestAbsX + mx;
          const hatCurY = hatRestAbsY + my;
          const head = getHeadAnchor();
          setLineData({
            x1: hatCurX, y1: hatCurY, x2: head.x, y2: head.y,
            cx: (hatCurX + head.x) / 2 + (hatCurY - head.y) * 0.25,
            cy: (hatCurY + head.y) / 2 - (hatCurX - head.x) * 0.15,
          });
        }
      }

      if (!active) {
        hatApi.start({
          x: 0, y: 0,
          config: { tension: 200, friction: 10, mass: 1 },
          onRest: () => setLineVisible(false),
        });
        setLineVisible(false);
        setReaction("happy");
        playBoing();
      }
    },
    { pointer: { touch: true }, filterTaps: true }
  );

  return (
    <>
      {/* Elastic line overlay */}
      {lineVisible && (
        <svg style={{ position: "fixed", inset: 0, width: "100vw", height: "100vh", pointerEvents: "none", zIndex: 9998 }}>
          <path
            d={`M ${lineData.x1} ${lineData.y1} Q ${lineData.cx} ${lineData.cy} ${lineData.x2} ${lineData.y2}`}
            stroke="white" strokeWidth="4" strokeOpacity="0.65" fill="none" strokeLinecap="round"
          />
        </svg>
      )}

      {/* Chef container */}
      <div
        ref={chefRef}
        style={{ position: "fixed", left: 24, bottom: 0, width: CHEF_W, zIndex: 9999, userSelect: "none" }}
      >
        <div className="chef-float" style={{ position: "relative" }}>

          {/* Speech bubble */}
          <div style={{
            position: "absolute",
            bottom: CHEF_H + 10,
            left: "50%",
            transform: "translateX(-50%)",
            background: "white",
            color: "#1a1a2e",
            fontSize: "13px",
            fontWeight: 700,
            fontFamily: "var(--font-outfit), sans-serif",
            padding: "8px 14px",
            borderRadius: "12px",
            whiteSpace: "nowrap",
            boxShadow: "0 4px 20px rgba(0,0,0,0.35)",
            pointerEvents: "none",
            opacity: lineVisible ? 0 : 1,
            transition: "opacity 0.3s ease",
            zIndex: 10001,
          }}>
            Pull my hat! 🎩
            <div style={{
              position: "absolute", bottom: -7, left: "50%", transform: "translateX(-50%)",
              width: 0, height: 0, borderLeft: "7px solid transparent",
              borderRight: "7px solid transparent", borderTop: "8px solid white",
            }} />
          </div>

          {/* Draggable Hat */}
          <animated.div
            {...bindHat()}
            style={{
              position: "absolute",
              top: HAT_REST_Y,
              left: HAT_REST_X,
              width: HAT_W,
              height: HAT_H,
              touchAction: "none",
              zIndex: 10000,
              x: hatSpring.x,
              y: hatSpring.y,
            }}
          >
            <ChefHatSVG />
          </animated.div>

          {/* Chef body */}
          <div style={{ width: CHEF_W, height: CHEF_H }}>
            <ChefBodySVG reaction={reaction} />
          </div>

        </div>
      </div>

      <style>{`
        @keyframes chefFloat {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-6px); }
        }
        .chef-float { animation: chefFloat 2s ease-in-out infinite; }

        @keyframes steamRise {
          0% { transform: translateY(0) scale(0.9); opacity: 0; }
          30% { opacity: 0.6; }
          100% { transform: translateY(-20px) scale(1.15); opacity: 0; }
        }
        .steam-1 { animation: steamRise 2.5s ease-in infinite; transform-origin: 50px 108px; }
        .steam-2 { animation: steamRise 3s ease-in infinite 0.8s; transform-origin: 65px 106px; }
        .steam-3 { animation: steamRise 2.8s ease-in infinite 1.5s; transform-origin: 80px 108px; }
      `}</style>
    </>
  );
}
