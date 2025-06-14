import { Link } from 'react-router-dom';

export const LandingPage = () => {
  return (
    <>
      <div className="flex flex-col w-screen h-screen items-center justify-center text-[var(--primary-text)]">
        <h1 className="text-3xl font-semibold">Landing Page</h1>
        <Link to='/mp' className="border-2 p-3 m-3 rounded-xl cursor-pointer transition duration-200 hover:border-[var(--highlight-text)] hover:text-[var(--highlight-text)]">Get Started</Link>
      </div>
    </>
  );
}
