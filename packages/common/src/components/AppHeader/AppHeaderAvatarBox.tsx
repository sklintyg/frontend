import React from 'react'

interface Props {
  userItems?: React.ReactNode
  links?: React.ReactNode[]
}

const AppHeaderAvatarBox: React.FC<Props> = (props) => {
  return (
    <div className="ic-page-header__item iu-mr-gutter ic-avatar-box">
      <div role="presentation" className="iu-svg-icon iu-mr-300 ic-avatar-box__icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 35 35">
          <path
            fill="#6A0032"
            d="M24.719 10.5c0-3.524-3.106-6.344-7.219-6.344-3.364 0-6.344 2.935-6.344 6.344 0 3.87 3.232 8.094 6.344 8.094 3.847 0 7.219-4.062 7.219-8.094zm1.312 0c0 4.709-3.9 9.406-8.531 9.406-3.925 0-7.656-4.875-7.656-9.406 0-4.138 3.571-7.656 7.656-7.656 4.811 0 8.531 3.377 8.531 7.656z"
            transform="translate(-1058 -171) translate(0 140) translate(1058 31)"
          />
          <g fill="#6A0032">
            <path
              d="M23.595 10.719c-.06-.194-.122-.398-.187-.62-.07-.234-.082-.277-.255-.879-.851-2.957-1.391-4.216-2.534-5.383-1.486-1.516-3.82-2.306-7.494-2.306-4.076 0-6.657.816-8.275 2.378C3.617 5.1 3.056 6.37 2.177 9.385l-.21.716c-.066.222-.127.426-.187.618h21.815zm-23.34.44c.146-.42.285-.86.454-1.431l.208-.71c.942-3.232 1.57-4.65 3.022-6.053C5.83 1.137 8.737.219 13.125.219c4 0 6.672.903 8.432 2.7 1.346 1.374 1.947 2.775 2.857 5.938l.253.872c.165.56.306 1.007.453 1.43.148.427-.169.872-.62.872H.875c-.451 0-.768-.445-.62-.871z"
              transform="translate(-1058 -171) translate(0 140) translate(1058 31) translate(5.25 21)"
            />
            <path
              d="M20.117 10.955c.07.355-.16.7-.516.771-.355.07-.7-.16-.771-.516l-.666-3.353c-.07-.356.16-.701.516-.772.355-.07.7.16.771.516l.666 3.354zM5.515 7.601c.07-.355.416-.586.771-.516.356.071.586.416.516.772l-.666 3.353c-.07.356-.416.587-.771.516-.356-.07-.587-.416-.516-.771L5.515 7.6z"
              transform="translate(-1058 -171) translate(0 140) translate(1058 31) translate(5.25 21)"
            />
          </g>
          <path
            fill="#C12143"
            d="M16.844 10.281H14c-.362 0-.656-.294-.656-.656 0-.362.294-.656.656-.656h3.5c.362 0 .656.294.656.656v3.719h1.094c.362 0 .656.294.656.656 0 .362-.294.656-.656.656H17.5c-.362 0-.656-.294-.656-.656v-3.719z"
            transform="translate(-1058 -171) translate(0 140) translate(1058 31)"
          />
        </svg>
      </div>
      <div className="iu-lh-narrow">
        <p className=" ic-avatar-box__name">{props.userItems}</p>
        <p className="iu-hide-md iu-hide-sm iu-display-flex">{props.links}</p>
      </div>
    </div>
  )
}

export default AppHeaderAvatarBox
