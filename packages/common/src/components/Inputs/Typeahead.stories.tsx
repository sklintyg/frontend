import { Story } from '@storybook/react'
import React, { ComponentProps } from 'react'
import Typeahead from './Typeahead'

export default {
  title: 'Components/Typeahead',
  component: Typeahead,
}

const Template: Story<Partial<ComponentProps<typeof Typeahead>>> = ({ ...args }) => {
  return <Typeahead onChange={() => null} onClose={() => null} onSuggestionSelected={console.log} suggestions={[]} {...args} />
}

export const Default = Template.bind({})
Default.args = {
  suggestions: [
    { label: 'Hello, World!', disabled: false, title: null },
    { label: 'Suggestion 2', disabled: false, title: null },
    { label: 'Test', disabled: false, title: null },
    { label: 'String', disabled: true, title: null },
  ],
}
