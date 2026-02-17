import Image from 'next/image';

export const Logo = () => {
  return (
    <Image
      src="/images/logo.png"
      alt="Logo"
      width={90}
      height={90}
      className="inline-block h-10 sm:h-20 w-auto"
    />
  );
};
