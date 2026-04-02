/**
 * @param id            유저 아이디
 * @param departure     출발지
 * @param arrival       목적지
 * @param departureTime 출발시간
 */
export interface Tiket {
  id: number;
  departure: string;
  arrival: string;
  departureTime: string;
}
