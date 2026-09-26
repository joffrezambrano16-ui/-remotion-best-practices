import { NextResponse } from 'next/server'
import { findCoupon } from '@/lib/coupons'

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}))
  const coupon = findCoupon(typeof body.code === 'string' ? body.code.slice(0, 40) : '')
  if (!coupon) return NextResponse.json({ error: 'Cupón no válido' }, { status: 404 })
  return NextResponse.json({ coupon })
}
