export default function AuthLayout({
  children,
  login,
  register,
}: {
  children: React.ReactNode;
  login: React.ReactNode;
  register: React.ReactNode;
}) {
  const isLoggedIn = false;
  return isLoggedIn ? (
    <div>
      <div> {children}</div>
      <div>{register}</div>
    </div>
  ) : (
    login
  );
}
