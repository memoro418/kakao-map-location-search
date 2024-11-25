import {ReactNode, useEffect, useRef, useState} from "react";
import styled from "@emotion/styled";
import { KakaoMapContext } from "../hooks/useMap";

interface DynamicMapProps {
  children: ReactNode
}

const DynamicMap = (props:DynamicMapProps) => {
  const [map, setMap] = useState<kakao.maps.Map>()
  const kakaoMapRef = useRef<HTMLDivElement>(null)


  useEffect(() => {
    if(!kakaoMapRef.current) {
      return;
    }

    const { kakao } = window;

    // 공식 문서에 있는 지도 시작 주소
    const targetPoint = new kakao.maps.LatLng(37.566826, 126.9786567)

    const options = {
      center: targetPoint,
      level: 3
    };

    setMap(new kakao.maps.Map(kakaoMapRef.current, options));
  }, [])

  return (
    <>
      <Container>
        <Map ref={kakaoMapRef} />
      </Container>
      {
        map ? (
          <KakaoMapContext.Provider value={map}>
            { props.children }
          </KakaoMapContext.Provider>
        ) : null
      }
    </>
  )
}

const Container = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
`

const Map = styled.div`
  position: static;
  width: 100%;
  height: 100%;
`

export default DynamicMap
