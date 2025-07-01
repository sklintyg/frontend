import { IDSIconExternal } from '@inera/ids-react'
import { render } from '@testing-library/react'
import { LinkIcon } from '../LinkIcon'
import { TertiaryButton } from './TertiaryButton'

it('Should render as expected', () => {
  const { container } = render(<TertiaryButton>Hello</TertiaryButton>)
  expect(container).toMatchInlineSnapshot(`
    <div>
      <button
        class="ids-link inline-flex text-base font-normal ids-link--underlined"
        type="button"
      >
        <span
          class="ids-link__text"
        >
          Hello
        </span>
      </button>
    </div>
  `)
})

it('Should be possible to add icon before text', () => {
  const { container } = render(<TertiaryButton startIcon={<LinkIcon icon={IDSIconExternal} />}>Hello</TertiaryButton>)
  expect(container).toMatchInlineSnapshot(`
    <div>
      <button
        class="ids-link inline-flex text-base font-normal ids-link--underlined"
        type="button"
      >
        <span
          class="ids-link__icon"
        >
          <ids-icon-external
            class="ids-icon"
          />
        </span>
        <span
          class="ids-link__text"
        >
          Hello
        </span>
      </button>
    </div>
  `)
})

it('Should be possible to add icon after text', () => {
  const { container } = render(<TertiaryButton endIcon={<LinkIcon icon={IDSIconExternal} />}>Hello</TertiaryButton>)
  expect(container).toMatchInlineSnapshot(`
    <div>
      <button
        class="ids-link inline-flex text-base font-normal ids-link--underlined"
        type="button"
      >
        <span
          class="ids-link__text"
        >
          Hello
        </span>
        <span
          class="ids-link__icon"
        >
          <ids-icon-external
            class="ids-icon"
          />
        </span>
      </button>
    </div>
  `)
})
