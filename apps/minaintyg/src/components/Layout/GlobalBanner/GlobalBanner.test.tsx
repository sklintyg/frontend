import { render, screen } from '@testing-library/react'
import { Banner, BannerPriority } from '../../../schema/info.schema'
import { GlobalBanner } from './GlobalBanner'

function renderComponent(banner: Banner) {
  return render(<GlobalBanner banner={banner} />)
}

function getBanner(priority: BannerPriority) {
  return {
    content: 'content',
    type: priority,
  }
}

it('should render without issues', () => {
  expect(() => renderComponent(getBanner(BannerPriority.INFO))).not.toThrow()
})

it('should render alert', () => {
  renderComponent(getBanner(BannerPriority.INFO))
  expect(screen.getByRole('alert')).toBeInTheDocument()
})

it('should render content', () => {
  renderComponent(getBanner(BannerPriority.INFO))
  expect(screen.getByText('content')).toBeInTheDocument()
})

it('should render info icon', () => {
  renderComponent(getBanner(BannerPriority.INFO))
  expect(screen.getByTestId('INFO_ICON')).toBeInTheDocument()
})

it('should render observe icon', () => {
  renderComponent(getBanner(BannerPriority.OBSERVE))
  expect(screen.getByTestId('OBSERVE_ICON')).toBeInTheDocument()
})

it('should render error icon', () => {
  renderComponent(getBanner(BannerPriority.ERROR))
  expect(screen.getByTestId('ERROR_ICON')).toBeInTheDocument()
})
