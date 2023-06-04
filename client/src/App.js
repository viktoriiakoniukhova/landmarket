import { useEffect, useState } from "react";
import { Outlet, useOutletContext } from "react-router-dom";
import Navbar from "./scenes/global/navbar/Navbar";
import Footer from "./scenes/global/footer/Footer";

function App() {
  const initialUser = {
    token: "",
    id: "",
  };

  //Update if user logged in
  const [user, setUser] = useState(() => {
    const storedToken = localStorage.getItem("token");
    const storedId = localStorage.getItem("id");
    const initialToken = JSON.parse(storedToken);
    const initialId = JSON.parse(storedId);

    return initialToken ? { token: initialToken, id: initialId } : initialUser;
  });

  // localStorage.clear();
  const [stats, setStats] = useState({
    annos: 0,
    agents: 0,
    visits: 0,
  });

  const [annos, setAnnos] = useState([]);
  const [navbarHeight, setNavbarHeight] = useState();
  const [regionClicked, setRegionClicked] = useState({ code: "", title: "" });
  // const [wishlsitClicked, setWishlsitClicked] = useState(false);
  // const [myAnnosClicked, setMyAnnosClicked] = useState(false);

  useEffect(() => {
    fetchAnnos();
  }, []);

  useEffect(() => {
    setStats((prevStats) => ({ ...prevStats, annos: annos.length - 1 }));
  }, [annos]);

  function fetchAnnos() {
    fetch(`${process.env.REACT_APP_URL}/api/anno/all`)
      .then((res) => res.json())
      .then((data) => {
        setAnnos(data);
      });
  }

  return (
    <div className="app">
      <Navbar user={user} setUser={setUser} setNavbarHeight={setNavbarHeight} />
      <Outlet
        context={{
          user,
          setUser,
          stats,
          annos,
          navbarHeight,
          regionClicked,
          setRegionClicked,
        }}
      />
      <Footer />
    </div>
  );
}

export default App;

export function useInfo() {
  return useOutletContext();
}
