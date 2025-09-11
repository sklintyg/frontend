import styled from 'styled-components'

const Accordion = styled.details.attrs({
  className: 'ic-card ic-card--expandable ic-card--sm-unset-style ic-expandable ic-card--inspiration-large iu-bg-white',
})`
  padding: 0 !important;
  overflow: visible;

  &:open > summary {
    padding-bottom: 0.625rem !important;
  }
`

export default Accordion
