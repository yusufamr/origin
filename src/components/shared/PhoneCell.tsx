interface PhoneCellProps {
  phone: string
  phone2?: string | null
}

export function PhoneCell({ phone, phone2 }: PhoneCellProps) {
  return (
    <div>
      <div>{phone}</div>
      {phone2 && <div className="text-xs opacity-70">{phone2}</div>}
    </div>
  )
}
