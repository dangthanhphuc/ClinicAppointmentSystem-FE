export enum AppointmentStatus {
    PENDING = "PENDING", // Chờ đặt hẹn
    SCHEDULED = "SCHEDULED",  // Đã đặt hẹn chờ tới ngày
    COMPLETED = "COMPLETED", // Đã hoàn thành hẹn
    CANCELLED = "CANCELLED" // Đã hủy bởi bác sĩ
}