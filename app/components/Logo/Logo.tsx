import Image from 'next/image';

export const Logo = () => {
  return (
    <Image
      src="/images/logo.png" // caminho relativo à pasta public
      alt="Logo"
      width={50}
      height={50}
      className="inline-block h-5 sm:h-10"
    />
  );
};
