interface SendResult {
  success: boolean;
  error?: string;
}
enum EmailStatus {
  Send = "Send",
  Failed = "Failed"
}