import React from 'react'
import { CustomButton } from '../Inputs/CustomButton'
import ExternalLinkIcon from '../image/image/ExternalLinkIcon'
import { ButtonWrapper, Footer } from './Styles'

interface IcfFooterProps {
  handleToggleDropdownButtonClick: () => void
}

const IcfFooter: React.FC<IcfFooterProps> = ({ handleToggleDropdownButtonClick }) => {
  return (
    <Footer className={'iu-bg-secondary-light iu-p-300'}>
      <ButtonWrapper>
        <CustomButton className={'iu-mr-200'} onClick={handleToggleDropdownButtonClick}>
          Stäng
        </CustomButton>
      </ButtonWrapper>
      <a rel="noreferrer" target={'_blank'} href={'https://www.socialstyrelsen.se/statistik-och-data/klassifikationer-och-koder/icf'}>
        Läs mer om ICF hos Socialstyrelsen
        <ExternalLinkIcon className={'iu-ml-100'} />
      </a>
    </Footer>
  )
}

export default IcfFooter
