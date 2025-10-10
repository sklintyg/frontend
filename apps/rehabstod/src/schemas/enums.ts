import { z } from 'zod'

enum AgandeForm {
  PRIVAT = 'PRIVAT',
}

export const AgandeFormEnum = z.nativeEnum(AgandeForm)
