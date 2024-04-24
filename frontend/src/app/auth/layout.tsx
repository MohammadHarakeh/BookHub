export default function AuthLayout({
  children,
  register,
}: {
  children: React.ReactNode;
  register: React.ReactNode;
}) {
  return (
    <div>
      <div> {children}</div>
      <div>{register}</div>
    </div>
  );
}
