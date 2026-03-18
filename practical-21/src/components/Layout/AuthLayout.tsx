import React from "react";

type AuthLayoutProps = React.PropsWithChildren<{
  title: string;
  subtitle?: string;
}>;

export default function AuthLayout({ title, subtitle, children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 to-teal-950 flex items-center justify-center p-4">
      <div className="pointer-events-none absolute inset-0"></div>
      <div className="relative w-full max-w-md sm:max-w-lg">
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-2xl backdrop-blur ">
          <div className="bg-[#faf7f4] p-8 sm:p-10">
            <div className="mb-7 text-center">
              <h1 className="bg-gradient-to-br from-teal-500 to-teal-800  bg-clip-text text-transparent font-bold text-3xl">{title}</h1>
              {subtitle ? <p className="mt-2 text-sm leading-6 text-slate-600">{subtitle}</p> : null}
            </div>
            <div className="space-y-6">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
