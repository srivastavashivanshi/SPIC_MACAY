import { Link } from 'react-router-dom';
import { Motif } from '../components/Art.jsx';
import { useTitle } from '../lib/useTitle.js';

export default function NotFound() {
  useTitle('Page not found');
  return (
    <section className="container notfound">
      <Motif name="gateway" className="inline" />
      <p className="eyebrow">404</p>
      <h1>This doorway leads nowhere</h1>
      <p className="lede" style={{ margin: '0 auto' }}>
        The page you were looking for doesn’t exist. Try one of these instead.
      </p>
      <div className="hero-actions">
        <Link className="btn btn-maroon" to="/">
          Home
        </Link>
        <Link className="btn btn-outline" to="/map">
          Reach Map
        </Link>
        <Link className="btn btn-outline" to="/art-forms">
          Art Forms
        </Link>
      </div>
    </section>
  );
}
