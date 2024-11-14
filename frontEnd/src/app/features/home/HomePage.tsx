export const HomePage = () => {
  return (
    <div>
      <div>Welcome Home!</div>;
      <button
        onClick={() =>
          fetch("http://localhost:3000/api/auth/status").then(console.log)
        }
      >
        status
      </button>
    </div>
  );
};
