import Image from 'next/image';

export const Logo = () => {
  return (
    <Image
      src="/images/logo.png"
      alt="Logo"
      width={120}
      height={120}
      className="inline-block h-10 sm:h-10 w-auto"
      quality={100}
    />
  );
};
