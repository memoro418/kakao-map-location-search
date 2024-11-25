import DynamicMap from "./Map/DynamicMap";
import KakaoMapScriptLoader from "./Map/KakaoMapScriptLoader";
import SearchLocation from "./Map/SearchLocation";
import { useState } from "react";
import MapMarkerController from "./Map/MapMarkerController";
import { PlaceType } from "./Map/mapTypes";

// 스크립트로 kakao maps api를 심어서 가져오면 window전역 객체에 들어가게 된다
// declare global {
//   interface Window {
//     // https://apis.map.kakao.com/web/guide/
//     kakao: any
//   }
// }

function App() {
  const [places, setPlaces] = useState<PlaceType[]>([]);
  const [selectedMarkerId, setSelectedMarkerId] = useState("");

  return (
    <KakaoMapScriptLoader>
      <DynamicMap>
        <MapMarkerController
          places={places}
          selectedMarkerId={selectedMarkerId}
        />
        <SearchLocation
          onSelectMarker={(id) => {
            setSelectedMarkerId(id);
          }}
          onUpdatePlaces={(places) => setPlaces(places)}
        />
      </DynamicMap>
    </KakaoMapScriptLoader>
  );
}

export default App;
