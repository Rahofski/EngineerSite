import { Request } from "./RequestList";
import { Building } from "./RequestItem";

export const mockRequests: Request[] = [
    {
      _id: 1,
      building_id: 1,
      field_id: 1,
      user_id: 0,
      description: "Протечка трубы в подвале",
      img: "https://static19.tgcnt.ru/posts/_0/f7/f71018d04759977b551e565434c3276e.jpg",
      status: "in progress",
      time: "12:30 01.03.2025",
    },
    {
      _id: 2,
      building_id: 2,
      field_id: 2,
      user_id: 1,
      description: "Не работает освещение в подъезде",
      img: "https://i.pinimg.com/736x/b2/0b/3a/b20b3adce236bcf18185dae624357524.jpg",
      status: "done",
      time: "15:00 02.03.2025",
    },
    {
      _id: 3,
      building_id: 2,
      field_id: 6,
      user_id: 0,
      description: "Сломан лифт",
      img: "https://avatars.mds.yandex.net/get-altay/3522550/2a00000174ef9bbb46794d1f51e8086ccae6/XXL_height",
      status: "not taken",
      time: "15:00 02.03.2025",
    },
  ];

export const mockBuildings: Building[] = [
    {
      _id: 0,
      name: "6 общага",
      address: "Хрыщева, 16",
      type: "dorm",
    },
    {
      _id: 1,
      name: "11 корпус",
      address: "ул. Гидротехников, 20",
      type: "stud",
    },
    {
      _id: 2,
      name: "Главный корпус",
      address: "ул. Политехническая, 29",
      type: "stud",
    },
  ];