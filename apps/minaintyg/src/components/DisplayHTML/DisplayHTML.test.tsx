import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { DisplayHTML } from './DisplayHTML'

describe('tables', () => {
  it('Should add class to tables', () => {
    render(<DisplayHTML html="<table></table>" />)
    expect(screen.getByRole('table')).toHaveClass('ids-table', { exact: true })
  })

  it('Should render mobile table', () => {
    render(
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
      />
    )
    expect(screen.getAllByRole('table')[0]).toMatchSnapshot()
  })

  it('Should render mobile table with row headers', () => {
    render(
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
      />
    )
    expect(screen.getAllByRole('table')[0]).toMatchSnapshot()
  })
})

describe('link', () => {
  it('Should render link as ids-link', () => {
    const { container } = render(
      <MemoryRouter>
        <DisplayHTML html="<a href='http://some-place.com'>Some link</a>" />
      </MemoryRouter>
    )
    expect(container).toMatchSnapshot()
  })

  it('Should render link with external icon when target is _blank', () => {
    const { container } = render(<DisplayHTML html="<a href='http://some-place.com' target='_blank'>Some link</a>" />)
    expect(container).toMatchSnapshot()
  })
})

describe('headings', () => {
  it('Should render level 1 heading as expected', () => {
    render(<DisplayHTML html="<h1>text</h1>" />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveClass(`ids-heading-l mb-4`, { exact: true })
  })

  it('Should render level 2 heading as expected', () => {
    render(<DisplayHTML html="<h2>text</h2>" />)
    expect(screen.getByRole('heading', { level: 2 })).toHaveClass(`ids-heading-m mb-4`, { exact: true })
  })

  it('Should render level 3 heading as expected', () => {
    render(<DisplayHTML html="<h3>text</h3>" />)
    expect(screen.getByRole('heading', { level: 3 })).toHaveClass(`ids-heading-s mb-4`, { exact: true })
  })

  it('Should render level 4 heading as expected', () => {
    render(<DisplayHTML html="<h4>text</h4>" />)
    expect(screen.getByRole('heading', { level: 4 })).toHaveClass(`ids-heading-xs mb-4`, { exact: true })
  })

  it('Should render level 5 heading as expected', () => {
    render(<DisplayHTML html="<h5>text</h5>" />)
    expect(screen.getByRole('heading', { level: 5 })).toHaveClass(`ids-heading-xs mb-4`, { exact: true })
  })
})

describe('Table header', () => {
  it('Empty table header cell should be converted to td', () => {
    render(<DisplayHTML html="<table><thead><tr><th></th></tr></thead></table>" />)
    expect(screen.getByRole('cell')).toBeInTheDocument()
    expect(screen.queryByRole('columnheader')).not.toBeInTheDocument()
  })

  it('Populated table header cell should not be converted to td', () => {
    render(<DisplayHTML html="<table><thead><tr><th>Hello</th></tr></thead></table>" />)
    expect(screen.getByRole('columnheader')).toBeInTheDocument()
    expect(screen.queryByRole('cell')).not.toBeInTheDocument()
  })
})
