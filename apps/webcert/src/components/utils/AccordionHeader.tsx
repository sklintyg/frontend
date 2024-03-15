import styled from 'styled-components'

const AccordionHeader = styled.summary.attrs({
  tabIndex: 0,
  className: 'ic-expandable-button iu-focus ic-expandable-button--chevron iu-fs-400 iu-mb-300',
})`
  justify-content: flex-start;
  align-items: flex-start;
  padding-left: 0 !important;
  margin-bottom: 0.625rem !important;
  padding-right: 40px !important;

  & ::after {
    top: 20px !important;
  }

  &:focus {
    outline-width: 2px;
    outline-style: solid;
    outline-color: #a1958a;
    outline-offset: 3px;
    margin-bottom: 0.625rem !important;
  }
`

export default AccordionHeader
