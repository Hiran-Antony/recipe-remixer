"use client";

import dynamic from "next/dynamic";

const ChefMascot = dynamic(() => import("./ChefMascot"), { ssr: false });

export default function ChefMascotLoader() {
  return <ChefMascot />;
}
