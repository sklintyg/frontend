export function PageHeading({ title, subTitle }: { title: string; subTitle?: string }) {
  return (
    <>
      <h1 className="ids-heading-1 ids-small">{title}</h1>
      {subTitle && <h2 className="ids-heading-3 mb-10">{subTitle}</h2>}
    </>
  )
}
