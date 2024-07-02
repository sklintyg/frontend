import type { User} from '../schemas';
import { UserUrval } from '../schemas'

export const isUserDoctor = (user: User) => user.urval === UserUrval.ISSUED_BY_ME
