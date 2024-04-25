export default function AuthLayout({
  login,
  register,
}: {
  login: React.ReactNode;
  register: React.ReactNode;
}) {
  const isLoggedIn = true;
  return isLoggedIn ? (
    <div>
      <div>{register}</div>
    </div>
  ) : (
    login
  );
}
