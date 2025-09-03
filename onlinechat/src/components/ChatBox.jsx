export default function ChatBox({ message, isMine }) {
  return (
    <div
      className={`p-2 rounded ${
        isMine ? "bg-blue-100 self-end" : "bg-gray-100 self-start"
      }`}
    >
      <div className="text-xs text-gray-600">{message.sender}</div>
      <div>{message.content}</div>
      <div className="text-xs text-gray-400">
        {new Date(message.createdAt).toLocaleString()}
      </div>
    </div>
  );
}
