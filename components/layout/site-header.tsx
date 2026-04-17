import Link from "next/link";
import { Fragment, type ReactNode } from "react";
import { ArrowUpRight, ChevronRight } from "lucide-react";

import { ThemeToggle } from "@/components/theme-toggle";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { buttonVariants } from "@/components/ui/button";
import { buildBreadcrumbs } from "@/lib/site";

type SiteHeaderProps = {
  pathname: string;
  mobileMenuTrigger: ReactNode;
};

export function SiteHeader({
  pathname,
  mobileMenuTrigger,
}: SiteHeaderProps) {
  const breadcrumbs = buildBreadcrumbs(pathname);

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background">
      <div className="px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="lg:hidden">{mobileMenuTrigger}</div>
            <Breadcrumb>
              <BreadcrumbList className="text-xs">
                {breadcrumbs.map((crumb, index) => {
                  const isLast = index === breadcrumbs.length - 1;

                  return (
                    <Fragment key={crumb.href}>
                      <BreadcrumbItem>
                        {isLast ? (
                          <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                        ) : (
                          <BreadcrumbLink render={<Link href={crumb.href} />}>
                            {crumb.label}
                          </BreadcrumbLink>
                        )}
                      </BreadcrumbItem>
                      {!isLast ? (
                        <BreadcrumbSeparator>
                          <ChevronRight className="size-3.5" />
                        </BreadcrumbSeparator>
                      ) : null}
                    </Fragment>
                  );
                })}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/contact"
              className={buttonVariants({ variant: "outline", size: "sm" })}
            >
              Prendre contact
            </Link>
            <Link
              href="/documents"
              className={buttonVariants({ variant: "default", size: "sm" })}
            >
              Ressources clés
              <ArrowUpRight className="size-3.5" />
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
