import { useEffect, useState } from "react";
import Router from "./router/Router";
import publicRoutes from "./router/routes/publicRoutes";
import { getRoutes } from "./router/routes";
import { useDispatch } from "react-redux";
import { get_user_info } from "./store/Reducers/authReducer";

function App() {
  const dispatch = useDispatch()
  const [allRoutes, setAllRoutes] = useState([...publicRoutes])
  const [authReady, setAuthReady] = useState(false)

  useEffect(() => {
    const routes = getRoutes()
    setAllRoutes([...allRoutes, routes])
  }, [])

  useEffect(() => {
    dispatch(get_user_info()).finally(() => {
      setAuthReady(true)
    })
  }, [])

  if (!authReady) {
    return null
  }

  return <Router allRoutes={allRoutes} />;
}

export default App;
