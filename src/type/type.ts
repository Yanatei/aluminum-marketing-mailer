interface SendResult {
  success: boolean;
  error?: string;
}
enum EmailStatus {
  Sent = "Sent",
  Failed = "Failed"
}