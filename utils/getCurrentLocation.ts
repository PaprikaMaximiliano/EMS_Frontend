export type CurrentLocation = {
  lat: number;
  lng: number;
};

export type CurrentLocationResult =
  | { ok: true; position: CurrentLocation }
  | { ok: false; reason: string };

const GEO_OPTIONS: PositionOptions = {
  enableHighAccuracy: false,
  timeout: 8000,
  maximumAge: 60000,
};

function mapLocationError(error: GeolocationPositionError): string {
  if (error.code === error.PERMISSION_DENIED) {
    return "Location permission denied. You can enable it in browser site settings.";
  }

  if (error.code === error.POSITION_UNAVAILABLE) {
    return "Location is unavailable on this device right now.";
  }

  if (error.code === error.TIMEOUT) {
    return "Location request timed out. Try again in an open area or disable VPN/proxy.";
  }

  return "Could not read your location.";
}

export default function getCurrentLocation(): Promise<CurrentLocationResult> {
  return new Promise((resolve) => {
    if (typeof window === "undefined" || typeof navigator === "undefined") {
      resolve({
        ok: false,
        reason: "Location is unavailable outside browser context.",
      });
      return;
    }

    if (!window.isSecureContext) {
      resolve({
        ok: false,
        reason: "Location requires HTTPS (or localhost).",
      });
      return;
    }

    if (!navigator.geolocation) {
      resolve({
        ok: false,
        reason: "Your browser does not support geolocation.",
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          ok: true,
          position: {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          },
        });
      },
      (error) => {
        resolve({ ok: false, reason: mapLocationError(error) });
      },
      GEO_OPTIONS,
    );
  });
}
