import { z } from 'zod'

export enum AgandeForm {
  PRIVAT = 'PRIVAT',
}

export const AgandeFormEnum = z.nativeEnum(AgandeForm)
