import type { ReactNode } from 'react'

export function GenderGraph({ percentage, color, children }: { percentage: number; color: string; children: ReactNode }) {
  return (
    <div>
      <svg width="81" height="74" viewBox="0 0 81 74" fill={color} className="pb-1" xmlns="http://www.w3.org/2000/svg">
        <path d="M40.5 74L27 63.4286H6.75C4.95 63.4286 3.375 62.8853 2.025 61.7988C0.675 60.7123 0 59.4937 0 58.1429V5.28571C0 3.87619 0.675 2.64286 2.025 1.58571C3.375 0.528572 4.95 0 6.75 0H74.25C75.975 0 77.5312 0.528572 78.9188 1.58571C80.3063 2.64286 81 3.87619 81 5.28571V58.1429C81 59.4937 80.3063 60.7123 78.9188 61.7988C77.5312 62.8853 75.975 63.4286 74.25 63.4286H54L40.5 74ZM6.75 58.1429H29.7L39.8769 55.5L51.3 58.1429H74.25H6.75Z" />
        <text x="27" y="38" className="fill-white">
          {`${Math.round(percentage)} %`}
        </text>
      </svg>
      {children}
    </div>
  )
}
