import { makeStyles, Paper } from '@material-ui/core'
import React, { useRef, useState } from 'react'

const useStyles = makeStyles((theme) => ({
  // default: {
  //   '-webkit-transform': 'scaleY(0)',
  //   transform: 'scaleY(0)',
  //   transition: 'transform 250ms ease-in-out, opacity 250ms ease-in-out',
  //   willChange: 'transform, opacity',
  //   opacity: 0,
  //   transformOrigin: 'top',
  // },
  // open: {
  //   '-webkit-transform': 'none',
  //   transform: 'scaleY(1)',
  //   opacity: 1,
  //   position: 'static',
  // },
  // absolute: {
  //   position: 'absolute',
  // },
  // static: {
  //   position: 'static',
  // },
  default: {
    maxHeight: 0,
    opacity: 0,
    display: 'none',
    willChange: 'max-height, opacity',
    transition: 'max-height 250ms ease-in-out, opacity 250ms ease-in-out',
  },
  open: {
    maxHeight: 'initial',
    opacity: 1,
    display: 'block',
  },
}))

interface Props {
  isExpanded: boolean
  additionalStyles?: string
}

const Expandable: React.FC<Props> = ({ isExpanded, children, additionalStyles }) => {
  const classes = useStyles()
  const [isStatic, setIsStatic] = useState(false)
  const ref = useRef(null)

  // Lista ut ett coolt sätt att sätta position absolute efter att transition är klar, när isExpanded går från true till false

  // useEffect(() => {
  //   ref.current.addEventListener('transition', () => {
  //     if (isExpanded) {
  //       ref.current.classList.remove(classes.absolute)
  //       ref.current.classList.add(classes.static)
  //     }
  //   })
  //   ref.current.addEventListener('transitionend', () => {
  //     if (!isExpanded) {
  //       ref.current.classList.add(classes.absolute)
  //       ref.current.classList.remove(classes.static)
  //     }
  //   })
  // }, [])

  // const handleTransitionEnd = (event: React.TransitionEvent<HTMLDivElement>) => {
  //   if (!isExpanded) {
  //     event.currentTarget.classList.remove(classes.static)
  //   }
  // }

  // useEffect(() => {
  //   if (isExpanded) {
  //     setIsStatic(true)
  //   } else {
  //     setTimeout(() => {
  //       setIsStatic(false)
  //     }, 10)
  //   }
  // })

  // useEffect(() => {
  //   if (isExpanded) {
  //     expandSection(ref.current)
  //   } else {
  //     collapseSection(ref.current)
  //   }
  // })

  // function collapseSection(element: any) {
  //   // get the height of the element's inner content, regardless of its actual size
  //   var sectionHeight = element.scrollHeight

  //   // temporarily disable all css transitions
  //   var elementTransition = element.style.transition
  //   element.style.transition = ''

  //   // on the next frame (as soon as the previous style change has taken effect),
  //   // explicitly set the element's height to its current pixel height, so we
  //   // aren't transitioning out of 'auto'
  //   requestAnimationFrame(function() {
  //     element.style.height = sectionHeight + 'px'
  //     element.style.transition = elementTransition

  //     // on the next frame (as soon as the previous style change has taken effect),
  //     // have the element transition to height: 0
  //     requestAnimationFrame(function() {
  //       element.style.height = 0 + 'px'
  //     })
  //   })

  //   // mark the section as "currently collapsed"
  //   element.setAttribute('data-collapsed', 'true')
  // }

  // function expandSection(element: any) {
  //   // get the height of the element's inner content, regardless of its actual size
  //   var sectionHeight = element.scrollHeight

  //   // have the element transition to the height of its inner content
  //   element.style.height = sectionHeight + 'px'

  //   // when the next css transition finishes (which should be the one we just triggered)
  //   element.addEventListener('transitionend', function(e: any) {
  //     // remove this event listener so it only gets triggered once
  //     element.removeEventListener('transitionend', arguments.callee)

  //     // remove "height" from the element's inline styles, so it can return to its initial value
  //     element.style.height = null
  //   })

  //   // mark the section as "currently not collapsed"
  //   element.setAttribute('data-collapsed', 'false')
  // }

  // if (isExpanded) {
  //   return children
  // }

  return (
    // <div ref={ref} className={`${classes.default} ${isExpanded ? classes.open : ''} ${isExpanded ? classes.static : classes.absolute}`}>
    <div ref={ref} className={`expandable ${classes.default} ${isExpanded ? classes.open : ''} ${additionalStyles}`}>
      {children}
    </div>
    // </div>
  )
}

export default Expandable
