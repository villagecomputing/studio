'use client';
import { cn } from '@/lib/utils';
import { ChevronRightIcon } from 'lucide-react';
import { Route } from 'next';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { colors } from '../../tailwind.config';

type CustomSegment = {
  [routeSegment: string]: React.ReactNode;
};
interface BreadcrumbProps {
  customSeparator?: React.ReactNode;
  customSegments?: CustomSegment;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({
  customSegments,
  customSeparator,
}) => {
  const paths = usePathname();
  const pathNames = paths.split('/').filter((path) => !!path);

  const separator = customSeparator || (
    <ChevronRightIcon color={colors.slateGray500} size={18} />
  );

  return (
    <ul className="flex w-full items-center gap-1.5">
      {pathNames.map((segment, index) => {
        const element =
          customSegments && customSegments[segment] ? (
            customSegments[segment]
          ) : (
            <Link href={`/${pathNames.slice(0, index + 1).join('/')}` as Route}>
              {segment.charAt(0).toUpperCase() + segment.slice(1)}
            </Link>
          );
        return (
          <>
            <li
              key={index}
              className={cn([
                'text-lg',
                index === pathNames.length - 1
                  ? 'text-slateGray950'
                  : 'text-slateGray700',
              ])}
            >
              {element}
            </li>
            {index < pathNames.length - 1 && separator}
          </>
        );
      })}
    </ul>
  );
};

export default Breadcrumb;
