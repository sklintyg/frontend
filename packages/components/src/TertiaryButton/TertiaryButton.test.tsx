import { render } from '@testing-library/react'
import { TertiaryButton } from './TertiaryButton'

it('Should render as expected', () => {
  const { container } = render(<TertiaryButton>Hello</TertiaryButton>)
  expect(container).toMatchInlineSnapshot(`
    <div>
      <button
        class="ids-link inline-flex font-normal items-center ids-link--underlined text-base"
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
