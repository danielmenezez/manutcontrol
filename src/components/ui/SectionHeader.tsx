interface SectionHeaderProps {
  tag: string;
  title: string;
  text: string;
}

export function SectionHeader({ tag, title, text }: SectionHeaderProps) {
  return (
    <div className="mb-5 max-w-4xl">
      <p className="mb-2 text-xs font-black uppercase text-brand-700">{tag}</p>
      <h2 className="text-2xl font-black text-slate-950 md:text-3xl">{title}</h2>
      <p className="mt-3 max-w-3xl leading-7 text-slate-600">{text}</p>
    </div>
  );
}
