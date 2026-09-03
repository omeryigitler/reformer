export function SiteFooter({ socialLinks, contactInfo }: any) {
  return (
    <footer className="py-8 text-center text-sm text-stone-600">
      <p>Reformer Pilates Malta Footer (Mock)</p>
      <p>{contactInfo?.address}</p>
    </footer>
  );
}
