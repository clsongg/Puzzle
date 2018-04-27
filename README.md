# JS study

퍼즐 GAME

### 로컬 스토리지(localStorage) / 세션 스토리지(sessionStorage)

HTML5에서 추가된 저장소. key=value 형태.

둘의 차이점은 데이터의 영구성.

로컬 스토리지는 데이터가 계속 남아있음(**지속적으로 필요한 정보 저장**).

세션 스토리지는 윈도우나 브라우저 탭을 닫을 경우 제거됨(**일회성 정보 저장**).

스토리지는 브라우저, 디바이스 등등의 환경을 많이 타서 제대로 작동하지 않을 수 있다. 따라서 꼭 필요한 정보는 서버에서 관리해야한다.

쿠키 또한 브라우저에 저장소 역할을 한다. 만료기한이 있음. 사이즈가 매우 작음 4kb.

따라서 많은 양의 데이터를 저장할 수 없음. HTTP요청마다 포함되어 서버에 전달되므로 필요하지 않은 데이터가 전달되어짐.

### 로컬 스토리지(localStorage)
window.localstorage에 위치.

값으로는 문자열, 불린, 숫자, null, undefined 등을 저장할 수 있지만, 모두 문자열로 변환(키값도 문자열로 변환됨)

객체는 저장될때 toString 메소드가 호출된 형태로 저장된다. [object 생성자]형으로 저장됨.

- 로컬 스토리지 저장 : **localStorage.setItem(키, 값)** | 키-값 형식으로 풀어서 여러 개를 저장
- 로컬 스토리지 조회 : **localStorage.getItem()**
- 로컬 스토리지 삭제 : **localStorage.removeItem()**
- 로컬 스토리지 비우기 : **localStorage.clear()**
- json 객체를 String 객체로 변환 : **JSON.stringify()** | 한번에 객체를 통째로 저장(객체 형식 그대로 문자열로 변환)
- string 객체를 json 객체로 변환 : **JSON.parse()** | 변환된 문자열을 받을때 사용
