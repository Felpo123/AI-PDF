"use client";

import UploadButton from "./UploadButton";
import Link from "next/link";
import { Ghost, MessageSquare, Plus } from "lucide-react";
import { format } from "date-fns";
import Skeleton from "react-loading-skeleton";
import { useState } from "react";

function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);

  const mockFiles = [
    {
      id: "1",
      name: "file1",
      createdAt: "2021-09-01T00:00:00.000Z",
    },
    {
      id: "2",
      name: "file2",
      createdAt: "2021-09-02T00:00:00.000Z",
    },
    {
      id: "3",
      name: "file3",
      createdAt: "2021-09-03T00:00:00.000Z",
    },
  ];

  //crea un intervalo de 1500 ms para simular la carga de los archivos
  setTimeout(() => {
    setIsLoading(false);
  }, 1500);

  // hacer llamada a la api para obtener los archivos

  return (
    <main className="mx-auto max-w-7xl md:p-10">
      <div className="mt-8 flex flex-col items-start justify-between gap-4 border-b border-gray-200 pb-5 sm:flex-row sm:items-center sm:gap-0">
        <h1 className="mb-3 font-bold text-5xl text-gray-900">Mis PDFs</h1>

        <UploadButton />
      </div>

      {/* display all user files */}
      {mockFiles && mockFiles?.length !== 0 ? (
        <ul className="mt-8 grid grid-cols-1 gap-6 divide-y divide-zinc-200 md:grid-cols-2 lg:grid-cols-3">
          {mockFiles
            .sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            )
            .map((file) => (
              <li
                key={file.id}
                className="col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow transition hover:shadow-lg"
              >
                <Link
                  href={`/dashboard/${file.id}`}
                  className="flex flex-col gap-2"
                >
                  <div className="pt-6 px-6 flex w-full items-center justify-between space-x-6">
                    <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gradient-to-r from-primary-foreground to-primary" />
                    <div className="flex-1 truncate">
                      <div className="flex items-center space-x-3">
                        <h3 className="truncate text-lg font-medium text-zinc-900">
                          {file.name}
                        </h3>
                      </div>
                    </div>
                  </div>
                </Link>

                <div className="px-6 mt-4 grid grid-cols-3 place-items-center py-2 gap-6 text-xs text-zinc-500">
                  <div className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    {format(new Date(file.createdAt), "MMM yyyy")}
                  </div>

                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    mocked
                  </div>
                </div>
              </li>
            ))}
        </ul>
      ) : isLoading ? (
        <Skeleton height={100} className="my-2" count={3} />
      ) : (
        <div className="mt-16 flex flex-col items-center gap-2">
          <Ghost className="h-8 w-8 text-zinc-800" />
          <h3 className="font-semibold text-xl">Pretty empty around here</h3>
          <p>Let&apos;s upload your first PDF.</p>
        </div>
      )}
    </main>
  );
}

export default Dashboard;
