import { useEffect } from "react";
import MapMarker from "./MapMarker";
import { useMap } from "../hooks/useMap";
import { PlaceType } from "./mapTypes";

interface MapMarkerControllerProps {
  places: PlaceType[];
  selectedMarkerId?: string;
}

const MapMarkerController = (props: MapMarkerControllerProps) => {
  const map = useMap();

  useEffect(() => {
    if (!props.places || props.places.length < 1) {
      return;
    }
    // 검색된 장소 위치를 기준으로 지도 범위 재설정
    // LatLngBounds 객체에 좌표를 추가
    const { kakao } = window;
    const bounds = new kakao.maps.LatLngBounds();

    props.places.forEach((item) => {
      bounds.extend(item.position);
    });

    map.setBounds(bounds);
  }, [props.places]);

  return (
    <>
      {props.places.map((place, index) => (
        <MapMarker
          key={place.id}
          position={place.position}
          index={index}
          title={place.title}
          address={place.address}
          showInfo={props.selectedMarkerId === place.id}
        />
      ))}
    </>
  );
};

export default MapMarkerController;
