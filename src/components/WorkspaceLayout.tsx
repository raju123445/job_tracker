import { ReactNode } from "react";

interface WorkspaceLayoutProps {
  primary: ReactNode;
  secondary: ReactNode;
}

const WorkspaceLayout = ({ primary, secondary }: WorkspaceLayoutProps) => {
  return (
    <div className="flex flex-1 min-h-0">
      <main className="w-[70%] overflow-y-auto border-r border-border p-4">
        {primary}
      </main>
      <aside className="w-[30%] overflow-y-auto p-3">
        {secondary}
      </aside>
    </div>
  );
};

export default WorkspaceLayout;
