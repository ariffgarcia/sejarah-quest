import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, Trophy, CheckCircle2, XCircle, ArrowRight, Crown, Puzzle, Compass, Flower, Lock } from 'lucide-react';

// ============================================================================
// HELPER FUNCTIONS (Using standard functions to prevent ReferenceErrors)
// ============================================================================
function formatTime(totalSeconds) {
  const h = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
  const m = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
  const s = (totalSeconds % 60).toString().padStart(2, '0');
  return `${h}:${m}:${s}`;
}

function getSlicePath(angleInDegrees, radius) {
  if (angleInDegrees >= 360) return "";
  const start = (-90 - angleInDegrees / 2) * (Math.PI / 180);
  const end = (-90 + angleInDegrees / 2) * (Math.PI / 180);
  const x1 = radius * Math.cos(start);
  const y1 = radius * Math.sin(start);
  const x2 = radius * Math.cos(end);
  const y2 = radius * Math.sin(end);
  const largeArc = angleInDegrees > 180 ? 1 : 0;
  return `M 0 0 L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;
}

// ============================================================================
// DATA & ASSETS
// ============================================================================

// --- LEVEL 1 DATA ---
const BUCKETS = [
  { id: 'Animisme', color: 'bg-amber-700', border: 'border-amber-900' },
  { id: 'Hindu', color: 'bg-orange-500', border: 'border-orange-700' },
  { id: 'Buddha', color: 'bg-yellow-500', border: 'border-yellow-700' },
  { id: 'Kristian', color: 'bg-blue-500', border: 'border-blue-700' },
  { id: 'Islam', color: 'bg-green-600', border: 'border-green-800' }
];

const L1_PHRASES = [
  { text: "Percaya roh nenek moyang", religion: "Animisme" },
  { text: "Percaya makhluk halus", religion: "Animisme" },
  { text: "Percaya kelahiran semula", religion: "Hindu" },
  { text: "Percaya karma", religion: "Hindu" },
  { text: "Percaya Jalan Lapan Lapis Mulia", religion: "Buddha" },
  { text: "Percaya kehidupan adalah sementara", religion: "Buddha" },
  { text: "Percaya Jesus anak tuhan", religion: "Kristian" },
  { text: "Wujud ketika penjajahan Portugis", religion: "Kristian" },
  { text: "Percaya Rukun Islam", religion: "Islam" },
  { text: "Percaya Rukun Iman", religion: "Islam" }
];

// --- LEVEL 2 DATA & HD SVG ICONS ---
const IconTengkolok = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full" style={{ filter: 'drop-shadow(3px 5px 6px rgba(0,0,0,0.3))' }}>
    <defs>
      <linearGradient id="fabric" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#333" />
        <stop offset="40%" stopColor="#1a1a1a" />
        <stop offset="100%" stopColor="#000" />
      </linearGradient>
      <linearGradient id="goldRel" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#BF953F" />
        <stop offset="50%" stopColor="#FCF6BA" />
        <stop offset="100%" stopColor="#AA771C" />
      </linearGradient>
    </defs>
    <path d="M15 75 Q 15 45 45 35 Q 75 25 85 40 Q 90 60 75 80 Q 45 90 15 75 Z" fill="url(#fabric)" />
    <path d="M20 70 Q 30 50 60 40" fill="none" stroke="#444" strokeWidth="2" />
    <path d="M25 75 Q 45 55 75 50" fill="none" stroke="#222" strokeWidth="3" />
    <path d="M35 38 Q 45 20 65 30" fill="none" stroke="#555" strokeWidth="1" />
    <path d="M 40 60 A 12 12 0 1 0 60 55 A 10 10 0 1 1 45 55" fill="url(#goldRel)" />
    <polygon points="52,48 54,52 59,52 55,55 57,60 52,57 47,60 49,55 45,52 50,52" fill="url(#goldRel)" />
  </svg>
);

const IconPayung = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full" style={{ filter: 'drop-shadow(3px 5px 6px rgba(0,0,0,0.3))' }}>
    <defs>
      <linearGradient id="yellowRel" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#D4AF37" />
        <stop offset="50%" stopColor="#F3E5AB" />
        <stop offset="100%" stopColor="#AA8C29" />
      </linearGradient>
      <linearGradient id="silverRelPole" x1="0" y1="0" x2="1" y2="0">
         <stop offset="0%" stopColor="#8A8D91" />
         <stop offset="50%" stopColor="#E2E5E7" />
         <stop offset="100%" stopColor="#76797D" />
      </linearGradient>
    </defs>
    <rect x="48" y="25" width="4" height="70" fill="url(#silverRelPole)" />
    <rect x="25" y="45" width="3" height="50" fill="url(#silverRelPole)" />
    <path d="M26.5 25 L 29 45 L 24 45 Z" fill="url(#silverRelPole)" />
    <rect x="72" y="45" width="3" height="50" fill="url(#silverRelPole)" />
    <path d="M73.5 25 L 76 45 L 71 45 Z" fill="url(#silverRelPole)" />
    <path d="M 15 40 Q 50 5 85 40 Z" fill="url(#yellowRel)" />
    <path d="M 15 40 Q 50 48 85 40 Z" fill="#B8860B" />
    <path d="M 15 40 L 15 45 M 25 42 L 25 47 M 35 44 L 35 49 M 45 45 L 45 50 M 55 45 L 55 50 M 65 44 L 65 49 M 75 42 L 75 47 M 85 40 L 85 45" stroke="#DAA520" strokeWidth="2" />
    <circle cx="50" cy="15" r="4" fill="url(#yellowRel)" />
  </svg>
);

const IconCoganAgama = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full" style={{ filter: 'drop-shadow(3px 5px 6px rgba(0,0,0,0.3))' }}>
    <defs>
      <linearGradient id="silverRel" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#B0B5B9" />
        <stop offset="50%" stopColor="#FFFFFF" />
        <stop offset="100%" stopColor="#76797D" />
      </linearGradient>
      <linearGradient id="goldRelCogan" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#BF953F" />
        <stop offset="50%" stopColor="#FCF6BA" />
        <stop offset="100%" stopColor="#AA771C" />
      </linearGradient>
    </defs>
    <line x1="25" y1="85" x2="65" y2="40" stroke="url(#silverRel)" strokeWidth="6" strokeLinecap="round" />
    <line x1="35" y1="70" x2="40" y2="75" stroke="#555" strokeWidth="3" />
    <line x1="45" y1="59" x2="50" y2="64" stroke="#555" strokeWidth="3" />
    <path d="M 55 45 L 60 50 L 75 33 L 70 28 Z" fill="url(#silverRel)" />
    <ellipse cx="72" cy="27" rx="8" ry="12" transform="rotate(45 72 27)" fill="url(#silverRel)" />
    <path d="M 75 12 A 8 8 0 1 0 85 22 A 6 6 0 1 1 75 12" fill="url(#goldRelCogan)" />
    <polygon points="82,14 83,17 86,17 84,19 85,22 82,20 79,22 80,19 78,17 81,17" fill="url(#goldRelCogan)" />
  </svg>
);

const IconPending = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full" style={{ filter: 'drop-shadow(3px 5px 6px rgba(0,0,0,0.4))' }}>
    <defs>
      <linearGradient id="goldRelPen" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#BF953F" />
        <stop offset="25%" stopColor="#FCF6BA" />
        <stop offset="50%" stopColor="#B38728" />
        <stop offset="75%" stopColor="#FBF5B7" />
        <stop offset="100%" stopColor="#AA771C" />
      </linearGradient>
      <radialGradient id="ruby" cx="30%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#ff4d4d" />
        <stop offset="70%" stopColor="#990000" />
        <stop offset="100%" stopColor="#4d0000" />
      </radialGradient>
    </defs>
    <rect x="5" y="40" width="90" height="20" fill="url(#goldRelPen)" rx="2" />
    <rect x="5" y="42" width="90" height="16" fill="#8B6508" opacity="0.3" />
    <ellipse cx="50" cy="50" rx="35" ry="25" fill="url(#goldRelPen)" stroke="#664200" strokeWidth="1" />
    <ellipse cx="50" cy="50" rx="30" ry="20" fill="none" stroke="#996600" strokeWidth="2" strokeDasharray="2,2" />
    <ellipse cx="50" cy="50" rx="25" ry="15" fill="url(#goldRelPen)" stroke="#FFF" strokeWidth="1" opacity="0.8" />
    <circle cx="25" cy="50" r="3" fill="url(#ruby)" stroke="#664200" strokeWidth="1" />
    <circle cx="75" cy="50" r="3" fill="url(#ruby)" stroke="#664200" strokeWidth="1" />
    <circle cx="50" cy="32" r="3" fill="url(#ruby)" stroke="#664200" strokeWidth="1" />
    <circle cx="50" cy="68" r="3" fill="url(#ruby)" stroke="#664200" strokeWidth="1" />
    <circle cx="50" cy="50" r="8" fill="url(#ruby)" stroke="#FFD700" strokeWidth="2" />
    <path d="M47 47 Q 50 45 53 47" fill="none" stroke="#fff" strokeWidth="1" opacity="0.6"/>
  </svg>
);

const IconCoganAlam = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full" style={{ filter: 'drop-shadow(3px 5px 6px rgba(0,0,0,0.3))' }}>
    <defs>
      <linearGradient id="silverRelAlam" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#B0B5B9" />
        <stop offset="50%" stopColor="#FFFFFF" />
        <stop offset="100%" stopColor="#76797D" />
      </linearGradient>
      <linearGradient id="goldRelAlam" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#BF953F" />
        <stop offset="50%" stopColor="#FCF6BA" />
        <stop offset="100%" stopColor="#AA771C" />
      </linearGradient>
    </defs>
    <line x1="25" y1="85" x2="65" y2="40" stroke="url(#silverRelAlam)" strokeWidth="6" strokeLinecap="round" />
    <line x1="40" y1="65" x2="45" y2="70" stroke="#555" strokeWidth="3" />
    <line x1="50" y1="54" x2="55" y2="59" stroke="#555" strokeWidth="3" />
    <path d="M 60 45 L 68 36 L 73 41 L 65 50 Z" fill="url(#goldRelAlam)" />
    <circle cx="72" cy="30" r="12" fill="url(#silverRelAlam)" />
    <path d="M 64 30 Q 72 40 80 30" fill="none" stroke="#76797D" strokeWidth="1" />
    <path d="M 72 18 Q 62 30 72 42" fill="none" stroke="#76797D" strokeWidth="1" />
    <path d="M 65 20 A 15 15 0 0 0 85 40 A 18 18 0 0 1 65 20" fill="url(#goldRelAlam)" />
    <polygon points="76,12 77,16 81,16 78,19 79,23 76,20 73,23 74,19 71,16 75,16" fill="url(#goldRelAlam)" />
  </svg>
);

const IconCokmar = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full" style={{ filter: 'drop-shadow(3px 5px 6px rgba(0,0,0,0.4))' }}>
    <defs>
      <linearGradient id="silverRelCokmar" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#76797D" />
        <stop offset="30%" stopColor="#E2E5E7" />
        <stop offset="70%" stopColor="#B0B5B9" />
        <stop offset="100%" stopColor="#5A5D61" />
      </linearGradient>
      <linearGradient id="darkWood" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#2E1A0A" />
        <stop offset="50%" stopColor="#4A2F1D" />
        <stop offset="100%" stopColor="#1A0D04" />
      </linearGradient>
    </defs>
    <g transform="rotate(15 35 50)">
      <rect x="32" y="30" width="6" height="60" fill="url(#darkWood)" rx="3" />
      <rect x="31" y="40" width="8" height="5" fill="url(#silverRelCokmar)" />
      <rect x="31" y="60" width="8" height="3" fill="url(#silverRelCokmar)" />
      <ellipse cx="35" cy="25" rx="12" ry="14" fill="url(#silverRelCokmar)" />
      <path d="M 25 25 Q 35 35 45 25" fill="none" stroke="#5A5D61" strokeWidth="2" />
      <path d="M 27 18 Q 35 28 43 18" fill="none" stroke="#5A5D61" strokeWidth="2" />
      <path d="M 27 32 Q 35 42 43 32" fill="none" stroke="#5A5D61" strokeWidth="2" />
      <polygon points="33,11 37,11 35,5" fill="url(#silverRelCokmar)" />
    </g>
    <g transform="rotate(-15 65 50)">
      <rect x="62" y="30" width="6" height="60" fill="url(#darkWood)" rx="3" />
      <rect x="61" y="40" width="8" height="5" fill="url(#silverRelCokmar)" />
      <rect x="61" y="60" width="8" height="3" fill="url(#silverRelCokmar)" />
      <ellipse cx="65" cy="25" rx="12" ry="14" fill="url(#silverRelCokmar)" />
      <path d="M 55 25 Q 65 35 75 25" fill="none" stroke="#5A5D61" strokeWidth="2" />
      <path d="M 57 18 Q 65 28 73 18" fill="none" stroke="#5A5D61" strokeWidth="2" />
      <path d="M 57 32 Q 65 42 73 32" fill="none" stroke="#5A5D61" strokeWidth="2" />
      <polygon points="63,11 67,11 65,5" fill="url(#silverRelCokmar)" />
    </g>
  </svg>
);

const L2_ITEMS = [
  { id: 'tengkolok', name: 'Tengkolok Diraja', Icon: IconTengkolok },
  { id: 'payung', name: 'Payung Ubur-Ubur Kuning dan Tombak Berambu', Icon: IconPayung },
  { id: 'cogan_agama', name: 'Cogan Agama', Icon: IconCoganAgama },
  { id: 'pending', name: 'Pending Diraja', Icon: IconPending },
  { id: 'cogan_alam', name: 'Cogan Alam', Icon: IconCoganAlam },
  { id: 'cokmar', name: 'Cokmar', Icon: IconCokmar },
];

const L3_GRID = [
  { id: 0, row: 0, col: 0 }, { id: 1, row: 0, col: 1 }, { id: 2, row: 0, col: 2 },
  { id: 3, row: 1, col: 0 }, { id: 4, row: 1, col: 1 }, { id: 5, row: 1, col: 2 },
  { id: 6, row: 2, col: 0 }, { id: 7, row: 2, col: 1 }, { id: 8, row: 2, col: 2 },
];
const JATA_URL = "https://upload.wikimedia.org/wikipedia/commons/2/26/Coat_of_arms_of_Malaysia.svg";

const PuzzlePiece = ({ piece }) => (
  <div
    style={{
      width: '100%',
      height: '100%',
      backgroundImage: `url(${JATA_URL})`,
      backgroundSize: '300% 300%',
      backgroundPosition: `${piece.col * 50}% ${piece.row * 50}%`,
      backgroundColor: '#fff' 
    }}
  />
);

const L4_STATES = [
  { id: 'melaka', name: 'Melaka', head: 'Yang di-Pertua Negeri', color: '#f87171' },
  { id: 'perak', name: 'Perak', head: 'Sultan', color: '#fb923c' },
  { id: 'perlis', name: 'Perlis', head: 'Raja', color: '#facc15' },
  { id: 'pahang', name: 'Pahang', head: 'Sultan', color: '#4ade80' },
  { id: 'sarawak', name: 'Sarawak', head: 'Yang di-Pertua Negeri', color: '#60a5fa' },
  { id: 'johor', name: 'Johor', head: 'Sultan', color: '#a78bfa' },
  { id: 'kedah', name: 'Kedah', head: 'Sultan', color: '#f472b6' },
  { id: 'sabah', name: 'Sabah', head: 'Yang di-Pertua Negeri', color: '#34d399' },
  { id: 'kelantan', name: 'Kelantan', head: 'Sultan', color: '#fbbf24' },
  { id: 'negerisembilan', name: 'Negeri Sembilan', head: 'Yang di-Pertuan Besar', color: '#e879f9' },
  { id: 'selangor', name: 'Selangor', head: 'Sultan', color: '#818cf8' },
  { id: 'terengganu', name: 'Terengganu', head: 'Sultan', color: '#c084fc' },
  { id: 'pulaupinang', name: 'Pulau Pinang', head: 'Yang di-Pertua Negeri', color: '#fb7185' },
];

const HEAD_TITLES = [
  { id: 'Sultan', label: 'Sultan', color: 'bg-yellow-400', shadow: 'border-yellow-600', text: 'text-yellow-900' },
  { id: 'Raja', label: 'Raja', color: 'bg-blue-400', shadow: 'border-blue-600', text: 'text-blue-900' },
  { id: 'Yang di-Pertua Negeri', label: 'Yang di-Pertua Negeri', color: 'bg-green-500', shadow: 'border-green-700', text: 'text-white' },
  { id: 'Yang di-Pertuan Besar', label: 'Yang di-Pertuan Besar', color: 'bg-red-500', shadow: 'border-red-700', text: 'text-white' },
];

// --- LEVEL 5 ICONS (REALISTIC SIDE-PROFILE FLOWERS & CAT) ---
const IconHibiscus = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xl">
    <defs>
       <linearGradient id="hibiscusRed" x1="0" y1="1" x2="1" y2="0">
         <stop offset="0%" stopColor="#991b1b" />
         <stop offset="50%" stopColor="#ef4444" />
         <stop offset="100%" stopColor="#fca5a5" />
       </linearGradient>
       <linearGradient id="hibiscusDark" x1="0" y1="1" x2="1" y2="0">
         <stop offset="0%" stopColor="#7f1d1d" />
         <stop offset="100%" stopColor="#dc2626" />
       </linearGradient>
    </defs>
    <path d="M 30 85 L 40 70 L 45 75 Z" fill="#166534" />
    <path d="M 25 95 L 35 80 L 30 85 Z" fill="#15803d" stroke="#166534" strokeWidth="2"/>
    <path d="M 35 80 Q 45 90 50 70 L 30 65 Z" fill="#22c55e" />
    <path d="M 40 70 C 10 60 15 20 45 35 C 55 40 45 60 40 70 Z" fill="url(#hibiscusDark)" />
    <path d="M 40 70 C 40 20 85 10 75 45 C 70 60 50 65 40 70 Z" fill="url(#hibiscusDark)" />
    <path d="M 45 65 Q 75 50 90 25" fill="none" stroke="#fecaca" strokeWidth="3" strokeLinecap="round" />
    <circle cx="90" cy="25" r="2.5" fill="#facc15" />
    <circle cx="85" cy="22" r="2" fill="#eab308" />
    <circle cx="94" cy="28" r="2" fill="#eab308" />
    <circle cx="88" cy="30" r="2" fill="#facc15" />
    <circle cx="94" cy="22" r="1.5" fill="#ca8a04" />
    <path d="M 40 70 C 20 85 65 95 80 75 C 90 60 60 55 40 70 Z" fill="url(#hibiscusRed)" />
    <path d="M 40 70 C 35 40 65 25 85 50 C 95 65 60 65 40 70 Z" fill="url(#hibiscusRed)" />
  </svg>
);

const IconRose = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xl">
    <defs>
      <linearGradient id="roseBase" x1="0" y1="1" x2="0" y2="0">
        <stop offset="0%" stopColor="#881337" />
        <stop offset="100%" stopColor="#e11d48" />
      </linearGradient>
    </defs>
    <path d="M 45 95 L 50 75 L 55 95 Z" fill="#15803d" />
    <path d="M 30 65 Q 50 85 70 65 L 60 70 L 50 80 L 40 70 Z" fill="#22c55e" />
    <path d="M 25 55 Q 35 70 45 75 L 35 65 Z" fill="#166534" />
    <path d="M 75 55 Q 65 70 55 75 L 65 65 Z" fill="#166534" />
    <path d="M 25 55 C 25 90 75 90 75 55 Z" fill="url(#roseBase)" />
    <path d="M 25 55 C 15 30 45 20 50 40 C 50 40 45 60 25 55 Z" fill="#be123c" stroke="#9f1239" strokeWidth="1"/>
    <path d="M 75 55 C 85 30 55 20 50 40 C 50 40 55 60 75 55 Z" fill="#f43f5e" stroke="#e11d48" strokeWidth="1"/>
    <path d="M 35 50 C 30 25 60 25 65 45 C 55 55 40 55 35 50 Z" fill="#fb7185" />
    <path d="M 42 45 C 40 30 55 30 58 42 C 53 48 45 48 42 45 Z" fill="#fda4af" />
    <path d="M 48 40 C 47 35 52 35 53 40 C 51 43 49 43 48 40 Z" fill="#fff1f2" />
  </svg>
);

const IconDaisy = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xl">
    <defs>
      <linearGradient id="daisyCenter" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#facc15" />
        <stop offset="100%" stopColor="#a16207" />
      </linearGradient>
    </defs>
    <path d="M 48 95 L 50 70 L 52 95 Z" fill="#166534" />
    <path d="M 35 70 Q 50 85 65 70 Z" fill="#22c55e" />
    <g stroke="#cbd5e1" strokeWidth="1" fill="#f8fafc">
      <path d="M 40 65 Q 20 40 25 25 Q 35 45 45 65 Z" />
      <path d="M 45 65 Q 35 30 45 15 Q 50 35 50 63 Z" />
      <path d="M 50 63 Q 65 30 55 15 Q 65 35 55 65 Z" />
      <path d="M 60 65 Q 80 40 75 25 Q 65 45 55 65 Z" />
    </g>
    <path d="M 30 65 C 30 50 70 50 70 65 C 70 70 30 70 30 65 Z" fill="url(#daisyCenter)" />
    <g stroke="#e2e8f0" strokeWidth="1" fill="#ffffff">
      <path d="M 35 65 Q 10 55 5 45 Q 20 60 40 66 Z" />
      <path d="M 40 66 Q 15 40 20 25 Q 35 50 45 67 Z" />
      <path d="M 45 67 Q 40 25 50 15 Q 55 35 50 68 Z" />
      <path d="M 50 68 Q 60 25 50 15 Q 65 35 55 67 Z" transform="scale(-1, 1) translate(-100, 0)" />
      <path d="M 40 66 Q 15 40 20 25 Q 35 50 45 67 Z" transform="scale(-1, 1) translate(-100, 0)" />
      <path d="M 35 65 Q 10 55 5 45 Q 20 60 40 66 Z" transform="scale(-1, 1) translate(-100, 0)" />
    </g>
  </svg>
);

const IconSunflower = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xl">
    <defs>
      <linearGradient id="sunCenter" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#451a03" />
        <stop offset="100%" stopColor="#1c0a01" />
      </linearGradient>
      <linearGradient id="sunPetal" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#fde047" />
        <stop offset="100%" stopColor="#d97706" />
      </linearGradient>
    </defs>
    <path d="M 45 95 L 50 65 L 55 95 Z" fill="#14532d" />
    <path d="M 20 65 Q 50 90 80 65 L 70 65 L 50 75 L 30 65 Z" fill="#15803d" />
    <g fill="#b45309">
      <path d="M 30 60 Q 5 35 15 15 Q 35 40 40 60 Z" />
      <path d="M 40 55 Q 30 15 45 5 Q 55 25 50 55 Z" />
      <path d="M 60 55 Q 70 15 55 5 Q 45 25 50 55 Z" />
      <path d="M 70 60 Q 95 35 85 15 Q 65 40 60 60 Z" />
    </g>
    <path d="M 15 65 C 15 40 85 40 85 65 C 85 75 15 75 15 65 Z" fill="url(#sunCenter)" />
    <g fill="url(#sunPetal)" stroke="#ca8a04" strokeWidth="0.5">
      <path d="M 20 65 Q -5 45 5 35 Q 25 55 30 68 Z" />
      <path d="M 30 68 Q 5 25 20 10 Q 40 45 40 70 Z" />
      <path d="M 40 70 Q 35 15 50 5 Q 60 35 50 72 Z" />
      <path d="M 50 72 Q 65 15 50 5 Q 40 35 60 70 Z" transform="scale(-1, 1) translate(-100, 0)" />
      <path d="M 30 68 Q 5 25 20 10 Q 40 45 40 70 Z" transform="scale(-1, 1) translate(-100, 0)" />
      <path d="M 20 65 Q -5 45 5 35 Q 25 55 30 68 Z" transform="scale(-1, 1) translate(-100, 0)" />
    </g>
  </svg>
);

const IconCarnation = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xl">
    <path d="M 48 95 L 50 75 L 52 95 Z" fill="#14532d" />
    <path d="M 38 75 L 35 60 Q 50 55 65 60 L 62 75 Q 50 85 38 75 Z" fill="#16a34a" stroke="#15803d" strokeWidth="2" strokeLinejoin="round"/>
    <path d="M 38 75 Q 25 70 35 60" fill="none" stroke="#15803d" strokeWidth="2" />
    <path d="M 62 75 Q 75 70 65 60" fill="none" stroke="#15803d" strokeWidth="2" />
    <path d="M 30 60 C 10 50 10 10 40 15 C 60 5 90 10 70 60 Z" fill="#be185d" />
    <path d="M 32 60 C 15 45 20 15 50 20 C 80 15 85 45 68 60 Z" fill="#ec4899" />
    <path d="M 35 60 L 25 45 L 35 40 L 30 25 L 50 30 L 65 20 L 65 35 L 75 40 L 65 60 Z" fill="#f472b6" stroke="#db2777" strokeWidth="1" strokeLinejoin="round"/>
    <path d="M 40 60 L 35 45 L 45 40 L 50 25 L 55 40 L 65 45 L 60 60 Z" fill="#fbcfe8" />
  </svg>
);

const IconCatBasket = () => (
  <svg viewBox="0 0 150 100" className="w-full h-full drop-shadow-xl">
    {/* Cat Tail */}
    <path d="M 110 80 Q 140 80 130 50 Q 120 20 140 10" fill="none" stroke="#f59e0b" strokeWidth="8" strokeLinecap="round" />
    {/* Cat Ears & Head */}
    <polygon points="30,40 20,10 50,25" fill="#f59e0b" />
    <polygon points="70,40 80,10 50,25" fill="#f59e0b" />
    <circle cx="50" cy="45" r="25" fill="#f59e0b" />
    {/* Cat Face */}
    <circle cx="40" cy="40" r="3" fill="#000" />
    <circle cx="60" cy="40" r="3" fill="#000" />
    <path d="M 45 50 Q 50 55 55 50" fill="none" stroke="#000" strokeWidth="2" />
    <polygon points="48,46 52,46 50,49" fill="#ea580c" />
    {/* Paws holding basket */}
    <ellipse cx="25" cy="65" rx="8" ry="6" fill="#fef3c7" />
    <ellipse cx="125" cy="65" rx="8" ry="6" fill="#fef3c7" />
    {/* Basket */}
    <path d="M 20 60 L 130 60 L 120 95 L 30 95 Z" fill="#a16207" stroke="#713f12" strokeWidth="4" strokeLinejoin="round" />
    <line x1="25" y1="70" x2="125" y2="70" stroke="#854d0e" strokeWidth="2" />
    <line x1="28" y1="80" x2="122" y2="80" stroke="#854d0e" strokeWidth="2" />
    <line x1="32" y1="90" x2="118" y2="90" stroke="#854d0e" strokeWidth="2" />
    <line x1="40" y1="60" x2="40" y2="95" stroke="#854d0e" strokeWidth="2" />
    <line x1="60" y1="60" x2="60" y2="95" stroke="#854d0e" strokeWidth="2" />
    <line x1="80" y1="60" x2="80" y2="95" stroke="#854d0e" strokeWidth="2" />
    <line x1="100" y1="60" x2="100" y2="95" stroke="#854d0e" strokeWidth="2" />
  </svg>
);

const FLOWERS = [
  { type: 'hibiscus', name: 'Bunga Raya', Icon: IconHibiscus, isTarget: true },
  { type: 'rose', name: 'Mawar', Icon: IconRose, isTarget: false },
  { type: 'daisy', name: 'Daisi', Icon: IconDaisy, isTarget: false },
  { type: 'sunflower', name: 'Matahari', Icon: IconSunflower, isTarget: false },
  { type: 'carnation', name: 'Karnesyen', Icon: IconCarnation, isTarget: false },
];

// --- ABSTRACT HISTORICAL MOTIFS ---
const IconPucukRebung = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md opacity-20 pointer-events-none">
    <polygon points="50,10 90,90 10,90" fill="none" stroke="#78350f" strokeWidth="4" strokeLinejoin="round" />
    <polygon points="50,30 75,80 25,80" fill="none" stroke="#78350f" strokeWidth="4" strokeLinejoin="round" />
    <polygon points="50,50 60,70 40,70" fill="#78350f" />
    <path d="M 10 90 Q 50 100 90 90" fill="none" stroke="#78350f" strokeWidth="4" />
  </svg>
);

const IconAwanLarat = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md opacity-20 pointer-events-none" fill="none" stroke="#78350f" strokeWidth="4" strokeLinecap="round">
    <path d="M 10 50 C 10 20 40 10 50 30 C 60 50 40 70 30 50 C 20 30 50 10 80 20 C 95 25 90 50 70 50 C 50 50 60 80 80 80" />
    <path d="M 50 30 C 55 20 70 30 65 40" />
  </svg>
);

const IconAbstractKeris = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md opacity-20 pointer-events-none" fill="none" stroke="#78350f" strokeWidth="4" strokeLinejoin="round" strokeLinecap="round">
    <path d="M 50 10 C 65 20 35 30 50 45 C 65 60 35 70 50 80" />
    <path d="M 30 80 L 70 80 L 65 85 L 35 85 Z" fill="#78350f" />
    <path d="M 45 85 L 55 85 L 50 95 Z" fill="#78350f" />
  </svg>
);

const IconAbstractPerisai = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md opacity-20 pointer-events-none" fill="none" stroke="#78350f" strokeWidth="4">
    <path d="M 20 20 L 80 20 L 80 50 C 80 80 50 95 50 95 C 50 95 20 80 20 50 Z" />
    <circle cx="50" cy="45" r="10" />
    <circle cx="50" cy="45" r="20" strokeDasharray="5,5" />
  </svg>
);

const IconAbstractWau = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md opacity-20 pointer-events-none" fill="none" stroke="#78350f" strokeWidth="3" strokeLinejoin="round">
    <path d="M 50 10 C 80 10 90 40 90 50 C 90 60 70 70 50 70 C 30 70 10 60 10 50 C 10 40 20 10 50 10 Z" />
    <path d="M 50 70 C 70 70 80 85 80 95 L 50 85 L 20 95 C 20 85 30 70 50 70 Z" />
    <circle cx="50" cy="45" r="15" />
    <circle cx="50" cy="45" r="5" fill="#78350f" />
  </svg>
);

const IconAbstractGong = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md opacity-20 pointer-events-none" fill="none" stroke="#78350f" strokeWidth="3">
    <circle cx="50" cy="50" r="40" />
    <circle cx="50" cy="50" r="10" fill="#78350f" />
    <path d="M 50 10 L 50 0 M 50 90 L 50 100 M 10 50 L 0 50 M 90 50 L 100 50" />
    <circle cx="50" cy="50" r="30" strokeDasharray="4 4" />
  </svg>
);

// --- SCROLL LETTER COMPONENT (OLD ENGLISH FONT) ---
const LetterScroll = ({ letter }) => (
  <div className="relative inline-flex items-center justify-center w-24 h-32 md:w-32 md:h-40 mx-2 hover:scale-105 transition-transform duration-500">
    <svg viewBox="0 0 100 140" className="absolute inset-0 w-full h-full drop-shadow-2xl">
      <path d="M10 20 Q 50 10 90 20 L 90 120 Q 50 130 10 120 Z" fill="#fef3c7" stroke="#92400e" strokeWidth="3" />
      <path d="M10 20 Q 5 15 10 10 Q 50 0 90 10 Q 95 15 90 20" fill="#d97706" stroke="#92400e" strokeWidth="2" />
      <path d="M10 120 Q 5 125 10 130 Q 50 140 90 130 Q 95 125 90 120" fill="#d97706" stroke="#92400e" strokeWidth="2" />
      <line x1="15" y1="20" x2="15" y2="120" stroke="#b45309" strokeWidth="2" strokeDasharray="4 4" opacity="0.4" />
      <line x1="85" y1="20" x2="85" y2="120" stroke="#b45309" strokeWidth="2" strokeDasharray="4 4" opacity="0.4" />
    </svg>
    <span 
      className="relative z-10 text-[5rem] md:text-[6.5rem] text-amber-950 drop-shadow-md pt-2"
      style={{ fontFamily: '"Old English Text MT", "Cloister Black", "Pirata One", serif' }}
    >
      {letter}
    </span>
  </div>
);

// ============================================================================
// LEVEL 1 COMPONENT
// ============================================================================
function Level1({ onComplete }) {
  const [feedback, setFeedback] = useState(null);
  const [renderState, setRenderState] = useState({ active: [], score: 0 });
  
  const engineRef = useRef({ pending: [], active: [], score: 0 });
  const bucketRefs = useRef({});
  const dragInfo = useRef(null);
  const loopRef = useRef(null);
  
  const startTime = useRef(Date.now());
  const hasCompleted = useRef(false);

  useEffect(() => {
    engineRef.current.pending = [...L1_PHRASES].sort(() => Math.random() - 0.5);
    engineRef.current.score = 0;
    
    loopRef.current = setInterval(() => {
      let data = engineRef.current;
      let needsRender = false;

      const topMostY = data.active.length > 0 ? Math.min(...data.active.map(i => i.y)) : window.innerHeight;

      if (data.active.length < 2 && data.pending.length > 0 && topMostY > 150) {
        const nextPhrase = data.pending.shift();
        const itemWidth = 160; 
        const randomX = Math.max(10, Math.random() * (window.innerWidth - itemWidth - 20));
        data.active.push({ ...nextPhrase, id: `item-${Date.now()}-${Math.random()}`, x: randomX, y: -100, isDragging: false });
        needsRender = true;
      }

      data.active.forEach(item => {
        if (!item.isDragging) { item.y += 1.2; needsRender = true; }
      });

      const missedItems = data.active.filter(i => i.y > window.innerHeight);
      if (missedItems.length > 0) {
        data.active = data.active.filter(i => i.y <= window.innerHeight);
        missedItems.forEach(item => data.pending.push({ text: item.text, religion: item.religion }));
        needsRender = true;
      }

      if (needsRender) setRenderState({ active: [...data.active], score: data.score });
    }, 25);

    return () => clearInterval(loopRef.current);
  }, []);

  useEffect(() => {
    if (renderState.score === L1_PHRASES.length && !hasCompleted.current) {
      hasCompleted.current = true;
      const elapsed = Math.floor((Date.now() - startTime.current) / 1000);
      setTimeout(() => onComplete(elapsed), 1000);
    }
  }, [renderState.score, onComplete]);

  const showFeedback = (type, text) => {
    setFeedback({ type, text });
    setTimeout(() => setFeedback(null), 1500);
  };

  const handlePointerDown = (e, id) => {
    const item = engineRef.current.active.find(i => i.id === id);
    if (!item) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    const rect = e.currentTarget.getBoundingClientRect();
    dragInfo.current = { id, offsetX: e.clientX - rect.left, offsetY: e.clientY - rect.top, pointerId: e.pointerId };
    item.isDragging = true;
    setRenderState({ active: [...engineRef.current.active], score: engineRef.current.score });
  };

  const handlePointerMove = (e) => {
    if (!dragInfo.current) return;
    const item = engineRef.current.active.find(i => i.id === dragInfo.current.id);
    if (item && item.isDragging) {
      item.x = e.clientX - dragInfo.current.offsetX;
      item.y = e.clientY - dragInfo.current.offsetY;
    }
  };

  const handlePointerUp = (e) => {
    if (!dragInfo.current) return;
    const itemIndex = engineRef.current.active.findIndex(i => i.id === dragInfo.current.id);
    if (itemIndex > -1) {
      const item = engineRef.current.active[itemIndex];
      item.isDragging = false;
      try { e.currentTarget.releasePointerCapture(dragInfo.current.pointerId); } catch (err) {}

      const itemRect = e.currentTarget.getBoundingClientRect();
      const centerX = itemRect.left + itemRect.width / 2;
      const centerY = itemRect.top + itemRect.height / 2;

      let hitBucket = null;
      for (const [religion, node] of Object.entries(bucketRefs.current)) {
        if (!node) continue;
        const rect = node.getBoundingClientRect();
        if (centerX >= rect.left && centerX <= rect.right && centerY >= rect.top && centerY <= rect.bottom) {
          hitBucket = religion; break;
        }
      }

      if (hitBucket) {
        if (hitBucket === item.religion) {
          engineRef.current.active.splice(itemIndex, 1);
          engineRef.current.score += 1;
          showFeedback('correct', 'Tepat sekali!');
        } else {
          const removedItem = engineRef.current.active.splice(itemIndex, 1)[0];
          engineRef.current.pending.push({ text: removedItem.text, religion: removedItem.religion });
          showFeedback('wrong', 'Cuba lagi!');
        }
      }
    }
    dragInfo.current = null;
    setRenderState({ active: [...engineRef.current.active], score: engineRef.current.score });
  };

  return (
    <div className="w-full h-full relative touch-none select-none bg-sky-100" onPointerMove={handlePointerMove}>
      <header className="absolute top-0 left-0 w-full p-4 flex justify-between items-center z-10 pointer-events-none">
        <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-md border border-sky-200">
          <h1 className="text-sm md:text-xl font-bold text-sky-900">Level 1: Agama di Malaysia</h1>
        </div>
        <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-md border border-sky-200 flex items-center gap-2">
          <Trophy className="w-4 h-4 text-yellow-600" />
          <span className="text-base md:text-xl font-bold text-sky-900">{renderState.score} / {L1_PHRASES.length}</span>
        </div>
      </header>

      {feedback && (
        <div className={`absolute top-24 left-1/2 -translate-x-1/2 px-6 py-3 rounded-full shadow-xl font-bold text-lg md:text-xl flex items-center gap-2 z-50 animate-bounce ${feedback.type === 'correct' ? 'bg-green-100 text-green-700 border-2 border-green-500' : 'bg-red-100 text-red-700 border-2 border-red-500'}`}>
          {feedback.type === 'correct' ? <CheckCircle2 /> : <XCircle />}
          {feedback.text}
        </div>
      )}

      <div className="absolute inset-0 z-20 overflow-hidden">
        {renderState.active.map((item) => (
          <div
            key={item.id}
            onPointerDown={(e) => handlePointerDown(e, item.id)}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            style={{ transform: `translate(${item.x}px, ${item.y}px)` }}
            className={`absolute w-36 md:w-48 bg-white border-b-4 border-slate-300 rounded-xl p-3 shadow-lg cursor-grab active:cursor-grabbing transition-transform duration-75 ${item.isDragging ? 'scale-110 shadow-2xl z-50 ring-4 ring-sky-400 rotate-2' : 'z-30 hover:scale-105'}`}
          >
            <p className="text-center font-bold text-slate-800 text-sm md:text-base leading-snug pointer-events-none select-none">{item.text}</p>
          </div>
        ))}
      </div>

      <div className="absolute bottom-0 left-0 w-full flex justify-between items-end p-2 md:p-4 gap-1 md:gap-4 z-10 pointer-events-none">
        {BUCKETS.map((bucket) => (
          <div key={bucket.id} ref={(el) => (bucketRefs.current[bucket.id] = el)} className={`flex-1 h-28 md:h-36 ${bucket.color} border-t-8 ${bucket.border} rounded-t-xl md:rounded-t-2xl flex flex-col items-center justify-center shadow-lg relative overflow-hidden`}>
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent"></div>
            <span className="font-extrabold text-white text-[10px] md:text-lg lg:text-xl text-center uppercase tracking-wider drop-shadow-md px-1 relative z-10">{bucket.id}</span>
            <div className="mt-2 w-8 h-1 md:w-12 md:h-2 bg-white/30 rounded-full relative z-10"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// LEVEL 2 COMPONENT (MATCH PICTURE TO NAME)
// ============================================================================
function Level2({ onComplete }) {
  const [matchedItems, setMatchedItems] = useState([]);
  const [shuffledPictures, setShuffledPictures] = useState([]);
  const [shuffledNames, setShuffledNames] = useState([]);
  const [draggingItem, setDraggingItem] = useState(null);
  const [feedback, setFeedback] = useState(null);
  
  const dropZonesRef = useRef({});
  const startTime = useRef(Date.now());
  const hasCompleted = useRef(false);

  useEffect(() => {
    const safeL2Items = L2_ITEMS.map(i => ({...i})); 
    setShuffledPictures([...safeL2Items].sort(() => Math.random() - 0.5));
    setShuffledNames([...safeL2Items].sort(() => Math.random() - 0.5));
  }, []);

  useEffect(() => {
    if (matchedItems.length === L2_ITEMS.length && !hasCompleted.current) {
      hasCompleted.current = true;
      const elapsed = Math.floor((Date.now() - startTime.current) / 1000);
      setTimeout(() => onComplete(elapsed), 1500);
    }
  }, [matchedItems, onComplete]);

  const showFeedback = (type, text) => {
    setFeedback({ type, text });
    setTimeout(() => setFeedback(null), 1500);
  };

  const handlePointerDown = (e, item) => {
    if (matchedItems.includes(item.id)) return;
    if(e.cancelable) e.preventDefault(); 
    const rect = e.currentTarget.getBoundingClientRect();
    setDraggingItem({
      ...item,
      offsetX: e.clientX - rect.left,
      offsetY: e.clientY - rect.top,
      x: e.clientX - (e.clientX - rect.left),
      y: e.clientY - (e.clientY - rect.top),
      width: rect.width
    });
  };

  const handlePointerMove = (e) => {
    if (draggingItem) {
      setDraggingItem({ ...draggingItem, x: e.clientX - draggingItem.offsetX, y: e.clientY - draggingItem.offsetY });
    }
  };

  const handlePointerUp = (e) => {
    if (!draggingItem) return;
    const centerX = draggingItem.x + draggingItem.width / 2;
    const centerY = draggingItem.y + 20;

    let hitId = null;
    for (const [id, node] of Object.entries(dropZonesRef.current)) {
      if (!node) continue;
      const rect = node.getBoundingClientRect();
      if (centerX >= rect.left && centerX <= rect.right && centerY >= rect.top && centerY <= rect.bottom) {
        hitId = id; break;
      }
    }

    if (hitId) {
      if (hitId === draggingItem.id) {
        setMatchedItems(prev => [...prev, hitId]);
        showFeedback('correct', 'Bagus!');
      } else {
        showFeedback('wrong', 'Bukan yang itu!');
      }
    }
    setDraggingItem(null);
  };

  return (
    <div className="w-full h-full flex flex-col bg-amber-50 relative select-none touch-none" onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerCancel={handlePointerUp}>
      <header className="w-full p-4 flex justify-between items-center z-10 shrink-0">
        <div className="bg-white px-4 py-2 rounded-full shadow-sm border border-amber-200">
          <h1 className="text-sm md:text-xl font-bold text-amber-900 flex items-center gap-2"><Crown className="w-5 h-5 text-amber-500" />Level 2: Alat Kebesaran Diraja</h1>
        </div>
        <div className="bg-white px-4 py-2 rounded-full shadow-sm border border-amber-200 flex items-center gap-2">
          <Trophy className="w-4 h-4 text-yellow-600" />
          <span className="text-base md:text-xl font-bold text-amber-900">{matchedItems.length} / {L2_ITEMS.length}</span>
        </div>
      </header>

      {feedback && (
        <div className={`absolute top-20 left-1/2 -translate-x-1/2 px-6 py-3 rounded-full shadow-xl font-bold text-lg flex items-center gap-2 z-50 animate-bounce ${feedback.type === 'correct' ? 'bg-green-100 text-green-700 border-2 border-green-500' : 'bg-red-100 text-red-700 border-2 border-red-500'}`}>
          {feedback.type === 'correct' ? <CheckCircle2 /> : <XCircle />}
          {feedback.text}
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4 md:p-8 pt-0">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 max-w-5xl mx-auto h-full content-start">
          {shuffledPictures.map((item) => {
            const isMatched = matchedItems.includes(item.id);
            return (
              <div key={item.id} ref={(el) => dropZonesRef.current[item.id] = el} className={`flex flex-col bg-white rounded-2xl p-4 shadow-md border-4 transition-colors ${isMatched ? 'border-green-400 bg-green-50' : 'border-amber-100'}`}>
                <div className="flex-1 min-h-[120px] md:min-h-[160px] bg-slate-50 rounded-xl mb-3 flex items-center justify-center p-4 border border-slate-100 shadow-inner">
                  <div className="w-24 h-24 md:w-32 md:h-32">
                    {item.Icon && <item.Icon />}
                  </div>
                </div>
                <div className={`h-12 md:h-16 rounded-lg flex items-center justify-center p-2 text-center transition-all ${isMatched ? 'bg-green-500 text-white font-bold shadow-sm' : 'bg-slate-100 border-2 border-dashed border-slate-300'}`}>
                  {isMatched ? <span className="text-xs md:text-sm">{item.name}</span> : <span className="text-slate-400 text-xs md:text-sm">Tarik jawapan ke sini</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="shrink-0 bg-white border-t-4 border-amber-200 p-4 pb-8 md:p-6 shadow-[0_-10px_20px_rgba(0,0,0,0.05)] z-20">
        <p className="text-center text-amber-700 font-bold mb-3 text-sm md:text-base">Tarik nama alat kebesaran ke gambar yang betul:</p>
        <div className="flex flex-wrap justify-center gap-2 md:gap-4 max-w-5xl mx-auto">
          {shuffledNames.map((item) => {
            const isMatched = matchedItems.includes(item.id);
            const isDraggingThis = draggingItem?.id === item.id;
            return (
              <div key={item.id} onPointerDown={(e) => handlePointerDown(e, item)} className={`px-4 py-2 md:px-6 md:py-3 rounded-xl font-semibold text-xs md:text-sm text-center shadow-md border-b-4 ${isMatched ? 'opacity-0 pointer-events-none' : 'bg-amber-100 border-amber-300 text-amber-900 cursor-grab active:cursor-grabbing hover:bg-amber-200'} ${isDraggingThis ? 'opacity-0' : ''}`} style={{ touchAction: 'none' }}>
                {item.name}
              </div>
            );
          })}
        </div>
      </div>

      {draggingItem && (
        <div className="fixed pointer-events-none px-4 py-2 md:px-6 md:py-3 bg-amber-100 border-b-4 border-amber-400 text-amber-900 rounded-xl font-semibold text-xs md:text-sm text-center shadow-2xl z-50 scale-105 rotate-2" style={{ left: draggingItem.x, top: draggingItem.y, width: draggingItem.width, margin: 0 }}>
          {draggingItem.name}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// LEVEL 3 COMPONENT (ASSEMBLE JATA NEGARA)
// ============================================================================
function Level3({ onComplete }) {
  const [placedParts, setPlacedParts] = useState(() => [Math.floor(Math.random() * 9)]);
  const [shuffledTray, setShuffledTray] = useState([]);
  const [draggingItem, setDraggingItem] = useState(null);
  const [feedback, setFeedback] = useState(null);
  
  const startTime = useRef(Date.now());
  const hasCompleted = useRef(false);

  useEffect(() => {
    setShuffledTray([...L3_GRID].sort(() => Math.random() - 0.5));
  }, []);

  useEffect(() => {
    if (placedParts.length === L3_GRID.length && !hasCompleted.current) {
      hasCompleted.current = true;
      const elapsed = Math.floor((Date.now() - startTime.current) / 1000);
      setTimeout(() => onComplete(elapsed), 1500);
    }
  }, [placedParts, onComplete]);

  const showFeedback = (type, text) => {
    setFeedback({ type, text });
    setTimeout(() => setFeedback(null), 1500);
  };

  const handlePointerDown = (e, piece) => {
    if (placedParts.includes(piece.id)) return;
    if(e.cancelable) e.preventDefault(); 
    const cellWidth = window.innerWidth >= 768 ? 150 : 100;
    const cellHeight = window.innerWidth >= 768 ? 114 : 76;

    setDraggingItem({
      ...piece,
      offsetX: cellWidth / 2,
      offsetY: cellHeight / 2,
      x: e.clientX - (cellWidth / 2),
      y: e.clientY - (cellHeight / 2),
      width: cellWidth,
      height: cellHeight
    });
  };

  const handlePointerMove = (e) => {
    if (draggingItem) {
      setDraggingItem({ ...draggingItem, x: e.clientX - draggingItem.offsetX, y: e.clientY - draggingItem.offsetY });
    }
  };

  const handlePointerUp = (e) => {
    if (!draggingItem) return;
    const element = document.elementFromPoint(e.clientX, e.clientY);
    const slot = element?.closest('[data-slot-id]');

    if (slot) {
      const slotId = parseInt(slot.getAttribute('data-slot-id'), 10);
      if (slotId === draggingItem.id) {
        setPlacedParts(prev => [...prev, draggingItem.id]);
        showFeedback('correct', 'Tepat!');
      } else {
        showFeedback('wrong', 'Bukan di situ!');
      }
    }
    setDraggingItem(null);
  };

  return (
    <div className="w-full h-full flex flex-col bg-red-50 relative select-none touch-none" onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerCancel={handlePointerUp}>
      <header className="w-full p-4 flex justify-between items-center z-10 shrink-0">
        <div className="bg-white px-4 py-2 rounded-full shadow-sm border border-red-200">
          <h1 className="text-sm md:text-xl font-bold text-red-900 flex items-center gap-2"><Puzzle className="w-5 h-5 text-red-500" />Level 3: Jata Negara</h1>
        </div>
        <div className="bg-white px-4 py-2 rounded-full shadow-sm border border-red-200 flex items-center gap-2">
          <Trophy className="w-4 h-4 text-yellow-600" />
          <span className="text-base md:text-xl font-bold text-red-900">{placedParts.length} / {L3_GRID.length}</span>
        </div>
      </header>

      {feedback && (
        <div className={`absolute top-20 left-1/2 -translate-x-1/2 px-6 py-3 rounded-full shadow-xl font-bold text-lg flex items-center gap-2 z-50 animate-bounce ${feedback.type === 'correct' ? 'bg-green-100 text-green-700 border-2 border-green-500' : 'bg-red-100 text-red-700 border-2 border-red-500'}`}>
          {feedback.type === 'correct' ? <CheckCircle2 /> : <XCircle />}
          {feedback.text}
        </div>
      )}

      <div className="flex-1 flex items-center justify-center p-2 md:p-4">
        <div className="w-[300px] h-[228px] md:w-[450px] md:h-[342px] grid grid-cols-3 grid-rows-3 relative bg-white rounded-xl shadow-xl border-4 border-red-400 overflow-hidden">
          {L3_GRID.map(cell => {
            const isPlaced = placedParts.includes(cell.id);
            return (
              <div key={cell.id} data-slot-id={cell.id} className={`w-full h-full transition-colors ${!isPlaced ? 'border border-dashed border-red-300 bg-red-50/50' : ''}`}>
                {isPlaced && <PuzzlePiece piece={cell} />}
              </div>
            );
          })}
        </div>
      </div>

      <div className="shrink-0 bg-white border-t-4 border-red-200 p-4 pb-8 md:p-6 shadow-[0_-10px_20px_rgba(0,0,0,0.05)] z-20 min-h-[160px]">
        <p className="text-center text-red-700 font-bold mb-4 text-sm md:text-base">Cantumkan 9 bahagian ini untuk melengkapkan Jata Negara:</p>
        <div className="flex flex-wrap justify-center items-center gap-2 md:gap-4 max-w-3xl mx-auto h-24">
          {shuffledTray.map(piece => {
            const isPlaced = placedParts.includes(piece.id);
            const isDraggingThis = draggingItem?.id === piece.id;
            if (isPlaced) return null;
            return (
              <div key={piece.id} onPointerDown={(e) => handlePointerDown(e, piece)} className={`w-[60px] h-[45px] md:w-[80px] md:h-[60px] border border-slate-300 rounded shadow-md overflow-hidden flex items-center justify-center cursor-grab active:cursor-grabbing hover:scale-105 transition-all ${isDraggingThis ? 'opacity-0' : ''}`} style={{ touchAction: 'none' }}>
                <PuzzlePiece piece={piece} />
              </div>
            );
          })}
        </div>
      </div>

      {draggingItem && (
        <div className="fixed pointer-events-none z-50 drop-shadow-2xl shadow-[0_10px_20px_rgba(0,0,0,0.3)] border border-slate-200 rounded overflow-hidden" style={{ left: draggingItem.x, top: draggingItem.y, width: draggingItem.width, height: draggingItem.height }}>
          <PuzzlePiece piece={draggingItem} />
        </div>
      )}
    </div>
  );
}

// ============================================================================
// LEVEL 4 COMPONENT (SPIN THE WHEEL)
// ============================================================================
function Level4({ onComplete }) {
  const [statesRemaining, setStatesRemaining] = useState(L4_STATES);
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [selectedState, setSelectedState] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);
  
  const startTime = useRef(Date.now());
  const hasCompleted = useRef(false);

  useEffect(() => {
    if (statesRemaining.length === 0 && score > 0 && !hasCompleted.current) {
      hasCompleted.current = true;
      const elapsed = Math.floor((Date.now() - startTime.current) / 1000);
      setTimeout(() => onComplete(elapsed), 1500);
    }
  }, [statesRemaining, score, onComplete]);

  const spinWheel = () => {
    if (isSpinning || statesRemaining.length === 0 || feedback) return;
    setIsSpinning(true);
    setSelectedState(null);

    const newRotation = rotation + 1440 + Math.floor(Math.random() * 360);
    setRotation(newRotation);

    setTimeout(() => {
      setIsSpinning(false);
      const normalized = newRotation % 360;
      const sliceAngle = 360 / statesRemaining.length;
      const selectedIndex = Math.round(((360 - normalized) % 360) / sliceAngle) % statesRemaining.length;
      setSelectedState(statesRemaining[selectedIndex]);
    }, 3000); 
  };

  const handleBuzzer = (headId) => {
    if (!selectedState || feedback) return;

    if (selectedState.head === headId) {
      setFeedback({ type: 'correct', text: 'Tepat Sekali!' });
      setTimeout(() => {
        setStatesRemaining(prev => prev.filter(s => s.id !== selectedState.id));
        setSelectedState(null);
        setFeedback(null);
        setScore(s => s + 1);
      }, 1500);
    } else {
      setFeedback({ type: 'wrong', text: 'Salah! Cuba lagi.' });
      setTimeout(() => {
        setFeedback(null);
      }, 1500);
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-slate-50 relative overflow-hidden select-none">
      <header className="w-full p-4 flex justify-between items-center z-10 shrink-0">
        <div className="bg-white px-4 py-2 rounded-full shadow-sm border border-slate-200">
          <h1 className="text-sm md:text-xl font-bold text-slate-800 flex items-center gap-2">
            <Compass className="w-5 h-5 text-indigo-500" />
            Level 4: Institusi Raja
          </h1>
        </div>
        <div className="bg-white px-4 py-2 rounded-full shadow-sm border border-slate-200 flex items-center gap-2">
          <Trophy className="w-4 h-4 text-yellow-600" />
          <span className="text-base md:text-xl font-bold text-slate-800">{score} / {L4_STATES.length}</span>
        </div>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="relative w-[280px] h-[280px] md:w-[360px] md:h-[360px] mb-8">
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20 w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-t-[25px] border-t-slate-800 drop-shadow-md"></div>
          
          <svg
            viewBox="-100 -100 200 200"
            className="w-full h-full rounded-full drop-shadow-2xl bg-white"
            style={{ transform: `rotate(${rotation}deg)`, transition: 'transform 3s cubic-bezier(0.25, 0.1, 0.25, 1)' }}
          >
            {statesRemaining.length === 0 ? null : statesRemaining.length === 1 ? (
              <g>
                <circle cx="0" cy="0" r="100" fill={statesRemaining[0].color} stroke="#fff" strokeWidth="2" />
                <text transform="translate(0, -50) rotate(-90)" textAnchor="middle" alignmentBaseline="middle" fill="#000" fontSize="12" fontWeight="bold">
                  {statesRemaining[0].name}
                </text>
              </g>
            ) : (
              statesRemaining.map((state, i) => {
                const angle = 360 / statesRemaining.length;
                return (
                  <g key={state.id} transform={`rotate(${i * angle})`}>
                    <path d={getSlicePath(angle, 100)} fill={state.color} stroke="#fff" strokeWidth="1" />
                    <text transform="translate(0, -60) rotate(-90)" textAnchor="middle" alignmentBaseline="middle" fill="#000" fontSize={angle < 25 ? "5.5" : "7"} fontWeight="bold">
                      {state.name}
                    </text>
                  </g>
                );
              })
            )}
          </svg>

          <button onClick={spinWheel} disabled={isSpinning || !!selectedState || statesRemaining.length === 0} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 md:w-20 md:h-20 bg-white rounded-full font-black text-slate-800 border-4 border-slate-200 shadow-[0_0_15px_rgba(0,0,0,0.2)] hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 z-10 flex items-center justify-center transition-transform">
            SPIN
          </button>
        </div>

        <div className="h-24 flex flex-col items-center justify-center">
          {selectedState ? (
            <div className="bg-white px-6 py-3 rounded-2xl shadow-lg text-center animate-in fade-in slide-in-from-bottom-4 duration-300 border-2 border-indigo-100">
              <p className="text-slate-500 text-sm md:text-base font-semibold mb-1">Negeri Terpilih:</p>
              <h2 className="text-2xl md:text-3xl font-black text-slate-800" style={{ color: selectedState.color }}>{selectedState.name}</h2>
            </div>
          ) : isSpinning ? (
            <p className="text-xl font-bold text-slate-400 animate-pulse">Roda sedang berputar...</p>
          ) : statesRemaining.length > 0 ? (
            <p className="text-xl font-bold text-slate-500">Tekan SPIN untuk mula!</p>
          ) : (
             <p className="text-xl font-bold text-green-600">Hebat! Semua negeri telah dijawab.</p>
          )}

          {feedback && (
            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-8 py-4 rounded-full shadow-2xl font-black text-2xl flex items-center gap-3 z-50 animate-bounce ${feedback.type === 'correct' ? 'bg-green-500 text-white border-4 border-green-300' : 'bg-red-500 text-white border-4 border-red-300'}`}>
              {feedback.type === 'correct' ? <CheckCircle2 size={32} /> : <XCircle size={32} />}
              {feedback.text}
            </div>
          )}
        </div>
      </div>

      <div className="shrink-0 bg-white border-t-4 border-slate-200 p-4 md:p-6 shadow-[0_-10px_20px_rgba(0,0,0,0.05)] z-20">
        <p className="text-center text-slate-600 font-bold mb-4 text-sm md:text-base">Pilih gelaran Ketua Negeri yang betul untuk negeri di atas:</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 max-w-4xl mx-auto">
          {HEAD_TITLES.map(title => (
            <button key={title.id} onClick={() => handleBuzzer(title.id)} disabled={!selectedState || !!feedback} className={`relative flex items-center justify-center h-16 md:h-20 rounded-xl font-bold text-xs md:text-base text-center px-2 ${title.color} ${title.text} border-b-8 ${title.shadow} active:border-b-0 active:translate-y-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${selectedState && !feedback ? 'hover:brightness-110 hover:shadow-lg' : ''}`}>
              {title.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// LEVEL 5 COMPONENT (CATCH Bunga Raya)
// ============================================================================
function Level5({ onComplete }) {
  const [score, setScore] = useState(0);
  const [basketX, setBasketX] = useState(0);
  const [activeFlowers, setActiveFlowers] = useState([]);
  const [bigRedX, setBigRedX] = useState(false);
  const [flashGreen, setFlashGreen] = useState(false);

  const containerRef = useRef(null);
  const gameLoopRef = useRef(null);
  const startTime = useRef(Date.now());
  const hasCompleted = useRef(false);
  
  const targetScore = 5;

  useEffect(() => {
    if (containerRef.current) {
      setBasketX(containerRef.current.offsetWidth / 2);
    }
  }, []);

  useEffect(() => {
    if (score >= targetScore) {
      if (!hasCompleted.current) {
        hasCompleted.current = true;
        const elapsed = Math.floor((Date.now() - startTime.current) / 1000);
        clearInterval(gameLoopRef.current);
        setTimeout(() => onComplete(elapsed), 1000);
      }
      return;
    }

    gameLoopRef.current = setInterval(() => {
      setActiveFlowers((prev) => {
        let needsUpdate = false;
        const newFlowers = [];

        if (Math.random() < 0.015 && prev.length < 4) {
          const containerWidth = containerRef.current?.offsetWidth || window.innerWidth;
          const randomX = 40 + Math.random() * (containerWidth - 80); 
          const randomFlower = FLOWERS[Math.floor(Math.random() * FLOWERS.length)];
          newFlowers.push({
            ...randomFlower,
            id: `flower-${Date.now()}-${Math.random()}`,
            x: randomX, y: -50
          });
          needsUpdate = true;
        }

        const containerHeight = containerRef.current?.offsetHeight || window.innerHeight;
        const catchY = containerHeight - 120;

        for (const f of prev) {
          const newY = f.y + 4;
          const isCaught = newY >= catchY && newY <= catchY + 20 && Math.abs(f.x - basketX) < 75;

          if (isCaught) {
            needsUpdate = true;
            if (f.isTarget) {
              setScore(s => s + 1);
              setFlashGreen(true); setTimeout(() => setFlashGreen(false), 300);
            } else {
              setBigRedX(true); setTimeout(() => setBigRedX(false), 800);
            }
            continue; 
          }

          if (newY < containerHeight + 50) {
            newFlowers.push({ ...f, y: newY });
            if (newY !== f.y) needsUpdate = true;
          } else { needsUpdate = true; }
        }

        return needsUpdate ? newFlowers : prev;
      });
    }, 20);

    return () => clearInterval(gameLoopRef.current);
  }, [score, basketX, targetScore, onComplete]);

  const handleMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    let clientX = (e.touches && e.touches.length > 0) ? e.touches[0].clientX : e.clientX;
    let newX = clientX - rect.left;
    newX = Math.max(75, Math.min(newX, rect.width - 75)); 
    setBasketX(newX);
  };

  return (
    <div className="w-full h-full flex flex-col bg-emerald-50 relative overflow-hidden select-none touch-none" ref={containerRef} onPointerMove={handleMove} onTouchMove={handleMove}>
      <header className="w-full p-4 flex justify-between items-center z-10 shrink-0 pointer-events-none">
        <div className="bg-white/90 backdrop-blur px-4 py-2 rounded-full shadow-sm border border-emerald-200">
          <h1 className="text-sm md:text-xl font-bold text-emerald-900 flex items-center gap-2"><Flower className="w-5 h-5 text-rose-500" />Level 5: Bunga Kebangsaan</h1>
        </div>
        <div className={`bg-white/90 backdrop-blur px-4 py-2 rounded-full shadow-sm border-2 flex items-center gap-2 transition-colors duration-300 ${flashGreen ? 'border-green-500 bg-green-100' : 'border-emerald-200'}`}>
          <Trophy className="w-4 h-4 text-yellow-600" />
          <span className="text-base md:text-xl font-bold text-emerald-900">{score} / {targetScore}</span>
        </div>
      </header>

      <div className="absolute top-20 left-1/2 -translate-x-1/2 text-center pointer-events-none z-10 w-full animate-out fade-out delay-[3000ms] duration-1000 fill-mode-forwards">
        <div className="bg-emerald-900/80 text-white px-6 py-3 rounded-full inline-block backdrop-blur-md shadow-lg">
          <p className="font-bold text-sm md:text-lg">Gerakkan bakul untuk tangkap Bunga Raya!</p>
        </div>
      </div>

      <div className="absolute inset-0 z-20 pointer-events-none">
        {activeFlowers.map(f => (
          <div key={f.id} className="absolute w-12 h-12 md:w-16 md:h-16 flex items-center justify-center" style={{ transform: `translate(${f.x - 32}px, ${f.y - 32}px) rotate(${f.y % 360}deg)` }}>
             <f.Icon />
          </div>
        ))}
      </div>

      <div className="absolute bottom-4 z-30 pointer-events-none w-32 h-24 md:w-40 md:h-32 transition-transform duration-75 ease-out" style={{ transform: `translateX(${basketX - 80}px)` }}>
        <IconCatBasket />
        {bigRedX && (
          <div className="absolute inset-0 flex items-center justify-center -top-16 z-50 animate-in zoom-in fade-in duration-200">
            <XCircle className="w-24 h-24 text-red-600 drop-shadow-[0_0_15px_rgba(220,38,38,0.8)] fill-white/90" strokeWidth={2.5} />
          </div>
        )}
      </div>

      <div className="absolute bottom-0 w-full h-8 bg-emerald-600/20 rounded-t-[50%] blur-sm pointer-events-none"></div>
    </div>
  );
}

// ============================================================================
// MAIN APP COMPONENT (ROUTER)
// ============================================================================
export default function App() {
  const [view, setView] = useState('start'); 
  const [unlockedLevel, setUnlockedLevel] = useState(1);
  const [levelTimes, setLevelTimes] = useState({ l1: 0, l2: 0, l3: 0, l4: 0, l5: 0 });

  return (
    <div className="w-full h-screen overflow-hidden font-sans bg-stone-100">
      
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Pirata+One&display=swap');
      `}} />

      {/* --- MAIN MENU --- */}
      {view === 'start' && (
        <div className="w-full h-full flex flex-col items-center justify-center bg-[#e7d5b3] relative p-6 overflow-hidden">
          
          <div className="absolute inset-0 opacity-10 pointer-events-none mix-blend-multiply" style={{ backgroundImage: 'radial-gradient(#78350f 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
          
          <div className="absolute top-[-5%] left-[-10%] w-64 md:w-96"><IconAwanLarat /></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-64 md:w-96 transform rotate-180"><IconAwanLarat /></div>
          <div className="absolute top-10 right-10 w-32 md:w-48 transform -rotate-12"><IconPucukRebung /></div>
          <div className="absolute bottom-20 left-10 w-32 md:w-48 transform rotate-12"><IconPucukRebung /></div>

          <div className="absolute top-[35%] left-[5%] w-24 md:w-32 transform -rotate-45"><IconAbstractKeris /></div>
          <div className="absolute top-[45%] right-[8%] w-20 md:w-28 transform rotate-12"><IconAbstractPerisai /></div>
          <div className="absolute top-[15%] left-[20%] w-24 md:w-32 transform -rotate-12"><IconAbstractWau /></div>
          <div className="absolute bottom-[25%] right-[15%] w-20 md:w-28 transform rotate-12"><IconAbstractGong /></div>

          <div className="text-center mb-8 md:mb-12 relative z-10 flex flex-col items-center">
            <div className="flex justify-center items-center -space-x-4">
              <LetterScroll letter="S" />
              <div className="flex flex-col text-left pl-6 mt-4">
                 <h1 className="text-4xl md:text-5xl font-serif font-black text-amber-950 uppercase tracking-widest leading-none drop-shadow-md">ejarah</h1>
              </div>
            </div>
            
            <div className="flex justify-center items-center -space-x-4 mt-2">
              <LetterScroll letter="Q" />
              <div className="flex flex-col text-left pl-6 mt-4">
                 <h1 className="text-4xl md:text-5xl font-serif font-black text-amber-900 uppercase tracking-widest leading-none drop-shadow-md">uest</h1>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 md:gap-6 w-full max-w-lg relative z-10 px-2">
            <button onClick={() => setView('maklumat')} className="col-span-1 w-full py-3 md:py-4 bg-[#fef3c7] hover:bg-[#fde68a] border-4 border-[#92400e] text-[#78350f] font-black text-base md:text-xl rounded-full shadow-[4px_4px_0_#451a03] hover:translate-y-1 hover:shadow-[2px_2px_0_#451a03] transition-all uppercase tracking-wider">
              Maklumat
            </button>
            <button onClick={() => setView('l1')} className="col-span-1 w-full py-3 md:py-4 bg-[#fef3c7] hover:bg-[#fde68a] border-4 border-[#92400e] text-[#78350f] font-black text-base md:text-xl rounded-full shadow-[4px_4px_0_#451a03] hover:translate-y-1 hover:shadow-[2px_2px_0_#451a03] transition-all uppercase tracking-wider">
              Level 1
            </button>
            <button onClick={() => setView('l2')} disabled={unlockedLevel < 2} className={`col-span-1 w-full py-3 md:py-4 border-4 rounded-full shadow-[4px_4px_0_#451a03] transition-all uppercase tracking-wider font-black text-base md:text-xl flex items-center justify-center gap-2 ${unlockedLevel >= 2 ? 'bg-[#fef3c7] hover:bg-[#fde68a] border-[#92400e] text-[#78350f] hover:translate-y-1 hover:shadow-[2px_2px_0_#451a03]' : 'bg-[#d6d3d1] border-[#a8a29e] text-[#78716c] cursor-not-allowed opacity-80'}`}>
              {unlockedLevel < 2 && <Lock size={18} strokeWidth={3} />} Level 2
            </button>
            <button onClick={() => setView('l3')} disabled={unlockedLevel < 3} className={`col-span-1 w-full py-3 md:py-4 border-4 rounded-full shadow-[4px_4px_0_#451a03] transition-all uppercase tracking-wider font-black text-base md:text-xl flex items-center justify-center gap-2 ${unlockedLevel >= 3 ? 'bg-[#fef3c7] hover:bg-[#fde68a] border-[#92400e] text-[#78350f] hover:translate-y-1 hover:shadow-[2px_2px_0_#451a03]' : 'bg-[#d6d3d1] border-[#a8a29e] text-[#78716c] cursor-not-allowed opacity-80'}`}>
              {unlockedLevel < 3 && <Lock size={18} strokeWidth={3} />} Level 3
            </button>
            <button onClick={() => setView('l4')} disabled={unlockedLevel < 4} className={`col-span-1 w-full py-3 md:py-4 border-4 rounded-full shadow-[4px_4px_0_#451a03] transition-all uppercase tracking-wider font-black text-base md:text-xl flex items-center justify-center gap-2 ${unlockedLevel >= 4 ? 'bg-[#fef3c7] hover:bg-[#fde68a] border-[#92400e] text-[#78350f] hover:translate-y-1 hover:shadow-[2px_2px_0_#451a03]' : 'bg-[#d6d3d1] border-[#a8a29e] text-[#78716c] cursor-not-allowed opacity-80'}`}>
              {unlockedLevel < 4 && <Lock size={18} strokeWidth={3} />} Level 4
            </button>
            <button onClick={() => setView('l5')} disabled={unlockedLevel < 5} className={`col-span-1 w-full py-3 md:py-4 border-4 rounded-full shadow-[4px_4px_0_#451a03] transition-all uppercase tracking-wider font-black text-base md:text-xl flex items-center justify-center gap-2 ${unlockedLevel >= 5 ? 'bg-[#fef3c7] hover:bg-[#fde68a] border-[#92400e] text-[#78350f] hover:translate-y-1 hover:shadow-[2px_2px_0_#451a03]' : 'bg-[#d6d3d1] border-[#a8a29e] text-[#78716c] cursor-not-allowed opacity-80'}`}>
              {unlockedLevel < 5 && <Lock size={18} strokeWidth={3} />} Level 5
            </button>
          </div>
        </div>
      )}

      {/* --- MAKLUMAT PAGE --- */}
      {view === 'maklumat' && (
        <div className="w-full h-full flex flex-col items-center justify-center bg-[#e7d5b3] relative p-4 md:p-6 overflow-hidden">
          <div className="absolute inset-0 opacity-10 pointer-events-none mix-blend-multiply" style={{ backgroundImage: 'radial-gradient(#78350f 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-64 md:w-96 opacity-10 pointer-events-none transform rotate-12"><IconAbstractWau /></div>
          <div className="absolute top-[-10%] left-[-10%] w-64 md:w-96 opacity-10 pointer-events-none transform -rotate-12"><IconAwanLarat /></div>
          
          <div className="relative w-full max-w-3xl bg-[#fdf5e6] border-x-8 border-[#8b4513] p-8 md:p-14 shadow-2xl mx-4 my-8 animate-in zoom-in-95 duration-500">
            <div className="absolute -top-6 left-[-16px] right-[-16px] h-10 md:h-12 bg-[#d2b48c] border-4 border-[#8b4513] rounded-full shadow-lg flex items-center justify-between px-2">
               <div className="w-6 h-6 rounded-full bg-[#8b4513]"></div><div className="w-6 h-6 rounded-full bg-[#8b4513]"></div>
            </div>
            <div className="absolute -bottom-6 left-[-16px] right-[-16px] h-10 md:h-12 bg-[#d2b48c] border-4 border-[#8b4513] rounded-full shadow-lg flex items-center justify-between px-2">
               <div className="w-6 h-6 rounded-full bg-[#8b4513]"></div><div className="w-6 h-6 rounded-full bg-[#8b4513]"></div>
            </div>
            
            <div className="flex justify-center mb-8 relative z-10">
              <h2 className="text-4xl md:text-6xl font-serif font-black text-[#5c2a0d] border-b-4 border-[#8b4513]/30 pb-4 inline-flex items-center gap-4 drop-shadow-sm">
                MAKLUMAT
              </h2>
            </div>
            <p className="text-lg md:text-2xl text-[#4a2e1b] leading-relaxed font-serif font-semibold mb-8 text-justify md:text-center px-2 md:px-8 relative z-10">
              <span className="font-black text-2xl md:text-3xl text-[#8b4513]">Sejarah Quest</span> adalah satu permainan bagi meningkatkan kemahiran pemain dalam mata pelajaran Sejarah Tahun 5. Permainan ini boleh diulang sehingga pemain menguasai sepenuhnya topik yang ditonjolkan.
            </p>
            <div className="bg-[#f5deb3]/50 rounded-xl p-4 md:p-6 mb-8 border border-[#deb887] relative z-10">
              <p className="text-base md:text-xl text-[#5c2a0d] italic font-serif text-center">
                Permainan ini dicipta oleh <br className="md:hidden" /><span className="text-[#8b4513] not-italic font-bold">Dhiya Mohamed Ariff</span> dan <span className="text-[#8b4513] not-italic font-bold">Ishaa Mohamed Ariff</span>.
              </p>
            </div>
            <div className="flex justify-center relative z-10">
              <button onClick={() => setView('start')} className="px-10 py-3 md:py-4 bg-[#8b4513] hover:bg-[#5c2a0d] text-amber-50 rounded-full font-bold text-xl md:text-2xl shadow-[0_5px_0_#451a03] transition-all hover:translate-y-1 hover:shadow-[0_2px_0_#451a03]">
                Kembali
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- ROUTING LEVELS --- */}
      {view === 'l1' && <Level1 onComplete={(time) => {
        setLevelTimes(prev => ({ ...prev, l1: time }));
        setUnlockedLevel(prev => Math.max(prev, 2));
        setView('l1_end');
      }} />}
      {view === 'l1_end' && (
        <div className="w-full h-full flex flex-col items-center justify-center bg-sky-900 z-50 text-white p-6 text-center">
          <Trophy className="w-32 h-32 text-yellow-400 mb-6 drop-shadow-lg animate-bounce" />
          <h1 className="text-5xl font-bold mb-4">Tahniah!</h1>
          <p className="text-2xl mb-8">Anda berjaya tamatkan Level 1.</p>
          <div className="flex flex-col gap-4">
            <button onClick={() => setView('l2')} className="flex items-center justify-center gap-3 px-8 py-4 bg-amber-500 hover:bg-amber-400 text-white rounded-full text-xl font-bold shadow-xl hover:scale-105 transition-transform">
              Teruskan ke Level 2 <ArrowRight strokeWidth={3} />
            </button>
            <button onClick={() => setView('start')} className="text-sky-300 underline font-semibold mt-4">Kembali ke Menu Utama</button>
          </div>
        </div>
      )}

      {view === 'l2' && <Level2 onComplete={(time) => {
        setLevelTimes(prev => ({ ...prev, l2: time }));
        setUnlockedLevel(prev => Math.max(prev, 3));
        setView('l2_end');
      }} />}
      {view === 'l2_end' && (
        <div className="w-full h-full flex flex-col items-center justify-center bg-amber-900 z-50 text-white p-6 text-center">
          <Crown className="w-32 h-32 text-yellow-400 mb-6 drop-shadow-lg animate-bounce" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-amber-100">Hebat!</h1>
          <p className="text-xl md:text-2xl mb-8 text-amber-200">Anda mengenali semua Alat Kebesaran Diraja.</p>
          <div className="flex flex-col gap-4">
            <button onClick={() => setView('l3')} className="flex items-center justify-center gap-3 px-8 py-4 bg-red-600 hover:bg-red-500 text-white rounded-full text-xl font-bold shadow-xl hover:scale-105 transition-transform">
              Teruskan ke Level 3 <ArrowRight strokeWidth={3} />
            </button>
            <button onClick={() => setView('start')} className="text-amber-300 underline font-semibold mt-4">Kembali ke Menu Utama</button>
          </div>
        </div>
      )}

      {view === 'l3' && <Level3 onComplete={(time) => {
        setLevelTimes(prev => ({ ...prev, l3: time }));
        setUnlockedLevel(prev => Math.max(prev, 4));
        setView('l3_end');
      }} />}
      {view === 'l3_end' && (
        <div className="w-full h-full flex flex-col items-center justify-center bg-red-900 z-50 text-white p-6 text-center">
          <Trophy className="w-32 h-32 text-yellow-400 mb-6 drop-shadow-lg animate-bounce" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-red-100">Syabas!</h1>
          <p className="text-xl md:text-2xl mb-8 text-red-200">Anda telah melengkapkan Jata Negara Malaysia.</p>
          <div className="flex flex-col gap-4">
            <button onClick={() => setView('l4')} className="flex items-center justify-center gap-3 px-8 py-4 bg-indigo-500 hover:bg-indigo-400 text-white rounded-full text-xl font-bold shadow-xl hover:scale-105 transition-transform">
              Teruskan ke Level 4 <ArrowRight strokeWidth={3} />
            </button>
            <button onClick={() => setView('start')} className="text-red-300 underline font-semibold mt-4">Kembali ke Menu Utama</button>
          </div>
        </div>
      )}

      {view === 'l4' && <Level4 onComplete={(time) => {
        setLevelTimes(prev => ({ ...prev, l4: time }));
        setUnlockedLevel(prev => Math.max(prev, 5));
        setView('l4_end');
      }} />}
      {view === 'l4_end' && (
        <div className="w-full h-full flex flex-col items-center justify-center bg-indigo-900 z-50 text-white p-6 text-center">
          <Compass className="w-32 h-32 text-yellow-400 mb-6 drop-shadow-lg animate-bounce" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-indigo-100">Cemerlang!</h1>
          <p className="text-xl md:text-2xl mb-8 text-indigo-200">Anda pakar tentang Institusi Raja di Malaysia.</p>
          <div className="flex flex-col gap-4">
            <button onClick={() => setView('l5')} className="flex items-center justify-center gap-3 px-8 py-4 bg-pink-500 hover:bg-pink-400 text-white rounded-full text-xl font-bold shadow-xl hover:scale-105 transition-transform">
              Teruskan ke Level 5 <ArrowRight strokeWidth={3} />
            </button>
            <button onClick={() => setView('start')} className="text-indigo-300 underline font-semibold mt-4">Kembali ke Menu Utama</button>
          </div>
        </div>
      )}

      {view === 'l5' && <Level5 onComplete={(time) => {
        setLevelTimes(prev => ({ ...prev, l5: time }));
        setView('pencapaian');
      }} />}

      {/* --- PENCAPAIAN PAGE --- */}
      {view === 'pencapaian' && (
        <div className="w-full h-full flex flex-col items-center justify-center bg-[#e7d5b3] relative p-4 md:p-6 overflow-hidden">
          <div className="absolute inset-0 opacity-10 pointer-events-none mix-blend-multiply" style={{ backgroundImage: 'radial-gradient(#78350f 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
          <div className="absolute top-10 right-10 w-32 md:w-48 transform -rotate-12"><IconPucukRebung /></div>
          <div className="absolute bottom-20 left-10 w-32 md:w-48 transform rotate-12"><IconPucukRebung /></div>

          <div className="relative w-full max-w-2xl bg-[#fdf5e6] border-x-8 border-[#8b4513] p-8 md:p-12 shadow-2xl mx-4 my-8 animate-in slide-in-from-bottom duration-700">
            <div className="absolute -top-6 left-[-16px] right-[-16px] h-10 md:h-12 bg-[#d2b48c] border-4 border-[#8b4513] rounded-full shadow-lg flex items-center justify-between px-2">
               <div className="w-6 h-6 rounded-full bg-[#8b4513]"></div><div className="w-6 h-6 rounded-full bg-[#8b4513]"></div>
            </div>
            <div className="absolute -bottom-6 left-[-16px] right-[-16px] h-10 md:h-12 bg-[#d2b48c] border-4 border-[#8b4513] rounded-full shadow-lg flex items-center justify-between px-2">
               <div className="w-6 h-6 rounded-full bg-[#8b4513]"></div><div className="w-6 h-6 rounded-full bg-[#8b4513]"></div>
            </div>
            
            <div className="flex flex-col items-center text-center relative z-10">
              <Trophy className="w-20 h-20 md:w-24 md:h-24 text-yellow-500 drop-shadow-md mb-4 animate-bounce" />
              <h1 className="text-3xl md:text-5xl font-serif font-black text-[#5c2a0d] uppercase tracking-widest drop-shadow-sm mb-1 leading-tight">
                CONGRATULATIONS!!
              </h1>
              <h2 className="text-xl md:text-2xl font-serif font-bold text-[#8b4513] mb-8 border-b-4 border-[#8b4513]/30 pb-2">
                Pencapaian
              </h2>
              
              <div className="flex flex-col gap-3 w-full max-w-sm font-black text-xl md:text-2xl text-[#4a2e1b] tracking-wider mb-10">
                {[1, 2, 3, 4, 5].map((lvl) => (
                  <div key={`lvl-${lvl}`} className="flex justify-between items-center border-b-2 border-[#8b4513]/20 pb-2 px-4 bg-[#f5deb3]/30 rounded-lg pt-2 hover:bg-[#f5deb3]/50 transition-colors">
                    <span>LEVEL {lvl}</span>
                    <span className="text-[#8b4513] drop-shadow-sm">{formatTime(levelTimes[`l${lvl}`] || 0)}</span>
                  </div>
                ))}
              </div>
              
              <button onClick={() => setView('start')} className="px-10 py-3 md:py-4 bg-[#8b4513] hover:bg-[#5c2a0d] text-amber-50 rounded-full font-bold text-xl md:text-2xl shadow-[0_5px_0_#451a03] transition-all hover:translate-y-1 hover:shadow-[0_2px_0_#451a03]">
                Kembali
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}