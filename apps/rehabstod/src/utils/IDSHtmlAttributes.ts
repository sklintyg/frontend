export type OmitByType<T, K> = Omit<T, keyof K>

export type IDSHtmlAttribute<A, B, C> = OmitByType<OmitByType<B, A> & A, C> & C
