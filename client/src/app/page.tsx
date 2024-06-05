import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { AuthTabs } from "@/components/AuthTabs";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col gap-1">
      <MaxWidthWrapper className="mb-12 sm:mt-32 flex flex-col items-center justify-center text-center">
        <div className="mx-auto mb-4 flex max-w-fit items-center justify-center space-x-2 overflow-hidden rounded-full border px-7 py-2 shadow-md backdrop-blur transition-all">
          <p className="text-sm font-semibold text-gray-700">
            Ingresa a tu cuenta!
          </p>
        </div>
        <h1 className="max-w-5xl text-5xl font-bold md:text-6xl lg:text-7xl">
          Chatea con tus <span className="text-primary">documentos</span> en
          segundos.
        </h1>
      </MaxWidthWrapper>
      <div className="mt-10 flex items-center justify-center">
        <AuthTabs />
      </div>
    </main>
  );
}
