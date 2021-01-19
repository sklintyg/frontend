import React, { useEffect, useRef } from 'react'
import styled from 'styled-components'

const Root = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`

const Section = styled.section`
  height: 100%;
  display: flex;
  flex-direction: column;
`

interface Props {
  tabs: React.ReactNode[]
  tabsContent: React.ReactNode[]
  setSelectedTabIndex: (index: number) => void
  selectedTabIndex: number
}

export const Tabs: React.FC<Props> = ({ tabs, tabsContent, setSelectedTabIndex, selectedTabIndex }) => {
  const tabbed = useRef<HTMLDivElement | null>(null)
  const tablist = useRef<HTMLUListElement | null>(null)
  const tabRefs = useRef<HTMLAnchorElement[]>([])
  const panels = useRef<HTMLDivElement[]>([])

  useEffect(() => {
    // Add the tablist role to the first <ul> in the .tabbed container
    tablist?.current?.setAttribute('role', 'tablist')

    // Add semantics are remove user focusability for each tab
    Array.prototype.forEach.call(tabRefs.current, (tab: HTMLAnchorElement, i) => {
      tab.setAttribute('role', 'tab')
      tab.setAttribute('id', 'tab' + i)
      tab.setAttribute('tabindex', '-1')
      ;(tab.parentNode as HTMLAnchorElement).setAttribute('role', 'presentation')

      // Handle clicking of tabs for mouse users
      tab.addEventListener('click', (e) => {
        e.preventDefault()
        const currentTab = tablist?.current?.querySelector('[aria-selected]')
        if (currentTab && e.currentTarget && e.currentTarget !== currentTab) {
          switchTab(currentTab as HTMLElement, e.currentTarget as HTMLElement)
        }
      })

      // Handle keydown events for keyboard users
      tab.addEventListener('keydown', (e) => {
        // Get the index of the current tab in the tabs node list
        const index = Array.prototype.indexOf.call(tabRefs.current, e.currentTarget)
        // Work out which key the user is pressing and
        // Calculate the new tab's index where appropriate
        const dir = e.which === 37 ? index - 1 : e.which === 39 ? index + 1 : e.which === 40 ? 'down' : null
        if (dir !== null && e.currentTarget) {
          e.preventDefault()
          // If the down key is pressed, move focus to the open panel,
          // otherwise switch to the adjacent tab
          dir === 'down'
            ? panels.current[i].focus()
            : tabRefs.current[dir]
            ? switchTab(e.currentTarget as HTMLElement, tabRefs.current[dir])
            : void 0
        }
      })
    })

    // Add tab panel semantics and hide them all
    Array.prototype.forEach.call(panels.current, (panel, i) => {
      panel.setAttribute('role', 'tabpanel')
      panel.setAttribute('tabindex', '-1')
      const id = panel.getAttribute('id')
      panel.setAttribute('aria-labelledby', tabRefs.current[i].id)
      panel.hidden = true
    })

    // Initially activate the first tab and reveal the first tab panel
    tabRefs.current[0].removeAttribute('tabindex')
    tabRefs.current[0].setAttribute('aria-selected', 'true')
    panels.current[0].hidden = false

    setTab(selectedTabIndex)
  }, [])

  // The tab switching function
  const switchTab = (oldTab: HTMLElement, newTab: HTMLElement) => {
    newTab.focus()
    // Make the active tab focusable by the user (Tab key)
    newTab.removeAttribute('tabindex')
    // Set the selected state
    newTab.setAttribute('aria-selected', 'true')
    oldTab.removeAttribute('aria-selected')
    oldTab.setAttribute('tabindex', '-1')
    // Get the indices of the new and old tabs to find the correct
    // tab panels to show and hide
    const index = Array.prototype.indexOf.call(tabRefs.current, newTab)
    const oldIndex = Array.prototype.indexOf.call(tabRefs.current, oldTab)
    panels.current[oldIndex].hidden = true
    panels.current[index].hidden = false
  }

  const setTab = (index: number) => {
    // if (!tablist.current) return
    clearFocus()
    const tab = tablist?.current?.querySelector(`#tab${index}`)

    // Make the active tab focusable by the user (Tab key)
    tab?.removeAttribute('tabindex')
    // Set the selected state
    tab?.setAttribute('aria-selected', 'true')
    // Get the indices of the new and old tabs to find the correct
    // tab panels to show and hide
    panels.current[index].hidden = false
  }

  const clearFocus = () => {
    for (let i = 0; i < panels.current.length; i++) {
      if (i === selectedTabIndex) {
        continue
      }
      const tab = tablist.current?.querySelector(`#tab${i}`)
      panels.current[i].hidden = true
      tab?.removeAttribute('aria-selected')
      tab?.setAttribute('tabindex', '-1')
    }
  }

  return (
    <Root ref={tabbed} className="ic-tabbed tabbed">
      <ul ref={tablist} className="ic-tabbed__tabs iu-hide-sm">
        {tabs.map((tab, i) => {
          return (
            <li key={i}>
              <a
                onClick={() => setSelectedTabIndex(i)}
                ref={(el: HTMLAnchorElement) => (tabRefs.current[i] = el)}
                className="ic-tabbed__tab"
                href={i.toString()}>
                {tab}
              </a>
            </li>
          )
        })}
      </ul>

      {tabsContent.map((tabContent, i) => {
        return (
          <Section key={i} ref={(el: HTMLDivElement) => (panels.current[i] = el)} className="ic-tabbed__section ic-text" id={i.toString()}>
            {tabContent}
          </Section>
        )
      })}
    </Root>
  )
}

export default Tabs
