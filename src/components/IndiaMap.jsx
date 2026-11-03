import { useEffect, useState } from 'react';
import L from 'leaflet';
import { MapContainer, TileLayer, CircleMarker, GeoJSON, Marker, Polyline, Tooltip, useMap } from 'react-leaflet';

export const INDIA_BOUNDS = [
  [6.5, 68.0],
  [36.5, 97.5],
];
const MAX_BOUNDS = [
  [-2, 58],
  [44, 108],
];

// OpenStreetMap's standard tiles need no API key. To use another provider (for example a
// keyed CARTO or MapTiler style), set VITE_TILE_URL and VITE_TILE_ATTRIBUTION at build time.
const TILE_URL = import.meta.env.VITE_TILE_URL || 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
const TILE_ATTRIBUTION =
  import.meta.env.VITE_TILE_ATTRIBUTION || '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

// India's official outline (Survey of India, via DataMeet, CC BY 4.0), drawn over the base
// tiles, whose own borders may differ. Loaded once and shared by every map.
const BOUNDARY_ATTRIBUTION = 'Boundary: Survey of India via <a href="https://github.com/datameet/maps">DataMeet</a> (CC BY 4.0)';
let boundaryRequest;
const loadBoundary = () => (boundaryRequest ??= fetch('/india-boundary.geojson').then((r) => (r.ok ? r.json() : null)).catch(() => null));

function OfficialBoundary() {
  const [data, setData] = useState(null);
  useEffect(() => {
    let alive = true;
    loadBoundary().then((d) => alive && setData(d));
    return () => {
      alive = false;
    };
  }, []);
  if (!data) return null;
  return (
    <GeoJSON
      data={data}
      interactive={false}
      attribution={BOUNDARY_ATTRIBUTION}
      style={{ color: '#8b1538', weight: 1.6, opacity: 0.85, fill: false, className: 'india-boundary' }}
    />
  );
}

// The chapter pin echoes the SPIC MACAY emblem: a yellow almond with a red bindu.
const homeIcon = L.divIcon({
  className: 'home-pin',
  html: '<svg viewBox="0 0 24 40" width="24" height="40" aria-hidden="true"><path d="M12 1 C21 11 21 29 12 39 C3 29 3 11 12 1Z" fill="#fff200" stroke="#1a0a0d" stroke-width="1.6"/><circle cx="12" cy="20" r="5" fill="#c4261c"/></svg>',
  iconSize: [24, 40],
  iconAnchor: [12, 20],
});

// focus: { lat, lng, zoom } | { bounds } | null (all of India) | undefined (stay put).
// Re-runs only when `focusKey` changes.
function Focus({ focus, focusKey }) {
  const map = useMap();
  useEffect(() => {
    if (focus === undefined) return;
    if (!focus) map.flyToBounds(INDIA_BOUNDS, { duration: 0.8 });
    else if (focus.bounds) map.flyToBounds(focus.bounds, { duration: 0.8, padding: [40, 40], maxZoom: focus.maxZoom ?? 15 });
    else map.flyTo([focus.lat, focus.lng], focus.zoom ?? Math.max(map.getZoom(), 7), { duration: 0.8 });
  }, [focusKey, map]);
  return null;
}

// points: [{ id, lat, lng, label, radius, color }]; route: optional [[lat, lng], …] drawn as a dashed path.
export default function IndiaMap({ points, home, selectedId, onSelect, onHomeClick, focus, focusKey = '', route }) {
  return (
    <MapContainer bounds={INDIA_BOUNDS} maxBounds={MAX_BOUNDS} minZoom={4} maxZoom={17} scrollWheelZoom
      style={{ height: '100%', width: '100%' }} className="india-map">
      <TileLayer
        attribution={TILE_ATTRIBUTION}
        url={TILE_URL}
        maxZoom={19}
      />
      <OfficialBoundary />
      {route?.length > 1 && <Polyline positions={route} pathOptions={{ color: '#c4261c', weight: 3, dashArray: '6 8', opacity: 0.8 }} />}
      {points.map((p) => {
        const selected = p.id === selectedId;
        return (
          <CircleMarker
            key={p.id}
            center={[p.lat, p.lng]}
            radius={(p.radius ?? 7) + (selected ? 3 : 0)}
            pathOptions={{
              className: 'map-dot',
              fillColor: p.color,
              fillOpacity: 0.9,
              color: selected ? '#1a0a0d' : '#fffaf2',
              weight: selected ? 3 : 1.2,
            }}
            eventHandlers={{ click: () => onSelect?.(p.id) }}
          >
            <Tooltip direction="top" offset={[0, -4]}>
              {p.label}
            </Tooltip>
          </CircleMarker>
        );
      })}
      {home && (
        <Marker position={[home.lat, home.lng]} icon={homeIcon} zIndexOffset={1000} eventHandlers={{ click: () => onHomeClick?.() }}>
          <Tooltip direction="right" offset={[10, 0]} permanent className="home-label">
            {home.label}
          </Tooltip>
        </Marker>
      )}
      <Focus focus={focus} focusKey={focusKey} />
    </MapContainer>
  );
}
