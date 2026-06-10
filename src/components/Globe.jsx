import { useEffect, useMemo, useRef, useState } from 'react';
import { m, useInView, useReducedMotion } from 'framer-motion';
import * as THREE from 'three';
import { useCountUp } from '../hooks/useCountUp';

const COVERED_CODES = [
  'DE', 'AT', 'BE', 'BG', 'BY', 'CY', 'HR', 'DK', 'ES', 'EE', 'FR', 'FI', 'GR', 'HU',
  'IT', 'IE', 'IS', 'LT', 'LV', 'LU', 'MT', 'NO', 'NL', 'PT', 'PL', 'CZ', 'RO', 'GB',
  'SE', 'CH', 'SK', 'SI',
];

const getIsoCode = (feature) => {
  return (
    feature.properties.ISO_A2 || feature.properties.iso_a2 || feature.properties.ADM0_A2 || feature.properties.iso_a2 || ''
  ).toUpperCase();
};

const codeToFlag = (code) =>
  code
    .toUpperCase()
    .split('')
    .map((char) => String.fromCodePoint(127397 + char.charCodeAt(0)))
    .join('');

const goldMaterial = new THREE.MeshStandardMaterial({
  flatShading: true,
  color: '#C9A84C',
  metalness: 0.1,
  roughness: 0.7,
  transparent: true,
  opacity: 0.85,
  side: THREE.DoubleSide,
});

function Globe() {
  const wrapperRef = useRef(null);
  const globeRef = useRef(null);
  const [GlobeComponent, setGlobeComponent] = useState(null);
  const [polygons, setPolygons] = useState([]);
  const [activeCodes, setActiveCodes] = useState(new Set());
  const inView = useInView(wrapperRef, { once: true, margin: '-120px 0px -120px 0px' });
  const prefersReducedMotion = useReducedMotion();
  const countriesCount = useCountUp(34, { duration: 1500, delay: 200, isInView: inView });

  useEffect(() => {
    let active = true;
    import('react-globe.gl').then((mod) => {
      if (active) setGlobeComponent(() => mod.default);
    });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!GlobeComponent) return;

    fetch('https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson')
      .then((response) => response.json())
      .then((data) => {
        if (!data.features) return;
        setPolygons(data.features);
      })
      .catch(() => {
        setPolygons([]);
      });
  }, [GlobeComponent]);

  useEffect(() => {
    if (!inView || polygons.length === 0) return;

    const visible = COVERED_CODES.filter((code) => polygons.some((feature) => getIsoCode(feature) === code));
    visible.forEach((code, index) => {
      window.setTimeout(() => {
        setActiveCodes((previous) => new Set([...previous, code]));
      }, index * 50);
    });
  }, [inView, polygons]);

  const polygonCapColor = (feature) => {
    const code = getIsoCode(feature);
    const isCovered = COVERED_CODES.includes(code);
    if (isCovered && activeCodes.has(code)) {
      return 'rgba(201,168,76,0.85)';
    }
    if (isCovered) {
      return 'rgba(201,168,76,0.22)';
    }
    return 'rgba(26,26,46,0.48)';
  };

  const polygonLabel = (feature) => {
    const code = getIsoCode(feature);
    const label = feature.properties.ADMIN || feature.properties.name || 'Pays';
    return `${codeToFlag(code)} ${label}`;
  };

  const handleGlobeReady = () => {
    const globe = globeRef.current;
    if (!globe) return;

    const scene = globe.scene();
    scene.children.filter((child) => child.isLight).forEach((light) => scene.remove(light));

    const light = new THREE.DirectionalLight('#ffffff', 0.85);
    light.position.set(8, 12, 14);
    scene.add(light);

    const camera = globe.camera();
    const renderer = globe.renderer();
    const canvas = renderer?.domElement;
    if (camera && canvas) {
      camera.left = canvas.clientWidth / -2;
      camera.right = canvas.clientWidth / 2;
      camera.top = canvas.clientHeight / 2;
      camera.bottom = canvas.clientHeight / -2;
      camera.near = 0.1;
      camera.far = 1000;
      camera.zoom = 1.3;
      camera.isPerspectiveCamera = false;
      camera.isOrthographicCamera = true;
      camera.type = 'OrthographicCamera';
      camera.projectionMatrix.makeOrthographic(camera.left, camera.right, camera.top, camera.bottom, camera.near, camera.far);
      camera.updateProjectionMatrix = function () {
        this.projectionMatrix.makeOrthographic(this.left, this.right, this.top, this.bottom, this.near, this.far);
      };
      globe.controls().object = camera;
      globe.controls().update();
    }

    globe.controls().enableRotate = false;
    globe.controls().enableZoom = false;
    globe.controls().enablePan = false;
    globe.renderer().setClearColor('#0A0A0A', 1);
    globe.pointOfView({ lat: 54, lng: 15, altitude: 2.5 }, 0);
  };

  return (
    <section ref={wrapperRef} className="relative mx-auto max-w-7xl px-6 pb-24 pt-24 lg:px-8">
      <m.div
        initial={{ opacity: 0, scale: 0.94 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-slate-950/95 p-6 shadow-[0_40px_120px_-70px_rgba(0,0,0,0.9)] md:p-10"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,214,84,0.12),transparent_25%),radial-gradient(circle_at_bottom_right,rgba(248,250,252,0.04),transparent_30%)]" />
        <div className="relative z-10 grid gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
          <div className="space-y-4">
            <p className="text-sm uppercase tracking-[0.35em] text-amber-300/80">Globe Europe</p>
            <h2 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">Cartographie premium des pays assurés</h2>
            <p className="max-w-xl text-sm leading-7 text-slate-300">Vue orthographique, pays dorés et surbrillance flat pour une représentation nette des 34 destinations couvertes.</p>
            <div className="mt-6 flex flex-wrap gap-4">
              <span className="rounded-full border border-amber-300/20 bg-white/5 px-4 py-3 text-sm text-amber-200">Pays couverts</span>
              <span className="rounded-full border border-slate-500/20 bg-white/5 px-4 py-3 text-sm text-slate-300">Sans atmosphère</span>
            </div>
            <div className="mt-8 flex items-end gap-4">
              <div className="rounded-[2rem] bg-[#111116] px-6 py-5 text-white shadow-[0_24px_60px_-40px_rgba(201,168,76,0.7)]">
                <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Pays en réseau</p>
                <p className="mt-3 text-5xl font-semibold text-amber-300">{countriesCount}</p>
              </div>
              <div className="rounded-[2rem] bg-white/5 px-6 py-5 text-slate-300">
                <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Position</p>
                <p className="mt-3 text-2xl font-semibold text-white">Europe centrée</p>
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#05050b] p-2 shadow-[inset_0_0_40px_rgba(255,255,255,0.04)]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02),transparent_50%)]" />
            {GlobeComponent ? (
              <GlobeComponent
                ref={globeRef}
                width={680}
                height={420}
                backgroundColor="#0A0A0A"
                globeColor="#0A0A0A"
                showAtmosphere={false}
                showGlobe={true}
                showGraticules={false}
                polygonsData={polygons}
                polygonLabel={polygonLabel}
                polygonCapColor={polygonCapColor}
                polygonSideColor={polygonCapColor}
                polygonAltitude={0.01}
                polygonStrokeColor="rgba(255,255,255,0.02)"
                polygonStrokeWidth={0.2}
                polygonsTransitionDuration={400}
                enablePointerInteraction={true}
                onGlobeReady={handleGlobeReady}
                onPolygonHover={(feature) => feature}
              />
            ) : (
              <div className="flex h-[420px] items-center justify-center text-sm text-slate-400">Chargement du globe en 3D...</div>
            )}
          </div>
        </div>
      </m.div>
    </section>
  );
}

export default Globe;
