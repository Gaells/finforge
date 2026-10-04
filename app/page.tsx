import { Dashboard } from "@/components/Dashboard";
import { PortfolioTeaser } from "@/components/Dashboard/PortfolioTeaser";

export default function Home() {
  return (
    <>
      <PortfolioTeaser />
      <Dashboard />
    </>
  );
}