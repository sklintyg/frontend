import { IDSContainer, IDSFooter, IDSHeader } from '@inera/ids-react'

function App() {
  return (
    <>
      <IDSHeader type="inera-admin" className="ids-hide ids-show-inera-admin" brandText="Rehabstöd" />
      <main>
        <IDSContainer>
          <p className="ids-body">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
        </IDSContainer>
      </main>
      <IDSFooter type="inera-admin" headline="Rehabstöd" />
    </>
  )
}

export default App
