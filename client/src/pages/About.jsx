import PageWrapper from "../components/PageWrapper";
import { InfoIcon } from "lucide-react";

export default function About() {
  return (
    <PageWrapper>
      <div className="flex flex-col items-center justify-center text-center">
        <InfoIcon className="w-12 h-12 text-green-500 mb-4" />
        <h1 className="text-4xl font-bold">About Us</h1>
        <p className="text-gray-500 mt-2 max-w-xl">
          We’re building modern web experiences using Vite, React, Tailwind CSS, and Framer Motion.
        </p>
      </div>
    </PageWrapper>
  );
}
