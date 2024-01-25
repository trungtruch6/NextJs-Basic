"use client";
import React from "react";
import useSWR from "swr";

import { DataTable } from "../../containers";
import { Loading } from "../../components";

const fetcher = (url: string) => fetch(url).then((response) => response.json());

const page = () => {
  const { data, error, isLoading } = useSWR(
    "http://localhost:8000/blogs",
    fetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );
  if (isLoading || !data)
    return (
      <div className="flex items-center justify-center">
        <Loading />
      </div>
    );
  if (error)
    return (
      <div>
        <p>Error: {error.message}</p>
      </div>
    );
  return (
    <div className="flex items-center justify-center">
      <div className="w-3/4 h-[300px]">
        <DataTable blogs={data?.sort((a: any, b: any) => b.id - a.id)} />
      </div>
    </div>
  );
};

export default page;
