import { Heading } from '../../Heading/Heading'
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
      <div className="hidden print:block">
        <Heading level={1} size="s">
          {printTitle}
        </Heading>
      </div>
    </div>
  )
}
