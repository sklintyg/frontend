import { IDSAlertGlobal, IDSIconAttention, IDSIconInformation, IDSIconWarning } from '@frontend/ids-react-ts'
import { Banner, BannerPriority } from '../../../schema/info.schema'

export function GlobalBanner({ banner }: { banner: Banner }) {
  return (
    <IDSAlertGlobal headline="Driftmeddelande">
      {banner.type === BannerPriority.INFO && <IDSIconInformation data-testid="INFO_ICON" />}
      {banner.type === BannerPriority.OBSERVE && <IDSIconAttention data-testid="OBSERVE_ICON" />}
      {banner.type === BannerPriority.ERROR && <IDSIconWarning data-testid="ERROR_ICON" />}
      {banner.content}
    </IDSAlertGlobal>
  )
}
