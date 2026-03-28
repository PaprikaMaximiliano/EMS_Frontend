export type CurrentLocation = {
  lat: number;
  lng: number;
};

export const FALLBACK_LOCATION: CurrentLocation = {
  lat: 49.3794,
  lng: 31.1656,
};

export type CurrentLocationResult =
  | { ok: true; position: CurrentLocation }
  | { ok: false; reason: string };

const FAST_GEO_OPTIONS: PositionOptions = {
  enableHighAccuracy: false,
  timeout: 5000,
  maximumAge: 120000,
};

const RETRY_GEO_OPTIONS: PositionOptions = {
  enableHighAccuracy: true,
  timeout: 12000,
  maximumAge: 0,
};

function requestPosition(
  options: PositionOptions,
): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, options);
  });
}

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

    requestPosition(FAST_GEO_OPTIONS)
      .catch(() => requestPosition(RETRY_GEO_OPTIONS))
      .then((position) => {
        resolve({
          ok: true,
          position: {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          },
        });
      })
      .catch((error: GeolocationPositionError) => {
        resolve({ ok: false, reason: mapLocationError(error) });
      });
  });
}
