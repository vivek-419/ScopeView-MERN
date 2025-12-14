const { io } = require("socket.io-client");

console.log("🚀 Starting Telemetry WebSocket client...");

const socket = io("http://localhost:4000", {
  transports: ["websocket"],
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000
});

socket.on("connect", () => {
  console.log("✅ Connected:", socket.id);

  // Subscribe to a telemetry stream
  socket.emit("subscribe", { streams: ["engine_temp"] });
  console.log("📡 Subscribed to stream: engine_temp");

  // Send simulated telemetry data every 500ms
  setInterval(() => {
    const point = {
      streamKey: "engine_temp",
      value: Math.random() * 100,
      timestamp: Date.now(),
      sessionId: "demo_session_1"
    };

    socket.emit("telemetry", point);
    console.log("📤 Sent telemetry:", point);
  }, 500);
});

// Receive telemetry back from the server
socket.on("telemetry", (data) => {
  console.log("📥 Received telemetry:", data);
});

// Error handling
socket.on("connect_error", (err) => {
  console.error("❌ Connection Error:", err.message);
});
