import Image from "next/image";

export default function Loading() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-6"
    >
      <div className="site-loading grid w-full max-w-56 justify-items-center gap-5 text-center">
        <div className="relative size-16 overflow-hidden rounded-xl border border-border bg-white shadow-sm">
          <Image
            src="/branding/comite-logo.png"
            alt=""
            fill
            priority
            className="object-contain p-1.5"
          />
        </div>
        <div className="space-y-2">
          <p className="text-sm font-semibold text-foreground">CD51TT</p>
          <div className="h-1 w-44 overflow-hidden rounded-full bg-muted">
            <div className="site-loading-bar h-full w-1/2 rounded-full bg-primary" />
          </div>
        </div>
        <span className="sr-only">Chargement en cours</span>
      </div>
    </div>
  );
}
