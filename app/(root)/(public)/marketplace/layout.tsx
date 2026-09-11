export default function MarketplacePage({
  children,
}: {
  children: React.ReactNode;
}): React.ReactNode {
  return (
    <div className="min-h-screen bg-slate-50 pt-20">
      {/* Marketplace content */}
      {children}
    </div>
  );
}
