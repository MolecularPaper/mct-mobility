interface User {
  _id: string; // id를 직접 string으로 사용
  password: string;
}

interface Carpool {
  driver_id: string;
  passengers_id: string[];
}
