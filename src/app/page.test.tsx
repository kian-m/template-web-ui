import { render, screen } from '@testing-library/react'
import Page from '../app/page'

describe('Home', () => {
    it('renders a heading', () => {
        render(<Page />)

        const image = screen.getByAltText(/next\.js logo/i)

        expect(image).toBeInTheDocument()
    })
})