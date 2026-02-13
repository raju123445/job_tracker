const Dashboard = () => {
  return (
    <div className="flex flex-1 items-center justify-center bg-background px-3">
      <div className="text-center max-w-[var(--text-max-width)]">
        <h1 className="font-serif text-display text-foreground">Dashboard</h1>
        <p className="mt-3 text-body text-muted-foreground">
          No jobs yet. In the next step, you will load a realistic dataset.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
