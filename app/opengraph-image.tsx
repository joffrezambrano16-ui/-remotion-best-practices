import { ImageResponse } from 'next/og'

export const alt = 'FruitsIsland · Fruta tropical premium'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

// Imagen que se muestra al compartir la tienda en WhatsApp, Facebook, etc.
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', background: 'linear-gradient(135deg, #FFF3CF 0%, #FFE6DD 55%, #E4F4E8 100%)', padding: 80, alignItems: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          <div style={{ fontSize: 110, fontWeight: 800, color: '#1E6B38', display: 'flex' }}>
            Fruits<span style={{ color: '#FF7A59' }}>Island</span>
          </div>
          <div style={{ fontSize: 44, color: '#1F2A24', marginTop: 20 }}>La isla llega a tu mesa</div>
          <div style={{ fontSize: 30, color: '#1F2A24', opacity: 0.7, marginTop: 16 }}>Fruta tropical premium · Cajas de regalo · Club de fruta</div>
        </div>
        <div style={{ display: 'flex', position: 'relative', width: 280, height: 300 }}>
          <div style={{ position: 'absolute', left: 150, top: 0, width: 110, height: 60, borderRadius: '0 100px 0 100px', background: '#2F8F4E' }} />
          <div style={{ position: 'absolute', left: 20, top: 40, width: 240, height: 260, borderRadius: 999, background: 'linear-gradient(135deg, #FFE066 0%, #FFB13B 50%, #FF7A59 100%)' }} />
        </div>
      </div>
    ),
    size,
  )
}
