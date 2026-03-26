import { useEffect, useLayoutEffect, useState } from "react";
import Router from "./router/Router";
import publicRoutes from "./router/routes/publicRoutes";
import { getRoutes } from "./router/routes";
import { useDispatch, useSelector } from "react-redux";
import { get_user_info } from "./store/Reducers/authReducer";

function App() {
  const dispatch = useDispatch()
  const darkMode = useSelector((state) => state.theme.darkMode)
  const { role, userInfo, token } = useSelector((state) => state.auth)
  const [allRoutes, setAllRoutes] = useState([...publicRoutes])
  const [authReady, setAuthReady] = useState(false)
  const [bootstrappedAuth, setBootstrappedAuth] = useState(false)

  useLayoutEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
  }, [darkMode])

  useEffect(() => {
    const routes = getRoutes()
    setAllRoutes([...allRoutes, routes])
  }, [])

  useEffect(() => {
    if (bootstrappedAuth) return

    setBootstrappedAuth(true)
    const isAuthenticated = Boolean(role || userInfo || token)

    if (!isAuthenticated) {
      setAuthReady(true)
      return
    }

    dispatch(get_user_info()).finally(() => {
      setAuthReady(true)
    })
  }, [dispatch, role, userInfo, token, bootstrappedAuth])

  if (!authReady) {
    return null
  }

  return <Router allRoutes={allRoutes} />;
}

export default App;
