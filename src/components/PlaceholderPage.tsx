interface PlaceholderPageProps {
  title: string;
}

const PlaceholderPage = ({ title }: PlaceholderPageProps) => {
  return (
    <div className="flex flex-1 items-center justify-center bg-background px-3">
      <div className="text-center">
        <h1 className="font-serif text-display text-foreground">{title}</h1>
        <p className="mt-2 text-body text-muted-foreground">
          This section will be built in the next step.
        </p>
      </div>
    </div>
  );
};

export default PlaceholderPage;
