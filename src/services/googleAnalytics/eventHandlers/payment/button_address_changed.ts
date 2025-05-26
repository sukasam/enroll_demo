import { Event, pushEvent } from "Services/googleAnalytics/index";

export default function handler(event: Event["event"]): void {
    pushEvent(event);
}
