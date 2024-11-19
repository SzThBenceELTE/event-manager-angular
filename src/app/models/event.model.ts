import { EventTypeEnum } from "./enums/event-type.enum";

export interface EventModel {
    id: number;
    name: string;
    type: EventTypeEnum;
    startDate: Date;
    endDate: Date;
    maxParticipants: number;
    currentParticipants: number;
    parentId?: number;
    subevents?: EventModel[];
}