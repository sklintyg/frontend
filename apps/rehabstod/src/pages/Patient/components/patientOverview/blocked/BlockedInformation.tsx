export function BlockedInformation({ items }: { items: string[] }) {
  return (
    <>
      {items.map((item) => (
        <p key={item} className="pb-3">
          {item}
        </p>
      ))}
    </>
  )
}
