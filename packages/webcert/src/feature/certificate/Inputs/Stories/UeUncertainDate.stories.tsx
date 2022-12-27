import { fakeCertificate, fakeUncertainDateElement } from '@frontend/common'
import { configureStore } from '@reduxjs/toolkit'
import { Story } from '@storybook/react'
import React, { ComponentProps } from 'react'
import { Provider } from 'react-redux'
import { updateCertificate } from '../../../../store/certificate/certificateActions'
import { certificateMiddleware } from '../../../../store/certificate/certificateMiddleware'
import reducers from '../../../../store/reducers'
import UeUncertainDate from '../UeUncertainDate'

export default {
  title: 'Webcert/UeUncertainDate',
  component: UeUncertainDate,
}

const Template: Story<ComponentProps<typeof UeUncertainDate>> = ({ question, ...args }) => {
  const store = configureStore({
    reducer: reducers,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(certificateMiddleware),
  })

  store.dispatch(
    updateCertificate(
      fakeCertificate({
        data: {
          [question.id]: question,
        },
      })
    )
  )

  return (
    <Provider store={store}>
      <UeUncertainDate {...args} question={question} />
    </Provider>
  )
}

export const Default = Template.bind({})
Default.args = {
  question: fakeUncertainDateElement({ id: '1' })['1'],
}
