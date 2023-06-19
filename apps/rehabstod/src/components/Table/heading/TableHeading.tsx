export function TableHeading({ title, subTitle, printTitle }: { title: string; subTitle: string; printTitle: string }) {
  return (
    <>
      <div className="print:hidden">
        <h1 className="ids-heading-2">{title}</h1>
        <h2 className="ids-heading-3 mb-10">{subTitle}</h2>
        <hr className="opacity-40 " />
      </div>
      <div className="hidden print:block">
        <h1 className="ids-heading-3 mb-5">{printTitle}</h1>
      </div>
    </>
  )
}
