import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import Home from './pages/Home.jsx';
import Artists from './pages/Artists.jsx';
import ArtForms from './pages/ArtForms.jsx';
import Dashboard from './pages/Dashboard.jsx';
import NotFound from './pages/NotFound.jsx';
import Programme from './pages/Programme.jsx';
import Gallery from './pages/Gallery.jsx';
import ArtistDetail from './pages/ArtistDetail.jsx';
import Glossary from './pages/Glossary.jsx';
import Lineages from './pages/Lineages.jsx';
import Quiz from './pages/Quiz.jsx';
import Ragas from './pages/Ragas.jsx';
import Talas from './pages/Talas.jsx';
import Instruments from './pages/Instruments.jsx';
import Primer from './pages/Primer.jsx';
// The admin page (and its upload library) only loads for volunteers who open it.
const Admin = lazy(() => import('./pages/Admin.jsx'));
// Map pages carry the map library, so they load when first opened.
const MapPage = lazy(() => import('./pages/MapPage.jsx'));
const Conventions = lazy(() => import('./pages/Conventions.jsx'));
const HeritageWalk = lazy(() => import('./pages/HeritageWalk.jsx'));
const wait = (el) => <Suspense fallback={<section className="container section admin-page" />}>{el}</Suspense>;

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="map" element={wait(<MapPage />)} />
        <Route path="artists" element={<Artists />} />
        <Route path="artists/:id" element={<ArtistDetail />} />
        <Route path="glossary" element={<Glossary />} />
        <Route path="lineages" element={<Lineages />} />
        <Route path="heritage-walk" element={wait(<HeritageWalk />)} />
        <Route path="quiz" element={<Quiz />} />
        <Route path="ragas" element={<Ragas />} />
        <Route path="talas" element={<Talas />} />
        <Route path="instruments" element={<Instruments />} />
        <Route path="programmes/:id/primer" element={<Primer />} />
        <Route path="art-forms" element={<ArtForms />} />
        <Route path="conventions" element={wait(<Conventions />)} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="programmes/:id" element={<Programme />} />
        <Route path="gallery" element={<Gallery />} />
        <Route
          path="admin"
          element={
            <Suspense fallback={<section className="container section admin-page" />}>
              <Admin />
            </Suspense>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
