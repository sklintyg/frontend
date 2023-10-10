import { render, screen } from '@testing-library/react'
import { DisplayHTML } from './DisplayHTML'

describe('tables', () => {
  it('Should add class to tables', () => {
    render(<DisplayHTML html="<table></table>" />)
    expect(screen.getByRole('table')).toHaveClass('ids-table', { exact: true })
  })

  it('Should render mobile table', () => {
    const { container } = render(
      <DisplayHTML
        html="`
          <table>
            <thead>
              <tr>
                <th>First cell</th>
                <th>Second cell</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>123</td>
                <td>Lorem ipsum</td>
              </tr>
              <tr>
                <td>456</td>
                <td>dolor sit amet</td>
              </tr>
            </tbody>
          </table>
        `"
        mobile
      />
    )
    expect(container).toMatchSnapshot()
  })

  it('Should render mobile table with row headers', () => {
    const { container } = render(
      <DisplayHTML
        html="`
          <table>
            <thead>
              <tr>
                <th></th>
                <th>First cell</th>
                <th>Second cell</th>
                <th>Third cell</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th>Row heading</th>
                <td>1</td>
                <td>2</td>
                <td>3</td>
              </tr>
            </tbody>
          </table>
        `"
        mobile
      />
    )
    expect(container).toMatchSnapshot()
  })
})

describe('link', () => {
  it('Should render link as ids-link', () => {
    const { container } = render(<DisplayHTML html="<a href='http://some-place.com'>Some link</a>" />)
    expect(container).toMatchSnapshot()
  })

  it('Should render link with external icon when target is _blank', () => {
    const { container } = render(<DisplayHTML html="<a href='http://some-place.com' target='_blank'>Some link</a>" />)
    expect(container).toMatchSnapshot()
  })
})

describe('headings', () => {
  it.each(Array.from({ length: 6 }, (_, index) => index + 1))('Should render %s heading as expected', (level) => {
    const tag = `h${level}`
    render(<DisplayHTML html={`<${tag}>text</${tag}>`} />)
    expect(screen.getByRole('heading')).toHaveClass(`ids-heading-${level}`, { exact: true })
  })
})
