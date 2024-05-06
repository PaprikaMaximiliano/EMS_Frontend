'use client';
import {Status, Wrapper} from "@googlemaps/react-wrapper";
import Map, {Marker} from "@/components/Map";
import React, {useEffect, useState} from "react";
import {Event} from "@/types/Event";
import axiosInterceptor from "@/interceptors/axiosInterceptor";

const render = (status: Status) => {
    return <h1>{status}</h1>;
};

type Props = {
    params: {
        id: string;
    };
};

const EventLocation = ({ params: { id } }: Props) => {
    const [event, setEvent] = useState<Event | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    useEffect(() => {
        const fetchEvent = async () => {
            setIsLoading(true);
            return await axiosInterceptor.get(`/events/${id}`);
        };
        fetchEvent()
            .then((event) => setEvent(event.data))
            .then(() => setIsLoading(false));
    }, []);



    const [zoom, setZoom] = React.useState(6); // initial zoom
    const [center, setCenter] = React.useState<google.maps.LatLngLiteral>({
        lat: 49.3794,
        lng: 31.1656,
    });
    const onIdle = (m: google.maps.Map) => {
        setZoom(m.getZoom()!);
        setCenter(m.getCenter()!.toJSON());
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div style={{flex: "1 1 auto", display: "flex", flexDirection: "column"}}>
            {/*<Grid container style={{ minWidth: "100%", minHeight: "100%" }}>*/}
            <Wrapper
                apiKey={'AIzaSyD8VhzS53KMGa_aZkfuqX2k7dVZstiIBAA'}
                render={render}
            >
                <Map
                    center={center}
                    onIdle={onIdle}
                    zoom={zoom}
                    style={{flexGrow: '1', height: '100%'}}
                >
                    {event && <Marker key={event.id} position={{lat: event.lat, lng: event.lng}} event={event}/>}
                </Map>
            </Wrapper>
            {/*</Grid>*/}
        </div>
    )
}

export default EventLocation;