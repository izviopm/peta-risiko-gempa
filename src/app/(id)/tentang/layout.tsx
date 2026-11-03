import SubNavTentang from "@/components/SubNavTentang";

export default function LayoutTentang({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SubNavTentang />
      {children}
    </>
  );
}
