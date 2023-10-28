function Header({ user }) {
  return (
    <header className="flex gap-4 bg-gray-900 text-white h-8">
      <h1>LoggedIn Home</h1>
      <p>Username: {user?.username}</p>
      <p>
        Username:{" "}
        {user?.cnpj.slice(0, 2) +
          "." +
          user?.cnpj.slice(2, 5) +
          "." +
          user?.cnpj.slice(5, 8) +
          "/" +
          user?.cnpj.slice(8, 12) +
          "-" +
          user?.cnpj.slice(12, 14)}
      </p>
    </header>
  );
}

export default Header;
