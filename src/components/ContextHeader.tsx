interface ContextHeaderProps {
  headline: string;
  subtext: string;
}

const ContextHeader = ({ headline, subtext }: ContextHeaderProps) => {
  return (
    <section className="border-b border-border px-4 py-4">
      <h1 className="font-serif text-display text-foreground">{headline}</h1>
      <p className="mt-1 text-body text-muted-foreground text-block">{subtext}</p>
    </section>
  );
};

export default ContextHeader;
