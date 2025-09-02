import { render, screen } from '@testing-library/react'
import React from 'react'
import NewPollPage from './page'

// Mock the CreatePollForm to control behavior
vi.mock('@/components/CreatePollForm', () => ({
  __esModule: true,
  default: () => <div data-testid="create-poll-form">CreatePollForm</div>,
}))

describe('NewPollPage', () => {
  it('renders the CreatePollForm', () => {
    render(<NewPollPage />)
    expect(screen.getByTestId('create-poll-form')).toBeInTheDocument()
  })
})


