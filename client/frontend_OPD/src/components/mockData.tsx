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
    {
        _id: 4,
        building_id: 0,
        field_id: 7,
        user_id: 2,
        description: "Треснутое окно в коридоре 3 этажа",
        img: "https://example.com/glass1.jpg",
        status: "not taken",
        time: "09:15 03.03.2025"
      },
      {
        _id: 5,
        building_id: 1,
        field_id: 1,
        user_id: 1,
        description: "Забит слив в раковине",
        img: "https://example.com/sink1.jpg",
        status: "in progress",
        time: "11:40 03.03.2025"
      },
      {
        _id: 6,
        building_id: 2,
        field_id: 7,
        user_id: 0,
        description: "Не закрывается входная дверь",
        img: "https://example.com/door1.jpg",
        status: "done",
        time: "14:20 04.03.2025"
      },
      {
        _id: 7,
        building_id: 0,
        field_id: 6,
        user_id: 2,
        description: "Протекает крыша в холле",
        img: "https://example.com/roof1.jpg",
        status: "in progress",
        time: "16:45 04.03.2025"
      },
      {
        _id: 8,
        building_id: 1,
        field_id: 2,
        user_id: 1,
        description: "Не работает розетка в кабинете 205",
        img: "https://example.com/socket1.jpg",
        status: "not taken",
        time: "10:10 05.03.2025"
      },
      {
        _id: 9,
        building_id: 2,
        field_id: 6,
        user_id: 0,
        description: "Сломанная ступенька на лестнице",
        img: "https://example.com/stairs1.jpg",
        status: "done",
        time: "13:30 05.03.2025"
      },
      {
        _id: 10,
        building_id: 0,
        field_id: 1,
        user_id: 2,
        description: "Подтекает батарея в комнате 312",
        img: "https://example.com/radiator1.jpg",
        status: "in progress",
        time: "15:55 06.03.2025"
      },
      {
        _id: 11,
        building_id: 1,
        field_id: 7,
        user_id: 1,
        description: "Отклеиваются обои в коридоре",
        img: "https://example.com/wallpaper1.jpg",
        status: "not taken",
        time: "08:20 07.03.2025"
      }
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