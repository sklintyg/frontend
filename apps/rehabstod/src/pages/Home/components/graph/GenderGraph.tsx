import { Gender, GenderSummary } from '../../../../schemas/sickLeaveSchema'
import { Tooltip } from '../../../../components/Tooltip/Tooltip'
import { TooltipTrigger } from '../../../../components/Tooltip/TooltipTrigger'
import { TooltipContent } from '../../../../components/Tooltip/TooltipContent'

export function GenderGraph({ gender }: { gender: GenderSummary | undefined }) {
  if (!gender) {
    return null
  }
  const isFemale = gender.gender === Gender.F

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div>
          <svg
            width="81"
            height="74"
            viewBox="0 0 81 74"
            fill={isFemale ? 'var(--IDS-COLOR-ACCENT-40)' : 'var(--IDS-COLOR-PRIMARY-30)'}
            className="pb-1"
            xmlns="http://www.w3.org/2000/svg">
            <path d="M40.5 74L27 63.4286H6.75C4.95 63.4286 3.375 62.8853 2.025 61.7988C0.675 60.7123 0 59.4937 0 58.1429V5.28571C0 3.87619 0.675 2.64286 2.025 1.58571C3.375 0.528572 4.95 0 6.75 0H74.25C75.975 0 77.5312 0.528572 78.9188 1.58571C80.3063 2.64286 81 3.87619 81 5.28571V58.1429C81 59.4937 80.3063 60.7123 78.9188 61.7988C77.5312 62.8853 75.975 63.4286 74.25 63.4286H54L40.5 74ZM6.75 58.1429H29.7L39.8769 55.5L51.3 58.1429H74.25H6.75Z" />
            <text x="27" y="38" className="fill-white">
              {`${Math.round(gender ? gender.percentage : 0)} %`}
            </text>
          </svg>
          {!isFemale ? (
            <svg
              width="35"
              height="100"
              viewBox="0 0 35 100"
              fill="var(--IDS-COLOR-PRIMARY-30)"
              xmlns="http://www.w3.org/2000/svg"
              className="mx-auto"
              data-testid="iconFemale">
              <path d="M10 100V65H0V33.375C0 31.2917 0.729167 29.5208 2.1875 28.0625C3.64583 26.6042 5.41667 25.875 7.5 25.875H27.5C29.5833 25.875 31.3542 26.6042 32.8125 28.0625C34.2708 29.5208 35 31.2917 35 33.375V65H25V100H10ZM17.5 18.25C15 18.25 12.8542 17.3542 11.0625 15.5625C9.27083 13.7708 8.375 11.625 8.375 9.125C8.375 6.625 9.27083 4.47917 11.0625 2.6875C12.8542 0.895833 15 0 17.5 0C20 0 22.1458 0.895833 23.9375 2.6875C25.7292 4.47917 26.625 6.625 26.625 9.125C26.625 11.625 25.7292 13.7708 23.9375 15.5625C22.1458 17.3542 20 18.25 17.5 18.25Z" />
            </svg>
          ) : (
            <svg
              width="44"
              height="100"
              viewBox="0 0 44 100"
              fill="var(--IDS-COLOR-ACCENT-40)"
              xmlns="http://www.w3.org/2000/svg"
              className="mx-auto"
              data-testid="iconMale">
              <path d="M14.6667 100V72.5H0L12.4667 31.5C13.1185 29.4167 14.3407 27.8125 16.1333 26.6875C17.9259 25.5625 19.8815 25 22 25C24.1185 25 26.0741 25.5625 27.8667 26.6875C29.6593 27.8125 30.8815 29.4167 31.5333 31.5L44 72.5H29.3333V100H14.6667ZM22 18.25C19.5556 18.25 17.4574 17.3542 15.7056 15.5625C13.9537 13.7708 13.0778 11.625 13.0778 9.125C13.0778 6.625 13.9537 4.47917 15.7056 2.6875C17.4574 0.895833 19.5556 0 22 0C24.4444 0 26.5426 0.895833 28.2944 2.6875C30.0463 4.47917 30.9222 6.625 30.9222 9.125C30.9222 11.625 30.0463 13.7708 28.2944 15.5625C26.5426 17.3542 24.4444 18.25 22 18.25Z" />
            </svg>
          )}
        </div>
        <TooltipContent>{`${isFemale ? 'Kvinnor' : 'Män'} (${gender.count} st, ${Math.round(gender.percentage)} %)`}</TooltipContent>
      </TooltipTrigger>
    </Tooltip>
  )
}
