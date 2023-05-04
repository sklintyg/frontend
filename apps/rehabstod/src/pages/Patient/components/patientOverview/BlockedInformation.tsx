export function BlockedInformation({ items }: { items: string[] }) {
  return (
    <>
      {items.map((item) => (
        <p key={item}>{item}</p>
      ))}
    </>
  )
}
