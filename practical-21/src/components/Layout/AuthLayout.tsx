import React from "react";

type AuthLayoutProps = React.PropsWithChildren<{
  title: string;
  subtitle?: string;
}>;

export default function AuthLayout({ title, subtitle, children }: AuthLayoutProps) {
  return (
    <div className="relative isolate flex h-screen items-center justify-center overflow-hidden bg-neutral-950 px-4 py-10">
      <div className="pointer-events-none absolute inset-0"></div>
      <div className="relative w-full max-w-md sm:max-w-lg">
        <div className="overflow-hidden rounded-2xl border border-white/20 bg-neutral-800 shadow-2xl">
          <div className="bg-neutral-900/60 p-8 sm:p-10">
            <div className="mb-7 text-center">
              <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">{title}</h1>
              {subtitle ? <p className="mt-2 text-sm leading-6 text-white/60">{subtitle}</p> : null}
            </div>
            <div className="space-y-6">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
