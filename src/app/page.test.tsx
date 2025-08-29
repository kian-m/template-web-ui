import { render, screen } from '@testing-library/react'
import Page from '../app/page'
import { CalProvider } from '@/components/CalProvider'
import { ThemeProvider } from 'next-themes'

beforeAll(() => {
    class MockIntersectionObserver {
        observe () {}
        unobserve () {}
        disconnect () {}
    }
    // @ts-ignore
    window.IntersectionObserver = MockIntersectionObserver
    // @ts-ignore
    window.matchMedia = window.matchMedia || function () {
        return {
            matches: false,
            addListener () {},
            removeListener () {},
        }
    }
})

describe('Home', () => {
    it('renders a heading', () => {
        render(
            <ThemeProvider attribute="class">
                <CalProvider>
                    <Page />
                </CalProvider>
            </ThemeProvider>
        )
        expect(
            screen.getByRole('heading', { name: /The Bay Area Tutor/i })
        ).toBeInTheDocument()
    })
})
