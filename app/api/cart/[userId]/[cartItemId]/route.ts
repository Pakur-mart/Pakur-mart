import { NextResponse } from "next/server"
import { FirebaseCartService } from "@/lib/firebase-cart-service"

export const dynamic = 'force-dynamic'

export async function PUT(req: Request, { params }: { params: { userId: string, cartItemId: string } }) {
  const { userId, cartItemId } = params

  if (!userId || !cartItemId) {
    return NextResponse.json({ message: "Invalid parameters" }, { status: 400 })
  }

  try {
    const { quantity } = await req.json()
    if (typeof quantity !== "number") {
      return NextResponse.json({ message: "Quantity must be a number" }, { status: 400 })
    }
    const updatedCart = await FirebaseCartService.updateItem(userId, cartItemId, quantity)
    return NextResponse.json(updatedCart)
  } catch (err) {
    return NextResponse.json({ message: "Failed to update cart item" }, { status: 500 })
  }
}

export async function DELETE(_req: Request, { params }: { params: { userId: string, cartItemId: string } }) {
  const { userId, cartItemId } = params

  if (!userId || !cartItemId) {
    return NextResponse.json({ message: "Invalid parameters" }, { status: 400 })
  }

  try {
    const updatedCart = await FirebaseCartService.removeItem(userId, cartItemId)
    return NextResponse.json(updatedCart)
  } catch (err) {
    return NextResponse.json({ message: "Failed to remove cart item" }, { status: 500 })
  }
}
