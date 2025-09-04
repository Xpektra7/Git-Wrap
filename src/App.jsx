import { createBrowserRouter, createRoutesFromElements, RouterProvider, Route } from "react-router-dom";

export default function App() {
  const routes = createRoutesFromElements(
    <Route path="/" element={<Home />} >
      <Route index element={<LandingPage />} />
      <Route path="username" element={<Stats />} />
      <Route path="notfound" element={<UserNotFound />} />
    </Route>
  );

  return (
    <RouterProvider router={createBrowserRouter(routes)} />
  );
}
