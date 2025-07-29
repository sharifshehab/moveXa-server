import dayjs from "dayjs";

export const generateTrackingId = () => {
    return `TRK-${dayjs().format('YYYY-MM-DD')}-${Math.floor(100000 + Math.random() * 900000)}`;
}