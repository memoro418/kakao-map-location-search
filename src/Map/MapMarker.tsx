import ReactDom from "react-dom";
import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import styled from "@emotion/styled";
import { useMap } from "../hooks/useMap";

interface MapMarkerProps {
  position: kakao.maps.LatLng;
  index: number;
  title: string;
  address: string;
  showInfo?: boolean;
}

const MARKER_IMAGE_URL =
  "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_number_blue.png"; // 마커 이미지 url, 스프라이트 이미지를 씁니다

const MapMarker = (props: MapMarkerProps) => {
  const map = useMap();
  const container = useRef(document.createElement("div"));

  const infoWindow = useMemo(() => {
    container.current.style.position = "absolute";
    container.current.style.bottom = "40px";

    // @ts-ignore
    return new kakao.maps.CustomOverlay({
      map: map,
      position: props.position,
      content: container.current,
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const marker = useMemo(() => {
    const { kakao } = window;

    const imageSize = new kakao.maps.Size(36, 37); // 마커 이미지의 크기
    const imgOptions = {
      spriteSize: new kakao.maps.Size(36, 691), // 스프라이트 이미지의 크기
      spriteOrigin: new kakao.maps.Point(0, props.index * 46 + 10), // 스프라이트 이미지 중 사용할 영역의 좌상단 좌표
      offset: new kakao.maps.Point(13, 37), // 마커 좌표에 일치시킬 이미지 내에서의 좌표
    };
    const markerImage = new kakao.maps.MarkerImage(
      MARKER_IMAGE_URL,
      imageSize,
      imgOptions
    );
    const marker = new kakao.maps.Marker({
      position: props.position, // 마커의 위치
      image: markerImage,
    });

    marker.setMap(map); // 지도 위 마커 표출

    kakao.maps.event.addListener(marker, "click", function () {
      map.setCenter(props.position);
      map.setLevel(4, {
        animate: true,
      });
      infoWindow.setMap(map);
    });

    return marker;
  }, []);

  useLayoutEffect(() => {
    marker.setMap(map);

    return () => {
      marker.setMap(null);
    };
  }, [map]);

  useEffect(() => {
    if (props.showInfo) {
      infoWindow.setMap(map);
      return;
    }

    infoWindow.setMap(null);
  }, [props.showInfo]);

  return (
    container.current &&
    ReactDom.createPortal(
      <Message
        onClick={() => {
          infoWindow.setMap(null);
        }}
      >
        <Title>{props.title}</Title>
        <Address>{props.address}</Address>
      </Message>,
      container.current
    )
  );
};

const Title = styled.label`
  white-space: pre-line;
  font-weight: bold;
  padding: 6px 8px;
`;

const Address = styled.span`
  font-size: 12px;
  white-space: pre-line;
  padding: 0 6px 6px 6px;
`;

const Message = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 16px;

  width: 180px;
  min-height: 50px;
  margin-left: -90px;

  background: rgba(255, 228, 196, 0.9);
`;

export default MapMarker;
