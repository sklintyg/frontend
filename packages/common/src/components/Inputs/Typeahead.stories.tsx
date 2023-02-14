import { Story } from '@storybook/react'
import faker from 'faker'
import React, { ComponentProps, useState } from 'react'
import Typeahead from './Typeahead'

export default {
  title: 'Components/Typeahead',
  component: Typeahead,
}

faker.seed(10)

const Template: Story<Partial<ComponentProps<typeof Typeahead>>> = ({ ...args }) => {
  const [text, setText] = useState('')
  return (
    <Typeahead
      onClose={() => null}
      onSuggestionSelected={setText}
      suggestions={[]}
      value={text}
      onChange={(event) => {
        setText(event.currentTarget.value)
      }}
      {...args}
    />
  )
}

export const Default = Template.bind({})
Default.args = {
  moreResults: true,
  suggestions: Array.from({ length: 20 }, () => ({
    label: faker.lorem.sentence(),
    disabled: faker.datatype.boolean(),
    title: null,
  })),
}
