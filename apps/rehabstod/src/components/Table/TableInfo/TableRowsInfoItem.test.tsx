import { render } from '@testing-library/react'
import { TableRowsInfoItem } from './TableRowsInfoItem'

it('Should render total number text', () => {
  const { container } = render(<TableRowsInfoItem listLength={10} totalNumber={20} />)
  expect(container).toMatchInlineSnapshot(`
    <div>
      <div
        class="after:mx-1 after:hidden after:content-['|'] print:after:inline-block print:inline-block xl:inline-block [&:not(:last-child)]:after:xl:inline-block"
      >
        Visar
         
        <span
          class="font-bold"
        >
          10
           av 
          20
        </span>
      </div>
    </div>
  `)
})
