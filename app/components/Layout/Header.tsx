import { NavBar } from '@app/components/Layout/NavBar/NavBar';
import { Logo } from '@app/components/Logo/Logo';
import testIds from '@app/utils/test-ids';
import Link from 'next/link';

const Header = () => (
  <>
    <header
      className="w-full my-4 px-3 sm:px-8"
      data-testid={testIds.LAYOUT.HEADER}
    >
      <div className="flex sm:px-6 sm:px-14 h-header sm:items-center sm:gap-4 sm:gap-8">
        <h2 className="flex-1">
          <Link
            href="/"
            className="flex flex-col sm:flex-row items-center gap-2 sm:gap-6"
          >
            <Logo />
          </Link>
        </h2>
        <div>
          <NavBar />
        </div>
      </div>
    </header>
  </>
);

export default Header;
