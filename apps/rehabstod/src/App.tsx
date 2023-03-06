import { IDSButton, IDSContainer, IDSFooter, IDSHeader } from '@frontend/ids-react-ts'

export function App() {
  return (
    <>
      <IDSHeader type="inera-admin" className="ids-hide ids-show-inera-admin" brandText="Rehabstöd" />
      <main>
        <IDSContainer>
          <p className="ids-body">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            <IDSButton onClick={(e) => console.log(e)}>Test</IDSButton>
          </p>
        </IDSContainer>
      </main>
      <IDSFooter type="inera-admin" headline="Rehabstöd" />
    </>
  )
}
