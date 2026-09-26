// Genera las ilustraciones SVG de ejemplo de FruitsIsland en public/images.
// Son imágenes provisionales y originales: cuando tengas fotos reales, colócalas
// en public/images/products y cambia la ruta en data/products.json.
// Uso: node scripts/generate-images.mjs

import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const outDir = join(root, 'public', 'images', 'products')
mkdirSync(outDir, { recursive: true })

const BG = {
  sand: ['#FFF8EC', '#FDEBCB'],
  mango: ['#FFF3CF', '#FFD66B'],
  coral: ['#FFE6DD', '#FFB199'],
  leaf: ['#E4F4E8', '#A8DDB5'],
  lagoon: ['#E2F6F4', '#9FDCD4'],
  lilac: ['#F3E8FB', '#D9C2EE'],
}

let uid = 0
const id = (p) => `${p}${++uid}`

function grad(stops, { x1 = 0.2, y1 = 0.1, x2 = 0.8, y2 = 0.95 } = {}) {
  const gid = id('g')
  const s = stops.map((c, i) => `<stop offset="${(i / (stops.length - 1)).toFixed(2)}" stop-color="${c}"/>`).join('')
  return { gid, def: `<linearGradient id="${gid}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}">${s}</linearGradient>` }
}

function radial(stops) {
  const gid = id('r')
  const s = stops.map((c, i) => `<stop offset="${(i / (stops.length - 1)).toFixed(2)}" stop-color="${c}"/>`).join('')
  return { gid, def: `<radialGradient id="${gid}" cx="0.35" cy="0.3" r="0.8">${s}</radialGradient>` }
}

const shadow = (cx, cy, rx) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${rx * 0.16}" fill="#1f3b2a" opacity="0.12"/>`
const shine = (cx, cy, r) => `<ellipse cx="${cx - r * 0.35}" cy="${cy - r * 0.4}" rx="${r * 0.22}" ry="${r * 0.12}" fill="#fff" opacity="0.45" transform="rotate(-30 ${cx - r * 0.35} ${cy - r * 0.4})"/>`
const leaf = (x, y, s, rot = -30, color = '#2F8F4E') =>
  `<path d="M0 0 C ${s * 0.4} ${-s * 0.5}, ${s * 1.1} ${-s * 0.45}, ${s * 1.4} 0 C ${s * 1.0} ${s * 0.35}, ${s * 0.4} ${s * 0.35}, 0 0 Z" fill="${color}" transform="translate(${x} ${y}) rotate(${rot})"/><path d="M0 0 L ${s * 1.3} 0" stroke="#1E6B38" stroke-width="${s * 0.04}" transform="translate(${x} ${y}) rotate(${rot})" opacity="0.6"/>`

function seeded(n) {
  let x = n
  return () => {
    x = (x * 9301 + 49297) % 233280
    return x / 233280
  }
}

// ---------- Frutas enteras ----------
const fruits = {
  mango(cx, cy, r, defs) {
    const g = grad(['#FFE066', '#FFB13B', '#FF7A59', '#E8503A'])
    defs.push(g.def)
    return `${shadow(cx, cy + r * 0.95, r * 0.9)}<ellipse cx="${cx}" cy="${cy}" rx="${r * 0.82}" ry="${r}" fill="url(#${g.gid})" transform="rotate(-25 ${cx} ${cy})"/>${shine(cx, cy, r)}<path d="M${cx + r * 0.3} ${cy - r * 0.85} q ${r * 0.05} ${-r * 0.2} ${r * 0.18} ${-r * 0.28}" stroke="#6B4A1F" stroke-width="${r * 0.06}" fill="none" stroke-linecap="round"/>${leaf(cx + r * 0.45, cy - r * 1.08, r * 0.55, -20)}`
  },
  pineapple(cx, cy, r, defs) {
    const g = grad(['#FFD54F', '#F4A623', '#C97A12'])
    defs.push(g.def)
    const pid = id('p')
    defs.push(`<pattern id="${pid}" width="${r * 0.28}" height="${r * 0.28}" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="${r * 0.28}" height="${r * 0.28}" fill="none" stroke="#9A5B0B" stroke-width="${r * 0.025}" opacity="0.55"/><circle cx="${r * 0.14}" cy="${r * 0.14}" r="${r * 0.025}" fill="#7A4508" opacity="0.6"/></pattern>`)
    let crown = ''
    for (let i = -3; i <= 3; i++) {
      const h = r * (1.05 - Math.abs(i) * 0.12)
      crown += `<path d="M${cx + i * r * 0.06} ${cy - r * 0.8} Q ${cx + i * r * 0.2} ${cy - r * 0.8 - h * 0.6} ${cx + i * r * 0.32} ${cy - r * 0.8 - h} Q ${cx + i * r * 0.1} ${cy - r * 0.8 - h * 0.5} ${cx + i * r * 0.06 + r * 0.08} ${cy - r * 0.8}" fill="${i % 2 ? '#2F8F4E' : '#3FAE62'}"/>`
    }
    return `${shadow(cx, cy + r * 1.02, r * 0.8)}${crown}<ellipse cx="${cx}" cy="${cy + r * 0.1}" rx="${r * 0.7}" ry="${r * 0.95}" fill="url(#${g.gid})"/><ellipse cx="${cx}" cy="${cy + r * 0.1}" rx="${r * 0.7}" ry="${r * 0.95}" fill="url(#${pid})"/>${shine(cx, cy, r * 0.9)}`
  },
  papaya(cx, cy, r, defs) {
    const g = grad(['#FFC857', '#FF9A3C', '#7DBE5A'], { x1: 0, y1: 0, x2: 1, y2: 1 })
    defs.push(g.def)
    return `${shadow(cx, cy + r * 0.62, r * 1.05)}<ellipse cx="${cx}" cy="${cy}" rx="${r * 1.15}" ry="${r * 0.62}" fill="url(#${g.gid})" transform="rotate(-12 ${cx} ${cy})"/>${shine(cx + r * 0.2, cy + r * 0.1, r * 0.8)}<circle cx="${cx - r * 1.1}" cy="${cy + r * 0.2}" r="${r * 0.06}" fill="#5B7F2B"/>`
  },
  passionfruit(cx, cy, r, defs) {
    const g = radial(['#B36AD8', '#6E2A8E', '#3E1453'])
    defs.push(g.def)
    const rnd = seeded(7)
    let dots = ''
    for (let i = 0; i < 26; i++) {
      const a = rnd() * Math.PI * 2
      const d = rnd() * r * 0.85
      dots += `<circle cx="${cx + Math.cos(a) * d}" cy="${cy + Math.sin(a) * d}" r="${r * 0.025}" fill="#F3D6FF" opacity="0.55"/>`
    }
    return `${shadow(cx, cy + r * 0.98, r * 0.85)}<circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#${g.gid})"/>${dots}${shine(cx, cy, r)}<path d="M${cx} ${cy - r} q ${r * 0.05} ${-r * 0.25} ${-r * 0.1} ${-r * 0.35}" stroke="#3E6B2A" stroke-width="${r * 0.07}" fill="none" stroke-linecap="round"/>`
  },
  coconut(cx, cy, r, defs) {
    const g = radial(['#9BD46E', '#4F9A3A', '#2E6B22'])
    defs.push(g.def)
    return `${shadow(cx, cy + r * 0.98, r * 0.9)}<circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#${g.gid})"/><path d="M${cx} ${cy - r} Q ${cx + r * 0.3} ${cy} ${cx} ${cy + r}" stroke="#2E6B22" stroke-width="${r * 0.03}" fill="none" opacity="0.4"/>${shine(cx, cy, r)}<circle cx="${cx}" cy="${cy - r * 0.93}" r="${r * 0.12}" fill="#7C5A2E"/>`
  },
  dragonfruit(cx, cy, r, defs) {
    const g = grad(['#FF5FA2', '#E3217A', '#B01463'])
    defs.push(g.def)
    let scales = ''
    const pos = [[-0.5, -0.5, -40], [0.45, -0.55, 40], [-0.75, 0.1, -80], [0.72, 0.05, 80], [-0.3, 0.55, -120], [0.35, 0.6, 120], [0, -0.1, 0], [-0.05, 0.85, 180]]
    for (const [dx, dy, rot] of pos) {
      const x = cx + dx * r
      const y = cy + dy * r
      scales += `<path d="M0 ${r * 0.12} Q ${-r * 0.16} 0 0 ${-r * 0.3} Q ${r * 0.16} 0 0 ${r * 0.12} Z" fill="#E3217A" stroke="#fff" stroke-opacity="0.25" transform="translate(${x} ${y}) rotate(${rot})"/><path d="M0 ${-r * 0.3} l 0 ${-r * 0.08}" stroke="#7CC46B" stroke-width="${r * 0.06}" stroke-linecap="round" transform="translate(${x} ${y}) rotate(${rot})"/>`
    }
    return `${shadow(cx, cy + r * 1.05, r * 0.85)}<ellipse cx="${cx}" cy="${cy}" rx="${r * 0.82}" ry="${r}" fill="url(#${g.gid})"/>${scales}${shine(cx, cy, r)}`
  },
  rambutan(cx, cy, r, defs) {
    const g = radial(['#FF6B5A', '#D8322A', '#8E1B16'])
    defs.push(g.def)
    let hair = ''
    for (let i = 0; i < 48; i++) {
      const a = (i / 48) * Math.PI * 2
      const x1 = cx + Math.cos(a) * r * 0.92
      const y1 = cy + Math.sin(a) * r * 0.92
      const x2 = cx + Math.cos(a + 0.12) * r * 1.22
      const y2 = cy + Math.sin(a + 0.12) * r * 1.22
      hair += `<path d="M${x1} ${y1} Q ${(x1 + x2) / 2 + 4} ${(y1 + y2) / 2 - 4} ${x2} ${y2}" stroke="${i % 3 ? '#E0443A' : '#7FBF5A'}" stroke-width="${r * 0.045}" fill="none" stroke-linecap="round"/>`
    }
    return `${shadow(cx, cy + r * 1.15, r * 0.9)}${hair}<circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#${g.gid})"/>${shine(cx, cy, r)}`
  },
  mangosteen(cx, cy, r, defs) {
    const g = radial(['#8E4A8F', '#5A1F4F', '#2E0C28'])
    defs.push(g.def)
    let calyx = ''
    for (let i = 0; i < 5; i++) {
      calyx += `<ellipse cx="${cx}" cy="${cy - r * 0.95}" rx="${r * 0.2}" ry="${r * 0.12}" fill="#4F8F3A" transform="rotate(${i * 72} ${cx} ${cy - r * 0.95}) translate(0 ${-r * 0.12})"/>`
    }
    return `${shadow(cx, cy + r * 0.98, r * 0.85)}<circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#${g.gid})"/>${shine(cx, cy, r)}${calyx}<rect x="${cx - r * 0.04}" y="${cy - r * 1.3}" width="${r * 0.08}" height="${r * 0.25}" rx="${r * 0.04}" fill="#3E6B2A"/>`
  },
  lychee(cx, cy, r, defs) {
    const g = radial(['#FF8A8A', '#E0485A', '#A8203A'])
    defs.push(g.def)
    const pid = id('p')
    defs.push(`<pattern id="${pid}" width="${r * 0.18}" height="${r * 0.18}" patternUnits="userSpaceOnUse"><circle cx="${r * 0.09}" cy="${r * 0.09}" r="${r * 0.05}" fill="#8E1B30" opacity="0.35"/></pattern>`)
    return `${shadow(cx, cy + r * 1.02, r * 0.85)}<ellipse cx="${cx}" cy="${cy}" rx="${r * 0.95}" ry="${r * 1.02}" fill="url(#${g.gid})"/><ellipse cx="${cx}" cy="${cy}" rx="${r * 0.95}" ry="${r * 1.02}" fill="url(#${pid})"/>${shine(cx, cy, r)}<path d="M${cx} ${cy - r} q ${r * 0.1} ${-r * 0.3} ${r * 0.3} ${-r * 0.4}" stroke="#6B4A1F" stroke-width="${r * 0.05}" fill="none"/>`
  },
  starfruit(cx, cy, r, defs) {
    const g = grad(['#FFF07A', '#F5CF2E', '#C9A50E'])
    defs.push(g.def)
    let pts = ''
    for (let i = 0; i < 10; i++) {
      const a = (i / 10) * Math.PI * 2 - Math.PI / 2
      const rr = i % 2 ? r * 0.5 : r
      pts += `${cx + Math.cos(a) * rr},${cy + Math.sin(a) * rr} `
    }
    return `${shadow(cx, cy + r * 1.0, r * 0.8)}<polygon points="${pts}" fill="url(#${g.gid})" stroke="#E0B820" stroke-width="${r * 0.04}" stroke-linejoin="round"/><circle cx="${cx}" cy="${cy}" r="${r * 0.14}" fill="#FFF6B8"/>${[0, 1, 2, 3, 4].map((i) => { const a = (i / 5) * Math.PI * 2 - Math.PI / 2; return `<ellipse cx="${cx + Math.cos(a) * r * 0.28}" cy="${cy + Math.sin(a) * r * 0.28}" rx="${r * 0.05}" ry="${r * 0.08}" fill="#8A6A10" transform="rotate(${(i * 72)} ${cx + Math.cos(a) * r * 0.28} ${cy + Math.sin(a) * r * 0.28})"/>` }).join('')}`
  },
  soursop(cx, cy, r, defs) {
    const g = grad(['#A6D86B', '#5FA83A', '#3A7324'])
    defs.push(g.def)
    const rnd = seeded(3)
    let spikes = ''
    for (let i = 0; i < 40; i++) {
      const a = rnd() * Math.PI * 2
      const d = Math.sqrt(rnd()) * 0.85
      const x = cx + Math.cos(a) * r * 0.75 * d
      const y = cy + Math.sin(a) * r * d
      spikes += `<path d="M${x} ${y} l ${r * 0.04} ${-r * 0.09}" stroke="#2E5E1C" stroke-width="${r * 0.035}" stroke-linecap="round"/>`
    }
    return `${shadow(cx, cy + r * 1.05, r * 0.85)}<path d="M${cx} ${cy - r} C ${cx + r * 0.95} ${cy - r * 0.9}, ${cx + r * 0.9} ${cy + r}, ${cx} ${cy + r} C ${cx - r * 0.9} ${cy + r}, ${cx - r * 0.85} ${cy - r * 0.8}, ${cx} ${cy - r} Z" fill="url(#${g.gid})"/>${spikes}${shine(cx, cy, r)}`
  },
  banana(cx, cy, r, defs) {
    const g = grad(['#FFF07A', '#FFD23F', '#E8B20E'])
    defs.push(g.def)
    const one = (dx, dy, rot) => `<g transform="translate(${dx} ${dy}) rotate(${rot} ${cx} ${cy})"><path d="M${cx - r} ${cy - r * 0.3} C ${cx - r * 0.6} ${cy + r * 0.6}, ${cx + r * 0.6} ${cy + r * 0.6}, ${cx + r} ${cy - r * 0.35} C ${cx + r * 0.5} ${cy + r * 0.2}, ${cx - r * 0.5} ${cy + r * 0.2}, ${cx - r} ${cy - r * 0.3} Z" fill="url(#${g.gid})" stroke="#C99A0A" stroke-width="${r * 0.03}"/><circle cx="${cx + r}" cy="${cy - r * 0.35}" r="${r * 0.06}" fill="#5B4415"/></g>`
    return `${shadow(cx, cy + r * 0.7, r * 1.0)}${one(0, r * 0.2, 8)}${one(0, 0, 0)}${one(0, -r * 0.2, -8)}`
  },
}

// ---------- Frutas cortadas ----------
const cuts = {
  mango(cx, cy, r) {
    let cubes = ''
    for (let i = -2; i <= 2; i++) for (let j = -2; j <= 2; j++) if (i * i + j * j <= 6) cubes += `<rect x="${cx + i * r * 0.26 - r * 0.11}" y="${cy + j * r * 0.26 - r * 0.11}" width="${r * 0.22}" height="${r * 0.22}" rx="${r * 0.05}" fill="${(i + j) % 2 ? '#FFB13B' : '#FFC24D'}"/>`
    return `${shadow(cx, cy + r * 0.9, r * 0.95)}<ellipse cx="${cx}" cy="${cy}" rx="${r * 0.85}" ry="${r * 0.8}" fill="#FF8A3D"/>${cubes}`
  },
  pineapple(cx, cy, r) {
    return `${shadow(cx, cy + r * 0.95, r)}<circle cx="${cx}" cy="${cy}" r="${r}" fill="#E8A21E"/><circle cx="${cx}" cy="${cy}" r="${r * 0.9}" fill="#FFE27A"/><circle cx="${cx}" cy="${cy}" r="${r * 0.2}" fill="#FFF3B0"/>${[...Array(12)].map((_, i) => `<line x1="${cx}" y1="${cy}" x2="${cx + Math.cos((i / 12) * Math.PI * 2) * r * 0.85}" y2="${cy + Math.sin((i / 12) * Math.PI * 2) * r * 0.85}" stroke="#F5C842" stroke-width="${r * 0.03}"/>`).join('')}`
  },
  papaya(cx, cy, r) {
    const rnd = seeded(11)
    let seeds = ''
    for (let i = 0; i < 22; i++) seeds += `<circle cx="${cx + (rnd() - 0.5) * r * 0.9}" cy="${cy + (rnd() - 0.5) * r * 0.35}" r="${r * 0.06}" fill="#1E1E1E"/>`
    return `${shadow(cx, cy + r * 0.6, r * 1.1)}<ellipse cx="${cx}" cy="${cy}" rx="${r * 1.15}" ry="${r * 0.6}" fill="#7DBE5A"/><ellipse cx="${cx}" cy="${cy}" rx="${r * 1.08}" ry="${r * 0.52}" fill="#FF7A59"/><ellipse cx="${cx}" cy="${cy}" rx="${r * 0.6}" ry="${r * 0.24}" fill="#FFB199"/>${seeds}`
  },
  passionfruit(cx, cy, r) {
    const rnd = seeded(5)
    let seeds = ''
    for (let i = 0; i < 30; i++) {
      const a = rnd() * Math.PI * 2
      const d = rnd() * r * 0.7
      seeds += `<circle cx="${cx + Math.cos(a) * d}" cy="${cy + Math.sin(a) * d}" r="${r * 0.07}" fill="#FFC23D" stroke="#3A2A0A" stroke-width="${r * 0.04}"/>`
    }
    return `${shadow(cx, cy + r * 0.95, r)}<circle cx="${cx}" cy="${cy}" r="${r}" fill="#5A1F6E"/><circle cx="${cx}" cy="${cy}" r="${r * 0.9}" fill="#FFF1C9"/><circle cx="${cx}" cy="${cy}" r="${r * 0.8}" fill="#FFCF4A"/>${seeds}`
  },
  coconut(cx, cy, r) {
    return `${shadow(cx, cy + r * 0.95, r)}<circle cx="${cx}" cy="${cy}" r="${r}" fill="#5E3B1C"/><circle cx="${cx}" cy="${cy}" r="${r * 0.88}" fill="#FFFDF7"/><circle cx="${cx}" cy="${cy}" r="${r * 0.6}" fill="#E9F4F7"/>`
  },
  dragonfruit(cx, cy, r) {
    const rnd = seeded(9)
    let seeds = ''
    for (let i = 0; i < 70; i++) {
      const a = rnd() * Math.PI * 2
      const d = Math.sqrt(rnd()) * r * 0.8
      seeds += `<ellipse cx="${cx + Math.cos(a) * d * 0.85}" cy="${cy + Math.sin(a) * d}" rx="${r * 0.02}" ry="${r * 0.03}" fill="#1A1A1A"/>`
    }
    return `${shadow(cx, cy + r * 1.0, r * 0.9)}<ellipse cx="${cx}" cy="${cy}" rx="${r * 0.85}" ry="${r}" fill="#E3217A"/><ellipse cx="${cx}" cy="${cy}" rx="${r * 0.78}" ry="${r * 0.93}" fill="#FBF7F2"/>${seeds}`
  },
  mangosteen(cx, cy, r) {
    let segs = ''
    for (let i = 0; i < 6; i++) segs += `<ellipse cx="${cx}" cy="${cy - r * 0.3}" rx="${r * 0.2}" ry="${r * 0.32}" fill="#FFFFFF" stroke="#EDE6E0" stroke-width="${r * 0.02}" transform="rotate(${i * 60} ${cx} ${cy})"/>`
    return `${shadow(cx, cy + r * 0.95, r)}<circle cx="${cx}" cy="${cy}" r="${r}" fill="#4A1540"/><circle cx="${cx}" cy="${cy}" r="${r * 0.82}" fill="#B0306A"/>${segs}`
  },
  lychee(cx, cy, r) {
    return `${shadow(cx, cy + r * 0.95, r)}<circle cx="${cx}" cy="${cy}" r="${r}" fill="#D8405A"/><circle cx="${cx}" cy="${cy}" r="${r * 0.86}" fill="#F7F3EA"/><ellipse cx="${cx}" cy="${cy}" rx="${r * 0.28}" ry="${r * 0.38}" fill="#6B3E1F"/>`
  },
  soursop(cx, cy, r) {
    const rnd = seeded(13)
    let seeds = ''
    for (let i = 0; i < 14; i++) seeds += `<ellipse cx="${cx + (rnd() - 0.5) * r * 1.1}" cy="${cy + (rnd() - 0.5) * r * 1.3}" rx="${r * 0.05}" ry="${r * 0.08}" fill="#2A1A0E"/>`
    return `${shadow(cx, cy + r * 1.0, r * 0.9)}<ellipse cx="${cx}" cy="${cy}" rx="${r * 0.8}" ry="${r}" fill="#4F8F2E"/><ellipse cx="${cx}" cy="${cy}" rx="${r * 0.72}" ry="${r * 0.92}" fill="#FFFDF5"/>${seeds}`
  },
}
cuts.rambutan = cuts.lychee
cuts.starfruit = (cx, cy, r, defs) => fruits.starfruit(cx, cy, r * 0.8, defs)
cuts.banana = (cx, cy, r) => `${shadow(cx, cy + r * 0.5, r)}${[-1, 0, 1].map((i) => `<circle cx="${cx + i * r * 0.55}" cy="${cy}" r="${r * 0.28}" fill="#FFF3C4" stroke="#F0D060" stroke-width="${r * 0.04}"/>`).join('')}`

// ---------- Objetos ----------
function giftBox(cx, cy, w, color, ribbon, contents, defs) {
  const h = w * 0.55
  const inner = contents.map(([f, dx, dy, s]) => fruits[f](cx + dx * w, cy - h * 0.1 + dy * w, s * w, defs)).join('')
  return `${shadow(cx, cy + h * 0.55, w * 0.62)}<g>${inner}</g><path d="M${cx - w / 2} ${cy} L ${cx + w / 2} ${cy} L ${cx + w * 0.45} ${cy + h * 0.5} L ${cx - w * 0.45} ${cy + h * 0.5} Z" fill="${color}"/><rect x="${cx - w * 0.52}" y="${cy - h * 0.06}" width="${w * 1.04}" height="${h * 0.14}" rx="${h * 0.05}" fill="${color}" stroke="#fff" stroke-opacity="0.35"/><rect x="${cx - w * 0.04}" y="${cy - h * 0.06}" width="${w * 0.08}" height="${h * 0.56}" fill="${ribbon}"/><path d="M${cx} ${cy + h * 0.02} q ${-w * 0.12} ${-h * 0.25} ${-w * 0.16} ${-h * 0.02} q ${w * 0.06} ${h * 0.1} ${w * 0.16} ${h * 0.02} Z M${cx} ${cy + h * 0.02} q ${w * 0.12} ${-h * 0.25} ${w * 0.16} ${-h * 0.02} q ${-w * 0.06} ${h * 0.1} ${-w * 0.16} ${h * 0.02} Z" fill="${ribbon}"/><text x="${cx}" y="${cy + h * 0.36}" text-anchor="middle" font-family="Arial Rounded MT Bold, Nunito, sans-serif" font-weight="700" font-size="${w * 0.07}" fill="#fff" opacity="0.9">FruitsIsland</text>`
}

function pouch(cx, cy, w, color, label, contents, defs) {
  const h = w * 1.25
  const win = contents.map(([f, dx, dy, s]) => fruits[f](cx + dx * w, cy + dy * w, s * w, defs)).join('')
  const cid = id('c')
  defs.push(`<clipPath id="${cid}"><rect x="${cx - w * 0.3}" y="${cy - h * 0.12}" width="${w * 0.6}" height="${h * 0.34}" rx="${w * 0.08}"/></clipPath>`)
  return `${shadow(cx, cy + h * 0.52, w * 0.55)}<path d="M${cx - w / 2} ${cy - h / 2 + w * 0.08} Q ${cx - w / 2} ${cy - h / 2} ${cx - w / 2 + w * 0.08} ${cy - h / 2} L ${cx + w / 2 - w * 0.08} ${cy - h / 2} Q ${cx + w / 2} ${cy - h / 2} ${cx + w / 2} ${cy - h / 2 + w * 0.08} L ${cx + w * 0.54} ${cy + h / 2} L ${cx - w * 0.54} ${cy + h / 2} Z" fill="${color}"/><rect x="${cx - w / 2}" y="${cy - h / 2 + w * 0.05}" width="${w}" height="${w * 0.05}" fill="#fff" opacity="0.4"/><rect x="${cx - w * 0.3}" y="${cy - h * 0.12}" width="${w * 0.6}" height="${h * 0.34}" rx="${w * 0.08}" fill="#FFF8EC"/><g clip-path="url(#${cid})">${win}</g><text x="${cx}" y="${cy - h * 0.25}" text-anchor="middle" font-family="Arial Rounded MT Bold, Nunito, sans-serif" font-weight="700" font-size="${w * 0.1}" fill="#fff">${label}</text><text x="${cx}" y="${cy + h * 0.36}" text-anchor="middle" font-family="Nunito, sans-serif" font-weight="700" font-size="${w * 0.07}" fill="#fff" opacity="0.85">FruitsIsland</text>`
}

function bottle(cx, cy, w, juice, label, defs) {
  const h = w * 2.1
  const g = grad([juice[0], juice[1]], { x1: 0, y1: 0, x2: 0, y2: 1 })
  defs.push(g.def)
  return `${shadow(cx, cy + h / 2, w * 0.6)}<rect x="${cx - w * 0.18}" y="${cy - h / 2 - w * 0.12}" width="${w * 0.36}" height="${w * 0.2}" rx="${w * 0.05}" fill="#2F8F4E"/><path d="M${cx - w * 0.16} ${cy - h / 2 + w * 0.06} L ${cx + w * 0.16} ${cy - h / 2 + w * 0.06} L ${cx + w * 0.16} ${cy - h / 2 + w * 0.3} Q ${cx + w / 2} ${cy - h / 2 + w * 0.45} ${cx + w / 2} ${cy - h / 2 + w * 0.8} L ${cx + w / 2} ${cy + h / 2 - w * 0.08} Q ${cx + w / 2} ${cy + h / 2} ${cx + w / 2 - w * 0.08} ${cy + h / 2} L ${cx - w / 2 + w * 0.08} ${cy + h / 2} Q ${cx - w / 2} ${cy + h / 2} ${cx - w / 2} ${cy + h / 2 - w * 0.08} L ${cx - w / 2} ${cy - h / 2 + w * 0.8} Q ${cx - w / 2} ${cy - h / 2 + w * 0.45} ${cx - w * 0.16} ${cy - h / 2 + w * 0.3} Z" fill="url(#${g.gid})" stroke="#fff" stroke-opacity="0.5" stroke-width="${w * 0.02}"/><rect x="${cx - w / 2}" y="${cy - w * 0.1}" width="${w}" height="${w * 0.6}" fill="#FFF8EC"/><text x="${cx}" y="${cy + w * 0.16}" text-anchor="middle" font-family="Arial Rounded MT Bold, Nunito, sans-serif" font-weight="700" font-size="${w * 0.14}" fill="#2F8F4E">${label}</text><text x="${cx}" y="${cy + w * 0.36}" text-anchor="middle" font-family="Nunito, sans-serif" font-size="${w * 0.09}" fill="#FF7A59">FruitsIsland</text><rect x="${cx + w * 0.3}" y="${cy - h / 2 + w * 0.7}" width="${w * 0.06}" height="${h * 0.3}" rx="${w * 0.03}" fill="#fff" opacity="0.4"/>`
}

function basket(cx, cy, w, contents, defs) {
  const h = w * 0.45
  const inner = contents.map(([f, dx, dy, s]) => fruits[f](cx + dx * w, cy + dy * w, s * w, defs)).join('')
  let weave = ''
  for (let i = 1; i < 4; i++) weave += `<line x1="${cx - w * 0.48 + i * 0.01 * w}" y1="${cy + (h * i) / 4}" x2="${cx + w * 0.48 - i * 0.01 * w}" y2="${cy + (h * i) / 4}" stroke="#A8743A" stroke-width="${w * 0.012}"/>`
  return `${shadow(cx, cy + h * 1.05, w * 0.6)}<path d="M${cx - w * 0.42} ${cy} Q ${cx} ${cy - w * 0.75} ${cx + w * 0.42} ${cy}" stroke="#C48A48" stroke-width="${w * 0.04}" fill="none"/>${inner}<path d="M${cx - w / 2} ${cy} L ${cx + w / 2} ${cy} L ${cx + w * 0.4} ${cy + h} L ${cx - w * 0.4} ${cy + h} Z" fill="#D9A15A"/>${weave}<rect x="${cx - w * 0.52}" y="${cy - w * 0.02}" width="${w * 1.04}" height="${w * 0.06}" rx="${w * 0.03}" fill="#C48A48"/>`
}

// ---------- Composición ----------
function svg(bg, body, { dots = true, label } = {}) {
  const defs = []
  const b = BG[bg]
  const g = grad(b, { x1: 0, y1: 0, x2: 1, y2: 1 })
  defs.push(g.def)
  const content = body(defs)
  let deco = ''
  if (dots) {
    const rnd = seeded(bg.length * 17)
    for (let i = 0; i < 14; i++) deco += `<circle cx="${rnd() * 800}" cy="${rnd() * 800}" r="${4 + rnd() * 10}" fill="#fff" opacity="${0.25 + rnd() * 0.3}"/>`
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" role="img"${label ? ` aria-label="${label}"` : ''}><defs>${defs.join('')}</defs><rect width="800" height="800" fill="url(#${g.gid})"/><circle cx="400" cy="400" r="300" fill="#fff" opacity="0.35"/>${deco}${content}</svg>`
}

const whole = (f, r = 190, y = 400) => (defs) => fruits[f](400, y, r, defs)
const wholeAndCut = (f, r = 150) => (defs) => fruits[f](300, 360, r, defs) + cuts[f](530, 470, r * 0.8, defs)
const trio = (f, r = 110) => (defs) => fruits[f](260, 470, r, defs) + fruits[f](540, 470, r, defs) + fruits[f](400, 320, r, defs)

const images = {}
const add = (name, bg, body, label) => { images[name] = svg(bg, body, { label }) }

const singles = [
  ['mango', 'mango', 'mango'],
  ['pina', 'pineapple', 'leaf'],
  ['papaya', 'papaya', 'coral'],
  ['maracuya', 'passionfruit', 'mango'],
  ['coco', 'coconut', 'lagoon'],
  ['pitahaya', 'dragonfruit', 'leaf'],
  ['rambutan', 'rambutan', 'mango'],
  ['mangostan', 'mangosteen', 'lilac'],
  ['lichi', 'lychee', 'coral'],
  ['carambola', 'starfruit', 'lagoon'],
  ['guanabana', 'soursop', 'sand'],
  ['banano', 'banana', 'leaf'],
]
for (const [name, f, bg] of singles) {
  add(`${name}-1`, bg, whole(f, f === 'papaya' ? 170 : f === 'pineapple' ? 170 : 190, f === 'pineapple' ? 460 : 400))
  add(`${name}-2`, bg === 'sand' ? 'leaf' : 'sand', wholeAndCut(f))
  add(`${name}-3`, bg === 'coral' ? 'lagoon' : 'coral', trio(f, f === 'papaya' ? 90 : 110))
}

add('caja-paraiso-1', 'sand', (d) => giftBox(400, 470, 520, '#2F8F4E', '#FFC23D', [['pineapple', -0.28, -0.16, 0.2], ['mango', 0.02, -0.12, 0.2], ['papaya', 0.3, -0.02, 0.14], ['passionfruit', 0.15, 0.02, 0.1]], d))
add('caja-paraiso-2', 'mango', (d) => fruits.pineapple(250, 420, 130, d) + fruits.mango(470, 380, 110, d) + fruits.papaya(560, 560, 90, d) + fruits.passionfruit(300, 600, 70, d))
add('caja-atardecer-1', 'coral', (d) => giftBox(400, 470, 520, '#FF7A59', '#2F8F4E', [['dragonfruit', -0.25, -0.14, 0.18], ['mangosteen', 0.05, -0.05, 0.14], ['rambutan', 0.3, -0.02, 0.11], ['starfruit', -0.02, -0.25, 0.1]], d))
add('caja-atardecer-2', 'lilac', (d) => fruits.dragonfruit(280, 380, 130, d) + fruits.mangosteen(520, 360, 100, d) + fruits.rambutan(420, 580, 80, d) + fruits.lychee(620, 560, 60, d))
add('caja-mini-1', 'lagoon', (d) => giftBox(400, 480, 440, '#FFC23D', '#FF7A59', [['mango', -0.18, -0.1, 0.2], ['lychee', 0.16, -0.02, 0.13], ['starfruit', 0.02, -0.28, 0.1]], d))
add('caja-mini-2', 'sand', (d) => fruits.mango(330, 400, 140, d) + fruits.lychee(520, 480, 90, d))
add('caja-armala-1', 'leaf', (d) => giftBox(400, 470, 520, '#FFF8EC', '#FF7A59', [['mango', -0.3, -0.1, 0.13], ['lychee', -0.1, -0.05, 0.1], ['passionfruit', 0.08, -0.07, 0.11], ['starfruit', 0.28, -0.08, 0.1]], d).replace(/fill="#fff" opacity="0.9">FruitsIsland/, 'fill="#2F8F4E" opacity="0.9">FruitsIsland'))
add('caja-corporativa-1', 'sand', (d) => giftBox(400, 470, 560, '#1E6B38', '#FFC23D', [['pineapple', -0.3, -0.18, 0.18], ['dragonfruit', -0.05, -0.1, 0.16], ['mango', 0.22, -0.08, 0.16], ['coconut', 0.36, 0.02, 0.1]], d))

add('mango-deshidratado-1', 'mango', (d) => pouch(400, 400, 360, '#FFB13B', 'MANGO', [['mango', 0, 0.02, 0.2]], d))
add('mango-deshidratado-2', 'sand', (d) => [...Array(7)].map((_, i) => `<path d="M0 0 C 40 -60, 120 -50, 150 0 C 110 30, 40 30, 0 0 Z" fill="${i % 2 ? '#FFB13B' : '#FFC857'}" stroke="#E8913A" stroke-width="3" transform="translate(${180 + (i % 3) * 150} ${260 + Math.floor(i / 3) * 140}) rotate(${(i * 37) % 60 - 30})"/>`).join('') + shadow(400, 690, 260))
add('chips-pina-1', 'leaf', (d) => pouch(400, 400, 360, '#2F8F4E', 'PIÑA', [['pineapple', 0, 0.08, 0.16]], d))
add('chips-pina-2', 'mango', (d) => [...Array(6)].map((_, i) => cuts.pineapple(220 + (i % 3) * 180, 320 + Math.floor(i / 3) * 200, 80, d)).join(''))
add('mix-tropical-1', 'coral', (d) => pouch(400, 400, 360, '#FF7A59', 'MIX', [['mango', -0.12, 0.02, 0.1], ['banana', 0.1, 0.04, 0.08], ['coconut', 0.05, -0.05, 0.07]], d))
add('mix-tropical-2', 'sand', (d) => cuts.banana(300, 330, 150, d) + cuts.pineapple(520, 330, 90, d) + cuts.coconut(400, 540, 90, d))
add('jugo-maracuya-1', 'mango', (d) => bottle(400, 420, 230, ['#FFE066', '#FF9A3C'], 'MARACUYÁ', d) + fruits.passionfruit(610, 570, 70, d))
add('jugo-maracuya-2', 'sand', (d) => bottle(300, 420, 180, ['#FFE066', '#FF9A3C'], 'MARACUYÁ', d) + bottle(520, 420, 180, ['#FFD23F', '#FF7A59'], 'MANGO', d))
add('agua-coco-1', 'lagoon', (d) => bottle(400, 420, 230, ['#F4FBF8', '#CDEDE6'], 'COCO', d) + fruits.coconut(610, 580, 70, d))
add('agua-coco-2', 'leaf', (d) => fruits.coconut(300, 420, 150, d) + cuts.coconut(530, 480, 110, d))
add('jugo-verde-1', 'leaf', (d) => bottle(400, 420, 230, ['#C9EF8A', '#5FA83A'], 'ISLA VERDE', d) + fruits.pineapple(620, 570, 60, d))
add('combo-desayuno-1', 'sand', (d) => basket(400, 480, 520, [['banana', -0.18, -0.12, 0.14], ['papaya', 0.12, -0.12, 0.12], ['mango', -0.02, -0.25, 0.12]], d))
add('combo-desayuno-2', 'mango', (d) => cuts.papaya(300, 350, 140, d) + cuts.mango(520, 520, 110, d) + cuts.banana(300, 600, 90, d))
add('combo-smoothie-1', 'coral', (d) => basket(400, 480, 520, [['pineapple', -0.2, -0.2, 0.13], ['mango', 0.05, -0.12, 0.12], ['passionfruit', 0.25, -0.08, 0.09], ['banana', -0.05, -0.02, 0.1]], d))
add('combo-smoothie-2', 'lagoon', (d) => bottle(300, 420, 170, ['#FFB199', '#FF7A59'], 'SMOOTHIE', d) + bottle(510, 420, 170, ['#FFE066', '#FFB13B'], 'SMOOTHIE', d))
add('combo-familiar-1', 'leaf', (d) => basket(400, 490, 560, [['pineapple', -0.28, -0.2, 0.14], ['papaya', 0.1, -0.1, 0.12], ['mango', -0.05, -0.2, 0.11], ['coconut', 0.3, -0.06, 0.09], ['banana', -0.2, -0.02, 0.1]], d))
add('club-1', 'mango', (d) => giftBox(400, 490, 540, '#2F8F4E', '#FF7A59', [['pineapple', -0.3, -0.18, 0.17], ['mango', -0.05, -0.1, 0.15], ['dragonfruit', 0.2, -0.08, 0.14], ['lychee', 0.36, 0.0, 0.08]], d))

// Imagen principal (hero) horizontal
const heroDefs = []
const heroG = grad(['#FFF3CF', '#FFE0C2', '#E4F4E8'], { x1: 0, y1: 0, x2: 1, y2: 1 })
heroDefs.push(heroG.def)
const heroBody = [
  fruits.pineapple(820, 430, 170, heroDefs),
  fruits.mango(1040, 520, 120, heroDefs),
  fruits.dragonfruit(640, 560, 100, heroDefs),
  cuts.papaya(930, 700, 110, heroDefs),
  fruits.passionfruit(1150, 330, 70, heroDefs),
  cuts.passionfruit(560, 330, 60, heroDefs),
  fruits.lychee(1160, 690, 55, heroDefs),
  leaf(460, 160, 160, 20),
  leaf(1330, 60, 160, 150, '#3FAE62'),
  leaf(1390, 860, 150, 200),
].join('')
const hero = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1400 900" role="img" aria-label="Frutas tropicales FruitsIsland"><defs>${heroDefs.join('')}</defs><rect width="1400" height="900" fill="url(#${heroG.gid})"/><circle cx="880" cy="500" r="380" fill="#fff" opacity="0.4"/><circle cx="1180" cy="170" r="90" fill="#FFC23D" opacity="0.5"/>${heroBody}</svg>`

writeFileSync(join(root, 'public', 'images', 'hero.svg'), hero)
for (const [name, content] of Object.entries(images)) writeFileSync(join(outDir, `${name}.svg`), content)

console.log(`Generadas ${Object.keys(images).length + 1} imágenes`)
