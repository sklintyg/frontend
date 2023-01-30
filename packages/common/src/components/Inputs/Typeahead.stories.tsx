import { Story } from '@storybook/react'
import React, { ComponentProps, useState } from 'react'
import Typeahead from './Typeahead'

export default {
  title: 'Components/Typeahead',
  component: Typeahead,
}

const Template: Story<Partial<ComponentProps<typeof Typeahead>>> = ({ ...args }) => {
  const [text, setText] = useState('')
  return (
    <Typeahead
      onClose={() => null}
      onSuggestionSelected={console.log}
      suggestions={[]}
      value={text}
      onChange={(event) => {
        console.log(event.currentTarget.value)
        setText(event.currentTarget.value)
      }}
      {...args}
    />
  )
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
