import { Heading } from '../Heading/Heading'

export function PageHeading({ title, subTitle }: { title: string; subTitle?: string }) {
  return (
    <>
      <Heading level={1} size="xxl">
        {title}
      </Heading>
      {subTitle && (
        <Heading level={2} size="xl">
          {subTitle}
        </Heading>
      )}
    </>
  )
}
