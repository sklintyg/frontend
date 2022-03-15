import DOMPurify from 'dompurify'

export const sanitizeText = (text: string) => {
  return { __html: DOMPurify.sanitize(text) }
}
