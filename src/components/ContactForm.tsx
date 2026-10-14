'use client'

import { useState } from 'react'

export function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('loading')
    setMessage('')

    const form = e.currentTarget
    const formData = new FormData(form)

    const payload = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      business: formData.get('business') as string,
      message: formData.get('message') as string,
    }

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) throw new Error('Failed')

      setStatus('success')
      setMessage('Thanks! Your enquiry has been received. I will get back to you soon.')
      form.reset()
    } catch {
      setStatus('error')
      setMessage('Something went wrong. Please try WhatsApp or call instead.')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="contact-form" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '420px' }}>
      <input name="name" type="text" placeholder="Your name" required className="form-input" />
      <input name="email" type="email" placeholder="Email" required className="form-input" />
      <input name="phone" type="tel" placeholder="Phone (optional)" className="form-input" />
      <input name="business" type="text" placeholder="Business type (optional)" className="form-input" />
      <textarea name="message" placeholder="How can I help?" required rows={4} className="form-input" />
      <button type="submit" disabled={status === 'loading'} className="ghost-link underlined">
        {status === 'loading' ? 'Sending…' : 'Send enquiry'}
      </button>
      {message && (
        <p style={{ color: status === 'success' ? '#4ade80' : '#f87171', fontSize: '0.9rem' }}>
          {message}
        </p>
      )}
    </form>
  )
}
