import useDarkMode from "../../hooks/useDarkMode";

const NavBar = () => {
  const [darkMode, toggleDarkMode] = useDarkMode();
  return (
    <div>
      <button onClick={toggleDarkMode}>
        Toggle {darkMode ? "Light" : "Dark"} Mode
      </button>
    </div>
  );
};

export default NavBar;
