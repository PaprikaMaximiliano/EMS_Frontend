import * as React from 'react';
import { createCustomEqual } from 'fast-equals';
import { isLatLngLiteral } from '@googlemaps/typescript-guards';
import {useState} from "react";
import {Event} from "@/types/Event";
import {useRouter} from "next/navigation";

interface MapProps extends google.maps.MapOptions {
    style: { [key: string]: string };
    onClick?: (e: google.maps.MapMouseEvent) => void;
    onIdle?: (map: google.maps.Map) => void;
    children?: React.ReactNode;
}

export const Map: React.FC<MapProps> = ({
                                     onClick,
                                     onIdle,
                                     children,
                                     style,
                                     ...options
                                 }) => {
    const ref = React.useRef<HTMLDivElement>(null);
    const [map, setMap] = React.useState<google.maps.Map>();

    React.useEffect(() => {
        if (ref.current && !map) {
            setMap(new window.google.maps.Map(ref.current, {}));
        }
    }, [ref, map]);

    useDeepCompareEffectForMaps(() => {
        if (map) {
            map.setOptions(options);
        }
    }, [map, options]);

    React.useEffect(() => {
        if (map) {
            ['click', 'idle'].forEach((eventName) =>
                google.maps.event.clearListeners(map, eventName)
            );

            if (onClick) {
                map.addListener('click', onClick);
            }

            if (onIdle) {
                map.addListener('idle', () => onIdle(map));
            }
        }
    }, [map, onClick, onIdle]);

    return (
        <>
            <div ref={ref} style={style} />
            {React.Children.map(children, (child) => {
                if (React.isValidElement(child)) {
                    // @ts-ignore
                    return React.cloneElement(child, { map });
                }
            })}
        </>
    );
};

interface MarkerProps extends google.maps.MarkerOptions {
    event?: Event;
    onDragEnd?: any;
}

export const Marker: React.FC<MarkerProps> = (options) => {
    const [infoWindow, setInfoWindows] = useState<google.maps.InfoWindow>(new google.maps.InfoWindow())
    const [marker, setMarker] = React.useState<google.maps.Marker>();
    const { event, onDragEnd } = options;
    React.useEffect(() => {
        if (!marker) {
            setMarker(new google.maps.Marker());
        }
        if(event){
            marker?.addListener('click', () => {
                infoWindow.close();

                infoWindow.setContent(
                    `<div>
                    <h3 style="text-align: center; margin-top: 0">${event.title}</h3>
                    <div style="margin-bottom: 10px">${event.description}</div>
                    <div style=" ">${new Date(event.date).toUTCString()}</div>
                </div>`
                );

                infoWindow.open(marker?.getMap(), marker);
            })
        }

        if(options.draggable){
            marker?.addListener('dragend', onDragEnd)
        }

        return () => {
            if (marker) {
                marker.setMap(null);
            }
        };
    }, [marker]);

    React.useEffect(() => {
        if (marker) {
            marker.setOptions(options);
        }
    }, [marker, options]);

    return null;
};

const deepCompareEqualsForMaps = createCustomEqual(
// @ts-ignore
    (deepEqual: any) => (a: any, b: any) => {
        if (
            isLatLngLiteral(a) ||
            a instanceof google.maps.LatLng ||
            isLatLngLiteral(b) ||
            b instanceof google.maps.LatLng
        ) {
            return new google.maps.LatLng(a).equals(new google.maps.LatLng(b));
        }

        return deepEqual(a, b);
    }
);

function useDeepCompareMemoize(value: any) {
    const ref = React.useRef();

    if (!deepCompareEqualsForMaps(value, ref.current)) {
        ref.current = value;
    }

    return ref.current;
}

function useDeepCompareEffectForMaps(
    callback: React.EffectCallback,
    dependencies: any[]
) {
    React.useEffect(callback, dependencies.map(useDeepCompareMemoize));
}

export default Map
