import styled from 'styled-components'

const Text = styled.p`
  max-height: 195px;
  overflow-y: auto;
  white-space: pre-wrap;

  ol {
    list-style-position: inside;
    list-style-type: decimal;
    white-space: normal;

    li {
      padding-bottom: 5px;
      padding-top: 5px;
    }
  }

  ul {
    list-style: disc;
    padding-left: 40px;
    margin-bottom: 10px;
    li {
      padding-bottom: unset;
      padding-top: unset;
    }
  }
`
export default Text
