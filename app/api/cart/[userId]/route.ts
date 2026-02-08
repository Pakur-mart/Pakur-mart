import { NextResponse } from "next/server"
import { FirebaseCartService } from "@/lib/firebase-cart-service"

export const dynamic = 'force-dynamic'

export async function GET(_req: Request, { params }: { params: { userId: string } }) {
  const { userId } = params

  if (!userId) {
    return NextResponse.json({ message: "Invalid userId" }, { status: 400 })
  }

  try {
    const cart = await FirebaseCartService.getCart(userId)
    return NextResponse.json(cart)
  } catch (err) {
    return NextResponse.json({ message: "Failed to fetch cart" }, { status: 500 })
  }
}

export async function DELETE(_req: Request, { params }: { params: { userId: string } }) {
  const { userId } = params

  if (!userId) {
    return NextResponse.json({ message: "Invalid userId" }, { status: 400 })
  }

  try {
    await FirebaseCartService.clearCart(userId)
    return NextResponse.json({ message: "Cart cleared" })
  } catch (err) {
    return NextResponse.json({ message: "Failed to clear cart" }, { status: 500 })
  }
}
