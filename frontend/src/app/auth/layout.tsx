export default function AuthLayout({
  login,
  register,
}: {
  login: React.ReactNode;
  register: React.ReactNode;
}) {
  const isLoggedIn = false;
  return isLoggedIn ? (
    <div>
      <div>{register}</div>
    </div>
  ) : (
    login
  );
}
