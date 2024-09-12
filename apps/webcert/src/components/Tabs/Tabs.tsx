import classNames from 'classnames'
import type React from 'react'
import { useState } from 'react'
import styled from 'styled-components'
import { LightbulpIcon } from '../../images/LightbulpIcon'
import { ResourceLinkType } from '../../types'

const Root = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`

const Section = styled.section`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  overflow: auto;
`

const List = styled.ul`
  border-bottom: 0 !important;
`

const TabButton = styled.button.attrs({
  classNames: 'ic-tabbed__tab',
})`
  border: none;
  color: #00706e;
`

type Tab = {
  name: string
  description: string
  icon?: ResourceLinkType
}

export function Tabs({
  tabs,
  tabsContent,
  setSelectedTabIndex,
  selectedTabIndex,
}: {
  tabs: Tab[]
  tabsContent: React.ReactNode[]
  setSelectedTabIndex: (index: number) => void
  selectedTabIndex: number
}) {
  const [tabFocus, setTabFocus] = useState(0)
  const iconLinkType = [ResourceLinkType.FMB, ResourceLinkType.SRS_FULL_VIEW, ResourceLinkType.SRS_MINIMIZED_VIEW]

  return (
    <Root className="ic-tabbed tabbed">
      <List
        role="tablist"
        className="ic-tabbed__tabs iu-hide-sm iu-border-grey-300 iu-pt-200"
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
            const tabButtons = e.currentTarget.querySelectorAll<HTMLButtonElement>('[role="tab"]')
            let updatedFocusIndex = 0

            if (tabButtons[tabFocus]) {
              tabButtons[tabFocus].setAttribute('tabindex', '-1')
            }

            if (e.key === 'ArrowRight') {
              updatedFocusIndex = tabFocus + 1 >= tabButtons.length ? 0 : tabFocus + 1
            } else if (e.key === 'ArrowLeft') {
              updatedFocusIndex = tabFocus - 1 < 0 ? tabButtons.length - 1 : tabFocus - 1
            }

            setTabFocus(updatedFocusIndex)
            if (tabButtons[updatedFocusIndex]) {
              tabButtons[updatedFocusIndex].setAttribute('tabindex', '0')
              tabButtons[updatedFocusIndex].focus()
            }
          }
        }}
      >
        {tabs.map(({ name, description, icon }, i) => {
          return (
            <li key={name} className={classNames(i === 0 && 'iu-pl-300')}>
              <TabButton
                id={`tab-${i}`}
                role="tab"
                aria-selected={selectedTabIndex === i}
                aria-controls={`panel-${i}`}
                tabIndex={tabFocus === i ? 0 : -1}
                onClick={() => setSelectedTabIndex(i)}
                className="ic-tabbed__tab"
                data-tip={description}
                onFocus={() => setTabFocus(i)}
              >
                {icon && iconLinkType.includes(icon) && <LightbulpIcon className="iu-mr-200" />}
                {name}
              </TabButton>
            </li>
          )
        })}
      </List>

      <div role="tabpanel">
        {tabsContent.map((tabContent, i) => {
          return (
            <Section
              id={`panel-${i}`}
              key={i}
              role="tabpanel"
              tabIndex={0}
              aria-labelledby={`tab-${i}`}
              hidden={i !== selectedTabIndex}
              className="ic-tabbed__section ic-text"
            >
              {tabContent}
            </Section>
          )
        })}
      </div>
    </Root>
  )
}
