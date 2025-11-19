import SidePanel from "../../components/sidePanel/SidePanel";

const Home = () => {
  return (
    <main className="flex">
      <SidePanel />
      {/* Content section */}
      <div className="flex-1 p-6">
        <h1>project details</h1>
      </div>
    </main>
  );
};

export default Home;
