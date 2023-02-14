import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import React from 'react'
import { fakeCertificateConfig, fakeCertificateValue, fakeDropdownElement } from '../../../utils'
import { UvCode } from './UvCode'

it('Should renders without crashing', () => {
  expect(() => render(<UvCode value={fakeCertificateValue.code()} config={fakeCertificateConfig.dropdown()} />)).not.toThrow()
})

it('Should displays code value', () => {
  render(
    <UvCode
      value={fakeCertificateValue.code({ id: 'CODE_1' })}
      config={fakeCertificateConfig.dropdown({
        list: [
          {
            id: 'CODE_1',
            label: 'Code 1',
          },
          {
            id: 'CODE_2',
            label: 'Code 2',
          },
          {
            id: 'CODE_3',
            label: 'Code 3',
          },
        ],
      })}
    />
  )
  expect(screen.getByText('Code 1')).toBeInTheDocument()
})

it('Should add text of optional dropdown to radio group text', () => {
  render(
    <UvCode
      value={fakeCertificateValue.code({ id: 'CODE_1' })}
      config={fakeCertificateConfig.dropdown({
        list: [
          {
            id: 'CODE_1',
            label: 'Code 1',
          },
        ],
      })}
      questionWithOptionalDropdown={
        fakeDropdownElement({
          id: 'id',
          value: { id: 'CODE_DROPDOWN' },
          config: {
            list: [
              {
                id: 'CODE_DROPDOWN',
                label: 'dropdown value',
              },
            ],
          },
        })['id']
      }
    />
  )
  expect(screen.getByText('Code 1 dropdown value')).toBeInTheDocument()
})
