import { Sidebar } from "./Sidebar";
import { Main } from "./Main";

export const Upload = () => {
	return(
		<>
      <div className="flex text-[var(--primary-text)] h-screen">
        <Sidebar />
        <Main />
      </div>
    </>
	);
}