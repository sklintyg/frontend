import { render } from '@testing-library/react'
import { Popover } from './Popover'
import { PopoverContent } from './PopoverContent'
import { PopoverTrigger } from './PopoverTrigger'

it('Should render without crash', () => {
  expect(() =>
    render(
      <Popover>
        <PopoverContent>
          <p>Hello</p>
        </PopoverContent>
        <PopoverTrigger>
          <button type="button">Button</button>
        </PopoverTrigger>
      </Popover>
    )
  ).not.toThrow()
})
