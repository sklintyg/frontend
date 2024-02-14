import React, { ComponentProps } from 'react'
import { SVGIcon } from './SVGIcon'

export const ReplyIcon = ({ ...props }: ComponentProps<typeof SVGIcon>): React.ReactElement => (
  <SVGIcon viewBox="0 0 40 41" {...props}>
    <path d="M11.5088 28.5683L0 16.998L11.5088 5.42775C12.0787 4.85481 13.0027 4.85481 13.5726 5.42775C14.1425 6.00068 14.1425 6.92958 13.5726 7.50252L5.61953 15.498H20.5C25.2625 15.498 28.9341 16.693 31.7383 18.5625C34.5332 20.4257 36.3777 22.8993 37.5916 25.3272C38.8027 27.7493 39.4007 30.1532 39.6983 31.9389C39.8477 32.8354 39.923 33.5857 39.961 34.1177C39.9801 34.384 39.9898 34.5964 39.9948 34.7459C39.9973 34.8207 39.9986 34.8798 39.9993 34.9222L39.9999 34.9731L40 34.9889L40 34.9964C40 34.9964 40 34.998 38.5 34.998H40C40 35.8265 39.3284 36.498 38.5 36.498C37.6724 36.498 37.0013 35.8277 37 35.0004V34.998L37 34.9969L36.9996 34.9706C36.9992 34.9449 36.9983 34.9029 36.9964 34.8459C36.9926 34.7317 36.9848 34.5574 36.9687 34.3315C36.9363 33.8792 36.871 33.2232 36.7392 32.4321C36.4743 30.8429 35.9473 28.7468 34.9084 26.6689C33.8723 24.5968 32.3418 22.5704 30.0742 21.0586C27.8159 19.5531 24.7375 18.498 20.5 18.498H5.61953L13.5726 26.4936C14.1425 27.0665 14.1425 27.9954 13.5726 28.5683C13.0027 29.1413 12.0787 29.1413 11.5088 28.5683Z" />
  </SVGIcon>
)