import { User, UserUrval } from '../../../schemas'

export function CurrentSickLeavesHeading({ user }: { user?: User }) {
  const isDoctor = user?.urval === UserUrval.ISSUED_BY_ME
  const headline = isDoctor ? 'Mina pågående sjukfall' : 'Alla pågående sjukfall'

  return (
    <>
      <div className="print:hidden">
        <h1 className="ids-heading-2">{headline}</h1>
        <h2 className="ids-heading-3 mb-10">{user && user.valdVardenhet ? user.valdVardenhet.namn : ''}</h2>
        <hr className="opacity-40 " />
      </div>
      <div className="hidden print:block">
        <h1 className="ids-heading-3 mb-5">
          {headline} på {user && user.valdVardenhet ? user.valdVardenhet.namn : ''}
        </h1>
      </div>
    </>
  )
}
