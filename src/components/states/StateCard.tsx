interface StateCardProps {
  title: string;
  message: string;
  detail?: string;
}

export function StateCard({ title, message, detail }: StateCardProps) {
  return (
    <section className="state-card">
      <h2 className="state-title">{title}</h2>
      <p>{message}</p>
      {detail ? <p className="section-copy">{detail}</p> : null}
    </section>
  );
}
