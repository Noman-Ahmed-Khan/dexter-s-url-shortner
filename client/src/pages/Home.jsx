import GeneratorUI from "../components/generatorUI";
import PageWrapper from "../components/PageWrapper";
import { HomeIcon } from "lucide-react";

export default function Home() {
  return (
    <PageWrapper>
      <div className="p-0">
        <GeneratorUI />
      </div>
    </PageWrapper>
  );
}
