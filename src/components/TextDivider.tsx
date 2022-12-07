export default function TextDivider({ value }: { value: string }) {
  return (
    <div className='space-x-2 flex items-center my-4'>
      <div className='h-0.5 w-full bg-white'></div>
      <span className='text-white font-semibold'>{value}</span>
      <div className='h-0.5 w-full bg-white'></div>
    </div>
  )
}
