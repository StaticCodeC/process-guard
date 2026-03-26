import json
import random
from pathlib import Path

import pandas as pd
import pyproj
from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="ZoPark API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

DATA_DIR = Path(__file__).parent.parent / "raw_data_halifax"

transformer = pyproj.Transformer.from_crs("EPSG:3857", "EPSG:4326", always_xy=True)

pay_stations: list[dict] = []
accessible_spots: list[dict] = []
park_ride_lots: list[dict] = []

random.seed(42)


def mercator_to_latlng(x: float, y: float) -> tuple[float, float]:
    lng, lat = transformer.transform(x, y)
    return lat, lng


def load_pay_stations() -> list[dict]:
    csv_path = next(DATA_DIR.glob("Parking_Pay_Stations*.csv"), None)
    if csv_path is None:
        return []
    df = pd.read_csv(csv_path)
    df = df[df["Asset Status"] == "INS"].reset_index(drop=True)
    results = []
    for i, row in df.iterrows():
        lat, lng = mercator_to_latlng(float(row["x"]), float(row["y"]))
        available = random.random() > 0.25
        results.append({
            "id": f"ps_{i}",
            "lat": lat,
            "lng": lng,
            "location": str(row.get("General Location", "")),
            "zone": str(row.get("Parking Pay Zone", "")),
            "status": str(row.get("Asset Status", "")),
            "available": available,
            "type": "pay_station",
        })
    return results


def load_accessible_spots() -> list[dict]:
    geojson_path = next(DATA_DIR.glob("Accessible_Parking_Spots_*.geojson"), None)
    if geojson_path is None:
        return []
    with open(geojson_path) as f:
        data = json.load(f)
    results = []
    for i, feature in enumerate(data.get("features", [])):
        props = feature.get("properties", {})
        status = str(props.get("Status", props.get("status", ""))).strip().upper()
        if status != "INS":
            continue
        geom = feature.get("geometry", {})
        coords = geom.get("coordinates", [None, None])
        if geom.get("type") == "Point":
            lng, lat = coords[0], coords[1]
        else:
            continue
        results.append({
            "id": f"acc_{i}",
            "lat": lat,
            "lng": lng,
            "street": str(props.get("Street", props.get("street", ""))),
            "from_street": str(props.get("From Street", props.get("from_street", ""))),
            "to_street": str(props.get("To Street", props.get("to_street", ""))),
            "spots_count": int(props.get("Number of Spots", props.get("number_of_spots", 1)) or 1),
            "time_limit": str(props.get("Time Limit", props.get("time_limit", ""))),
            "available": True,
            "type": "accessible",
        })
    return results


def load_park_ride() -> list[dict]:
    geojson_path = next(DATA_DIR.glob("Park_Ride_*.geojson"), None)
    csv_path = next(DATA_DIR.glob("Park_Ride_*.csv"), None)

    capacity_map: dict[str, dict] = {}
    if csv_path:
        df = pd.read_csv(csv_path)
        for _, row in df.iterrows():
            name = str(row.get("Park & Ride Name", "")).strip()
            capacity_map[name] = {
                "capacity": row.get("Parking Capacity", ""),
                "cost": str(row.get("Parking Cost Per Month", "")),
                "routes": str(row.get("Routes Serviced", "")),
            }

    if geojson_path is None:
        return []

    with open(geojson_path) as f:
        data = json.load(f)

    results = []
    for i, feature in enumerate(data.get("features", [])):
        props = feature.get("properties", {})
        geom = feature.get("geometry", {})

        # Compute centroid from polygon or use point
        coords = geom.get("coordinates", [])
        geom_type = geom.get("type", "")
        if geom_type == "Point":
            lng, lat = coords[0], coords[1]
        elif geom_type == "Polygon" and coords:
            ring = coords[0]
            lng = sum(c[0] for c in ring) / len(ring)
            lat = sum(c[1] for c in ring) / len(ring)
        elif geom_type == "MultiPolygon" and coords:
            ring = coords[0][0]
            lng = sum(c[0] for c in ring) / len(ring)
            lat = sum(c[1] for c in ring) / len(ring)
        else:
            continue

        name = str(props.get("Park_Ride_Name", props.get("Name", props.get("name", f"Park & Ride {i+1}")))).strip()
        extra = capacity_map.get(name, {})

        results.append({
            "id": f"pr_{i}",
            "lat": lat,
            "lng": lng,
            "name": name,
            "capacity": extra.get("capacity", props.get("Parking_Capacity", props.get("capacity", ""))),
            "cost": extra.get("cost", str(props.get("Parking_Cost_Per_Month", ""))),
            "routes": extra.get("routes", str(props.get("Routes_Serviced", ""))),
            "available": True,
            "type": "park_ride",
        })
    return results


@app.on_event("startup")
def startup():
    global pay_stations, accessible_spots, park_ride_lots
    pay_stations = load_pay_stations()
    accessible_spots = load_accessible_spots()
    park_ride_lots = load_park_ride()
    print(f"Loaded: {len(pay_stations)} pay stations, {len(accessible_spots)} accessible spots, {len(park_ride_lots)} park & ride lots")


@app.get("/api/parking")
def get_parking(type: str = Query("all")):
    all_spots: list[dict] = []
    if type in ("pay_station", "all"):
        all_spots.extend(pay_stations)
    if type in ("accessible", "all"):
        all_spots.extend(accessible_spots)
    if type in ("park_ride", "all"):
        all_spots.extend(park_ride_lots)
    return all_spots


@app.get("/api/stats")
def get_stats():
    total = len(pay_stations) + len(accessible_spots) + len(park_ride_lots)
    available = (
        sum(1 for s in pay_stations if s["available"])
        + sum(1 for s in accessible_spots if s["available"])
        + sum(1 for s in park_ride_lots if s["available"])
    )
    return {
        "total": total,
        "available": available,
        "pay_stations": len(pay_stations),
        "accessible": len(accessible_spots),
        "park_ride": len(park_ride_lots),
    }


@app.get("/api/heatmap")
def get_heatmap():
    points = []
    for spot in accessible_spots:
        points.append({"lat": spot["lat"], "lng": spot["lng"], "intensity": spot["spots_count"]})
    for spot in pay_stations:
        points.append({"lat": spot["lat"], "lng": spot["lng"], "intensity": 1})
    return points
