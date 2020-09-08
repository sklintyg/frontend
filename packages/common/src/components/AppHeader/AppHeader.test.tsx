import React from 'react'
import { shallow } from 'enzyme'
import AppHeader from './AppHeader'

test('render a label', (): void => {
  const wrapper = shallow(<AppHeader title="Webcert" />)

  expect(wrapper).toContain('Webcert')
})
