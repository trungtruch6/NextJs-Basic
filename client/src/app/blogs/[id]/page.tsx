"use client";
import React from "react";
import { Typography, Textarea, Button } from "@material-tailwind/react";
import Link from "next/link";
import useSWR, { Fetcher } from "swr";

import { path } from "../../../ultils/constant";
import { Loading } from "../../../components";
const fetcher: Fetcher<IBlog, string> = (url: string) =>
  fetch(url).then((response) => response.json());

const page = ({ params }: { params: { id: string } }) => {
  const { data, error, isLoading } = useSWR(
    `http://localhost:8000/blogs/${params?.id}`,
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
  console.log(data);
  return (
    <div className="flex flex-col gap-5 items-center justify-center">
      <div className="w-3/4 h-auto flex flex-col shadow-md">
        <div className="h-1/4 flex-none w-full flex justify-center border-t border-l border-r border-gray-400 rounded-tl-md rounded-tr-md p-5 bg-blue-gray-50">
          <Typography color="blue-gray" className="font-normal">
            {data?.title}
          </Typography>
        </div>
        <div className="flex-auto w-full flex flex-col justify-center border-l border-r border-t border-gray-400 p-5">
          <div className="flex justify-center">
            <Typography color="blue-gray" className="font-normal">
              Content
            </Typography>
          </div>
          <div className="w-full h-auto">
            <Textarea label="Content" readOnly value={data?.content} />
          </div>
        </div>
        <div className="h-1/4 flex-none w-full flex justify-center border border-gray-400 p-5 rounded-bl-md rounded-br-md bg-blue-gray-50">
          <Typography color="blue-gray" className="font-normal">
            {data?.author}
          </Typography>
        </div>
      </div>
      <div className="flex items-end justify-end w-3/4">
        <Link href={path.BLOGS}>
          <Button color="blue">Go back</Button>
        </Link>
      </div>
    </div>
  );
};

export default page;
