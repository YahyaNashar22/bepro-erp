const Login = () => {
  return (
    <main className="h-screen">
      <form className="h-100 flex-col g-4 justify-center">
        <label className="g-2">
          Username
          <input type="text" placeholder="username" />
        </label>
        <label className="g-2">
          Password
          <input type="password" placeholder="password123"/>
        </label>
        <button type="submit">Login</button>
      </form>
    </main>
  );
};

export default Login;
