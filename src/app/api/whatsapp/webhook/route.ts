import { NextRequest, NextResponse } from 'next/server'

// Stub for WhatsApp Business Cloud API webhook
// Configure this URL in Meta Business Manager after you have API access

export async function GET(request: NextRequest) {
  // Verification challenge from Meta
  const mode = request.nextUrl.searchParams.get('hub.mode')
  const token = request.nextUrl.searchParams.get('hub.verify_token')
  const challenge = request.nextUrl.searchParams.get('hub.challenge')

  const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN || 'dev-ai-studio-verify'

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    return new NextResponse(challenge, { status: 200 })
  }

  return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('WhatsApp webhook received:', JSON.stringify(body, null, 2))

    // TODO: parse messages, reply via WhatsApp Cloud API, or log to leads table
    // Example structure from Meta:
    // body.entry[0].changes[0].value.messages[0]

    return NextResponse.json({ status: 'received' }, { status: 200 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Bad request' }, { status: 400 })
  }
}
