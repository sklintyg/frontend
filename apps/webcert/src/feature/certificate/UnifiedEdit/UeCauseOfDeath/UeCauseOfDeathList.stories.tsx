import { Story } from '@storybook/react'
import React, { ComponentProps } from 'react'
import { Provider, useSelector } from 'react-redux'
import { updateCertificate } from '../../../../store/certificate/certificateActions'
import { certificateMiddleware } from '../../../../store/certificate/certificateMiddleware'
import { getQuestion } from '../../../../store/certificate/certificateSelectors'
import { configureApplicationStore } from '../../../../store/configureApplicationStore'
import UeCauseOfDeathList from './UeCauseOfDeathList'
import { fakeCertificateMetaData, fakeCauseOfDeathListElement } from '../../../../faker'

export default {
  title: 'Webcert/UeCauseOfDeathList',
  component: UeCauseOfDeathList,
}

const ComponentWrapper: React.FC<ComponentProps<typeof UeCauseOfDeathList>> = ({ ...args }) => {
  const question = useSelector(getQuestion('1'))
  return question ? <UeCauseOfDeathList {...args} question={question} /> : null
}

const Template: Story<ComponentProps<typeof UeCauseOfDeathList>> = ({ ...args }) => {
  const store = configureApplicationStore([certificateMiddleware])

  store.dispatch(
    updateCertificate({
      metadata: fakeCertificateMetaData(),
      data: {
        [args.question.id]: args.question,
      },
      links: [],
    })
  )

  return <Provider store={store}>{<ComponentWrapper {...args} />}</Provider>
}

export const Default = Template.bind({})
Default.args = {
  question: fakeCauseOfDeathListElement({ id: '1' })['1'],
}
