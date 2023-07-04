import { User, UserUrval } from '../schemas'

export const isUserDoctor = (user: User) => user.urval === UserUrval.ISSUED_BY_ME
