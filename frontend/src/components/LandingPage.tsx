import { Sidebar } from "./Sidebar";

export const LandingPage = () => {
  return (
    <>
    	<div className="flex text-[var(--primary-text)] h-screen">
				<Sidebar />
				<div className="flex flex-1 items-center justify-center">
					<h1 className="text-center text-3xl">Landing Page</h1>
				</div>
			</div>
    </>
  );
}