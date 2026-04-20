import React, { useEffect, useMemo, useRef, useState } from "react";
import Globe from "react-globe.gl";
import * as THREE from "three";

//
// FULL VITE + REACT GLOBE APP
//
// What this version gives you:
// - Dark "intel dashboard" style UI
// - Country-level base host layer
// - Major-base point layer
// - Combat / war country layer
// - Animated arcs from Washington, D.C.
// - Timeline slider (filters by year)
// - Search box
// - Country borders / polygons using built-in GeoJSON from unpkg
// - No shadcn / no @ alias / no extra UI framework required
//
// Install:
// npm install react react-dom react-globe.gl three
// npm run dev
//
// Notes:
// 1) This is a FULL WORKING APP, but the embedded data below is still curated starter data,
//    not a definitive 700+ verified-base dataset.
// 2) I structured it so you can scale it to large JSON/CSV datasets later without changing the UI.
// 3) If you want, replace the arrays with imported JSON from /public/data/*.json later.
//

const ORIGIN = {
  name: "Washington, D.C.",
  lat: 38.9072,
  lng: -77.0369,
};

const BASE_HOST_COUNTRIES = [
  { id: "jpn", name: "Japan", lat: 36.2048, lng: 138.2529, region: "Indo-Pacific", since: 1945, type: "host" },
  { id: "kor", name: "South Korea", lat: 36.5, lng: 127.9, region: "Indo-Pacific", since: 1953, type: "host" },
  { id: "phl", name: "Philippines", lat: 12.8797, lng: 121.774, region: "Indo-Pacific", since: 1898, type: "host" },
  { id: "aus", name: "Australia", lat: -25.2744, lng: 133.7751, region: "Indo-Pacific", since: 1942, type: "host" },
  { id: "deu", name: "Germany", lat: 51.1657, lng: 10.4515, region: "Europe", since: 1945, type: "host" },
  { id: "ita", name: "Italy", lat: 41.8719, lng: 12.5674, region: "Europe", since: 1943, type: "host" },
  { id: "gbr", name: "United Kingdom", lat: 55.3781, lng: -3.436, region: "Europe", since: 1942, type: "host" },
  { id: "esp", name: "Spain", lat: 40.4637, lng: -3.7492, region: "Europe", since: 1953, type: "host" },
  { id: "tur", name: "Turkey", lat: 38.9637, lng: 35.2433, region: "Europe", since: 1950, type: "host" },
  { id: "pol", name: "Poland", lat: 51.9194, lng: 19.1451, region: "Europe", since: 2010, type: "host" },
  { id: "rou", name: "Romania", lat: 45.9432, lng: 24.9668, region: "Europe", since: 2000, type: "host" },
  { id: "grc", name: "Greece", lat: 39.0742, lng: 21.8243, region: "Europe", since: 1947, type: "host" },
  { id: "prt", name: "Portugal", lat: 39.3999, lng: -8.2245, region: "Europe", since: 1944, type: "host" },
  { id: "bhr", name: "Bahrain", lat: 25.9304, lng: 50.6378, region: "Middle East", since: 1948, type: "host" },
  { id: "kwt", name: "Kuwait", lat: 29.3117, lng: 47.4818, region: "Middle East", since: 1991, type: "host" },
  { id: "qat", name: "Qatar", lat: 25.3548, lng: 51.1839, region: "Middle East", since: 1996, type: "host" },
  { id: "are", name: "United Arab Emirates", lat: 23.4241, lng: 53.8478, region: "Middle East", since: 1990, type: "host" },
  { id: "sau", name: "Saudi Arabia", lat: 23.8859, lng: 45.0792, region: "Middle East", since: 1990, type: "host" },
  { id: "jor", name: "Jordan", lat: 30.5852, lng: 36.2384, region: "Middle East", since: 2000, type: "host" },
  { id: "irq", name: "Iraq", lat: 33.2232, lng: 43.6793, region: "Middle East", since: 2003, type: "host" },
  { id: "syr", name: "Syria", lat: 34.8021, lng: 38.9968, region: "Middle East", since: 2014, type: "host" },
  { id: "omn", name: "Oman", lat: 21.4735, lng: 55.9754, region: "Middle East", since: 1980, type: "host" },
  { id: "dji", name: "Djibouti", lat: 11.8251, lng: 42.5903, region: "Africa", since: 2002, type: "host" },
  { id: "som", name: "Somalia", lat: 5.1521, lng: 46.1996, region: "Africa", since: 2007, type: "host" },
  { id: "ken", name: "Kenya", lat: -0.0236, lng: 37.9062, region: "Africa", since: 2002, type: "host" },
  { id: "cub", name: "Cuba", lat: 21.5218, lng: -77.7812, region: "Caribbean", since: 1903, type: "host" },
  { id: "hnd", name: "Honduras", lat: 15.2, lng: -86.2419, region: "Latin America", since: 1980, type: "host" },
  { id: "slv", name: "El Salvador", lat: 13.7942, lng: -88.8965, region: "Latin America", since: 2000, type: "host" },
  { id: "abw", name: "Aruba", lat: 12.5211, lng: -69.9683, region: "Caribbean", since: 1999, type: "host" },
  { id: "cuw", name: "Curaçao", lat: 12.1696, lng: -68.99, region: "Caribbean", since: 1999, type: "host" },
  { id: "bios", name: "British Indian Ocean Territory", lat: -7.3133, lng: 72.4111, region: "Indian Ocean", since: 1971, type: "host" },
];

const MAJOR_BASES = [
  { name: "Camp Humphreys", country: "South Korea", lat: 36.9668, lng: 127.028, region: "Indo-Pacific", since: 1950, kind: "Army" },
  { name: "Kadena Air Base", country: "Japan", lat: 26.3556, lng: 127.768, region: "Indo-Pacific", since: 1945, kind: "Air Force" },
  { name: "Yokosuka Naval Base", country: "Japan", lat: 35.281, lng: 139.672, region: "Indo-Pacific", since: 1945, kind: "Navy" },
  { name: "Ramstein Air Base", country: "Germany", lat: 49.4369, lng: 7.6003, region: "Europe", since: 1952, kind: "Air Force" },
  { name: "Aviano Air Base", country: "Italy", lat: 46.0319, lng: 12.5965, region: "Europe", since: 1954, kind: "Air Force" },
  { name: "NAS Sigonella", country: "Italy", lat: 37.4017, lng: 14.9224, region: "Europe", since: 1959, kind: "Navy" },
  { name: "RAF Lakenheath", country: "United Kingdom", lat: 52.4096, lng: 0.561, region: "Europe", since: 1948, kind: "Air Force" },
  { name: "Naval Station Rota", country: "Spain", lat: 36.6408, lng: -6.3497, region: "Europe", since: 1953, kind: "Navy" },
  { name: "Incirlik Air Base", country: "Turkey", lat: 37.0003, lng: 35.4259, region: "Europe", since: 1955, kind: "Air Force" },
  { name: "Camp Kościuszko", country: "Poland", lat: 52.393, lng: 16.982, region: "Europe", since: 2023, kind: "Army" },
  { name: "Souda Bay", country: "Greece", lat: 35.487, lng: 24.115, region: "Europe", since: 1969, kind: "Navy" },
  { name: "NSA Bahrain", country: "Bahrain", lat: 26.2249, lng: 50.605, region: "Middle East", since: 1971, kind: "Navy" },
  { name: "Camp Arifjan", country: "Kuwait", lat: 28.8611, lng: 47.7914, region: "Middle East", since: 1999, kind: "Army" },
  { name: "Al Udeid Air Base", country: "Qatar", lat: 25.117, lng: 51.314, region: "Middle East", since: 1996, kind: "Air Force" },
  { name: "Al Dhafra Air Base", country: "United Arab Emirates", lat: 24.2485, lng: 54.5477, region: "Middle East", since: 1990, kind: "Air Force" },
  { name: "Prince Sultan Air Base", country: "Saudi Arabia", lat: 24.0635, lng: 47.5805, region: "Middle East", since: 2000, kind: "Air Force" },
  { name: "Muwaffaq Salti Air Base", country: "Jordan", lat: 31.833, lng: 36.782, region: "Middle East", since: 2010, kind: "Air Force" },
  { name: "Erbil Air Base", country: "Iraq", lat: 36.2376, lng: 43.9632, region: "Middle East", since: 2014, kind: "Coalition" },
  { name: "Al Asad Air Base", country: "Iraq", lat: 33.785, lng: 42.441, region: "Middle East", since: 2003, kind: "Army/Air" },
  { name: "Al Tanf Garrison", country: "Syria", lat: 33.4885, lng: 38.6175, region: "Middle East", since: 2016, kind: "Outpost" },
  { name: "Camp Lemonnier", country: "Djibouti", lat: 11.5473, lng: 43.1595, region: "Africa", since: 2002, kind: "Joint" },
  { name: "Manda Bay", country: "Kenya", lat: -2.2486, lng: 40.9131, region: "Africa", since: 2004, kind: "Security Site" },
  { name: "Guantánamo Bay", country: "Cuba", lat: 19.9066, lng: -75.1229, region: "Caribbean", since: 1903, kind: "Navy" },
  { name: "Soto Cano Air Base", country: "Honduras", lat: 14.3824, lng: -87.6211, region: "Latin America", since: 1983, kind: "Air" },
  { name: "Lajes Field", country: "Portugal", lat: 38.7618, lng: -27.0908, region: "Atlantic", since: 1943, kind: "Air" },
  { name: "Diego Garcia", country: "British Indian Ocean Territory", lat: -7.3133, lng: 72.4111, region: "Indian Ocean", since: 1971, kind: "Air/Naval" },
];

const CONFLICTS = [
  { id: "mex-war", name: "Mexican-American War", country: "Mexico", lat: 23.6345, lng: -102.5528, start: 1846, end: 1848, theater: "North America" },
  { id: "spanish-cuba", name: "Spanish-American War", country: "Cuba", lat: 21.5218, lng: -77.7812, start: 1898, end: 1898, theater: "Caribbean" },
  { id: "philippine-american", name: "Philippine-American War", country: "Philippines", lat: 12.8797, lng: 121.774, start: 1899, end: 1902, theater: "Pacific" },
  { id: "ww1-france", name: "World War I", country: "France", lat: 46.2276, lng: 2.2137, start: 1917, end: 1918, theater: "Europe" },
  { id: "ww1-belgium", name: "World War I", country: "Belgium", lat: 50.5039, lng: 4.4699, start: 1917, end: 1918, theater: "Europe" },
  { id: "ww2-uk", name: "World War II", country: "United Kingdom", lat: 55.3781, lng: -3.436, start: 1941, end: 1945, theater: "Europe" },
  { id: "ww2-france", name: "World War II", country: "France", lat: 46.2276, lng: 2.2137, start: 1944, end: 1945, theater: "Europe" },
  { id: "ww2-germany", name: "World War II", country: "Germany", lat: 51.1657, lng: 10.4515, start: 1944, end: 1945, theater: "Europe" },
  { id: "ww2-italy", name: "World War II", country: "Italy", lat: 41.8719, lng: 12.5674, start: 1943, end: 1945, theater: "Europe" },
  { id: "ww2-japan", name: "World War II", country: "Japan", lat: 36.2048, lng: 138.2529, start: 1941, end: 1945, theater: "Pacific" },
  { id: "korea", name: "Korean War", country: "South Korea", lat: 36.5, lng: 127.9, start: 1950, end: 1953, theater: "Asia" },
  { id: "korea-nk", name: "Korean War", country: "North Korea", lat: 40.3399, lng: 127.5101, start: 1950, end: 1953, theater: "Asia" },
  { id: "vietnam", name: "Vietnam War", country: "Vietnam", lat: 14.0583, lng: 108.2772, start: 1955, end: 1975, theater: "Asia" },
  { id: "laos", name: "Vietnam War theater", country: "Laos", lat: 19.8563, lng: 102.4955, start: 1964, end: 1973, theater: "Asia" },
  { id: "cambodia", name: "Vietnam War theater", country: "Cambodia", lat: 12.5657, lng: 104.991, start: 1969, end: 1973, theater: "Asia" },
  { id: "lebanon-1983", name: "Lebanon intervention", country: "Lebanon", lat: 33.8547, lng: 35.8623, start: 1982, end: 1984, theater: "Middle East" },
  { id: "grenada", name: "Grenada", country: "Grenada", lat: 12.1165, lng: -61.679, start: 1983, end: 1983, theater: "Caribbean" },
  { id: "panama", name: "Panama", country: "Panama", lat: 8.538, lng: -80.7821, start: 1989, end: 1989, theater: "Latin America" },
  { id: "gulf-kuwait", name: "Gulf War", country: "Kuwait", lat: 29.3117, lng: 47.4818, start: 1991, end: 1991, theater: "Middle East" },
  { id: "gulf-iraq", name: "Gulf War", country: "Iraq", lat: 33.2232, lng: 43.6793, start: 1991, end: 1991, theater: "Middle East" },
  { id: "bosnia", name: "Bosnia", country: "Bosnia and Herzegovina", lat: 43.9159, lng: 17.6791, start: 1995, end: 1995, theater: "Europe" },
  { id: "serbia-kosovo", name: "Kosovo War", country: "Serbia", lat: 44.0165, lng: 21.0059, start: 1999, end: 1999, theater: "Europe" },
  { id: "afghanistan", name: "Afghanistan War", country: "Afghanistan", lat: 33.9391, lng: 67.71, start: 2001, end: 2021, theater: "Central Asia" },
  { id: "iraq-2003", name: "Iraq War / OIR era", country: "Iraq", lat: 33.2232, lng: 43.6793, start: 2003, end: 2026, theater: "Middle East" },
  { id: "pakistan", name: "Cross-border strikes", country: "Pakistan", lat: 30.3753, lng: 69.3451, start: 2004, end: 2018, theater: "Central Asia" },
  { id: "libya", name: "Libya", country: "Libya", lat: 26.3351, lng: 17.2283, start: 2011, end: 2011, theater: "North Africa" },
  { id: "syria", name: "Operation Inherent Resolve", country: "Syria", lat: 34.8021, lng: 38.9968, start: 2014, end: 2026, theater: "Middle East" },
  { id: "yemen", name: "Counterterror / Red Sea era", country: "Yemen", lat: 15.5527, lng: 48.5164, start: 2002, end: 2026, theater: "Middle East" },
  { id: "somalia", name: "Somalia operations", country: "Somalia", lat: 5.1521, lng: 46.1996, start: 1992, end: 2026, theater: "Horn of Africa" },
];

const COLORS = {
  host: "#38bdf8",
  base: "#22c55e",
  conflict: "#fb923c",
  arcBase: "rgba(56,189,248,0.75)",
  arcConflict: "rgba(251,146,60,0.72)",
  polygon: "rgba(255,255,255,0.04)",
  polygonStroke: "rgba(255,255,255,0.22)",
};

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function buildLabel(item) {
  const lines = [];
  if (item.country) lines.push(`<div style="font-size:12px;opacity:.8;">${item.country}</div>`);
  if (item.kind) lines.push(`<div style="font-size:12px;opacity:.8;">${item.kind}</div>`);
  if (item.region) lines.push(`<div style="font-size:12px;opacity:.8;">${item.region}</div>`);
  if (item.theater) lines.push(`<div style="font-size:12px;opacity:.8;">${item.theater}</div>`);
  if (item.since) lines.push(`<div style="font-size:12px;opacity:.8;">Since ${item.since}</div>`);
  if (item.start) lines.push(`<div style="font-size:12px;opacity:.8;">${item.start}–${item.end}</div>`);

  return `
    <div style="max-width:260px;padding:10px 12px;background:rgba(7,11,18,.96);color:white;border:1px solid rgba(255,255,255,.12);border-radius:12px;font-family:Inter,system-ui,sans-serif;box-shadow:0 12px 30px rgba(0,0,0,.35)">
      <div style="font-size:13px;font-weight:700;line-height:1.35;margin-bottom:4px;">${item.name}</div>
      ${lines.join("")}
    </div>
  `;
}

export default function App() {
  const globeRef = useRef(null);
  const [countries, setCountries] = useState({ features: [] });

  const minYear = 1776;
  const maxYear = 2026;

  const [year, setYear] = useState(2026);
  const [showHosts, setShowHosts] = useState(true);
  const [showBases, setShowBases] = useState(true);
  const [showConflicts, setShowConflicts] = useState(true);
  const [showArcs, setShowArcs] = useState(true);
  const [autoRotate, setAutoRotate] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("All");

  useEffect(() => {
    fetch("https://unpkg.com/world-atlas@2/countries-110m.json")
      .then((res) => res.json())
      .then(async (topology) => {
        const topojson = await import("https://cdn.jsdelivr.net/npm/topojson-client@3/+esm");
        const geo = topojson.feature(topology, topology.objects.countries);
        setCountries(geo);
      })
      .catch((err) => {
        console.error("Failed to load country polygons", err);
      });
  }, []);

  useEffect(() => {
    if (!globeRef.current) return;
    const controls = globeRef.current.controls();
    controls.autoRotate = autoRotate;
    controls.autoRotateSpeed = 0.35;
    controls.enablePan = false;
    controls.minDistance = 160;
    controls.maxDistance = 420;
  }, [autoRotate]);

  useEffect(() => {
    if (!globeRef.current) return;
    globeRef.current.pointOfView({ lat: 18, lng: 10, altitude: 1.95 }, 0);
  }, []);

  const regions = useMemo(() => {
    const s = new Set(["All"]);
    BASE_HOST_COUNTRIES.forEach((d) => s.add(d.region));
    MAJOR_BASES.forEach((d) => s.add(d.region));
    CONFLICTS.forEach((d) => s.add(d.theater));
    return [...s];
  }, []);

  const normalizedSearch = search.trim().toLowerCase();

  const filteredHosts = useMemo(() => {
    return BASE_HOST_COUNTRIES.filter((d) => {
      const yearOk = d.since <= year;
      const regionOk = selectedRegion === "All" || d.region === selectedRegion;
      const searchOk = !normalizedSearch || `${d.name} ${d.region}`.toLowerCase().includes(normalizedSearch);
      return yearOk && regionOk && searchOk;
    });
  }, [year, selectedRegion, normalizedSearch]);

  const filteredBases = useMemo(() => {
    return MAJOR_BASES.filter((d) => {
      const yearOk = d.since <= year;
      const regionOk = selectedRegion === "All" || d.region === selectedRegion;
      const searchOk = !normalizedSearch || `${d.name} ${d.country} ${d.region} ${d.kind}`.toLowerCase().includes(normalizedSearch);
      return yearOk && regionOk && searchOk;
    });
  }, [year, selectedRegion, normalizedSearch]);

  const filteredConflicts = useMemo(() => {
    return CONFLICTS.filter((d) => {
      const yearOk = d.start <= year && d.end >= year;
      const regionOk = selectedRegion === "All" || d.theater === selectedRegion;
      const searchOk = !normalizedSearch || `${d.name} ${d.country} ${d.theater}`.toLowerCase().includes(normalizedSearch);
      return yearOk && regionOk && searchOk;
    });
  }, [year, selectedRegion, normalizedSearch]);

  const pointsData = useMemo(() => {
    const pts = [];

    if (showHosts) {
      filteredHosts.forEach((d) => {
        pts.push({
          ...d,
          pointType: "host",
          color: COLORS.host,
          radius: 0.32,
          altitude: 0.04,
          label: buildLabel(d),
        });
      });
    }

    if (showBases) {
      filteredBases.forEach((d) => {
        pts.push({
          ...d,
          pointType: "base",
          color: COLORS.base,
          radius: 0.24,
          altitude: 0.12,
          label: buildLabel(d),
        });
      });
    }

    if (showConflicts) {
      filteredConflicts.forEach((d) => {
        pts.push({
          ...d,
          pointType: "conflict",
          color: COLORS.conflict,
          radius: 0.34,
          altitude: 0.08,
          label: buildLabel(d),
        });
      });
    }

    return pts;
  }, [filteredHosts, filteredBases, filteredConflicts, showHosts, showBases, showConflicts]);

  const arcData = useMemo(() => {
    if (!showArcs) return [];
    const arcs = [];

    if (showBases) {
      filteredBases.forEach((d, idx) => {
        arcs.push({
          id: `base-arc-${idx}-${d.name}`,
          startLat: ORIGIN.lat,
          startLng: ORIGIN.lng,
          endLat: d.lat,
          endLng: d.lng,
          color: [COLORS.arcBase, COLORS.arcBase],
          stroke: 0.5,
          dashLength: 0.55,
          dashGap: 0.15,
          dashAnimateTime: 2600,
          altitude: clamp(0.12 + Math.abs(d.lat - ORIGIN.lat) / 260, 0.1, 0.35),
        });
      });
    }

    if (showConflicts) {
      filteredConflicts.forEach((d, idx) => {
        arcs.push({
          id: `conflict-arc-${idx}-${d.name}`,
          startLat: ORIGIN.lat,
          startLng: ORIGIN.lng,
          endLat: d.lat,
          endLng: d.lng,
          color: [COLORS.arcConflict, COLORS.arcConflict],
          stroke: 0.55,
          dashLength: 0.45,
          dashGap: 0.18,
          dashAnimateTime: 2100,
          altitude: clamp(0.12 + Math.abs(d.lat - ORIGIN.lat) / 230, 0.11, 0.37),
        });
      });
    }

    return arcs;
  }, [filteredBases, filteredConflicts, showBases, showConflicts, showArcs]);

  const counts = useMemo(() => {
    return {
      hosts: filteredHosts.length,
      bases: filteredBases.length,
      conflicts: filteredConflicts.length,
      arcs: arcData.length,
    };
  }, [filteredHosts, filteredBases, filteredConflicts, arcData]);

  const regionSummary = useMemo(() => {
    const m = {};
    filteredBases.forEach((d) => {
      m[d.region] = (m[d.region] || 0) + 1;
    });
    return Object.entries(m).sort((a, b) => b[1] - a[1]);
  }, [filteredBases]);

  const controlStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    padding: "12px 14px",
    background: "rgba(8,12,18,.65)",
    border: "1px solid rgba(255,255,255,.08)",
    borderRadius: 16,
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "radial-gradient(circle at top left, #0f172a 0%, #05070b 45%, #020308 100%)",
        color: "#e5eefc",
        fontFamily: "Inter, system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
        padding: 20,
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          maxWidth: 1600,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "minmax(0, 1.4fr) 420px",
          gap: 20,
        }}
      >
        <div
          style={{
            position: "relative",
            overflow: "hidden",
            borderRadius: 28,
            border: "1px solid rgba(255,255,255,.08)",
            background: "linear-gradient(180deg, rgba(255,255,255,.04), rgba(255,255,255,.015))",
            boxShadow: "0 28px 90px rgba(0,0,0,.45)",
            minHeight: 860,
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              zIndex: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "16px 18px",
              borderBottom: "1px solid rgba(255,255,255,.08)",
              background: "rgba(3,6,12,.58)",
              backdropFilter: "blur(16px)",
            }}
          >
            <div>
              <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: -0.6 }}>
                U.S. Global Military Footprint
              </div>
              <div style={{ fontSize: 13, opacity: 0.72, marginTop: 4 }}>
                Bases, host countries, combat theaters, timeline filtering, and animated arcs
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <div style={{ padding: "7px 10px", borderRadius: 999, background: "rgba(56,189,248,.14)", color: "#7dd3fc", fontSize: 12, fontWeight: 700 }}>Host countries</div>
              <div style={{ padding: "7px 10px", borderRadius: 999, background: "rgba(34,197,94,.14)", color: "#86efac", fontSize: 12, fontWeight: 700 }}>Major bases</div>
              <div style={{ padding: "7px 10px", borderRadius: 999, background: "rgba(251,146,60,.14)", color: "#fdba74", fontSize: 12, fontWeight: 700 }}>Active conflicts by year</div>
            </div>
          </div>

          <div style={{ height: 900, paddingTop: 78 }}>
            <Globe
              ref={globeRef}
              width={1100}
              height={880}
              rendererConfig={{ antialias: true, alpha: true }}
              backgroundColor="rgba(0,0,0,0)"
              globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
              bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
              atmosphereAltitude={0.16}
              atmosphereColor="#93c5fd"
              polygonsData={countries.features}
              polygonCapColor={() => COLORS.polygon}
              polygonSideColor={() => "rgba(0,0,0,0.02)"}
              polygonStrokeColor={() => COLORS.polygonStroke}
              polygonAltitude={() => 0.004}
              pointsData={pointsData}
              pointLat={(d) => d.lat}
              pointLng={(d) => d.lng}
              pointAltitude={(d) => d.altitude}
              pointRadius={(d) => d.radius}
              pointColor={(d) => d.color}
              pointLabel={(d) => d.label}
              arcsData={arcData}
              arcStartLat={(d) => d.startLat}
              arcStartLng={(d) => d.startLng}
              arcEndLat={(d) => d.endLat}
              arcEndLng={(d) => d.endLng}
              arcColor={(d) => d.color}
              arcAltitude={(d) => d.altitude}
              arcStroke={(d) => d.stroke}
              arcDashLength={(d) => d.dashLength}
              arcDashGap={(d) => d.dashGap}
              arcDashAnimateTime={(d) => d.dashAnimateTime}
              onGlobeReady={() => {
                const scene = globeRef.current?.scene();
                if (scene) {
                  const ambient = new THREE.AmbientLight(0xffffff, 0.95);
                  const directional = new THREE.DirectionalLight(0xffffff, 0.85);
                  directional.position.set(1, 1, 2);
                  scene.add(ambient);
                  scene.add(directional);
                }
              }}
            />
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <Panel title="Controls">
            <div style={{ display: "grid", gap: 10 }}>
              <ControlRow label="Show host countries">
                <input type="checkbox" checked={showHosts} onChange={() => setShowHosts((v) => !v)} />
              </ControlRow>
              <ControlRow label="Show major bases">
                <input type="checkbox" checked={showBases} onChange={() => setShowBases((v) => !v)} />
              </ControlRow>
              <ControlRow label="Show conflict theaters">
                <input type="checkbox" checked={showConflicts} onChange={() => setShowConflicts((v) => !v)} />
              </ControlRow>
              <ControlRow label="Show animated arcs">
                <input type="checkbox" checked={showArcs} onChange={() => setShowArcs((v) => !v)} />
              </ControlRow>
              <ControlRow label="Auto rotate globe">
                <input type="checkbox" checked={autoRotate} onChange={() => setAutoRotate((v) => !v)} />
              </ControlRow>
            </div>

            <div style={{ marginTop: 14 }}>
              <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 8 }}>Timeline year: {year}</div>
              <input
                type="range"
                min={minYear}
                max={maxYear}
                step={1}
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                style={{ width: "100%" }}
              />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, opacity: 0.55, marginTop: 5 }}>
                <span>{minYear}</span>
                <span>{maxYear}</span>
              </div>
            </div>

            <div style={{ marginTop: 14 }}>
              <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 8 }}>Search</div>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Japan, Ramstein, Iraq, Europe..."
                style={inputStyle}
              />
            </div>

            <div style={{ marginTop: 14 }}>
              <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 8 }}>Region / theater filter</div>
              <select value={selectedRegion} onChange={(e) => setSelectedRegion(e.target.value)} style={inputStyle}>
                {regions.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <ActionButton onClick={() => globeRef.current?.pointOfView({ lat: 40, lng: -30, altitude: 1.9 }, 1200)}>Atlantic</ActionButton>
              <ActionButton onClick={() => globeRef.current?.pointOfView({ lat: 20, lng: 100, altitude: 1.9 }, 1200)}>Indo-Pacific</ActionButton>
              <ActionButton onClick={() => globeRef.current?.pointOfView({ lat: 26, lng: 45, altitude: 1.75 }, 1200)}>Middle East</ActionButton>
              <ActionButton onClick={() => globeRef.current?.pointOfView({ lat: 8, lng: 28, altitude: 2.0 }, 1200)}>Africa</ActionButton>
            </div>
          </Panel>

          <Panel title="Snapshot">
            <StatsGrid counts={counts} />
          </Panel>

          <Panel title="Region summary">
            {regionSummary.length === 0 ? (
              <div style={{ fontSize: 13, opacity: 0.65 }}>No base markers match the current filters.</div>
            ) : (
              <div style={{ display: "grid", gap: 9 }}>
                {regionSummary.map(([region, count]) => (
                  <div key={region} style={controlStyle}>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{region}</div>
                    <div style={{ fontSize: 12, padding: "4px 9px", borderRadius: 999, background: "rgba(255,255,255,.06)" }}>{count}</div>
                  </div>
                ))}
              </div>
            )}
          </Panel>

          <Panel title="How to scale this to 700+ bases and every war">
            <div style={{ display: "grid", gap: 10, fontSize: 13, lineHeight: 1.55, opacity: 0.85 }}>
              <div>1. Move these arrays into <code>public/data/bases.json</code>, <code>public/data/conflicts.json</code>, and <code>public/data/hosts.json</code>.</div>
              <div>2. Load them with <code>fetch()</code> in <code>useEffect</code>.</div>
              <div>3. Keep the UI exactly the same — it is already set up for larger datasets.</div>
              <div>4. Add fields like <code>branch</code>, <code>personnel</code>, <code>status</code>, <code>endYear</code>, or <code>source</code>.</div>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}

function Panel({ title, children }) {
  return (
    <div
      style={{
        borderRadius: 24,
        border: "1px solid rgba(255,255,255,.08)",
        background: "linear-gradient(180deg, rgba(255,255,255,.05), rgba(255,255,255,.02))",
        boxShadow: "0 16px 45px rgba(0,0,0,.32)",
        overflow: "hidden",
      }}
    >
      <div style={{ padding: "16px 18px", borderBottom: "1px solid rgba(255,255,255,.07)", fontSize: 16, fontWeight: 800 }}>
        {title}
      </div>
      <div style={{ padding: 16 }}>{children}</div>
    </div>
  );
}

function ControlRow({ label, children }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
        padding: "12px 14px",
        background: "rgba(8,12,18,.65)",
        border: "1px solid rgba(255,255,255,.08)",
        borderRadius: 16,
      }}
    >
      <div style={{ fontSize: 13, fontWeight: 600 }}>{label}</div>
      {children}
    </div>
  );
}

function ActionButton({ onClick, children }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: "rgba(15,23,42,.9)",
        color: "#e5eefc",
        border: "1px solid rgba(255,255,255,.1)",
        borderRadius: 14,
        padding: "10px 12px",
        cursor: "pointer",
        fontWeight: 700,
      }}
    >
      {children}
    </button>
  );
}

function StatsGrid({ counts }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
      <StatCard label="Host countries" value={counts.hosts} color="#7dd3fc" />
      <StatCard label="Major bases" value={counts.bases} color="#86efac" />
      <StatCard label="Conflict markers" value={counts.conflicts} color="#fdba74" />
      <StatCard label="Animated arcs" value={counts.arcs} color="#c4b5fd" />
    </div>
  );
}

function StatCard({ label, value, color }) {
  return (
    <div
      style={{
        borderRadius: 18,
        border: "1px solid rgba(255,255,255,.08)",
        background: "rgba(8,12,18,.65)",
        padding: 14,
      }}
    >
      <div style={{ fontSize: 26, fontWeight: 800, color }}>{value}</div>
      <div style={{ fontSize: 12, opacity: 0.7, marginTop: 4 }}>{label}</div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  boxSizing: "border-box",
  borderRadius: 14,
  border: "1px solid rgba(255,255,255,.1)",
  background: "rgba(10,14,22,.8)",
  color: "#e5eefc",
  padding: "11px 12px",
  outline: "none",
};