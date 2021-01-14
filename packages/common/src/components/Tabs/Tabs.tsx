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
    console.log('index', index)
    console.log('tablist.current', tablist.current)
    const tab = tablist?.current?.querySelector(`#tab${index}`)

    console.log(`tab${index}`)
    // Make the active tab focusable by the user (Tab key)
    tab?.removeAttribute('tabindex')
    // Set the selected state
    tab?.setAttribute('aria-selected', 'true')
    // Get the indices of the new and old tabs to find the correct
    // tab panels to show and hide
    console.log('panels.current', panels.current)
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
      console.log('panels.current[i]', panels.current[i])
    }
  }

  return (
    <Root ref={tabbed} className="ic-tabbed tabbed">
      <ul ref={tablist} className="ic-tabbed__tabs iu-hide-sm">
        {tabs.map((tab, i) => {
          return (
            <li>
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
        {/* <li>
          <a ref={(el: HTMLAnchorElement) => (tabRefs.current[0] = el)} className="ic-tabbed__tab" href="#section1">
            Section 1
          </a>
        </li>
        <li>
          <a ref={(el: HTMLAnchorElement) => (tabRefs.current[1] = el)} className="ic-tabbed__tab" href="#section2">
            Section 2
          </a>
        </li>
        <li>
          <a ref={(el: HTMLAnchorElement) => (tabRefs.current[2] = el)} className="ic-tabbed__tab" href="#section3">
            Section 3
          </a>
        </li>
        <li>
          <a ref={(el: HTMLAnchorElement) => (tabRefs.current[3] = el)} className="ic-tabbed__tab" href="#section4">
            Section 4
          </a>
        </li> */}
      </ul>

      {tabsContent.map((tabContent, i) => {
        return (
          <Section ref={(el: HTMLDivElement) => (panels.current[i] = el)} className="ic-tabbed__section ic-text" id={i.toString()}>
            {tabContent}
          </Section>
        )
      })}

      {/* <section ref={(el: HTMLDivElement) => (panels.current[0] = el)} className="ic-tabbed__section ic-text iu-py-900" id="section1">
        <h2>Section 1</h2>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam euismod, tortor nec pharetra ultricies, ante erat imperdiet velit,
          nec laoreet enim lacus a velit. enim in interdum condimentum, nisl diam iaculis lorem, vel volutpat mi leo sit amet lectus.
          Praesent non odio bibendum magna bibendum accumsan.
        </p>
      </section>

      <section ref={(el: HTMLDivElement) => (panels.current[1] = el)} className="ic-tabbed__section ic-text iu-py-900" id="section2">
        <h2>Section 2</h2>
        <p>
          Nullam at diam nec arcu suscipit auctor non a erat. Sed et magna semper, eleifend magna non, facilisis nisl. Proin et est et lorem
          dictum finibus ut nec turpis. Aenean nisi tortor, euismod a mauris a, mattis scelerisque tortor. Sed dolor risus, varius a nibh
          id, condimentum lacinia est. In lacinia cursus odio a aliquam. Curabitur tortor magna, laoreet ut rhoncus at, sodales consequat
          tellus.
        </p>
      </section>

      <section ref={(el: HTMLDivElement) => (panels.current[2] = el)} className="ic-tabbed__section ic-text iu-py-900" id="section3">
        <h2>Section 3</h2>
        <p>
          Phasellus ac tristique orci. Nulla maximus <a href="">justo nec dignissim consequat</a>. Sed vehicula diam sit amet mi efficitur
          vehicula in in nisl. Aliquam erat volutpat. Suspendisse lorem turpis, accumsan consequat consectetur gravida,{' '}
          <a href="javascript:void(0)">pellentesque ac ante</a>. Aliquam in commodo ligula, sit amet mollis neque. Vestibulum at facilisis
          massa.
        </p>
      </section>

      <section ref={(el: HTMLDivElement) => (panels.current[3] = el)} className="ic-tabbed__section ic-text iu-py-900" id="section4">
        <h2>Section 4</h2>
        <p>
          Nam luctus, enim in interdum condimentum, nisl diam iaculis lorem, vel volutpat mi leo sit amet lectus. Praesent non odio bibendum
          magna bibendum accumsan. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam euismod, tortor nec pharetra ultricies, ante
          erat imperdiet velit, nec laoreet enim lacus a velit.{' '}
        </p>
      </section> */}
    </Root>
  )
}

export default Tabs
