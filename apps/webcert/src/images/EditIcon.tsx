import type { SVGProps } from 'react'
import { forwardRef } from 'react'

export const EditIcon = forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>((props, ref) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30" {...props}>
      <path
        fill="currentColor"
        d="m2.744 23.66 3.132 3.132 1.061-1.06-3.132-3.133-1.061 1.06ZM17.73 8.673l3.133 3.133 1.06-1.06-3.132-3.133-1.06 1.06ZM19.546 6.858l3.132 3.132 1.061-1.06-3.132-3.133-1.061 1.06Z"
      />
      <path
        fill="currentColor"
        fill-rule="evenodd"
        d="M1.288 22.995 23.484.799a2.727 2.727 0 0 1 3.856 0l1.398 1.397a2.727 2.727 0 0 1 0 3.856L6.542 28.25 0 29.536l1.288-6.541Zm1.383.738-.768 3.9 3.9-.768L27.678 4.992a1.227 1.227 0 0 0 0-1.735L26.28 1.859a1.227 1.227 0 0 0-1.734 0L2.67 23.733Z"
        clip-rule="evenodd"
      />
    </svg>
  )
})

EditIcon.displayName = 'EditIcon'
