import { render, screen } from '@testing-library/react'
import { Item } from 'react-stately'
import { ListBox } from './ListBox'

it('Should support dynamic collection', () => {
  render(
    <ListBox
      label="Animals"
      items={[
        { id: 1, name: 'Aardvark' },
        { id: 2, name: 'Cat' },
        { id: 3, name: 'Dog' },
        { id: 4, name: 'Kangaroo' },
        { id: 5, name: 'Koala' },
        { id: 6, name: 'Penguin' },
        { id: 7, name: 'Snake' },
        { id: 8, name: 'Turtle' },
        { id: 9, name: 'Wombat' },
      ]}
      selectionMode="single"
    >
      {(item) => <Item>{item.name}</Item>}
    </ListBox>
  )

  expect(screen.getByRole('option', { name: 'Cat' })).toBeInTheDocument()
})
