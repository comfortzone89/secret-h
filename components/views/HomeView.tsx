import Button from "../../components/templates/Button";

interface HomeViewProps {
  onClick: (mode: "create" | "join") => void;
}

export default function HomeView({ onClick }: HomeViewProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full space-y-6">
      <p>Choose an option to get started</p>

      <div className="flex space-x-4">
        <Button onClick={() => onClick("create")}>Create Game</Button>
        <Button onClick={() => onClick("join")}>Join Game</Button>
      </div>
    </div>
  );
}
