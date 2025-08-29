import { notFound, redirect } from "next/navigation"
import { getPollByShareCode } from "@/lib/polls"

type QRPollPageProps = {
  params: { shareCode: string }
}

export default async function QRPollPage({ params }: QRPollPageProps) {
  const { shareCode } = params

  if (!shareCode) return notFound()

  try {
    const poll = await getPollByShareCode(shareCode)
    
    if (!poll) {
      return notFound()
    }

    // Redirect to the main poll page
    redirect(`/polls/${poll.id}`)
  } catch (error) {
    console.error('Error loading poll by share code:', error)
    return notFound()
  }
}
