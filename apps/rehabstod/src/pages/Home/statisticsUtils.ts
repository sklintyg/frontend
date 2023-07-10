import { Gender } from '../../schemas/patientSchema'

export const getGenderText = (gender: Gender) => {
  if (!gender) {
    return ''
  }

  return gender === Gender.M ? 'för män' : 'för kvinnor'
}
