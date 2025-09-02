import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import CreatePollForm from './CreatePollForm'

const mockCreatePoll = vi.fn()

vi.mock('@/lib/polls', () => ({
  __esModule: true,
  createPoll: (...args: unknown[]) => mockCreatePoll(...args),
}))

describe('CreatePollForm', () => {
  beforeEach(() => {
    mockCreatePoll.mockReset()
  })

  it('submits and shows success by calling createPoll', async () => {
    mockCreatePoll.mockResolvedValueOnce(undefined)

    render(<CreatePollForm />)

    const title = screen.getByLabelText(/poll title/i)
    await userEvent.type(title, 'My test poll')

    const option1 = screen.getByPlaceholderText('Option 1')
    const option2 = screen.getByPlaceholderText('Option 2')
    await userEvent.type(option1, 'Option A')
    await userEvent.type(option2, 'Option B')

    const form = screen.getByRole('form') || screen.getByText(/create poll/i).closest('form')!

    // Submit by clicking the button
    const submit = screen.getByRole('button', { name: /create poll/i })
    await userEvent.click(submit)

    await waitFor(() => {
      expect(mockCreatePoll).toHaveBeenCalledTimes(1)
    })
  })

  it('shows an error if createPoll fails', async () => {
    mockCreatePoll.mockRejectedValueOnce(new Error('Failed to create poll'))

    render(<CreatePollForm />)

    const title = screen.getByLabelText(/poll title/i)
    await userEvent.type(title, 'My test poll')

    const option1 = screen.getByPlaceholderText('Option 1')
    const option2 = screen.getByPlaceholderText('Option 2')
    await userEvent.type(option1, 'Option A')
    await userEvent.type(option2, 'Option B')

    const submit = screen.getByRole('button', { name: /create poll/i })
    await userEvent.click(submit)

    expect(await screen.findByText(/failed to create poll/i)).toBeInTheDocument()
  })
})


