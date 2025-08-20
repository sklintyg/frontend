import { Heading } from '../Heading/Heading'

export function PageHeading({ title, subTitle }: { title: string; subTitle?: string }) {
  return (
    <>
      <Heading level={1} size="l" className={subTitle ? 'mb-3' : 'mb-5'}>
        {title}
      </Heading>
      {subTitle && (
        <Heading level={2} size="s" className="mb-6">
          {subTitle}
        </Heading>
      )}
    </>
  )
}
