import { FormEvent, useEffect, useRef, useState } from "react";
import styled from "@emotion/styled";
import { useMap } from "../hooks/useMap";
import { PlaceType } from "./mapTypes";

interface SearchLocationProps {
  onUpdatePlaces: (places: PlaceType[]) => void;
  onSelectMarker: (placeId: string) => void;
}

const SearchLocation = (props: SearchLocationProps) => {
  const map = useMap();
  const [keyword, setKeyword] = useState("");
  const [placeList, setPlaceList] = useState<PlaceType[]>([]);
  const placeService = useRef<kakao.maps.services.Places | null>(null);

  // 키워드 검색을 요청하는 함수
  const searchPlaces = (keyword: string) => {
    if (!placeService.current) {
      return;
    }

    if (!keyword.replace(/^\s+|\s+$/g, "")) {
      alert("키워드를 입력해주세요!");
      return;
    }

    // 장소검색 객체를 통해 키워드로 장소 검색 요청
    placeService.current.keywordSearch(keyword, (data, status) => {
      const { kakao } = window;

      if (status === kakao.maps.services.Status.OK) {
        const placeInfos = data.map((placeSearchResultItem) => {
          return {
            id: placeSearchResultItem.id,
            position: new kakao.maps.LatLng(
              Number(placeSearchResultItem.y),
              Number(placeSearchResultItem.x)
            ),
            title: placeSearchResultItem.place_name,
            address: placeSearchResultItem.address_name,
          };
        });

        props.onUpdatePlaces(placeInfos);
        setPlaceList(placeInfos);
      } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
        alert("검색 결과가 존재하지 않습니다.");
        return;
      } else if (status === kakao.maps.services.Status.ERROR) {
        alert("검색 결과 중 오류가 발생했습니다.");
        return;
      }
    });
  };

  useEffect(() => {
    const { kakao } = window;
    // 장소 검색 객체를 생성
    placeService.current = new kakao.maps.services.Places();
  }, []);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    // submit 액션은 페이지를 재 호출하기에 막아야함
    e.preventDefault();
    searchPlaces(keyword);
  };

  const handleItemClick = (place: PlaceType) => {
    // 지도 중심을 이동
    map.setCenter(place.position);
    map.setLevel(4);
    props.onSelectMarker(place.id);
  };

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <Input
          value={keyword}
          onChange={(e) => {
            setKeyword(e.target.value);
          }}
        />
      </Form>
      <List>
        {placeList.map((item, index) => (
          <Item
            key={`${item.title}_${index}`}
            onClick={() => handleItemClick(item)}
          >
            <label>{`${index + 1}. ${item.title}`}</label>
            <span>{item.address}</span>
          </Item>
        ))}
      </List>
    </Container>
  );
};

const Form = styled.form`
  display: flex;
  position: sticky;
  top: 0;
`;

const Input = styled.input`
  width: 100%;
  min-width: 200px;
  padding: 8px;
  border: 1px solid #c0c0c0;
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
`;

const Container = styled.div`
  position: absolute;
  height: 100%;
  z-index: 1;
  background: white;
  opacity: 0.8;
  overflow-y: auto;
`;

const List = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`;

const Item = styled.li`
  display: flex;
  flex-direction: column;
  padding: 8px;
  cursor: pointer;
  border-bottom: 1px dashed #d2d2d2;

  &:hover {
    background-color: #d2d2d2;
    opacity: 1;
    transition: backgrond-color 0s;
  }
`;

export default SearchLocation;
