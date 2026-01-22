import {BuildingResponse, FloorResponse, RoomResponse, RoomTypeResponse} from "@/dtos/building";
import {RoomStatus} from "@/constaints/enum";

export const MOCK_ROOM_TYPES: RoomTypeResponse[] = [
    {
        roomTypeId: "rt-001",
        typeName: "Classroom",
        description: "Standard educational room with desks and a whiteboard.",
        rooms: [] // To be populated if needed
    },
    {
        roomTypeId: "rt-002",
        typeName: "Laboratory",
        description: "Specialized room for scientific or technical research.",
        rooms: []
    }
];
export const MOCK_BUILDINGS: BuildingResponse[] = [
    // Building A, B, and C
    ...["A", "B", "C"].map((bName): BuildingResponse => {
        const buildingId = `bid-${bName.toLowerCase()}`;

        return {
            buildingId: buildingId,
            buildingName: `Building ${bName}`,
            floorCount: 3,
            note: `Main academic block ${bName}`,
            floors: [1, 2, 3].map((fNum): FloorResponse => {
                const floorId = `fid-${bName.toLowerCase()}-${fNum}`;

                return {
                    floorId: floorId,
                    buildingId: buildingId,
                    buildingName: `Building ${bName}`,
                    floorName: `Floor ${fNum}`,
                    roomCount: 5,
                    note: `Level ${fNum} of ${bName}`,
                    rooms: [1, 2, 3, 4, 5].map((rNum): RoomResponse => ({
                        roomId: `rid-${bName.toLowerCase()}-${fNum}0${rNum}`,
                        roomName: `${bName}${fNum}0${rNum}`, // e.g., A101, B205
                        floorId: floorId,
                        floorName: `Floor ${fNum}`,
                        roomTypeId: rNum === 5 ? "rt-002" : "rt-001", // 5th room is a Lab
                        typeName: rNum === 5 ? "Laboratory" : "Classroom",
                        capacity: rNum === 5 ? 20 : 40,
                        status: RoomStatus.Available
                    }))
                };
            })
        };
    })
];
// All Floors across all buildings
export const MOCK_FLOORS_FLAT: FloorResponse[] = MOCK_BUILDINGS.flatMap(b => b.floors);

// All Rooms across all buildings and floors
export const MOCK_ROOMS_FLAT: RoomResponse[] = MOCK_FLOORS_FLAT.flatMap(f => f.rooms);