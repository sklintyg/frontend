import type { FallbackProps } from 'react-error-boundary'

export const ErrorMessage = ({ error }: FallbackProps) => <>Ett fel har inträffat: {error.message}</>
