'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { Poll } from '@/types/database'

type PollShareProps = {
  poll: Poll
}

export default function PollShare({ poll }: PollShareProps) {
  const [copied, setCopied] = useState(false)

  // Generate the share URL
  const shareUrl = `${window.location.origin}/polls/${poll.id}`
  const qrUrl = `${window.location.origin}/poll/${poll.share_code}`

  const copyToClipboard = async (text: string, type: 'link' | 'qr') => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Share This Poll</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Direct Link</label>
          <div className="flex gap-2">
            <Input
              value={shareUrl}
              readOnly
              className="flex-1"
            />
            <Button
              variant="outline"
              onClick={() => copyToClipboard(shareUrl, 'link')}
            >
              {copied ? 'Copied!' : 'Copy'}
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">QR Code Link</label>
          <div className="flex gap-2">
            <Input
              value={qrUrl}
              readOnly
              className="flex-1"
            />
            <Button
              variant="outline"
              onClick={() => copyToClipboard(qrUrl, 'qr')}
            >
              {copied ? 'Copied!' : 'Copy'}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Share code: <code className="bg-gray-100 px-1 rounded">{poll.share_code}</code>
          </p>
        </div>

        <div className="border-t pt-4">
          <p className="text-sm text-muted-foreground">
            💡 Generate a QR code from the QR link above to let people scan and vote instantly!
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
