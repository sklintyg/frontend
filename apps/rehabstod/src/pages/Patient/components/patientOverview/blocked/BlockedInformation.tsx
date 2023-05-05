export function BlockedInformation({ items, inline = false }: { items: string[]; inline?: boolean }) {
  return inline ? (
    <p className="pb-3">
      {items.map((item, index) => (
        <span key={item}>
          {item}
          {index !== items.length - 1 && ', '}
        </span>
      ))}
    </p>
  ) : (
    <>
      {items.map((item) => (
        <p key={item} className="pb-3">
          {item}
        </p>
      ))}
    </>
  )
}
