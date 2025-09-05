import { render, screen } from '@testing-library/react'
import Page from '../app/page'
import { CalProvider } from '@/components/CalProvider'

describe('Home', () => {
    it('renders a heading', () => {
        render(
            <CalProvider>
                <Page />
            </CalProvider>
        )
        expect(screen.getByText(/Bay Area Premier Tutor/i)).toBeInTheDocument()
    })
})