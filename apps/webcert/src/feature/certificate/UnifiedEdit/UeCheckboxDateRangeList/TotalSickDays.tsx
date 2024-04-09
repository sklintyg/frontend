import Icon from '../../../../components/image/image/Icon'

export function TotalSickDays({ total }: { total: number }) {
  return total > 0 ? (
    <div className="iu-mb-400">
      <p className="iu-color-main">
        <Icon iconType={'lightbulb_outline'} includeTooltip={true} />
        Intyget motsvarar en period på {total} dagar.{' '}
      </p>
    </div>
  ) : null
}
