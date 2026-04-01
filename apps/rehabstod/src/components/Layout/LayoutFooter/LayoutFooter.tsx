import { IDSFooter1177Admin, IDSLink, IDSMobileMenu, IDSMobileMenuItem } from '@inera/ids-react'
import { TertiaryButton } from '@frontend/components'
import { useGetLinksQuery } from '../../../store/api'
import { useAppDispatch } from '../../../store/hooks'
import { updateShowCookieDialog } from '../../../store/slices/cookieDialog.slice'
import { DynamicLink } from '../../DynamicLink/DynamicLink'
import { ServiceLink } from './ServiceLink'

export function LayoutFooter() {
  const { data: links } = useGetLinksQuery()
  const dispatch = useAppDispatch()

  return (
    <IDSFooter1177Admin
      headline="Rehabstöd"
      col1={
        <>
          <IDSLink block footer>
            <a
              href={links?.ineraManualRehabstod?.url}
              target={links?.ineraManualRehabstod?.target}
              rel={links?.ineraManualRehabstod?.target === '_blank' ? 'noreferrer' : undefined}
            >
              <span aria-hidden="true" className="ids-icon-arrow-right-small ids-icon--text-start" />
              {links?.ineraManualRehabstod?.text}
            </a>
          </IDSLink>{' '}
          <IDSLink block footer>
            <a
              href={links?.ineraNationellKundservice?.url}
              target={links?.ineraNationellKundservice?.target}
              rel={links?.ineraNationellKundservice?.target === '_blank' ? 'noreferrer' : undefined}
            >
              <span aria-hidden="true" className="ids-icon-arrow-right-small ids-icon--text-start" />
              {links?.ineraNationellKundservice?.text}
            </a>
          </IDSLink>
        </>
      }
      col2={
        <IDSLink block footer>
          <a
            href={links?.rehabstodTillganglighetsredogorelse?.url}
            target={links?.rehabstodTillganglighetsredogorelse?.target}
            rel={links?.rehabstodTillganglighetsredogorelse?.target === '_blank' ? 'noreferrer' : undefined}
          >
            <span aria-hidden="true" className="ids-icon-arrow-right-small ids-icon--text-start" />
            {links?.rehabstodTillganglighetsredogorelse?.text}
          </a>
        </IDSLink>
      }
      mobileMenu={
        <IDSMobileMenu variation={2}>
          <IDSMobileMenuItem
            link={
              <a
                href={links?.ineraManualRehabstod?.url}
                target={links?.ineraManualRehabstod?.target}
                rel={links?.ineraManualRehabstod?.target === '_blank' ? 'noreferrer' : undefined}
              >
                {links?.ineraManualRehabstod?.text}
              </a>
            }
          />
          <IDSMobileMenuItem
            link={
              <a
                href={links?.ineraNationellKundservice?.url}
                target={links?.ineraNationellKundservice?.target}
                rel={links?.ineraNationellKundservice?.target === '_blank' ? 'noreferrer' : undefined}
              >
                {links?.ineraNationellKundservice?.text}
              </a>
            }
          />
          <IDSMobileMenuItem
            link={
              <a
                href={links?.rehabstodTillganglighetsredogorelse?.url}
                target={links?.rehabstodTillganglighetsredogorelse?.target}
                rel={links?.rehabstodTillganglighetsredogorelse?.target === '_blank' ? 'noreferrer' : undefined}
              >
                {links?.rehabstodTillganglighetsredogorelse?.text}
              </a>
            }
          />
        </IDSMobileMenu>
      }
      mobileLinks={
        <>
          <DynamicLink link={links?.ineraBehandlingPersonuppgifter} colorPreset={3} />
          <TertiaryButton onClick={() => dispatch(updateShowCookieDialog(true))}>Hantering av kakor</TertiaryButton>
        </>
      }
      subFooterLeft={
        <>
          <DynamicLink link={links?.ineraBehandlingPersonuppgifter} small colorPreset={3} />
          <TertiaryButton small colorPreset={4} onClick={() => dispatch(updateShowCookieDialog(true))}>
            Hantering av kakor
          </TertiaryButton>
        </>
      }
      subFooterRight={<ServiceLink />}
      subFooterMobile={<ServiceLink mobile />}
      className="print:hidden"
    >
      <p className="ids-body">Rehabstöd används för att samordna och följa upp sjukskrivna patienters rehabilitering.</p>
    </IDSFooter1177Admin>
  )
}
