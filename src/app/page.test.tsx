import { render, screen } from '@testing-library/react'
import Page from '../app/page'

describe('Home', () => {
    it('renders eating and workout actions as disabled by default', () => {
        render(<Page />)

        expect(screen.getByRole('button', { name: /eating/i })).toBeDisabled()
        expect(screen.getByRole('button', { name: /workout/i })).toBeDisabled()
    })
})
