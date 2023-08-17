import { PageHeading } from '../../PageHeading/PageHeading'

export function TableHeading({
  title,
  subTitle,
  printTitle,
  hideDivider = false,
}: {
  title: string
  subTitle: string
  printTitle: string
  hideDivider?: boolean
}) {
  return (
    <div className="w-full">
      <div className="print:hidden">
        <PageHeading title={title} subTitle={subTitle} />
        {!hideDivider && <hr className="opacity-40 " />}
      </div>
      <h1 className="ids-heading-3 mb-5 hidden print:block">{printTitle}</h1>
    </div>
  )
}
