import { render } from '@testing-library/react'
import { LayoutFooterLink } from './LayoutFooterLink'

it('Should render as expected', () => {
  const { container } = render(<LayoutFooterLink href="https://www.site.com/">Hantering av kakor</LayoutFooterLink>)

  expect(container).toMatchInlineSnapshot(`
    <div>
      <a
        class="text-white outline-white hover:underline"
        href="https://www.site.com/"
        rel="noreferrer"
      >
        Hantering av kakor
      </a>
       
    </div>
  `)
})

it('Should have external icon when target is _blank', () => {
  const { container } = render(
    <LayoutFooterLink href="https://www.site.com/" target="_blank">
      Hantering av kakor
    </LayoutFooterLink>
  )

  expect(container).toMatchInlineSnapshot(`
    <div>
      <a
        class="text-white outline-white hover:underline"
        href="https://www.site.com/"
        rel="noreferrer"
        target="_blank"
      >
        Hantering av kakor
      </a>
       
      <ids-icon-external
        class="relative -bottom-0.5 ids-icon"
      />
    </div>
  `)
})
