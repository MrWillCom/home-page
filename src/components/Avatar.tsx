import AvatarImage from '@/assets/avatar.jpg'
import Image from 'next/image'
import type { SetOptional } from 'type-fest'

export default function Avatar({
  alt = 'Avatar',
  width = 160,
  height = 160,
  placeholder = 'blur',
  ...props
}: SetOptional<React.ComponentProps<typeof Image>, 'src' | 'alt'>) {
  return (
    <Image
      alt={alt}
      width={width}
      height={height}
      placeholder={placeholder}
      {...props}
      src={AvatarImage}
    />
  )
}
