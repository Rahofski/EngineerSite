import { Request } from "./RequestList";
import { Building } from "./RequestList";

export const mockRequests: Request[] = [
    {
      request_id: 1,
      building_id: 1,
      field_id: 1,
      additional_text: "Протечка трубы в подвале",
      photos: "https://static19.tgcnt.ru/posts/_0/f7/f71018d04759977b551e565434c3276e.jpg",
      status: "in progress",
      time: "12:30 04.27.2025",
    },
    {
      request_id: 2,
      building_id: 2,
      field_id: 2,
      additional_text: "Не работает освещение в подъезде",
      photos: "https://i.pinimg.com/736x/b2/0b/3a/b20b3adce236bcf18185dae624357524.jpg",
      status: "done",
      time: "15:00 02.03.2025",
    },
    {
      request_id: 3,
      building_id: 2,
      field_id: 6,
      additional_text: "Сломан лифт",
      photos: "https://avatars.mds.yandex.net/get-altay/3522550/2a00000174ef9bbb46794d1f51e8086ccae6/XXL_height",
      status: "not taken",
      time: "15:00 04.27.2025",
    },
    {
        request_id: 4,
        building_id: 0,
        field_id: 7,
        additional_text: "Треснутое окно в коридоре 3 этажа",
        photos: "https://example.com/glass1.jpg",
        status: "not taken",
        time: "09:15 04.26.2025"
      },
      {
        request_id: 12,
        building_id: 1,
        field_id: 3,
        additional_text: "Протечка трубы в подвале",
        photos: "https://static19.tgcnt.ru/posts/_0/f7/f71018d04759977b551e565434c3276e.jpg",
        status: "in progress",
        time: "12:30 04.28.2025",
      },
      {
        request_id: 13,
        building_id: 2,
        field_id: 5,
        additional_text: "Не работает освещение в подъезде",
        photos: "https://i.pinimg.com/736x/b2/0b/3a/b20b3adce236bcf18185dae624357524.jpg",
        status: "done",
        time: "15:00 02.03.2025",
      },
      {
        request_id: 14,
        building_id: 2,
        field_id: 6,
        additional_text: "Сломан лифт",
        photos: "https://avatars.mds.yandex.net/get-altay/3522550/2a00000174ef9bbb46794d1f51e8086ccae6/XXL_height",
        status: "not taken",
        time: "15:00 04.28.2025",
      },
      {
          request_id: 15,
          building_id: 0,
          field_id: 7,
          additional_text: "Треснутое окно в коридоре 3 этажа",
          photos: "https://example.com/glass1.jpg",
          status: "not taken",
          time: "09:15 04.26.2025"
        },
      {
        request_id: 5,
        building_id: 1,
        field_id: 1,
        additional_text: "Забит слив в раковине",
        photos: "https://example.com/sink1.jpg",
        status: "in progress",
        time: "11:40 04.27.2025"
      },
      {
        request_id: 6,
        building_id: 2,
        field_id: 7,
        additional_text: "Не закрывается входная дверь",
        photos: "https://example.com/door1.jpg",
        status: "done",
        time: "14:20 04.03.2025"
      },
      {
        request_id: 7,
        building_id: 0,
        field_id: 6,
        additional_text: "Протекает крыша в холле",
        photos: "https://example.com/roof1.jpg",
        status: "in progress",
        time: "16:45 04.03.2025"
      },
      {
        request_id: 8,
        building_id: 1,
        field_id: 2,
        additional_text: "Не работает розетка в кабинете 205",
        photos: "https://example.com/socket1.jpg",
        status: "not taken",
        time: "10:10 04.27.2025"
      },
      {
        request_id: 9,
        building_id: 2,
        field_id: 6,
        additional_text: "Сломанная ступенька на лестнице",
        photos: "https://example.com/stairs1.jpg",
        status: "done",
        time: "13:30 05.03.2025"
      },
      {
        request_id: 10,
        building_id: 0,
        field_id: 1,
        additional_text: "Подтекает батарея в комнате 312",
        photos: "https://example.com/radiator1.jpg",
        status: "in progress",
        time: "15:55 06.03.2025"
      },
      {
        request_id: 11,
        building_id: 1,
        field_id: 7,
        additional_text: "Отклеиваются обои в коридоре",
        photos: "https://example.com/wallpaper1.jpg",
        status: "not taken",
        time: "08:20 04.27.2025"
      }
  ];

export const mockBuildings: Building[] = [
    {
      building_id: 0,
      building_name: "6 общага",
      address: "Хрыщева, 16",
      building_type: "dorm",
    },
    {
      building_id: 1,
      building_name: "11 корпус",
      address: "ул. Гидротехников, 20",
      building_type: "stud",
    },
    {
      building_id: 2,
      building_name: "Главный корпус",
      address: "ул. Политехническая, 29",
      building_type: "stud",
    },
  ];