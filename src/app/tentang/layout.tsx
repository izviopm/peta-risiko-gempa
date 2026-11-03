import SubNavTentang from "@/components/SubNavTentang";

export default function LayoutTentang({ children }: LayoutProps<"/tentang">) {
  return (
    <>
      <SubNavTentang />
      {children}
    </>
  );
}
